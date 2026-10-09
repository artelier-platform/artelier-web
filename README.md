<a id="top"></a>

<p align="center">
  <img src="public/images/logo-horizontal.svg" alt="Artelier" width="60%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4"/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-Radix-black?logo=shadcnui&logoColor=white" alt="shadcn/ui"/>
  <img src="https://img.shields.io/badge/Zustand-State-orange" alt="Zustand"/>
  <img src="https://img.shields.io/badge/Vitest-Tests-6E9F18?logo=vitest&logoColor=white" alt="Vitest"/>
  <img src="https://img.shields.io/badge/version-0.1.0-blue" alt="version"/>
  <img src="https://img.shields.io/github/last-commit/artelier-platform/artelier-web" alt="last commit"/>
</p>

<p align="center">
  <b>Web storefront for Artelier Cajicá — an e-commerce platform for handmade ceramic and wood art.</b><br/>
  Built with Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · Zustand
</p>

---

## Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-stack-frontend)
- [Architecture Overview](#-architecture-overview)
- [Project Status](#-project-status)
- [Testing & Quality](#-testing--quality)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [CI/CD](#-cicd)
- [Deploy](#-deployment--infrastructure)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎨 About the Project

**Artelier Cajicá** is a real handmade art brand based in Cajicá, Colombia. The brand sells
one-of-a-kind ceramic and wood sculptures — each piece hand-painted, some made entirely from
scratch using clay.

Up until now, sales have been mostly word-of-mouth. The artist has an Instagram account
([@arteliercajica](https://www.instagram.com/arteliercajica)) with 109 posts but limited reach.
This repository is the **frontend** of the platform built to solve that: an online store that
showcases her work properly and gives her a real digital presence. It consumes the
[Artelier API](https://github.com/MimiRandomS/artelier-api).

**What this frontend covers:**

- Product catalog and product detail pages
- Authentication (login and registration) in a modal flow
- Shopping cart drawer
- Custom (made-to-order) request dialog
- Light/dark theme support
- Admin area shell (layout and sidebar) for managing the store

This is also a full-stack portfolio project, paired with the backend repository.

---

## 🚀 Stack Frontend

| Layer | Technology |
|-------|------------|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) |
| **Styling & UI** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix-black?logo=shadcnui&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56040) ![Sonner](https://img.shields.io/badge/Sonner-Toasts-black) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-5-orange) |
| **HTTP** | ![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white) |
| **Theming** | ![next-themes](https://img.shields.io/badge/next--themes-Dark_Mode-black) |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-Unit_Tests-6E9F18?logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-React-E33332?logo=testinglibrary&logoColor=white) |
| **Quality & CI** | ![SonarCloud](https://img.shields.io/badge/SonarCloud-Analysis-F3702A?logo=sonarcloud&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?logo=githubactions&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white) |
| **Package manager** | ![pnpm](https://img.shields.io/badge/pnpm-Package_Manager-F69220?logo=pnpm&logoColor=white) |

---

## 🏗 Architecture Overview

The app uses the **Next.js App Router**. The browser never talks to the backend directly:
requests go through **Route Handlers** under `src/app/api`, which act as a
**BFF (Backend for Frontend)** and delegate to server-side services in `src/server`
that call the Artelier API.

- **App Layer (`src/app`)** → Pages and layouts, organized in route groups: `(shop)`, `(auth)` and `(protected)` (`account` and `admin`)
- **BFF Layer (`src/app/api`)** → Route Handlers for auth, products, categories, orders, custom orders, payments, banners, reviews and admin
- **Server Layer (`src/server`)** → One service per backend domain, plus a shared HTTP client
- **Components (`src/components`)** → `admin`, `auth`, `cart`, `layout`, `shop` and the shadcn/ui primitives in `ui`
- **State (`src/store`)** → Zustand stores for auth, cart and UI
- **Hooks & Lib (`src/hooks`, `src/lib`)** → Shared hooks, HTTP/BFF helpers, formatting and utilities
- **Types (`src/types`)** → Shared TypeScript types

### Project Structure

```
src
├── app
│   ├── (auth)         # Login and register pages
│   ├── (protected)    # Authenticated areas: account and admin
│   ├── (shop)         # Public storefront: home, products, product detail
│   └── api            # BFF route handlers (auth, products, orders, payments, ...)
├── components
│   ├── admin
│   ├── auth
│   ├── cart
│   ├── layout
│   ├── shop
│   └── ui             # shadcn/ui primitives
├── hooks
├── lib
├── server             # Server-side services that call the Artelier API
│   ├── admin
│   ├── auth
│   ├── banners
│   ├── categories
│   ├── custom-orders
│   ├── orders
│   ├── payments
│   ├── products
│   ├── reviews
│   └── stats
├── store              # Zustand stores
└── types
```

---

## 🚧 Project Status

The frontend is **under active development**.

**Already in place:** product listing and detail pages, authentication modal (login and
registration), cart drawer, custom order dialog, theme provider, route layouts for the
account and admin areas, and the BFF route handlers listed above.

**Still in progress:** landing page, checkout and payment result, user account pages (orders),
the admin screens (dashboard, products, orders, custom orders, banners, users), about page,
SEO files and route protection.

---

## 🧪 Testing & Quality

### Testing Stack

<p align="center">
  <img src="https://img.shields.io/badge/Vitest-Test_Runner-6E9F18?logo=vitest&logoColor=white" alt="Vitest"/>
  <img src="https://img.shields.io/badge/Testing_Library-React-E33332?logo=testinglibrary&logoColor=white" alt="Testing Library"/>
  <img src="https://img.shields.io/badge/jsdom-DOM_Environment-black" alt="jsdom"/>
  <img src="https://img.shields.io/badge/V8-Code_Coverage-4285F4?logo=v8&logoColor=white" alt="V8 coverage"/>
</p>

### Code Quality Metrics

<p align="center">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=alert_status" alt="Quality Gate"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=coverage" alt="Coverage"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=bugs" alt="Bugs"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=vulnerabilities" alt="Vulnerabilities"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=code_smells" alt="Code Smells"/>
  <img src="https://sonarcloud.io/api/project_badges/measure?project=artelier-platform_artelier-web&metric=duplicated_lines_density" alt="Duplications"/>
</p>

Static analysis is performed with **SonarCloud** and coverage is generated with **Vitest** (V8 provider).
The test suite is just getting started and will grow alongside the features.

### Running Tests

```bash
# Run all tests once
pnpm test

# Watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage
```

The coverage report is written to the `coverage/` folder (`lcov.info` is the file SonarCloud consumes).

Other useful checks:

```bash
pnpm lint        # ESLint
pnpm typecheck   # TypeScript, no emit
```

---

## 🚀 Getting Started

### Prerequisites

![Node.js](https://img.shields.io/badge/Node.js-20.9+-5FA04E?logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-Package_Manager-F69220?logo=pnpm&logoColor=white)

Node.js 20.9 or later is required by Next.js 16.

### 1. Clone the repo

```bash
git clone https://github.com/artelier-platform/artelier-web.git
cd artelier-web
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your values — see Environment Variables section below
```

On Windows PowerShell: `Copy-Item .env.example .env.local`

### 4. Run the app

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Available scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create the production build (also type-checks) |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run the TypeScript compiler without emitting files |
| `pnpm test` | Run the tests once |
| `pnpm test:watch` | Run the tests in watch mode |
| `pnpm test:coverage` | Run the tests and generate coverage |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in the following:

```env
# Backend API (Render)
API_URL=https://your-backend.onrender.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Wompi (public key, safe for the frontend)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxx
```

> ⚠️ Never commit your real `.env.local`. All `.env*` files are in `.gitignore` except `.env.example`.

---

## 🔄 CI/CD

<p align="center">
  <img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white" alt="GitHub Actions"/>
  <img src="https://img.shields.io/badge/Analysis-SonarCloud-F3702A?logo=sonarcloud&logoColor=white" alt="SonarCloud"/>
  <img src="https://img.shields.io/badge/CD-Vercel-black?logo=vercel&logoColor=white" alt="Vercel"/>
</p>

The workflow lives in `.github/workflows/ci.yml` and runs on every push and pull request
to `main` and `develop`:

1. Install dependencies with pnpm (frozen lockfile)
2. Lint (`pnpm lint`)
3. Tests with coverage (`pnpm test:coverage`)
4. Production build (`pnpm build`, which also type-checks)
5. SonarCloud analysis using the generated coverage report

The SonarCloud step requires the `SONAR_TOKEN` repository secret. Configuration is in
`sonar-project.properties`.

**Branching:** work happens in feature branches created from `develop`, merged through pull
requests; `main` holds the production-ready code.

---

## ☁️ Deployment & Infrastructure

### Platforms

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white" alt="Vercel Frontend"/>
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=black" alt="Render Backend"/>
  <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary Media"/>
</p>

### Deployment Notes

- **Frontend:** Will be hosted on **Vercel** — not yet deployed
- **Backend:** The [Artelier API](https://github.com/MimiRandomS/artelier-api) is deployed on **Render** with automatic deploys from its `main` branch
- **Media Storage:** Images handled via **Cloudinary**

The environment variables listed above must also be configured in the Vercel project settings.

> **Note:** the backend runs on a Render free-tier instance, which spins down after inactivity.
> The first request after a cold start may take 30–60 seconds.

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 👨‍💻 Author

<p align="center">
  <img
    src="https://avatars.githubusercontent.com/MimiRandomDev"
    width="120"
    alt="MimiRandomDev GitHub avatar"
    style="border-radius:50%"
  />
</p>

<p align="center">
  <b>Geronimo Martinez Nuñez</b><br/>
  Systems Engineer · Full Stack Developer
</p>

I focus on building scalable systems and real-world applications that solve practical problems.

This project is the web face of Artelier Cajicá — a storefront designed to give a family art
business a proper digital presence, backed by its own API.

### 🔧 What I work with

- Java · Spring Boot, Python · FastAPI
- JavaScript · TypeScript · React · Next.js
- PostgreSQL · MongoDB · Redis
- Docker, Apache Kafka, AWS, Azure

### 🌐 Links

- GitHub: https://github.com/MimiRandomDev

---

<p align="center">
  Built with ❤️ for <a href="https://www.instagram.com/arteliercajica">Artelier Cajicá</a> — handmade art from Cajicá, Colombia.
</p>

[Back to top](#top)
