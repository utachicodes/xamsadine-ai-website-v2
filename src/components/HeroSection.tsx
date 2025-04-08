
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const HeroSection = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWebUI, setShowWebUI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading for the WebUI
    setTimeout(() => {
      setIsLoading(false);
      setShowWebUI(true);
      // Simulate scrolling to the iframe
      setTimeout(() => {
        const webUIContainer = document.getElementById('webui-container');
        webUIContainer?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  return (
    <section className="relative pt-24 pb-32 overflow-hidden pattern-bg">
      <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-islamic-gold opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-islamic-teal opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-float">Islamic</span>{' '}
            <span className="text-islamic-gold">Knowledge</span>{' '}
            <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>At</span>{' '}
            <span className="text-islamic-gold">Your</span>{' '}
            <span className="inline-block animate-float" style={{ animationDelay: '1s' }}>Fingertips</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8">
            Get authentic answers to your questions from knowledgeable scholars
          </p>
          
          <form onSubmit={handleSubmit} className="relative mt-12 mb-8">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="search-input"
              placeholder="What do you want to know about Islam?"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-islamic"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <span className="loading-dot animate-bounce"></span>
                  <span className="loading-dot animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="loading-dot animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Ask
                </>
              )}
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-white/70">
            <span>Popular:</span>
            {['Prayer times', 'Fasting rules', 'Hajj guide', 'Islamic finance'].map((term) => (
              <button
                key={term}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setQuestion(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        
        {/* WebUI Container */}
        {showWebUI && (
          <div id="webui-container" className="mt-12 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-islamic-cream">
            <div className="bg-islamic-blue/10 p-3 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm font-medium">XamSaDine Knowledge Base</div>
              <div></div>
            </div>
            <iframe 
              src={`http://localhost:3000/?q=${encodeURIComponent(question)}`} 
              className="w-full h-[600px]"
              title="XamSaDine WebUI"
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
