import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Topics', href: '#topics' },
    { title: 'About', href: '#about' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-islamic-green to-islamic-blue">
            XamSaDine AI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-end flex-1">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="px-4 py-2 rounded-md text-islamic-dark hover:bg-islamic-cream transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-16 inset-x-0 bg-white shadow-md z-50 py-4 px-6 space-y-4 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="block py-2 text-islamic-dark hover:text-islamic-green transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
