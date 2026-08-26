# Blog Post Hero Images

## Purpose
Large hero images displayed at the top of individual blog post pages.

## Image Requirements
- **Dimensions:** 1920x1080px (16:9 ratio)
- **Format:** JPG or WebP
- **Max Size:** 600KB
- **Quality:** High resolution for full-width display
- **Style:** Impactful, professional, relevant to post

## Naming Convention
Match the blog post slug:
- `how-to-build-chatbots-hero.jpg`
- `seo-best-practices-2026-hero.jpg`
- `nextjs-performance-tips-hero.jpg`

## Usage
Hero images appear:
- At the top of individual blog posts
- Full-width across the page
- Below the post title
- Above the post content

## How to Add Hero Images

1. **Upload to this folder** with proper naming
2. **Reference in blog post:**
   - Admin dashboard: Use "Hero Image" field
   - Or manually set in post metadata:
   ```json
   {
     "heroImage": "/media/blog/heroes/your-post-hero.jpg"
   }
   ```

## Image Guidelines

### ✅ Good Hero Images:
- High resolution (1920x1080px minimum)
- Landscape orientation
- Relevant to article topic
- Visually striking
- Professional quality
- Good composition
- Works well at full width

### ❌ Avoid:
- Portrait orientation
- Low resolution
- Busy, distracting backgrounds
- Irrelevant imagery
- Poor quality photos
- Overly bright or dark
- Small file that gets stretched

## Responsive Considerations
Images will be displayed at:
- **Desktop:** Full width (up to 1920px)
- **Tablet:** Scaled down proportionally
- **Mobile:** Further scaled, possibly cropped

**Important:** Keep key content in the center of the image!

## Optional: Image Overlay
Consider adding a dark overlay (20-40% opacity) if:
- Placing text on the image
- Image is too bright
- Need to ensure text readability

## SEO Optimization
- Use descriptive file names
- Add ALT text in the blog post editor
- Compress images for faster loading
- Consider lazy loading for below-fold images

## Content Ideas by Topic

### Technology Posts:
- Code on screen
- Development setup
- Tech abstract backgrounds
- UI/UX mockups

### Business Posts:
- Office environments
- Professional meetings
- Data visualizations
- Business concepts

### Tutorial Posts:
- Relevant tools/software
- Step-by-step visuals
- Before/after comparisons
- Process diagrams

## Optimization Tips
1. **Use WebP format** for smaller file size
2. **Compress with tools:**
   - TinyPNG
   - Squoosh
   - ImageOptim
3. **Test loading speed** with slow connections
4. **Consider using CDN** for faster delivery
