# Receivable - PWA Installation & Setup Guide

## PWA Features Included

✅ **Web App Manifest** - Complete PWA manifest with app metadata  
✅ **Service Worker** - Network caching and offline support  
✅ **Meta Tags** - iOS, Android, and Windows app support  
✅ **Install Prompts** - Users can install on home screen  
✅ **Standalone Mode** - Works like a native app  
✅ **Icons & Splash** - Custom icons for different devices  

## Files Added for PWA

### Required Files:

```
public/
├── manifest.json          # Web app manifest
├── service-worker.js      # Service worker with caching
├── browserconfig.xml      # Windows tile configuration
├── favicon.svg            # App icon (SVG)
└── icons/
    ├── icon-192.png       # Icon 192x192
    ├── icon-512.png       # Icon 512x512
    ├── icon-192-maskable.png  # Maskable icon
    └── icon-512-maskable.png  # Maskable icon
```

### Configuration Files:

- `index.html` - Updated with PWA meta tags and links
- `package.json` - Complete with all dependencies
- `tsconfig.json` - TypeScript config with WebWorker support
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Utilities:

- `src/utils/pwaUtils.ts` - Install prompt handling
- `src/utils/swUtils.ts` - Service worker update handling

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/jahidulhub/Receivable.git
cd Receivable
npm install
```

### 2. Generate App Icons (Optional)

To generate icons, use a tool like:
- https://www.favicon-generator.org/
- https://convertio.co/png-ico/

Place generated icons in `public/icons/` folder:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-192-maskable.png` (192x192)
- `icon-512-maskable.png` (512x512)

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### 5. Preview Production Build

```bash
npm run preview
```

## Testing PWA Features

### Test Service Worker Registration

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Verify service worker is registered and active

### Test Install Prompt

1. Open the app in Chrome/Edge/Firefox
2. Click the install button in the address bar (if available)
3. Or use the app menu → "Install app"

### Test Offline Mode

1. Open DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Refresh the page - app should still work

### Test on Mobile

1. Use Chrome DevTools device emulation
2. Or deploy and access on actual mobile device
3. Tap the install button to add to home screen

## Deployment Options

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

## PWA Capabilities

✨ **Installable**: Users can install on home screen  
✨ **Offline**: Works without internet connection  
✨ **App-like**: Standalone window, no browser UI  
✨ **Fast**: Cached assets load instantly  
✨ **Responsive**: Works on all screen sizes  
✨ **Secure**: HTTPS required (automatic on most platforms)  

## Browser Support

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (limited)
- ✅ Android Browser
- ✅ Samsung Internet

## Troubleshooting

### Service Worker Not Registering

- Check HTTPS is enabled (or localhost)
- Clear browser cache
- Check console for errors

### Install Prompt Not Showing

- App must meet PWA requirements
- Must be HTTPS (or localhost for dev)
- Must have manifest.json
- Must have service worker

### Icons Not Showing

- Verify icon files exist in `public/icons/`
- Check manifest.json icon paths
- Ensure correct image format (PNG)
- Verify image dimensions match manifest

## Next Steps

1. **Generate proper app icons** - Replace favicon.svg with your branding
2. **Deploy to production** - Use Vercel, Netlify, or GitHub Pages
3. **Test on devices** - Verify install and offline functionality
4. **Monitor analytics** - Track app installations and usage

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest](https://web.dev/add-a-web-app-manifest/)
- [Service Workers](https://web.dev/service-workers-cache-storage/)
- [Install Prompts](https://web.dev/install-prompt/)

---

**Your Receivable PWA is ready to install!** 🚀
