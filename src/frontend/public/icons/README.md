# PWA Icons

This directory contains the PWA (Progressive Web App) icons for ExpertTech Studio.

## Required Icons

The following icon files need to be created for proper PWA functionality:

### Required Files:
- `icon-72x72.png` - Small icon for various uses
- `icon-96x96.png` - Medium icon
- `icon-128x128.png` - Large icon
- `icon-144x144.png` - Microsoft tile icon
- `icon-152x152.png` - iOS touch icon
- `icon-192x192.png` - Standard PWA icon (required)
- `icon-384x384.png` - Large PWA icon
- `icon-512x512.png` - Maximum size PWA icon (required)
- `apple-touch-icon.png` - iOS specific icon
- `favicon.ico` - Browser favicon

### Badge Icons:
- `badge-72x72.png` - Notification badge icon

### Action Icons (for notifications):
- `action-explore.png` - Explore action icon
- `action-close.png` - Close action icon

## Design Guidelines

### Brand Colors:
- Primary: #2563eb (Blue)
- Secondary: #1e40af (Dark Blue)
- Background: White or transparent

### Design Requirements:
- **Target Audience**: 40-50년대 전문가
- **Clear and Professional**: Simple, recognizable design
- **High Contrast**: Easy to see on various backgrounds
- **Scalable**: Should look good at all sizes

### Icon Content:
The icon should represent ExpertTech Studio's mission:
- Technology/AI elements
- Professional expertise
- Business consulting
- Clean, modern design

## Usage

These icons are referenced in:
- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service Worker for notifications
- Various HTML meta tags for different platforms

## Creation Tools

Recommended tools for creating these icons:
- **Figma** - For vector design
- **Adobe Illustrator** - Professional vector graphics
- **Canva** - Quick template-based design
- **PWA Builder** - Automated icon generation
- **RealFaviconGenerator** - Comprehensive favicon/icon generator

## Notes

Currently, placeholder references exist in the code. Replace with actual designed icons before production deployment.

The icons should maintain consistency with the overall brand identity and be optimized for the middle-aged professional demographic.