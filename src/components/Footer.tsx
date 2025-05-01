import React from 'react';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-islamic-dark text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <span className="font-bold text-xl text-islamic-gold">XamSaDine AI</span>
            </div>
            <p className="text-white/70 mb-4">
              A platform dedicated to providing authentic Islamic knowledge through expert scholars.
            </p>
            <div className="flex space-x-3">
              <a href="https://web.facebook.com/xamsadinexamsalon" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/xamsadine" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/xamsadine/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@XamSaDineAcademy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green text-white hover:bg-islamic-gold transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
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
                <a href="https://mail.google.com/mail/u/0/#inbox?compose=new" target="_blank" rel="noopener noreferrer" className="inline-block btn-islamic mt-2">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} XamSaDine AI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;