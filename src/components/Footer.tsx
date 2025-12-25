import React from 'react';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-islamic-dark text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <span className="font-bold text-xl text-islamic-gold">XamSaDine AI</span>
            </div>
            <p className="text-white/70 mb-4">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-islamic-gold mr-3 mt-1" />
                <span className="text-white/70">+221 78 108 05 06</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-islamic-gold mr-3 mt-1" />
                <span className="text-white/70">xamsadineacademy@gmail.com</span>
              </li>
              <li>
                <a href="/login" className="inline-block btn-islamic mt-2">
                  {t('nav.daily')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} XamSaDine AI. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;