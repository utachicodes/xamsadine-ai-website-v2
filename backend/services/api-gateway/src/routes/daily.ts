import type { Request, Response } from "express";

// Very small, curated set of ayat/duas/facts you can later expand or replace
// with calls to Qur'an / hadith APIs that you trust.

const ayat = [
  {
    reference: "An-Nur 24:35",
    arabic: "ٱللَّهُ نُورُ ٱلسَّمَٰوَاتِ وَٱلْأَرْضِ",
    translation:
      "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp...",
  },
  {
    reference: "Al-Baqarah 2:286",
    arabic:
      "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation:
      "Allah does not burden a soul beyond what it can bear.",
  },
  {
    reference: "Al-Inshirah 94:5",
    arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: "So, surely with hardship comes ease.",
  },
];

const duas = [
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
    translation:
      "Our Lord, do not let our hearts deviate after You have guided us.",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي ٱلْآخِرَةِ حَسَنَةً",
    translation:
      "Our Lord, grant us good in this world and good in the Hereafter.",
  },
];

const facts = [
  "The five daily prayers were made obligatory during the Night Journey (al-Isrāʾ wal-Miʿrāj).",
  "Many scholars from all four madhabs emphasized the importance of local custom (ʿurf) as long as it does not contradict clear texts.",
  "Seeking knowledge of dīn is a communal obligation (farḍ kifāyah) in every community.",
];

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

async function fetchHijriDate(now: Date): Promise<string> {
  try {
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    // AlAdhan API – Gregorian to Hijri conversion
    const url = `http://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Hijri date");

    const data = (await res.json()) as any;
    const hijri = data?.data?.hijri;
    if (!hijri) throw new Error("Invalid Hijri payload");

    const hijriDate = `${hijri.day} ${hijri.month?.en} ${hijri.year}`;
    return hijriDate;
  } catch (err) {
    console.error("Hijri date fallback used:", err);
    return "Hijri date unavailable (check AlAdhan API)";
  }
}

export async function getDaily(_req: Request, res: Response) {
  const dayIndex = getDayIndex();

  const ayah = ayat[dayIndex % ayat.length];
  const dua = duas[dayIndex % duas.length];
  const fact = facts[dayIndex % facts.length];

  const now = new Date();
  const hijriDate = await fetchHijriDate(now);

  return res.json({
    gregorianDate: now.toISOString().slice(0, 10),
    hijriDate,
    ayah,
    dua,
    fact,
  });
}


