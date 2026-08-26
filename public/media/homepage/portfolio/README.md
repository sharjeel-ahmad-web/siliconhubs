# Portfolio Gallery Images

## Purpose
Project showcase images for the homepage portfolio gallery section.

## Image Requirements
- **Dimensions:** 1470x980px (3:2 ratio) - This maintains consistency in the masonry grid
- **Format:** JPG or WebP (WebP strongly recommended for smaller file size)
- **Max Size:** 500KB per image
- **Quality:** High resolution, crisp details
- **Content:** Screenshots, mockups, or project photos

## Naming Convention
Use descriptive, SEO-friendly names:
- `project-name-website.jpg`
- `company-name-redesign.jpg`
- `app-name-mobile.jpg`

Examples:
- `acme-corp-website.jpg`
- `shopify-store-redesign.jpg`
- `chatbot-dashboard.jpg`

## How to Add Portfolio Items

1. **Prepare your image:**
   - Resize to 1470x980px
   - Optimize to < 500KB
   - Convert to WebP if possible

2. **Upload to this folder**

3. **Update the portfolio component:**
   - Open `components/sections/PortfolioGallery.tsx`
   - Find the `galleryData` array (around line 9-85)
   - Add your new project:
   ```tsx
   {
     id: 10,  // Use next available ID
     src: '/media/homepage/portfolio/your-project.jpg',
     alt: 'Descriptive alt text for accessibility',
     title: 'Your Project Name',
     span: 'col-span-1',  // or 'sm:col-span-2' for wider display
   }
   ```

4. **Commit and push changes**

## Grid Layout
- `col-span-1`: Normal size (takes 1 column)
- `sm:col-span-2`: Wide (takes 2 columns on desktop)

Alternate between sizes for visual interest!

## Image Content Tips
✅ **Do:**
- Show complete, polished projects
- Use high-quality screenshots
- Include mockups on devices (laptop, mobile)
- Showcase variety of work
- Maintain consistent quality

❌ **Don't:**
- Use low-resolution images
- Include projects with client confidentiality issues
- Show incomplete or buggy interfaces
- Use generic stock photos

## Optimization Tools
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **ImageOptim:** (Mac app)
- **WebP Converter:** https://cloudconvert.com/webp-converter
