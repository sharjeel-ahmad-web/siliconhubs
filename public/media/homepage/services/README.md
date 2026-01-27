# Services Section Images

## Purpose
Images for service cards in the homepage services showcase section.

## Image Requirements
- **Dimensions:** 800x600px (4:3 ratio)
- **Format:** JPG, PNG, or WebP (WebP preferred)
- **Max Size:** 300KB per image
- **Style:** Professional, high-quality, relevant to service
- **Color:** Should complement brand colors (#37AFE1, #F58122)

## Naming Convention
Use descriptive names matching the service:
- `chatbot-development.jpg`
- `n8n-automations.jpg`
- `web-design.jpg`
- `seo-services.jpg`
- `shopify-development.jpg`

## How to Add Images

1. **Optimize your image** (compress to < 300KB)
2. **Upload to this folder**
3. **Update component file:**
   - Open `components/sections/ServicesShowcase.tsx`
   - Find the services array (around line 78-145)
   - Update the `image` property for the service:
   ```tsx
   {
     title: "Chatbot Development",
     image: "/media/homepage/services/chatbot-development.jpg",
     // ... other properties
   }
   ```
4. **Commit and push changes**

## Tips
- Use images that represent the service visually
- Maintain consistent style across all service images
- Consider using illustrations or icons if photos aren't available
- Test images on both light and dark backgrounds
- Ensure images are accessible (add alt text in component)

## Example Images
Good service images show:
- Technology in action
- Abstract representations of the service
- Clean, modern design
- Professional appearance
