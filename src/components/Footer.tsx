
import React from 'react';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-islamic-dark text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-islamic-green flex items-center justify-center text-white font-bold text-lg">
                X
              </div>
              <span className="font-bold text-xl text-islamic-gold">XamSaDine</span>
            </div>
            <p className="text-white/70 mb-4">
              A platform dedicated to providing authentic Islamic knowledge through expert scholars.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/70 hover:text-islamic-gold transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-islamic-gold transition-colors">About Us</a>
              </li>
              <li>
                <a href="#topics" className="text-white/70 hover:text-islamic-gold transition-colors">Topics</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Scholars</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Islamic Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Prayer Times</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Quran Online</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Hadith Collection</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Islamic Calendar</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-islamic-gold transition-colors">Qibla Direction</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-islamic-gold mr-3 mt-1" />
                <span className="text-white/70">+221 77 123 45 67</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-islamic-gold mr-3 mt-1" />
                <span className="text-white/70">info@xamsadine.com</span>
              </li>
              <li>
                <a href="#" className="inline-block btn-islamic mt-2">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} XamSaDine Islamic Knowledge Platform. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
