# Debugr — Intelligence Marketplace & Creator Hub

![Debugr Logo](public/logo.png)

**Debugr** is a high-end, cinematic platform designed for the next generation of digital creators. It empowers AI engineers, prompt designers, and technical agents to monetize their expertise through a robust marketplace, professional verification systems, and real-time creator analytics.

## 🚀 Key Features

### 🏢 Professional Creator Hub
A centralized command center for verified creators to manage their digital identity and financials.
- **Analytics Matrix**: Real-time tracking of net revenue, follower growth, and profile reach.
- **Bank Terminal**: Secure synchronization of financial details for automated payouts.
- **Identity Tiers**: Tier-based verification (Unconfigured ➔ Pending ➔ Verified).

### 🛒 Intelligence Marketplace
A high-performance marketplace for premium AI prompts and technical intellectual property.
- **Gated Access**: Prompt listing is restricted to **Verified Professionals** to ensure quality.
- **Secure Transactions**: Revenue distribution handled via Cashfree synchronization.
- **Preview Engine**: Sneak peaks for buyers with full prompt isolation until purchase.

### 🎭 Authority Profiles
Customizable professional identities designed for maximum platform authority.
- **Neural Expertise**: Highlight specialized skills and technical mastery.
- **Social Integration**: Native links for X, Instagram, and GitHub.
- **Live Stats**: Interactive follower/following counters and reach metrics.

### 🎨 Cinematic UI/UX (Neon Noir)
- **Fluid Navigation**: Seamless sidebar with spring-physics toggles.
- **Spectral Themes**: Switch between Dark, Light, and Glass modes with smooth View Transitions.
- **Glassmorphism**: High-fidelity translucent interfaces for a premium developer aesthetic.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Framer Motion](https://www.framer.com/motion/)
- **Styling**: Vanilla CSS with Tailwind-inspired design tokens
- **Database**: [Prisma](https://www.prisma.io/) + [Neon PostgreSQL](https://neon.tech/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payment Gateway**: [Cashfree](https://www.cashfree.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/saurabhsingh-94/debugr.git
cd debugr
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Synchronization
Create a `.env` file in the root directory and populate it with your credentials:
```env
DATABASE_URL="your_neon_db_url"
AUTH_SECRET="your_nextauth_secret"
GITHUB_ID="your_github_id"
GITHUB_SECRET="your_github_secret"
CASHFREE_APP_ID="your_cashfree_id"
CASHFREE_SECRET_KEY="your_cashfree_secret"
```

### 4. Database Migration
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Launch the Intelligence Hub
```bash
npm run dev
```

---

## 🔒 License

Proprietary Copyright © 2026 Saurabh Kumar Singh. All Rights Reserved.
Refer to the [LICENSE](LICENSE) file for usage restrictions.
