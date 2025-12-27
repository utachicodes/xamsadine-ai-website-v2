import * as React from "react";
import { BookMarked, Sun, Moon, Palette } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Madhab = "hanafi" | "maliki" | "shafii" | "hanbali";
type Theme = "light" | "dark" | "auto";

const Language: React.FC = () => {
  const { t } = useLanguage();
  const [madhab, setMadhab] = React.useState<Madhab>("maliki");
  const [theme, setTheme] = React.useState<Theme>("light");

  const madhabs: { value: Madhab; label: string; region: string }[] = [
    { value: "hanafi", label: "Hanafi", region: "Türkiye, Pakistan, India, Central Asia" },
    { value: "maliki", label: "Maliki", region: "West & North Africa (Senegal, Morocco, etc.)" },
    { value: "shafii", label: "Shafi'i", region: "East Africa, Southeast Asia, Yemen" },
    { value: "hanbali", label: "Hanbali", region: "Gulf region, Saudi Arabia" },
  ];

  React.useEffect(() => {
    // Load saved preferences
    const savedMadhab = localStorage.getItem('xamsadine-madhab') as Madhab;
    const savedTheme = localStorage.getItem('xamsadine-theme') as Theme;
    if (savedMadhab && ['hanafi', 'maliki', 'shafii', 'hanbali'].includes(savedMadhab)) {
      setMadhab(savedMadhab);
    }
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme);
      // Apply theme immediately on load
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto mode - use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }, []);

  const handleMadhabChange = (newMadhab: Madhab) => {
    setMadhab(newMadhab);
    localStorage.setItem('xamsadine-madhab', newMadhab);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('xamsadine-theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-5 h-5" />, description: "Bright and clear interface" },
    { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5" />, description: "Easy on the eyes" },
    { value: "auto", label: "Auto", icon: <Palette className="w-5 h-5" />, description: "Follow system preference" },
  ];

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header>
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              <span className="text-gradient">Preferences</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">
              Customize your madhab preference and theme. XamSaDine will tailor all answers accordingly.
            </p>
          </div>
        </header>

        {/* Theme section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-islamic-gold" />
            <h2 className="text-xl font-semibold text-islamic-dark">Theme</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`islamic-card p-5 text-left transition-all ${
                  theme === t.value
                    ? "ring-2 ring-islamic-gold bg-islamic-gold/5"
                    : "hover:bg-islamic-cream/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${theme === t.value ? 'bg-islamic-gold/10 text-islamic-gold' : 'bg-islamic-cream/50 text-islamic-dark/60'}`}>
                      {t.icon}
                    </div>
                    <p className="text-base font-semibold text-islamic-dark">{t.label}</p>
                  </div>
                  {theme === t.value && (
                    <div className="w-5 h-5 rounded-full bg-islamic-gold flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-islamic-dark/70">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Madhab section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-islamic-blue" />
            <h2 className="text-xl font-semibold text-islamic-dark">Madhab (School of Fiqh)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {madhabs.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMadhabChange(m.value)}
                className={`islamic-card p-5 text-left transition-all ${
                  madhab === m.value
                    ? "ring-2 ring-islamic-green bg-islamic-green/5"
                    : "hover:bg-islamic-cream/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold text-islamic-dark">{m.label}</p>
                  {madhab === m.value && (
                    <div className="w-5 h-5 rounded-full bg-islamic-green flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-islamic-dark/70">Common in: {m.region}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="islamic-card p-6 flex items-start gap-4 bg-islamic-cream/70">
          <div className="w-10 h-10 rounded-full bg-islamic-gold/10 flex items-center justify-center text-islamic-gold">
            <BookMarked className="w-5 h-5" />
          </div>
          <div className="text-sm text-islamic-dark/80 space-y-2">
            <p className="font-medium">Your choices shape every answer</p>
            <p>
              When you ask a question in Guided Fatwa or explore Daily Islam, XamSaDine will prioritize references, rulings, and explanations from your selected madhab and present them in your chosen language.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Language;

