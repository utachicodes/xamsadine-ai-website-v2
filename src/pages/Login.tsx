import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
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
        title: t('login.failed'),
        description: err?.message ?? t('login.failed_desc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-islamic-light">
      <div className="w-full max-w-md islamic-card p-8 bg-white/95">
        {/* Title */}
        <h1 className="text-2xl font-bold text-islamic-dark mb-2">{t('login.title')}</h1>
        <p className="text-sm text-islamic-dark/60 mb-6">{t('login.subtitle')}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            {/* Email */}
            <label className="block text-sm font-medium text-islamic-dark mb-2">{t('login.email')}</label>
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
            {/* Password */}
            <label className="block text-sm font-medium text-islamic-dark mb-2">{t('login.password')}</label>
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
            {loading ? t('login.signing_in') : t('login.sign_in')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

