# Debug Guide for Flavour and Image Issues

## 1. Test Flavour Field

1. **Check Database Column:**
   ```sql
   DESCRIBE orders;
   ```
   Look for `flavour` column in the output.

2. **If missing, add it:**
   ```sql
   ALTER TABLE orders ADD COLUMN flavour VARCHAR(255);
   ```

3. **Restart Backend:**
   - Stop the Spring Boot application
   - Start it again
   - This should trigger Hibernate to update the schema

## 2. Test Image Enlargement

1. **Open Browser Developer Tools** (F12)
2. **Go to Console tab**
3. **Click on an image** in the order details
4. **Check for errors** in the console

## 3. Expected Behavior

- **Flavour field** should appear in both order cards and order details dialog
- **Image enlargement** should open a modal when clicking on images
- **No JavaScript errors** should appear in the console

## 4. If Issues Persist

1. **Clear browser cache** and refresh
2. **Check if backend is running** on port 8080
3. **Verify database connection** is working
4. **Check if images are loading** properly (no 404 errors) 