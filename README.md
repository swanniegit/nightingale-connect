# 🏥 Nightingale Connect

A healthcare-focused chat application built with Next.js, Supabase, and IndexedDB for offline-first functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nightingale-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧱 Architecture

This project follows the **LEGO BUILDER** methodology for atomic, composable components:

- **UI Utilities**: Pure, stateless components (15-line limit)
- **Client Orchestrators**: Stateful components that compose UI utilities
- **Server Components**: Data fetching and non-interactive UI
- **Data Hooks**: Custom hooks for all client-side logic
- **Core Libs**: Shared utilities and types

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # UI Utilities (Button, Card, Spinner)
│   ├── client/            # Client Orchestrators
│   └── server/            # Server Components
├── hooks/                 # Data & State Hooks
├── lib/                   # Core utilities
└── types/                 # TypeScript definitions
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Quality

This project enforces:
- **15-line limit** per component (excluding imports/types)
- **TypeScript** for type safety
- **ESLint** for code quality
- **Atomic design** principles
- **Single responsibility** per component

## 🚀 Deployment

This project is optimized for Vercel deployment. See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📚 Documentation

- [Development Specification](DEVELOPMENT_SPEC.md)
- [Task Breakdown](TASK_BREAKDOWN.md)
- [Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

Follow the LEGO BUILDER principles:
1. Keep components under 15 lines
2. Define TypeScript interfaces first
3. Use atomic, composable design
4. Write self-documenting code
5. Test all components

## 📄 License

MIT License - see LICENSE file for details
