
# SportsSync - Phase 1 MVP

SportsSync is a production-ready MVP that lets a user connect their Instagram Business/Creator account (linked to a Facebook Page) and read basic profile and media information.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Meta for Developers Setup](#1-meta-for-developers-setup)
  - [2. Project Setup](#2-project-setup)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Running the Application](#4-running-the-application)
- [Testing](#testing)
- [Security Notes](#security-notes)
- [Project Structure](#project-structure)

## Features

- **User Authentication**: Secure user sign-up and login with email/password and Google.
- **Instagram Connection**: Secure OAuth 2.0 flow to connect an Instagram Business/Creator account.
- **Dashboard**: View Instagram profile summary and a grid of recent media.
- **Secure Token Storage**: All external auth tokens are encrypted at rest using AES-256-GCM.
- **Privacy Ready**: Stub pages for Privacy Policy and Data Deletion instructions.
- **Containerized**: Fully containerized with Docker for consistent development and production environments.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js)
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod (for environment variables)
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18+) and pnpm
- Docker and Docker Compose
- A Meta (Facebook) Developer Account

### 1. Meta for Developers Setup

To connect to Instagram, you need a Meta App.

1.  **Create a Meta App**: Go to [Meta for Developers](https://developers.facebook.com/) and create a new app. Choose "Business" as the app type.
2.  **Add Products**:
    - In your App's dashboard, add the "Facebook Login" product.
    - Add the "Instagram Graph API" product.
3.  **Configure Facebook Login**:
    - Go to "Facebook Login" > "Settings".
    - Under "Valid OAuth Redirect URIs", add your callback URL: `http://localhost:3000/api/instagram/callback`. For production, you will add your production URL.
4.  **Get App Credentials**:
    - Go to "App Settings" > "Basic".
    - Your `App ID` is your `META_APP_ID`.
    - Your `App Secret` is your `META_APP_SECRET`. **Treat this like a password.**
5.  **Set Permissions**:
    - In the App Review section, you don't need to submit for review for development access for yourself.
    - The scopes requested by this app are `instagram_basic` and `pages_show_list`.

### 2. Project Setup

Clone the repository and install dependencies:

```bash
git clone <repository_url>
cd sportssync
pnpm install
```

### 3. Environment Variables

Create a `.env` file by copying the example file:

```bash
cp .env.example .env
```

Now, fill in the values in your new `.env` file:

- `DATABASE_URL`: The default value is configured for Docker Compose.
- `NEXTAUTH_URL`: Should be `http://localhost:3000` for local development.
- `NEXTAUTH_SECRET`: A strong, random secret. Generate one with: `openssl rand -base64 32`.
- `META_APP_ID`: From your Meta App dashboard.
- `META_APP_SECRET`: From your Meta App dashboard.
- `TOKEN_ENC_KEY`: A 32-byte (256-bit) key, base64 encoded. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

### 4. Running the Application

1.  **Start Services**:
    Use Docker Compose to start the web server and PostgreSQL database.

    ```bash
    docker-compose up --build
    ```

2.  **Run Database Migrations**:
    In a separate terminal, apply the Prisma schema to the database.

    ```bash
    pnpm prisma migrate dev
    ```

3.  **Seed the Database (Optional)**:
    To create a demo user (`test@example.com` / `password123`), run the seed script:

    ```bash
    pnpm prisma db seed
    ```

4.  **Access the App**:
    Open your browser and navigate to `http://localhost:3000`.

## Testing

- **Unit Tests**: Run with Vitest.
  ```bash
  pnpm test
  ```

- **End-to-End Tests**: Run with Playwright. Ensure your application is running first.
  ```bash
  pnpm e2e
  ```

## Security Notes

- **Token Encryption**: The `TOKEN_ENC_KEY` is critical. It must be a 32-byte key, base64 encoded. If this key is lost, all stored tokens will be unrecoverable. If it is compromised, all tokens can be decrypted. Manage it securely.
- **Secrets Management**: Never commit your `.env` file or other secrets to version control.
- **NextAuth**: The app uses NextAuth's built-in security features like CSRF protection and secure, HTTP-only cookies.

## Project Structure

A brief overview of the key files and directories:

```
.
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth-related pages (login, signup)
│   ├── (main)/           # Main protected app routes (dashboard, settings)
│   ├── api/              # API Route Handlers
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Landing Page
├── components/           # Reusable React components
├── lib/                  # Core logic, helpers, and utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── crypto.ts         # AES encryption utility
│   ├── env.ts            # Zod environment variable validation
│   ├── instagram.ts      # Instagram Graph API client
│   └── prisma.ts         # Prisma client singleton
├── prisma/               # Prisma schema, migrations, and seed script
├── public/               # Static assets
├── tests/                # Unit and E2E tests
├── docker-compose.yml    # Docker services definition
├── Dockerfile            # Docker configuration for the Next.js app
└── package.json          # Project dependencies and scripts
```
