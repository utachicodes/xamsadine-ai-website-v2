import * as React from "react";
import { Sparkles, Sun, MoonStar, HelpCircle, Star } from "lucide-react";
import LanguageToggle from "@/components/common/LanguageToggle";

type LanguageCode = "wo" | "fr" | "en";
type Difficulty = "easy" | "medium" | "advanced";

const quizByDifficulty: Record<
  Difficulty,
  { question: string; options: string[]; correct: string; hint: string }
> = {
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
  const [lang, setLang] = React.useState<LanguageCode>("fr");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [loadingDaily] = React.useState(false);

  const daily = MOCK_DAILY_BY_LANG[lang];
  const t = uiText[lang];
  const quiz = quizByDifficulty[difficulty];
  const isCorrect = submitted && selectedOption === quiz.correct;

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

          <div className="flex items-center gap-3">
            <LanguageToggle value={lang} onChange={setLang} />
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Ayah / reminder */}
          <div className="islamic-card col-span-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/10 via-islamic-blue/5 to-islamic-gold/10" />
            <div className="relative p-6 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-1">
                    {t.ayahOfTheDay}
                  </p>
                  <p className="text-sm text-islamic-dark/70">
                    {daily?.ayah.reference ?? t.loading}
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-islamic-gold" />
              </div>

              <p className="font-arabic text-2xl leading-relaxed text-islamic-dark/90 min-h-[3rem]">
                {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
              </p>

              <p className="text-sm text-islamic-dark/80">
                {daily?.ayah.translation ??
                  (loadingDaily ? t.ayahLoading : t.ayahError)}
              </p>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 mb-1">
                  {t.todayLabel}
                </p>
                <p className="font-medium text-islamic-dark">
                  {daily?.hijriDate ?? "Hijri date (connect API)"}
                </p>
              </div>
              <div className="flex gap-2 text-islamic-gold">
                <Sun className="w-5 h-5" />
                <MoonStar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-islamic-dark/70 mb-3">
              {t.todaySummary}
            </p>
            <button className="btn-islamic w-full">
              {t.openReminder}
            </button>
          </div>
        </div>

        {/* Duas, facts, quiz */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="islamic-card p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60">
              {t.dailyDua}
            </p>
            <p className="font-arabic text-xl text-islamic-dark/90">
              {daily?.dua.arabic ?? "…"}
            </p>
            <p className="text-xs text-islamic-dark/70">
              {daily?.dua.translation ??
                (loadingDaily ? t.dailyDuaLoading : t.dailyDuaError)}
            </p>
          </div>

          <div className="islamic-card p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60">
              {t.smallFact}
            </p>
            <p className="text-sm text-islamic-dark/80">
              {daily?.fact ??
                (loadingDaily ? t.factLoading : t.factError)}
            </p>
          </div>

          <div className="islamic-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60">
                  {t.weeklyQuiz}
                </p>
                <p className="text-sm text-islamic-dark/80">
                  {t.weeklyQuizSubtitle}
                </p>
              </div>
              <HelpCircle className="w-5 h-5 text-islamic-gold" />
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
      </section>
    </div>
  );
};

export default Dashboard;


