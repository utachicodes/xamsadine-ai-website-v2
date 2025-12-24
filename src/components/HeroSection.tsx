
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [question, setQuestion] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    navigate(`/fatwa?q=${encodeURIComponent(question)}`);
  };

  return (
    <section className="relative pt-32 pb-40 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50"></div>

      {/* Main Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient-alt"></div>

      {/* Animated Floating Orbs */}
      <div className="absolute top-20 right-[10%] w-96 h-96 bg-islamic-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute bottom-20 left-[10%] w-80 h-80 bg-islamic-gold-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-40 left-[20%] w-72 h-72 bg-islamic-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-bg opacity-10"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-islamic-gold-300" />
            <span className="text-sm font-medium text-white/90">Multi-Agent Epistemic Architecture</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Islamic</span>{' '}
            <span className="inline-block bg-clip-text text-transparent bg-gold-gradient animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Knowledge</span>
            <br />
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>At Your</span>{' '}
            <span className="inline-block bg-clip-text text-transparent bg-gold-gradient animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Fingertips</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Get authentic answers from multiple independent scholarly perspectives,
            preserving <span className="text-islamic-gold-300 font-semibold">ikhtilaf</span> and epistemic humility
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-8 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="search-input text-islamic-dark placeholder:text-islamic-dark/40 pr-40"
                placeholder="What do you want to know about Islam?"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-islamic"
              >
                <Search className="mr-2 h-4 w-4" />
                Ask Now
              </Button>

              {/* Glow effect on focus */}
              <div className="absolute inset-0 rounded-full bg-islamic-green-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </form>

          {/* Popular Topics */}
          <div className="flex flex-wrap justify-center gap-3 items-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <span className="text-sm text-white/60 font-medium">Popular:</span>
            {[
              'Prayer of the traveller',
              'What breaks my fast',
              'Hajj guide',
              'Islamic finance'
            ].map((term, idx) => (
              <button
                key={term}
                className="group relative px-4 py-2 rounded-full text-sm font-medium text-white/90 transition-all duration-300 hover:text-white"
                onClick={() => setQuestion(term)}
                style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
              >
                {/* Glassmorphic background */}
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"></div>

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-full bg-islamic-teal-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                <span className="relative">{term}</span>
              </button>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { label: 'Scholars Consulted', value: '4+', color: 'islamic-green' },
              { label: 'Active Users', value: '1K+', color: 'islamic-teal' },
              { label: 'Queries Answered', value: '5K+', color: 'islamic-gold' }
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="glass-panel rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${0.9 + idx * 0.1}s` }}
              >
                <div className={`text-3xl md:text-4xl font-bold text-${stat.color}-300 mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-islamic-light to-transparent"></div>
    </section>
  );
};

export default HeroSection;