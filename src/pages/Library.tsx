import * as React from "react";
import { useState, useMemo } from "react";
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  Star,
  FileText,
  Globe,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_BOOKS } from "@/lib/mock-data";
import type { DigitalBook, BookCategory, BookLanguage, BookFormat } from "@/types/ecosystem";
import { toast } from "sonner";

type LanguageCode = "wo" | "fr" | "en";

const translations: Record<LanguageCode, {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filterCategory: string;
  filterLanguage: string;
  filterFormat: string;
  allCategories: string;
  allLanguages: string;
  allFormats: string;
  downloads: string;
  pages: string;
  fileSize: string;
  downloadButton: string;
  featured: string;
  noResults: string;
  categories: Record<BookCategory, string>;
  languages: Record<BookLanguage, string>;
  formats: Record<BookFormat, string>;
}> = {
  en: {
    title: "Digital Islamic Library",
    subtitle: "Access a comprehensive collection of Islamic books, texts, and resources",
    searchPlaceholder: "Search books by title, author, or topic...",
    filterCategory: "Category",
    filterLanguage: "Language",
    filterFormat: "Format",
    allCategories: "All Categories",
    allLanguages: "All Languages",
    allFormats: "All Formats",
    downloads: "downloads",
    pages: "pages",
    fileSize: "MB",
    downloadButton: "Download",
    featured: "Featured",
    noResults: "No books found matching your criteria",
    categories: {
      quran: "Quran",
      hadith: "Hadith",
      fiqh: "Fiqh",
      aqeedah: "Aqeedah",
      seerah: "Seerah",
      tafsir: "Tafsir",
      arabic: "Arabic Learning",
      dua: "Dua & Dhikr",
      general: "General"
    },
    languages: {
      ar: "Arabic",
      en: "English",
      fr: "French",
      wo: "Wolof"
    },
    formats: {
      pdf: "PDF",
      epub: "EPUB",
      mobi: "MOBI",
      audio: "Audio"
    }
  },
  fr: {
    title: "Bibliothèque Islamique Numérique",
    subtitle: "Accédez à une collection complète de livres, textes et ressources islamiques",
    searchPlaceholder: "Rechercher par titre, auteur ou sujet...",
    filterCategory: "Catégorie",
    filterLanguage: "Langue",
    filterFormat: "Format",
    allCategories: "Toutes les catégories",
    allLanguages: "Toutes les langues",
    allFormats: "Tous les formats",
    downloads: "téléchargements",
    pages: "pages",
    fileSize: "Mo",
    downloadButton: "Télécharger",
    featured: "En vedette",
    noResults: "Aucun livre ne correspond à vos critères",
    categories: {
      quran: "Coran",
      hadith: "Hadith",
      fiqh: "Fiqh",
      aqeedah: "Aqeedah",
      seerah: "Seerah",
      tafsir: "Tafsir",
      arabic: "Apprentissage de l'arabe",
      dua: "Dua & Dhikr",
      general: "Général"
    },
    languages: {
      ar: "Arabe",
      en: "Anglais",
      fr: "Français",
      wo: "Wolof"
    },
    formats: {
      pdf: "PDF",
      epub: "EPUB",
      mobi: "MOBI",
      audio: "Audio"
    }
  },
  wo: {
    title: "Librairie Islamique Numérique",
    subtitle: "Jàppale li am ci tééré bu Islam, bind yi ak jumtukaay yu bari",
    searchPlaceholder: "Seet téere ci tur, bind mooy walla sujet...",
    filterCategory: "Kàddu",
    filterLanguage: "Làkk",
    filterFormat: "Format",
    allCategories: "Yépp kàddu",
    allLanguages: "Yépp làkk",
    allFormats: "Yépp format",
    downloads: "téléchargement",
    pages: "xët",
    fileSize: "Mo",
    downloadButton: "Télécharger",
    featured: "Bëgg-bëgg",
    noResults: "Amul tééré bu am sa kriiteer",
    categories: {
      quran: "Qurʼaan",
      hadith: "Hadith",
      fiqh: "Fiqh",
      aqeedah: "Aqeedah",
      seerah: "Seerah",
      tafsir: "Tafsir",
      arabic: "Jàng làkk Arab",
      dua: "Dua & Dhikr",
      general: "Général"
    },
    languages: {
      ar: "Arab",
      en: "Angle",
      fr: "Farañse",
      wo: "Wolof"
    },
    formats: {
      pdf: "PDF",
      epub: "EPUB",
      mobi: "MOBI",
      audio: "Audio"
    }
  }
};

export default function Library() {
  const { language } = useLanguage();
  const t = translations[language as LanguageCode] || translations.en;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "all" || book.language === selectedLanguage;
      const matchesFormat = selectedFormat === "all" || book.format === selectedFormat;
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesFormat;
    });
  }, [searchQuery, selectedCategory, selectedLanguage, selectedFormat]);
  
  const handleDownload = (book: DigitalBook) => {
    // In production, this would trigger actual download from book.file_url
    toast.success(`Downloading: ${book.title}`, {
      description: `Format: ${book.format.toUpperCase()} | Size: ${book.file_size_mb} MB`
    });
    
    // Simulate download
    console.log("Downloading:", book.title, "from", book.file_url);
    
    // In production, you would:
    // window.open(book.file_url, '_blank');
    // or
    // fetch(book.file_url).then(response => response.blob())...
  };

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Digital Library
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark dark:text-slate-100">
              {t.title}
            </h1>
            <p className="mt-2 text-islamic-dark/70 dark:text-slate-300 max-w-xl">
              {t.subtitle}
            </p>
          </div>
        </header>
        {/* Search and Filters */}
        <div className="islamic-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCategories}</SelectItem>
                {(Object.keys(t.categories) as BookCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t.categories[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allLanguages}</SelectItem>
                {(Object.keys(t.languages) as BookLanguage[]).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {t.languages[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Filter */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              variant={selectedFormat === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFormat("all")}
            >
              {t.allFormats}
            </Button>
            {(Object.keys(t.formats) as BookFormat[]).map((fmt) => (
              <Button
                key={fmt}
                variant={selectedFormat === fmt ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFormat(fmt)}
              >
                {t.formats[fmt]}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-islamic-dark/60 dark:text-slate-400 font-medium">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-islamic-dark/30 dark:text-slate-600 mb-4" />
            <p className="text-xl text-islamic-dark/60 dark:text-slate-400">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="islamic-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="relative">
                    {book.cover_image_url && (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105"
                      />
                    )}
                    {book.featured && (
                      <Badge className="absolute top-2 right-2 bg-islamic-gold text-white">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {t.featured}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-islamic-dark dark:text-slate-100">{book.title}</CardTitle>
                  <CardDescription className="text-islamic-dark/70 dark:text-slate-400">{book.author}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-islamic-dark/70 dark:text-slate-400 line-clamp-3 mb-4">
                    {book.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-islamic-cream/50 dark:bg-slate-700 text-islamic-dark dark:text-slate-200">
                      {t.categories[book.category]}
                    </Badge>
                    <Badge variant="outline" className="border-islamic-gold/30 text-islamic-dark dark:text-slate-300">
                      <Globe className="h-3 w-3 mr-1" />
                      {t.languages[book.language]}
                    </Badge>
                    <Badge variant="outline" className="border-islamic-gold/30 text-islamic-dark dark:text-slate-300">
                      <FileText className="h-3 w-3 mr-1" />
                      {t.formats[book.format]}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-islamic-dark/60 dark:text-slate-400 space-y-1">
                    {book.page_count && (
                      <div>{book.page_count} {t.pages}</div>
                    )}
                    {book.file_size_mb && (
                      <div>{book.file_size_mb} {t.fileSize}</div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {book.downloads.toLocaleString()} {t.downloads}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="islamicPrimary"
                    className="w-full"
                    onClick={() => handleDownload(book)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t.downloadButton}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

