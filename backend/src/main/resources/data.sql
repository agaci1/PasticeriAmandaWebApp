-- Add your own products here
-- Example format:
-- INSERT INTO products (name, category, description, price, price_type, image_url) VALUES
-- ('Your Cake Name', 'cakes', 'Your description', 25.00, 'per_person', '/your-image.jpg');

-- Add your own admin user here
-- Example format:
-- INSERT INTO users (email, name, password, role) VALUES
-- ('your-email@example.com', 'Your Name', '$2a$10$encoded-password', 'ADMIN');

-- Temporary user for testing (password: password)
INSERT INTO users (email, name, password, role) VALUES
('keogaci@gmail.com', 'Alkeo Gaci', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');

-- Add your own feed items here
-- Example format:
-- INSERT INTO feed_items (title, description, type, url, created_at) VALUES
-- ('Your Title', 'Your description', 'announcement', '/your-image.jpg', CURRENT_TIMESTAMP); 