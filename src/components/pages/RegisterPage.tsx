import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register as registerService } from '@/integrations/members/service';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await registerService(email, firstName, password);
      if (!result?.success) {
        setError(result?.message || 'Registration failed');
        return;
      }

      setSuccess('Registration successful, redirecting to login…');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError((err as Error)?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4" style={{backgroundColor: '#333333'}}>
      <div className="w-full max-w-md rounded-3xl card backdrop-blur-xl border p-10 shadow-xl">
        <h1 className="text-3xl font-heading font-bold text-white mb-6 text-center">Register</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-purple-500/10 px-4 py-3 text-sm text-purple-400">
            {success}
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
            <span className="text-sm font-medium text-white/70">First name</span>
            <Input
              value={firstName}
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
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
            {loading ? 'Registering…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-white/70 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-[#e0e0e0] text-hover">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
