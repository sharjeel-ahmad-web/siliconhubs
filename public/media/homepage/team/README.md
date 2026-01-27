# Team Member Photos

## Purpose
Professional headshots for team member profiles in the team section.

## Image Requirements
- **Dimensions:** 600x600px (square/1:1 ratio)
- **Format:** JPG or WebP
- **Max Size:** 200KB per photo
- **Background:** Solid color or professional background (avoid distracting backgrounds)
- **Style:** Consistent across all team members (same lighting, framing, style)

## Naming Convention
Use firstname-lastname format:
- `john-doe.jpg`
- `jane-smith.jpg`
- `alex-johnson.jpg`

## Photo Guidelines

### Professional Standards
✅ **Do:**
- Professional attire (business or business casual)
- Good lighting (soft, even lighting)
- Neutral or simple background
- Genuine smile (if appropriate)
- Direct eye contact with camera
- Shoulders and head visible (headshot style)
- High resolution (sharp, clear)

❌ **Don't:**
- Selfies or casual photos
- Busy backgrounds
- Poor lighting (too dark or overexposed)
- Filters or heavy editing
- Sunglasses or hats
- Group photos
- Low-quality images

### Technical Specs
- **Resolution:** Minimum 600x600px
- **Aspect Ratio:** 1:1 (square)
- **File Size:** Under 200KB
- **Format:** JPG (sRGB color space)

## How to Add Team Members

1. **Prepare photo:**
   - Crop to square (1:1)
   - Resize to 600x600px
   - Optimize file size
   - Save with descriptive name

2. **Upload to `/public/team/` folder** (not this folder - team images go in `/public/team/`)

3. **Update team component:**
   - Open `components/sections/HolographicTeam.tsx`
   - Add new team member to the array (around line 60-180)
   ```tsx
   {
     name: "John Doe",
     position: "Senior Developer",
     bio: "Brief bio here...",
     image: "/team/john-doe.jpg",
     social: {
       linkedin: "https://linkedin.com/in/johndoe",
       twitter: "https://twitter.com/johndoe",
       github: "https://github.com/johndoe"
     }
   }
   ```

4. **Commit and deploy**

## Photography Services
Consider hiring a professional photographer for:
- Consistent style across team
- High-quality results
- Proper lighting and equipment
- Multiple outfit options
- Company branding integration

## Placeholder Images
For temporary use:
- Use professional stock photos
- Or use services like UI Faces, This Person Does Not Exist
- Always replace with real photos for production
