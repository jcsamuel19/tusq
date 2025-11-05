# Setup Instructions

## Asset Setup

You need to copy the assets from the original traveler template to this Next.js project:

1. Copy the logo:
   ```bash
   cp "traveler (1)/assets/logo/logo.png" public/assets/logo/
   ```

2. Copy all images:
   ```bash
   cp -r "traveler (1)/assets/images" public/assets/
   ```

3. Copy app store badges (if they exist):
   ```bash
   cp -r "traveler (1)/assets/images/brand-logos" public/assets/images/ 2>/dev/null || echo "Brand logos folder may not exist"
   ```

## After Copying Assets

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The site will be available at http://localhost:3000

## Note

Make sure the following directories exist in `public/assets/`:
- `public/assets/logo/logo.png`
- `public/assets/images/home/` (with all image files)
- `public/assets/images/brand-logos/` (for app store badges)
