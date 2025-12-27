-- Digital Library Schema
-- Add this to your existing Supabase/PostgreSQL database

-- Digital Books Table
CREATE TABLE IF NOT EXISTS digital_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    author VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('quran', 'hadith', 'fiqh', 'aqeedah', 'seerah', 'tafsir', 'arabic', 'dua', 'general')),
    language VARCHAR(10) NOT NULL CHECK (language IN ('ar', 'en', 'fr', 'wo')),
    format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'epub', 'mobi', 'audio')),
    file_url VARCHAR(1000) NOT NULL,
    cover_image_url VARCHAR(1000),
    page_count INTEGER,
    file_size_mb DECIMAL(10, 2),
    isbn VARCHAR(20),
    publisher VARCHAR(200),
    publication_year INTEGER,
    downloads INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Downloads Tracking Table
CREATE TABLE IF NOT EXISTS book_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES digital_books(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Reviews/Ratings Table (Optional for future enhancement)
CREATE TABLE IF NOT EXISTS book_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES digital_books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_digital_books_category ON digital_books(category);
CREATE INDEX IF NOT EXISTS idx_digital_books_language ON digital_books(language);
CREATE INDEX IF NOT EXISTS idx_digital_books_format ON digital_books(format);
CREATE INDEX IF NOT EXISTS idx_digital_books_featured ON digital_books(featured);
CREATE INDEX IF NOT EXISTS idx_digital_books_created_at ON digital_books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_downloads_book_id ON book_downloads(book_id);
CREATE INDEX IF NOT EXISTS idx_book_downloads_user_id ON book_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_user_id ON book_reviews(user_id);

-- Full-text search index for books
CREATE INDEX IF NOT EXISTS idx_digital_books_search ON digital_books 
    USING gin(to_tsvector('english', title || ' ' || author || ' ' || COALESCE(description, '')));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_digital_books_updated_at ON digital_books;
CREATE TRIGGER update_digital_books_updated_at
    BEFORE UPDATE ON digital_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_book_reviews_updated_at ON book_reviews;
CREATE TRIGGER update_book_reviews_updated_at
    BEFORE UPDATE ON book_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE digital_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read all books
CREATE POLICY "Public can view books" ON digital_books
    FOR SELECT USING (true);

-- Only admins can insert/update/delete books
CREATE POLICY "Admins can manage books" ON digital_books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Users can track their own downloads
CREATE POLICY "Users can view their downloads" ON book_downloads
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can track downloads" ON book_downloads
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can manage their own reviews
CREATE POLICY "Users can view all reviews" ON book_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their reviews" ON book_reviews
    FOR ALL USING (user_id = auth.uid());

-- Insert some sample data (optional)
INSERT INTO digital_books (title, author, description, category, language, format, file_url, cover_image_url, page_count, file_size_mb, publisher, publication_year, downloads, featured) VALUES
('Understanding the Quran: A Thematic Commentary', 'Dr. Muhammad Asad', 'A comprehensive thematic commentary on the Quran, providing deep insights into the divine message with modern context and classical scholarship.', 'tafsir', 'en', 'pdf', '/books/understanding-quran.pdf', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', 450, 12.5, 'Islamic Foundation', 2020, 1250, true),
('Sahih Al-Bukhari - Complete Collection', 'Imam Bukhari', 'The most authentic collection of Hadith compiled by Imam Bukhari. This edition includes Arabic text with English translation and commentary.', 'hadith', 'en', 'pdf', '/books/sahih-bukhari.pdf', 'https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=400', 850, 25.8, 'Dar-us-Salam', 2019, 3450, true)
ON CONFLICT DO NOTHING;

-- Views for analytics (optional)
CREATE OR REPLACE VIEW book_statistics AS
SELECT 
    b.id,
    b.title,
    b.category,
    b.language,
    b.downloads,
    COUNT(DISTINCT bd.user_id) as unique_downloaders,
    COALESCE(AVG(br.rating), 0) as average_rating,
    COUNT(br.id) as review_count
FROM digital_books b
LEFT JOIN book_downloads bd ON b.id = bd.book_id
LEFT JOIN book_reviews br ON b.id = br.book_id
GROUP BY b.id, b.title, b.category, b.language, b.downloads;

COMMENT ON TABLE digital_books IS 'Stores digital Islamic books available in the library';
COMMENT ON TABLE book_downloads IS 'Tracks user downloads of digital books';
COMMENT ON TABLE book_reviews IS 'Stores user reviews and ratings for books';
COMMENT ON VIEW book_statistics IS 'Aggregated statistics for each book including downloads, ratings, and reviews';

