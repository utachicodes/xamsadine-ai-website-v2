import * as React from 'react';
import HeroSection from '@/components/HeroSection';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

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
                  {t('index.what_title_prefix')} <span className="text-gradient">{t('index.what_title_gradient')}</span>
                </h2>
                <p className="text-lg text-islamic-dark/70 max-w-2xl mx-auto">
                  {t('index.what_subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link to="/fatwa" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-islamic-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('index.guided_fatwa_title')}</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">{t('index.guided_fatwa_desc')}</p>
                  <span className="text-sm text-islamic-green font-medium inline-flex items-center gap-1">
                    {t('index.try_it_now')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/dashboard" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-blue/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-islamic-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('index.daily_islam_title')}</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">{t('index.daily_islam_desc')}</p>
                  <span className="text-sm text-islamic-blue font-medium inline-flex items-center gap-1">
                    {t('index.see_today')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/fiqh" className="islamic-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-islamic-gold/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-islamic-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('index.fiqh_map_title')}</h3>
                  <p className="text-islamic-dark/70 text-sm mb-3">{t('index.fiqh_map_desc')}</p>
                  <span className="text-sm text-islamic-gold font-medium inline-flex items-center gap-1">
                    {t('index.explore')} <ArrowRight className="w-4 h-4" />
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
                  {t('index.how_title_prefix')} <span className="text-gradient">{t('index.how_title_gradient')}</span>
                </h2>
                <p className="text-lg text-islamic-dark/70">{t('index.how_subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">{t('index.step1_title')}</h4>
                      <p className="text-sm text-islamic-dark/70">{t('index.step1_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">{t('index.step2_title')}</h4>
                      <p className="text-sm text-islamic-dark/70">{t('index.step2_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">{t('index.step3_title')}</h4>
                      <p className="text-sm text-islamic-dark/70">{t('index.step3_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-islamic-green font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-islamic-dark mb-1">{t('index.step4_title')}</h4>
                      <p className="text-sm text-islamic-dark/70">{t('index.step4_desc')}</p>
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
                {t('index.final_cta_title')}
              </h2>
              <p className="text-xl text-white/80 mb-8">
                {t('index.final_cta_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/fatwa" className="btn-islamic">
                  {t('index.ask_question_btn')}
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
