# 🎓 Language School Design System

> Professional, accessible, and modern UI framework specifically designed for language schools and educational platforms.

## 🎯 Overview

This design system provides a complete CSS/JS framework tailored for language schools, featuring:

- **Multi-generational appeal** - Works for kids, teens, and adults
- **WCAG 2.2 compliant** - Full accessibility support
- **Mobile-first responsive** - Optimized for all devices
- **Performance focused** - Fast loading and smooth interactions
- **Multilingual ready** - Typography and layout for multiple languages

## 🎨 Design Philosophy

### Core Principles
- **Trust & Professionalism** - Building credibility through clean, modern design
- **Engagement & Warmth** - Welcoming interface that encourages learning
- **Clarity & Focus** - Clear information hierarchy for educational content
- **Inclusivity** - Accessible design for all learners

## 🚀 Quick Start

### Installation

#### Option 1: CDN (Recommended)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Progreskurwo/language-school-design-system@main/dist/language-school.min.css">

<!-- JS (Optional) -->
<script src="https://cdn.jsdelivr.net/gh/Progreskurwo/language-school-design-system@main/dist/language-school.min.js"></script>
```

#### Option 2: Download
```bash
git clone https://github.com/Progreskurwo/language-school-design-system.git
cd language-school-design-system
npm install
npm run build
```

## 🎨 Color System

### Primary Palette
- **Primary Blue**: `#2563eb` - Trust, professionalism
- **Secondary Blue**: `#60a5fa` - Calm, readability
- **Primary Green**: `#059669` - Growth, progress
- **Accent Orange**: `#f97316` - Energy, warmth

### Age-Specific Themes
```html
<!-- For younger students (3-7 years) -->
<body class="theme-kids">

<!-- For teens and adults (13+) -->
<body class="theme-mature">
```

## 📝 Typography

### Font Stack
- **Primary**: Inter (body text, UI elements)
- **Headings**: Poppins (display, headings)
- **Accent**: Nunito Sans (special emphasis)

### Scale (Mobile-first)
```css
--text-xs: 0.75rem;    /* 12px */
--text-base: 1rem;     /* 16px - minimum for accessibility */
--text-xl: 1.25rem;    /* 20px */
--text-3xl: 1.875rem;  /* 30px */
```

## 🧩 Components

### Buttons
```html
<!-- Primary CTA -->
<button class="btn btn-primary">Enroll Now</button>

<!-- Secondary Action -->
<button class="btn btn-secondary">Learn More</button>

<!-- Accent (High priority) -->
<button class="btn btn-accent">Start Free Trial</button>
```

### Course Cards
```html
<div class="course-card">
  <div class="course-card__header">
    <h3 class="course-card__title">English for Beginners</h3>
    <span class="course-card__level">A1 Level</span>
  </div>
  <div class="course-card__content">
    <p class="course-card__description">Perfect for complete beginners...</p>
    <div class="course-card__meta">
      <span class="course-card__duration">12 weeks</span>
      <span class="course-card__format">Online</span>
    </div>
  </div>
  <div class="course-card__footer">
    <button class="btn btn-primary btn-full">View Course</button>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 768px`
- **Desktop**: `768px - 1024px`
- **Large**: `> 1024px`

## ♿ Accessibility Features

- **WCAG 2.2 AA Compliant** color contrasts
- **Minimum touch targets**: 44px (iOS/WCAG standard)
- **Keyboard navigation** support
- **Screen reader** optimized markup
- **Focus indicators** for all interactive elements
- **Reduced motion** support

## 🛠️ Development

### Build Process
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

## 📄 License

MIT License - feel free to use in your educational projects!

---

**Made with ❤️ for language educators worldwide**