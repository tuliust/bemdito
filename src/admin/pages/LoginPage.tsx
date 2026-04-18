import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card } from '@/components/foundation';
import { useAuth } from '@/lib/auth/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  useEffect(() => {
    if (!isAuthenticated) return;

    navigate(
      nextPath ||
        (role === 'company'
          ? '/portal/company'
          : role === 'professional'
          ? '/portal/professional'
          : '/admin'),
      { replace: true }
    );
  }, [isAuthenticated, navigate, nextPath, role]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      await signInWithPassword(email, password);
      toast.success('Sessao iniciada com sucesso');
      navigate(nextPath || '/admin', { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Nao foi possivel entrar. Verifique email, senha e role no Supabase.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7f7f5_0%,#eef4ff_45%,#f8ede3_100%)] p-6">
      <Card padding="lg" className="w-full max-w-md border-white/60 bg-white/90 backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com uma conta Supabase que tenha role `viewer`, `editor` ou `admin`.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="voce@empresa.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Sua senha"
              required
            />
          </label>

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            <LogIn className="h-4 w-4" />
            {submitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
