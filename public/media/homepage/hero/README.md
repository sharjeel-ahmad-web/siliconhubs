# Hero Section Images

## Purpose
This folder contains images for the homepage hero section background.

## Current Status
**No images needed** - The hero section uses an animated gradient background with particles and 3D sphere animation.

## If You Want to Add a Background Image/Video

### Image Requirements
- **Dimensions:** 1920x1080px minimum (16:9 ratio)
- **Format:** JPG or WebP
- **Max Size:** 500KB (optimize for web)
- **Orientation:** Landscape
- **Quality:** High resolution for retina displays

### Video Requirements
- **Dimensions:** 1920x1080px (1080p)
- **Format:** MP4 (H.264 codec)
- **Max Size:** 5MB (heavily optimized)
- **Duration:** 10-30 seconds (looping)
- **Frame Rate:** 30fps
- **Audio:** None (muted)

### Naming Convention
- `hero-background.jpg` or `hero-background.webp`
- `hero-background.mp4` for video

### How to Use
1. Add your image/video to this folder
2. Open `components/sections/CleanHero.tsx`
3. Add background image/video code (see component file for examples)
4. Commit and deploy changes

### Notes
- Consider using a dark overlay (opacity: 0.3-0.5) to maintain text readability
- Ensure background doesn't distract from main content
- Test on mobile devices for responsive behavior
- Optimize images before uploading (use tools like TinyPNG, ImageOptim)
