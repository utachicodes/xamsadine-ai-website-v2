import * as React from 'react';
import HeroSection from '@/components/HeroSection';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        
        {/* What XamSaDine Does */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-islamic-dark mb-4">
                  An AI advisor for <span className="text-gradient">Islamic guidance</span>
                </h2>
                <p className="text-lg text-islamic-dark/70 max-w-2xl mx-auto">
                  XamSaDine uses AI backed by expert scholars to provide structured, authentic answers to your questions about Islam.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link to="/fatwa" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-islamic-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Guided Fatwa</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">
                    Ask any Islamic question and receive a structured answer with clarification, hukm, evidence, explanation, and advice.
                  </p>
                  <span className="text-sm text-islamic-green font-medium inline-flex items-center gap-1">
                    Try it now <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/dashboard" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-blue/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-islamic-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Daily Islam</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">
                    Start each day with an ayah, hadith, dua, a small fact, and a weekly quiz to keep your knowledge fresh.
                  </p>
                  <span className="text-sm text-islamic-blue font-medium inline-flex items-center gap-1">
                    See today <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/fiqh" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-gold/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-islamic-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fiqh Map</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">
                    Explore fiqh themes across all four madhabs: worship, transactions, family, ethics, and local contexts.
                  </p>
                  <span className="text-sm text-islamic-gold font-medium inline-flex items-center gap-1">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-islamic-light relative overflow-hidden">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-islamic-dark mb-4">
                  Built for <span className="text-gradient">Senegal and the Ummah</span>
                </h2>
                <p className="text-lg text-islamic-dark/70">
                  Every answer follows a calm, structured flow rooted in authentic sources.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">Your madhab, your answers</h4>
                      <p className="text-sm text-islamic-dark/70">Choose your school of fiqh (Hanafi, Maliki, Shafi'i, Hanbali) and receive answers grounded in that tradition.</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">Senegalese context</h4>
                      <p className="text-sm text-islamic-dark/70">XamSaDine understands local customs, language (Wolof, French), and the realities of Muslim life in Senegal.</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">Structured & authenticated</h4>
                      <p className="text-sm text-islamic-dark/70">Each fatwa flows through 5 steps with clear references from Qur'an, Hadith, and classical texts of your madhab.</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">Islamic questions only</h4>
                      <p className="text-sm text-islamic-dark/70">XamSaDine is dedicated to Islamic guidance. It gently declines non-Islamic topics to stay focused.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-24 bg-islamic-light pattern-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 text-islamic-gold mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to ask your first question?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Start a guided fatwa session or explore today's daily content. XamSaDine is here to walk with you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/fatwa" className="btn-islamic">
                  Ask a question
                </Link>
                <Link to="/dashboard" className="px-6 py-3 font-medium rounded-full bg-white text-islamic-green shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-opacity-90 active:scale-95">
                  See Daily Islam
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
