-- Create users table (Supabase Auth handles most of this, but we can add custom fields)
-- Note: Supabase's default `auth.users` table is used for core auth.
-- This `profiles` table is for additional user data.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and update their own profile
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy for admin to view all profiles
CREATE POLICY "Admins can view all profiles." ON public.profiles
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  price_per_person NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy for all authenticated users to view products
CREATE POLICY "All authenticated users can view products." ON public.products
  FOR SELECT TO authenticated USING (TRUE);

-- Policy for admin to manage products
CREATE POLICY "Admins can manage products." ON public.products
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products ON DELETE RESTRICT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  number_of_persons INTEGER NOT NULL,
  custom_note TEXT,
  uploaded_image_url TEXT,
  provisional_price NUMERIC(10, 2) NOT NULL,
  final_price NUMERIC(10, 2), -- Nullable, set by admin
  status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and update their own orders
CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders." ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending'); -- Only allow updates if status is pending

-- Policy for admin to view and update all orders
CREATE POLICY "Admins can manage all orders." ON public.orders
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Function to update `updated_at` timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for `orders` table
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial dummy products (optional, for testing)
INSERT INTO public.products (category, name, description, image_url, base_price, price_per_person) VALUES
('normal-cakes', 'Red Velvet Delight', 'Classic red velvet with cream cheese frosting.', '/placeholder.svg?height=300&width=300', 50.00, 5.00),
('normal-cakes', 'Golden Raspberry Dream', 'Vanilla sponge with fresh raspberries and gold leaf.', '/placeholder.svg?height=300&width=300', 60.00, 6.00),
('normal-cakes', 'Chocolate Decadence', 'Rich chocolate cake with ganache and berries.', '/placeholder.svg?height=300&width=300', 55.00, 5.50),
('wedding-cakes', 'Elegant Rose Tier', 'Multi-tiered cake adorned with sugar roses.', '/placeholder.svg?height=300&width=300', 300.00, 10.00),
('wedding-cakes', 'Crystal Cascade', 'White chocolate and lavender, with edible crystals.', '/placeholder.svg?height=300&width=300', 350.00, 12.00),
('sweets', 'Macaron Tower', 'Assorted French macarons in a beautiful tower.', '/placeholder.svg?height=300&width=300', 30.00, 2.00),
('sweets', 'Mini Eclairs Set', 'Delicate eclairs with various fillings.', '/placeholder.svg?height=300&width=300', 25.00, 1.50),
('special-orders', 'Custom Themed Cake', 'Design your dream cake for any occasion.', '/placeholder.svg?height=300&width=300', 100.00, 8.00),
('special-orders', 'Sculpted Edible Art', 'Intricate 3D edible sculptures.', '/placeholder.svg?height=300&width=300', 150.00, 10.00);
