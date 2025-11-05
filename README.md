# Traveler - Next.js Travel Website

A modern, component-based travel website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ⚡ Built with Next.js 14 (App Router)
- 🎨 Styled with Tailwind CSS
- 📱 Fully responsive design
- 🔒 TypeScript for type safety
- 🎯 Component-based architecture with separation of concerns
- 🖼️ Optimized images with Next.js Image component
- ♻️ Reusable UI components and utilities
- 📦 Well-organized folder structure

## Project Structure

```
traveler-nextjs/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components
│   │   ├── Button.tsx
│   │   └── NavigationLink.tsx
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── DestinationsGallery.tsx
│   ├── CallToAction.tsx
│   └── Footer.tsx
├── constants/          # Application constants
│   ├── navigation.ts
│   └── hero.ts
├── lib/
│   └── utils/          # Utility functions
│       └── cn.ts       # Class name utility
├── types/              # TypeScript type definitions
│   └── index.ts
└── public/
    └── assets/         # Static assets (images, logos)
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Code Quality

This project follows modern best practices:

- **Type Safety**: Full TypeScript coverage with strict mode
- **Component Reusability**: Shared UI components to reduce duplication
- **Separation of Concerns**: Logic, constants, and UI are properly separated
- **Consistent Styling**: Tailwind CSS with utility class merging
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Optimized images and code splitting

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap Icons** - Icon library
- **clsx & tailwind-merge** - Utility class management

## License

This project is licensed under the MIT License.
