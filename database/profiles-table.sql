-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user' -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Create an index on the role column for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Create an index on the email column for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Allow admin to view all profiles (for admin dashboard)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin to update any profile (for admin dashboard)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert the admin user if they don't exist
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  'admin'
FROM auth.users
WHERE email = 'abdoullahaljersi@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.users.id
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
