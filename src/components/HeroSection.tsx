import React, { useState } from 'react';
import { Search, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const [question, setQuestion] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast({
        title: t("Error"),
        description: t("Please enter a question"),
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('auth.signin'),
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    navigate('/chat');
  };

  return (
    <section className="relative pt-32 pb-40 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-35"></div>

      {/* Main Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient-alt"></div>

      {/* Animated Floating Orbs */}
      <div className="absolute top-24 right-[12%] w-72 h-72 bg-islamic-teal-400 rounded-full filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-24 left-[12%] w-64 h-64 bg-islamic-gold-400 rounded-full filter blur-2xl opacity-18 animate-blob animation-delay-2000"></div>
      <div className="absolute top-44 left-[22%] w-60 h-60 bg-islamic-blue-400 rounded-full filter blur-2xl opacity-14 animate-blob animation-delay-4000"></div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-bg opacity-10"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block bg-clip-text text-transparent bg-gold-gradient animate-wave whitespace-pre-line">
              {t('hero.heading')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="search-input text-islamic-dark placeholder:text-islamic-dark/40 pr-40"
                placeholder={t('chat.placeholder')}
              />

              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-islamic"
              >
                <Search className="mr-2 h-4 w-4" />
                {t('hero.ask_now')}
              </Button>
            </div>
          </form>

          {/* Popular Topics */}
          <div className="flex flex-wrap justify-center gap-3 items-center">
            <span className="text-sm text-white/60 font-medium">{t('hero.popular')}</span>
            {[...(
              language === 'fr'
                ? ['Prière du voyageur', 'Ce qui annule mon jeûne', 'Guide du Hajj']
                : language === 'wo'
                ? ['Namaz bu ñu dox', 'Lu tëju suum gi', 'Jël Hajj']
                : ['Prayer of the traveller', 'What breaks my fast', 'Hajj guide']
            )].map((term, idx) => (
              <button
                key={term}
                className="group relative px-4 py-2 rounded-full text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: t('auth.required'),
                      description: t('auth.signin'),
                      variant: "destructive"
                    });
                    navigate('/login');
                    return;
                  }
                  setQuestion(term);
                }}
              >
                {/* Glassmorphic background */}
                <div className="absolute inset-0 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/18 group-hover:border-white/30 transition-all duration-200"></div>

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-full bg-islamic-teal-400/18 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>

                <span className="relative">{term}</span>
              </button>
            ))}
          </div>

          {/* Spacer for better visual balance */}
          <div className="mt-16"></div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-islamic-light to-transparent"></div>
    </section>
  );
};

export default HeroSection;