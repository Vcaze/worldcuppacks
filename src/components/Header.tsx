import { NavLink, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMember } from '@/integrations/members/providers';
import { cn } from '@/lib/utils';

export default function Header() {
  const navigate = useNavigate();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const handleLogout = () => {
    actions.logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-lg font-paragraph transition-colors duration-200 text-hover',
      isActive ? 'text-white underline' : 'text-white'
    );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="header-footer shadow-md sticky top-0 z-50"
    >
      <div className="max-w-[120rem] mx-auto px-6 py-6">
        <div className="relative flex items-center justify-between">
          {/* Left: logo + title (title is smaller and clickable to home) */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <NavLink to="/" className="text-xl md:text-2xl font-heading text-white font-bold text-hover">
              World Cup Packs
            </NavLink>
          </div>

          {/* Center: main navigation links (centered on page for md and up) */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <NavLink to="/" className={linkClass} end>
              Packs
            </NavLink>
            <NavLink to="/collection" className={linkClass}>
              Collection
            </NavLink>
            <NavLink to="/predictions" className={linkClass}>
              Predictions
            </NavLink>
            <NavLink to="/tenaball" className={linkClass}>
              Tenaball
            </NavLink>
          </nav>

          {/* Right: auth (visible on all sizes) */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <span className="text-white">Loading...</span>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-white">{member?.email}</span>
                <button className="text-sm text-white hover:text-[#d1d5db] transition-colors" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="text-sm text-white hover:text-[#d1d5db] transition-colors" onClick={() => navigate('/login')}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
