import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUpWithPassword({ email, password });
        toast({
          title: t('common.success'),
          description: t('login.success_signed_up'),
        });
        setIsSignUp(false); 
      } else {
        await signInWithPassword({ email, password });
        toast({
          title: t('common.success'),
          description: t('login.success_signed_in'),
        });
        navigate('/');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('login.failed_desc');
      toast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sand-50 via-white to-sand-100">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-islamic-primary-green/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-islamic-primary-gold/10 blur-3xl rounded-full" />
      </motion.div>

      <div className="container relative z-10 py-16">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold">
              XamSaDine AI
            </div>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isSignUp ? 'bg-white text-islamic-dark border border-islamic-primary-green shadow' : 'bg-sand-200 text-islamic-dark'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {t('login.sign_in')}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                isSignUp ? 'bg-white text-islamic-dark border border-islamic-primary-gold shadow' : 'bg-sand-200 text-islamic-dark'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {t('login.sign_up')}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-islamic-dark">
            {isSignUp ? t('login.create_account_title') : t('login.title')}
          </h1>
          <p className="text-center text-islamic-dark/70 mt-2">
            {isSignUp ? t('login.create_account_subtitle') : t('login.subtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-xl mx-auto mt-10 space-y-6"
        >
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.email')}
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-islamic-primary-green focus:border-islamic-primary-green"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.password')}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-islamic-primary-green focus:border-islamic-primary-green"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-islamic-primary-green focus:ring-islamic-primary-green border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t('login.remember_me')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-islamic-primary-green hover:text-islamic-primary-gold">
                  {t('login.forgot_password')}
                </a>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-sm font-semibold rounded-lg text-islamic-dark bg-white border transition-all ${
              isSignUp ? 'border-islamic-primary-gold hover:bg-islamic-primary-gold/10' : 'border-islamic-primary-green hover:bg-islamic-primary-green/10'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-primary-green active:scale-98`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 border-2 border-islamic-dark border-t-transparent rounded-full animate-spin" />
                <span>{t('login.processing')}</span>
              </div>
            ) : (
              <span>{isSignUp ? t('login.sign_up') : t('login.sign_in')}</span>
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            {isSignUp ? t('login.toggle_have_account') : t('login.toggle_no_account')}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-islamic-primary-green hover:text-islamic-primary-gold"
            >
              {isSignUp ? t('login.sign_in') : t('login.sign_up')}
            </button>
          </p>
        </motion.form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-islamic-primary-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-islamic-primary-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-islamic-primary-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-islamic-dark/80">{t('login.processing')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
