import * as React from "react";
import { Sparkles, Sun, MoonStar, HelpCircle, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LanguageCode = "wo" | "fr" | "en";
type Difficulty = "easy" | "medium" | "advanced";

const quizByLanguage: Record<
  LanguageCode,
  Record<Difficulty, { question: string; options: string[]; correct: string; hint: string }>
> = {
  en: {
    easy: {
      question: "How many daily obligatory prayers are there in Islam?",
      options: ["Three", "Five", "Seven"],
      correct: "Five",
      hint: "Think of Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "In Maliki fiqh, what is one key condition for following an imām in congregational prayer?",
      options: [
        "Standing directly in front of the imām",
        "Intending to follow the imām at the beginning of the prayer",
        "Reciting Sūrat al-Fātiḥah aloud with the imām",
      ],
      correct: "Intending to follow the imām at the beginning of the prayer",
      hint: "It relates to your niyyah (intention).",
    },
    advanced: {
      question:
        "According to many Maliki jurists, when can local custom (ʿurf) be used in rulings?",
      options: [
        "Whenever it is popular, even if it contradicts Qurʾān and Sunnah",
        "When it does not oppose clear textual evidence and helps clarify contracts or practices",
        "Only in matters of pure worship (ʿibādāt)",
      ],
      correct:
        "When it does not oppose clear textual evidence and helps clarify contracts or practices",
      hint: "Custom cannot override explicit texts.",
    },
  },
  fr: {
    easy: {
      question: "Combien de prières obligatoires quotidiennes y a-t-il en Islam ?",
      options: ["Trois", "Cinq", "Sept"],
      correct: "Cinq",
      hint: "Pense à Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "En fiqh malikite, quelle est une condition clé pour suivre l’imam en prière collective ?",
      options: [
        "Se tenir directement devant l’imam",
        "Avoir l’intention de suivre l’imam au début de la prière",
        "Réciter la Fātiḥa à voix haute avec l’imam",
      ],
      correct: "Avoir l’intention de suivre l’imam au début de la prière",
      hint: "Cela concerne la niyyah (intention).",
    },
    advanced: {
      question:
        "Selon de nombreux juristes malikites, quand peut-on utiliser la coutume locale (ʿurf) dans les règles ?",
      options: [
        "Chaque fois qu’elle est populaire, même si elle contredit le Coran et la Sunna",
        "Lorsqu’elle n’oppose pas un texte clair et aide à clarifier des contrats ou pratiques",
        "Uniquement dans les questions d’adoration (ʿibādāt)",
      ],
      correct:
        "Lorsqu’elle n’oppose pas un texte clair et aide à clarifier des contrats ou pratiques",
      hint: "La coutume ne peut pas contredire des textes explicites.",
    },
  },
  wo: {
    easy: {
      question: "Njulli yu séentu bu bépp bés ñaata la ci Islam ?",
      options: ["Ñetti", "Juroom", "Juróom-ñaari"],
      correct: "Juroom",
      hint: "Xool Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "Ci fiqh Maliki, lan la benn xaalis bu am solo ngir topp imâm ci njulli bu jàmm ?",
      options: [
        "Taxaw ci kanam imâm",
        "Niyyah ngir topp imâm ci tàmbali njulli",
        "Waxal Sūrat al-Fātiḥah ci kaw ak imâm",
      ],
      correct: "Niyyah ngir topp imâm ci tàmbali njulli",
      hint: "Li jëm ci sa niyyah.",
    },
    advanced: {
      question:
        "Ni jurist yu bari ci Maliki wax, kan la ʿurf (àdetu dëkkuwaay) mën cee jariñu ci tegtal yi ?",
      options: [
        "Saa su nekk bu ne, su mel la muy di wacc Qurʼaan ak Sunna",
        "Su mu du séen ak mbind yu wér te mu dëgëral jëmmante ak jumtukaay yi",
        "Ci mbiri jaamu rekk (ʿibādāt)",
      ],
      correct: "Su mu du séen ak mbind yu wér te mu dëgëral jëmmante ak jumtukaay yi",
      hint: "Àdet mënul weñ wott mbind yu wér.",
    },
  },
};

interface DailyData {
  gregorianDate: string;
  hijriDate: string;
  ayah: {
    reference: string;
    arabic: string;
    translation: string;
  };
  dua: {
    arabic: string;
    translation: string;
  };
  fact: string;
}

const MOCK_DAILY: DailyData = {
  gregorianDate: "2025-01-01",
  hijriDate: "19 Jumādā al-Ākhirah 1446",
  ayah: {
    reference: "Al-Baqarah 2:286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond what it can bear.",
  },
  dua: {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
  },
  fact: "The five daily prayers were made obligatory during the Night Journey (al-Isrāʾ wal-Miʿrāj).",
};

const MOCK_DAILY_BY_LANG: Record<LanguageCode, DailyData> = {
  en: MOCK_DAILY,
  fr: {
    gregorianDate: "01/01/2025",
    hijriDate: "19 Jumādā al-Ākhirah 1446",
    ayah: {
      reference: "Al-Baqara 2:286",
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation:
        "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    },
    dua: {
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "Seigneur, augmente-moi en science.",
    },
    fact: "Les cinq prières obligatoires rythment la journée du musulman, de l’aube à la nuit.",
  },
  wo: {
    gregorianDate: "01-01-2025",
    hijriDate: "19 Jumādā al-Ākhirah 1446",
    ayah: {
      reference: "Al-Baqara 2:286",
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation:
        "Yàlla du jël ci koro jigeen walla góor lu gën sàmm ndigalu moom.",
    },
    dua: {
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "Ya Rabb, yokkal ma xam-xam.",
    },
    fact: "Njulli juroom-ñaari waxtuñ bi lay setlu bésu musulmaan.",
  },
};

const uiText: Record<
  LanguageCode,
  {
    sectionLabel: string;
    titlePrefix: string;
    titleHighlight: string;
    intro: string;
    ayahOfTheDay: string;
    loading: string;
    ayahLoading: string;
    ayahError: string;
    todayLabel: string;
    todaySummary: string;
    openReminder: string;
    dailyDua: string;
    dailyDuaLoading: string;
    dailyDuaError: string;
    smallFact: string;
    factLoading: string;
    factError: string;
    weeklyQuiz: string;
    weeklyQuizSubtitle: string;
    easy: string;
    medium: string;
    advanced: string;
    checkAnswer: string;
    correctFeedback: string;
    wrongFeedbackPrefix: string;
  }
> = {
  en: {
    sectionLabel: "Daily Islam",
    titlePrefix: "Your calm space for",
    titleHighlight: "today's guidance",
    intro:
      "Reminders, duas, small facts, and a weekly quiz – a calm rhythm to keep your heart close to Allah throughout the week.",
    ayahOfTheDay: "Ayah of the day",
    loading: "Loading...",
    ayahLoading: "Loading today's ayah…",
    ayahError: "Unable to load today's ayah.",
    todayLabel: "Today",
    todaySummary:
      "A simple rhythm for today: one ayah, one hadith, one dua, and one small action you can hold onto.",
    openReminder: "Open today's reminder",
    dailyDua: "Daily dua",
    dailyDuaLoading: "Loading today's dua…",
    dailyDuaError: "Unable to load today's dua.",
    smallFact: "Small fact",
    factLoading: "Loading today's fact…",
    factError: "Unable to load today's fact.",
    weeklyQuiz: "Weekly quiz",
    weeklyQuizSubtitle: "One question, three levels.",
    easy: "Easy",
    medium: "Medium",
    advanced: "Advanced",
    checkAnswer: "Check answer",
    correctFeedback: "Beautiful, that is correct.",
    wrongFeedbackPrefix: "Not quite. Hint: ",
  },
  fr: {
    sectionLabel: "Islam au quotidien",
    titlePrefix: "Un espace calme pour",
    titleHighlight: "la guidance d'aujourd'hui",
    intro:
      "Rappels, invocations, petites connaissances et un quiz hebdomadaire – un rythme doux pour garder ton cœur proche d’Allah.",
    ayahOfTheDay: "Verset du jour",
    loading: "Chargement…",
    ayahLoading: "Chargement du verset du jour…",
    ayahError: "Impossible de charger le verset du jour.",
    todayLabel: "Aujourd'hui",
    todaySummary:
      "Un petit rythme pour aujourd'hui : un verset, un hadith, une douʿa et une petite action à garder.",
    openReminder: "Ouvrir le rappel du jour",
    dailyDua: "Douʿa du jour",
    dailyDuaLoading: "Chargement de la douʿa du jour…",
    dailyDuaError: "Impossible de charger la douʿa du jour.",
    smallFact: "Petit rappel",
    factLoading: "Chargement du rappel du jour…",
    factError: "Impossible de charger le rappel du jour.",
    weeklyQuiz: "Quiz de la semaine",
    weeklyQuizSubtitle: "Une question, trois niveaux.",
    easy: "Facile",
    medium: "Intermédiaire",
    advanced: "Avancé",
    checkAnswer: "Vérifier la réponse",
    correctFeedback: "Très bien, c’est correct.",
    wrongFeedbackPrefix: "Pas tout à fait. Indice : ",
  },
  wo: {
    sectionLabel: "Jàmmu Islam bii tey",
    titlePrefix: "Sa dëkk bu sukkandiku",
    titleHighlight: "cër yi tey",
    intro:
      "Tontu, duʿa, xam-xam yu ndaw ak quizu besub lakk – ngir nga dëppoo say xol ak Yàlla léegi léegi.",
    ayahOfTheDay: "Aaya bu bees",
    loading: "Mi ngi yeb…",
    ayahLoading: "Mi ngi yeb aaya bii…",
    ayahError: "Mënul yeb aaya bii.",
    todayLabel: "Tey",
    todaySummary:
      "Ci bés bii: benn aaya, benn hadith, benn duʿa ak benn jëf bu ndaw nga mën jëfandikoo.",
    openReminder: "Ubbi cuqalub bés bii",
    dailyDua: "Duʿa bu tey",
    dailyDuaLoading: "Mi ngi yeb duʿa bu tey…",
    dailyDuaError: "Mënul yeb duʿa bu tey.",
    smallFact: "Xam-xam bu ndaw",
    factLoading: "Mi ngi yeb xam-xam bu tey…",
    factError: "Mënul yeb xam-xam bu tey.",
    weeklyQuiz: "Quizu ayu-bés",
    weeklyQuizSubtitle: "Benn laaj, ñatte tollu.",
    easy: "Wóor-wóor",
    medium: "Dig-digg",
    advanced: "Xuux",
    checkAnswer: "Seet tontu bi",
    correctFeedback: "Baax na, tontu bi dëgg la.",
    wrongFeedbackPrefix: "Dul li. Wanaan: ",
  },
};

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [loadingDaily, setLoadingDaily] = React.useState(true);
  const [daily, setDaily] = React.useState<DailyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const t = uiText[language];
  const quiz = quizByLanguage[language][difficulty];
  const isCorrect = submitted && selectedOption === quiz.correct;

  React.useEffect(() => {
    const fetchDaily = async () => {
      setLoadingDaily(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/daily`);
        if (!response.ok) throw new Error('Failed to fetch daily content');
        const data = await response.json();
        
        // Map API response to DailyData format
        const mappedData: DailyData = {
          gregorianDate: data.gregorianDate,
          hijriDate: data.hijriDate,
          ayah: {
            reference: data.ayah.reference,
            arabic: data.ayah.arabic,
            translation: data.ayah.translation,
          },
          dua: {
            arabic: data.dua.arabic,
            translation: data.dua.translation,
          },
          fact: data.fact,
        };
        setDaily(mappedData);
      } catch (err) {
        console.error('Error fetching daily content:', err);
        setError('Failed to load daily content');
        // Fallback to mock data
        setDaily(MOCK_DAILY_BY_LANG[language]);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchDaily();
  }, [language]);

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              {t.sectionLabel}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              {t.titlePrefix}{" "}
              <span className="text-gradient">{t.titleHighlight}</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">{t.intro}</p>
          </div>

          <div className="flex items-center gap-3" />
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Ayah / reminder */}
          <div className="islamic-card col-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/10 via-islamic-blue/5 to-islamic-gold/10 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-gold/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative p-8 h-full flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-1 font-semibold">
                    {t.ayahOfTheDay}
                  </p>
                  <p className="text-sm text-islamic-dark/70 font-medium">
                    {daily?.ayah.reference ?? (loadingDaily ? t.loading : "")}
                  </p>
                </div>
                <div className="p-2 bg-islamic-gold/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-islamic-gold" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-arabic text-3xl md:text-4xl leading-relaxed text-islamic-dark/95 min-h-[4rem] text-right">
                  {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-islamic-gold/30 to-transparent" />

                <p className="text-base text-islamic-dark/85 leading-relaxed italic">
                  {daily?.ayah.translation ??
                    (loadingDaily ? t.ayahLoading : t.ayahError)}
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-islamic-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-2 font-semibold">
                    {t.todayLabel}
                  </p>
                  <p className="font-semibold text-islamic-dark text-lg">
                    {daily?.gregorianDate ? new Date(daily.gregorianDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'wo' ? 'wo-SN' : 'en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ""}
                  </p>
                  <p className="font-medium text-islamic-dark/80 mt-1 text-sm">
                    {daily?.hijriDate ?? (loadingDaily ? t.loading : "")}
                  </p>
                </div>
                <div className="flex gap-2 text-islamic-gold">
                  <div className="p-2 bg-islamic-gold/10 rounded-lg">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div className="p-2 bg-islamic-blue/10 rounded-lg">
                    <MoonStar className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-islamic-dark/70 mb-4 leading-relaxed">
                {t.todaySummary}
              </p>
              <button className="btn-islamic w-full hover:scale-[1.02] transition-transform">
                {t.openReminder}
              </button>
            </div>
          </div>
        </div>

        {/* Duas, facts, quiz */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="islamic-card p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-3 font-semibold">
                {t.dailyDua}
              </p>
              <p className="font-arabic text-2xl text-islamic-dark/95 mb-3 text-right leading-relaxed">
                {daily?.dua.arabic ?? (loadingDaily ? "…" : "")}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-islamic-green/20 to-transparent mb-3" />
              <p className="text-sm text-islamic-dark/80 leading-relaxed">
                {daily?.dua.translation ??
                  (loadingDaily ? t.dailyDuaLoading : t.dailyDuaError)}
              </p>
            </div>
          </div>

          <div className="islamic-card p-6 space-y-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-3 font-semibold">
                {t.smallFact}
              </p>
              <p className="text-sm text-islamic-dark/80 leading-relaxed">
                {daily?.fact ??
                  (loadingDaily ? t.factLoading : t.factError)}
              </p>
            </div>
          </div>

          <div className="islamic-card p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 font-semibold">
                    {t.weeklyQuiz}
                  </p>
                  <p className="text-sm text-islamic-dark/80 mt-1">
                    {t.weeklyQuizSubtitle}
                  </p>
                </div>
                <div className="p-2 bg-islamic-gold/10 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-islamic-gold" />
                </div>
              </div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              <button
                type="button"
                onClick={() => {
                  setDifficulty("easy");
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  difficulty === "easy"
                    ? "bg-islamic-green text-white border-islamic-green"
                    : "bg-islamic-green/10 text-islamic-green border-transparent"
                }`}
              >
                {t.easy}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDifficulty("medium");
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  difficulty === "medium"
                    ? "bg-islamic-gold text-white border-islamic-gold"
                    : "bg-islamic-gold/10 text-islamic-gold border-transparent"
                }`}
              >
                {t.medium}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDifficulty("advanced");
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  difficulty === "advanced"
                    ? "bg-islamic-blue text-white border-islamic-blue"
                    : "bg-islamic-blue/10 text-islamic-blue border-transparent"
                }`}
              >
                {t.advanced}
              </button>
            </div>

            <p className="text-sm text-islamic-dark/85">{quiz.question}</p>

            <div className="space-y-2 mt-2">
              {quiz.options.map((option) => {
                const selected = selectedOption === option;
                const correct = submitted && option === quiz.correct;
                const wrong = submitted && selected && !correct;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedOption(option);
                      setSubmitted(false);
                    }}
                    className={`w-full text-left text-xs md:text-sm px-3 py-2 rounded-full border transition-colors ${
                      correct
                        ? "border-green-600 bg-green-50 text-green-800"
                        : wrong
                          ? "border-red-600 bg-red-50 text-red-800"
                          : selected
                            ? "border-islamic-green bg-islamic-green/5 text-islamic-green"
                            : "border-islamic-cream bg-white/60 text-islamic-dark/80 hover:bg-islamic-cream/40"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selectedOption) return;
                setSubmitted(true);
              }}
              className="btn-islamic-outlined w-full mt-3 flex items-center justify-center gap-1"
            >
              <Star className="w-4 h-4" />
              {t.checkAnswer}
            </button>

            {submitted && (
              <p
                className={`mt-2 text-xs ${
                  isCorrect ? "text-green-700" : "text-islamic-dark/75"
                }`}
              >
                {isCorrect
                  ? t.correctFeedback
                  : `${t.wrongFeedbackPrefix}${quiz.hint}`}
              </p>
            )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;


