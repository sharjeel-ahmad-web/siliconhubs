# Testimonials Section Images

## Purpose
Client photos for testimonial cards in the premium testimonials section.

## Image Requirements
- **Dimensions:** 400x400px (square/1:1 ratio)
- **Format:** JPG or WebP
- **Max Size:** 150KB per photo
- **Content:** Professional headshots of clients
- **Privacy:** Must have written permission from client to use photo

## Naming Convention
Use client name or company:
- `client-john-smith.jpg`
- `acme-corp-ceo.jpg`
- `client-sarah-jones.jpg`

## Photo Guidelines

### Professional Headshots
- High-quality professional photo
- Clear face visibility
- Neutral or professional background
- Good lighting
- Natural expression
- Appropriate business attire

### Privacy & Permissions
⚠️ **IMPORTANT:**
- Always get written consent before using client photos
- Have clients sign photo release forms
- Respect client privacy preferences
- Remove photos if client requests

## How to Add Testimonials

1. **Get permission from client** ✅

2. **Prepare photo:**
   - Crop to square (400x400px)
   - Optimize to < 150KB
   - Save with descriptive name

3. **Upload to this folder**

4. **Update testimonials:**
   - Testimonials are **CMS-managed**
   - Go to `/admin/pages/home` in admin dashboard
   - Edit testimonials section
   - Or update database directly

5. **Database structure:**
   ```json
   {
     "name": "John Smith",
     "position": "CEO",
     "company": "Acme Corp",
     "quote": "Rising Dot transformed our business...",
     "image": "/media/homepage/testimonials/client-john-smith.jpg",
     "rating": 5
   }
   ```

## Alternative Approaches

### If client doesn't want photo:
- Use company logo instead
- Use initials in a colored circle
- Use abstract avatar
- Use professional illustration

### Stock Photos
- Use sparingly and only for mockups
- Never misrepresent as real clients
- Replace with real photos ASAP

## Testimonial Best Practices
- Real clients only (no fake testimonials)
- Specific, detailed feedback
- Include company/position for credibility
- Mix of different industries
- Recent testimonials (within 1-2 years)
- Video testimonials are even better!
