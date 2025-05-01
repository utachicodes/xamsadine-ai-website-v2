
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TopicsSection from '@/components/TopicsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-16 bg-islamic-light relative overflow-hidden">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden islamic-border">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-gradient-to-br from-islamic-green to-islamic-blue p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Why Choose XamSaDine?</h3>
                  <p className="mb-6">Our platform connects you with authentic Islamic knowledge and trusted scholars.</p>
                  <div className="mt-auto">
                    <Sparkles className="w-12 h-12 text-islamic-gold opacity-80" />
                  </div>
                </div>
                
                <div className="col-span-2 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                        <span className="text-islamic-green font-bold">01</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Authentic Knowledge</h4>
                      <p className="text-islamic-dark/70 text-sm">All answers are based on authentic Islamic sources and verified by scholars.</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                        <span className="text-islamic-green font-bold">02</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Easy Access</h4>
                      <p className="text-islamic-dark/70 text-sm">Get answers to your questions anytime, anywhere through our user-friendly interface.</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                        <span className="text-islamic-green font-bold">03</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Comprehensive Topics</h4>
                      <p className="text-islamic-dark/70 text-sm">Explore a wide range of Islamic topics, from basic beliefs to complex jurisprudence.</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="w-12 h-12 rounded-full bg-islamic-green/10 flex items-center justify-center mb-4">
                        <span className="text-islamic-green font-bold">04</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Community Support</h4>
                      <p className="text-islamic-dark/70 text-sm">Join a growing community of seekers of knowledge and experts in Islamic studies.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <TopicsSection />
        <AboutSection />
        
        {/* CTA Section */}
        <section className="py-24 bg-islamic-light pattern-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Deepen Your Islamic Knowledge?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of Muslims around the world who use XamSaDine to find authentic answers to their questions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#" className="btn-islamic">
                  Start Exploring
                </a>
                <a href="#" className="px-6 py-3 font-medium rounded-full bg-white text-islamic-green shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-opacity-90 active:scale-95">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
