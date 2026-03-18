import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
} from "@/lib/api";
import { Member } from ".";

const STORAGE_TOKEN_KEY = "jwtToken";
const STORAGE_USER_ID_KEY = "userId";
const STORAGE_USER_EMAIL_KEY = "userEmail";

export const getCurrentMember = async (): Promise<Member | null> => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const userId = localStorage.getItem(STORAGE_USER_ID_KEY);

  if (!token || !userId) return null;

  try {
    const user = await getCurrentUser(userId);
    return user;
  } catch (error) {
    console.error("Failed to fetch current member", error);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  const response = await apiLogin(email, password);

  if (response?.jwtToken) {
    localStorage.setItem(STORAGE_TOKEN_KEY, response.jwtToken);
    localStorage.setItem(STORAGE_USER_ID_KEY, response._id ?? "");
    localStorage.setItem(STORAGE_USER_EMAIL_KEY, email);
  }

  return response;
};

export const register = async (email: string, firstName: string, password: string) => {
  return apiRegister(email, firstName, password);
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_ID_KEY);
  localStorage.removeItem(STORAGE_USER_EMAIL_KEY);
};
