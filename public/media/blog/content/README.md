# Blog Post Content Images

## Purpose
Inline images used within blog post content to illustrate points, show examples, or break up text.

## Image Requirements
- **Dimensions:** Variable (depends on use case)
  - Full width: 1200px width
  - Standard: 800px width
  - Small/inline: 400-600px width
- **Format:** JPG, PNG, or WebP
- **Max Size:** 
  - Full width: 500KB
  - Standard: 300KB
  - Small: 150KB
- **Quality:** Clear and readable

## Naming Convention
Descriptive names related to content:
- `chatbot-architecture-diagram.png`
- `seo-dashboard-screenshot.jpg`
- `code-example-nextjs.png`
- `workflow-automation-example.jpg`

## Usage Types

### 1. Screenshots
- **Use for:** Demonstrating software, dashboards, code
- **Format:** PNG (for UI with text)
- **Dimensions:** Actual size or 2x resolution
- **Notes:** Annotate with arrows/highlights if needed

### 2. Diagrams & Infographics
- **Use for:** Explaining processes, architectures, flows
- **Format:** PNG or SVG (vector preferred)
- **Dimensions:** 800-1200px width
- **Notes:** Ensure text is readable

### 3. Photos
- **Use for:** Real-world examples, people, products
- **Format:** JPG or WebP
- **Dimensions:** 800-1200px width
- **Notes:** Professional quality only

### 4. Code Snippets (Images)
- **Use for:** When syntax highlighting in post isn't enough
- **Format:** PNG
- **Dimensions:** Actual width needed
- **Notes:** Consider using code blocks instead

## How to Add Content Images

### Via Markdown (in blog post):
```markdown
![Alt text description](/media/blog/content/image-name.jpg)
```

### Via Rich Text Editor:
1. Click image icon in editor
2. Upload or select image
3. Add alt text
4. Adjust size/alignment

## Image Placement Guidelines

### Best Practices:
✅ Place images near relevant text
✅ Add captions when helpful
✅ Use alt text for accessibility
✅ Maintain consistent style
✅ Break up long text sections
✅ Center or left-align (never right-align for LTR languages)

### Avoid:
❌ Too many images (overwhelming)
❌ Irrelevant decorative images
❌ Poor quality/pixelated images
❌ Images without alt text
❌ Huge file sizes (slow loading)

## Accessibility Requirements

### Alt Text:
- Describe what the image shows
- Be specific and concise
- Mention important text in image
- For decorative images, use empty alt: `alt=""`

Example:
```markdown
![Screenshot of Google Analytics dashboard showing 10,000 monthly visitors](/media/blog/content/analytics-dashboard.jpg)
```

## File Organization

### Folder Structure Options:

**Option 1: By Post**
```
/content/
  /post-slug-name/
    image-1.jpg
    image-2.jpg
```

**Option 2: By Type**
```
/content/
  /screenshots/
  /diagrams/
  /photos/
```

**Option 3: Flat (Current)**
```
/content/
  descriptive-image-name.jpg
```

## Optimization Tips

### Before Upload:
1. Resize to appropriate dimensions
2. Compress file size
3. Convert to WebP if possible
4. Add alt text in post
5. Test on mobile devices

### Tools:
- **Compression:** TinyPNG, Squoosh
- **Annotation:** Snagit, Skitch
- **Diagrams:** Figma, Excalidraw
- **Screenshots:** Built-in tools, CleanShot X

## Copyright Considerations

### ⚠️ Always Check:
- Do you have rights to use the image?
- Is proper attribution needed?
- Is it under Creative Commons?
- Did you create it yourself?

### Safe Sources:
- Your own screenshots
- Custom diagrams/illustrations
- Licensed stock photos
- Creative Commons (with attribution)
- Public domain images

## Performance Tips

1. **Lazy load** images below the fold
2. **Use responsive images** with srcset
3. **Serve WebP** with JPG fallback
4. **Compress aggressively** for web
5. **Use CDN** for faster delivery
6. **Test with slow connections**
