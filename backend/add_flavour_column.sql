-- Add flavour column to orders table
ALTER TABLE orders ADD COLUMN flavour VARCHAR(255);

-- Verify the column was added
DESCRIBE orders; 