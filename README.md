# Enajori — Assam in Dallas

A community website for the Assamese diaspora in Dallas, USA. Built with Next.js 16, Firebase, and deployed on Vercel.

**Live:** [https://enajoridallas.org](https://enajoridallas.org)

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (React 19) | App Router, SSR, API routes |
| TypeScript | Type-safe codebase |
| Tailwind CSS v4 | Styling with custom Assamese cultural themes |
| Firebase Auth | Email/password authentication with admin claims |
| Cloud Firestore | NoSQL database for all content |
| Firebase Storage | Image and video uploads |
| PayPal | Donation processing via redirect |
| Resend | Transactional email for contact form |
| Vercel | Hosting with auto-deploy from GitHub |

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Auth, Firestore, and Storage enabled
- A `.env.local` file (see `.env.example`)

### Setup

```bash
git clone https://github.com/dfwassamese-star/Enajori.git
cd Enajori
npm install
cp .env.example .env.local
# Fill in .env.local with your Firebase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Commands

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Production build
npm run lint      # Run ESLint
npm run start     # Serve production build locally
```

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (events, gallery, community, etc.)
│   ├── admin/             # Admin dashboard (protected)
│   └── api/               # API routes (contact, stripe, og, revalidate)
├── components/
│   ├── ui/                # Reusable UI components
│   ├── admin/             # Admin-specific components
│   ├── home/              # Homepage sections and animations
│   ├── layout/            # Header, Footer, Sidebar
│   └── shared/            # Cross-cutting components
├── lib/
│   ├── firebase/          # Firebase client, admin, and collection refs
│   ├── services/          # Firestore CRUD per domain
│   ├── utils/             # Helpers (cn, dates, slugify, firestore, validation)
│   └── constants/         # SEO config, categories
├── providers/             # Auth and Toast context providers
└── types/                 # TypeScript type definitions
```

## Deployment

The repository is connected to Vercel. Pushing to `main` triggers a production deployment automatically.

### Branch Protection

The `main` branch is protected:
- All changes require a pull request
- PRs require 1 approval before merging
- Force pushes are blocked

### Workflow

1. Create a feature branch: `git checkout -b feature/my-change`
2. Make changes, commit, and push
3. Open a pull request — Vercel creates a preview deployment
4. Get approval, merge to `main` — Vercel deploys to production

## Admin Portal

Access at `/admin` with a Firebase Auth user that has the `admin: true` custom claim. Manage events, performances, members, gallery, news, banners, donations, and site settings.

## Documentation

See [ADMIN_MANUAL.md](ADMIN_MANUAL.md) for the full setup and administration guide.

## Environment Variables

See [.env.example](.env.example) for all required and optional variables. Key groups:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client SDK config
- `FIREBASE_ADMIN_*` — Firebase Admin SDK credentials (server-side only)
- `NEXT_PUBLIC_BASE_URL` — Production URL
- `REVALIDATION_SECRET` — ISR revalidation auth
- `RESEND_API_KEY` — Contact form emails (optional)
- `STRIPE_*` — Stripe integration (optional)
