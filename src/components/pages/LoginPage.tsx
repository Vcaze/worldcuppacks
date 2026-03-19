import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMember } from '@/integrations/members/providers';
import { login as loginService } from '@/integrations/members/service';

export default function LoginPage() {
  const navigate = useNavigate();
  const { actions } = useMember();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginService(email, password);
      if (!result?.jwtToken) {
        setError('Login failed: check your email and password');
        return;
      }

      await actions.loadCurrentMember();
      navigate('/');
    } catch (err) {
      setError((err as Error)?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4" style={{backgroundColor: '#333333'}}>
      <div className="w-full max-w-md rounded-3xl card backdrop-blur-xl border p-10 shadow-xl">
        <h1 className="text-3xl font-heading font-bold text-white mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-white/70">Email</span>
            <Input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/70">Password</span>
            <Input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-white/70 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-white hover:text-[#e0e0e0] text-hover">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
