import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPassword({ email, password });
      navigate("/circle");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message ?? "Could not sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-islamic-light">
      <div className="w-full max-w-md islamic-card p-8 bg-white/95">
        <h1 className="text-2xl font-bold text-islamic-dark mb-2">Sign in</h1>
        <p className="text-sm text-islamic-dark/60 mb-6">Access your account</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-islamic-dark mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-islamic-dark mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-islamic-gold text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
