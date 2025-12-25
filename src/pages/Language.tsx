import * as React from "react";
import { Languages, BookMarked } from "lucide-react";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

type Madhab = "hanafi" | "maliki" | "shafii" | "hanbali";

const Language: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [madhab, setMadhab] = React.useState<Madhab>("maliki");

  const madhabs: { value: Madhab; label: string; region: string }[] = [
    { value: "hanafi", label: "Hanafi", region: "Türkiye, Pakistan, India, Central Asia" },
    { value: "maliki", label: "Maliki", region: "West & North Africa (Senegal, Morocco, etc.)" },
    { value: "shafii", label: "Shafi'i", region: "East Africa, Southeast Asia, Yemen" },
    { value: "hanbali", label: "Hanbali", region: "Gulf region, Saudi Arabia" },
  ];

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              Language & <span className="text-gradient">Madhab</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">
              Choose your language and the school of fiqh (madhab) you follow. XamSaDine will tailor all answers accordingly.
            </p>
          </div>

          <LanguageToggle value={language} onChange={setLanguage} />
        </header>

        {/* Language section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-islamic-green" />
            <h2 className="text-xl font-semibold text-islamic-dark">Language</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="islamic-card p-5 space-y-2">
              <p className="text-sm font-semibold text-islamic-dark">Wolof</p>
              <p className="text-xs text-islamic-dark/70">
                For questions, reminders, and explanations rooted in Senegalese everyday speech.
              </p>
            </div>
            <div className="islamic-card p-5 space-y-2">
              <p className="text-sm font-semibold text-islamic-dark">Français</p>
              <p className="text-xs text-islamic-dark/70">
                For users who are more comfortable in French or need to share answers in French contexts.
              </p>
            </div>
            <div className="islamic-card p-5 space-y-2">
              <p className="text-sm font-semibold text-islamic-dark">English</p>
              <p className="text-xs text-islamic-dark/70">
                For international use, diaspora, and readers who prefer English.
              </p>
            </div>
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
                onClick={() => setMadhab(m.value)}
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

