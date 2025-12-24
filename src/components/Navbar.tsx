import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Daily Islam', href: '/dashboard' },
    { title: 'Guided Fatwa', href: '/fatwa' },
    { title: 'Circle of Knowledge', href: '/circle' },
    { title: 'Admin Config', href: '/admin' },
    { title: 'Documents', href: '/documents' },
    { title: 'Fiqh', href: '/fiqh' },
    { title: 'Settings', href: '/language' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-islamic-green to-islamic-blue">
            XamSaDine AI
          </span>
        </div>

        {/* Menu button (all breakpoints) */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu (opens under header on all breakpoints) */}
      {isMenuOpen && (
        <div className="absolute top-16 inset-x-4 md:inset-x-auto md:right-6 md:w-60 bg-white/95 shadow-xl rounded-2xl border border-islamic-cream z-50 py-4 px-6 space-y-2 transform origin-top transition-all duration-200 ease-out">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="block py-2 text-sm text-islamic-dark hover:text-islamic-green transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
