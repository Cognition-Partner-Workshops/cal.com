<p align="center">
  <a href="https://github.com/calcom/cal.com">
    <img src="https://user-images.githubusercontent.com/8019099/210054112-5955e812-a76e-4160-9ddd-58f2c72f1cce.png" alt="Cal.com Logo">
  </a>
</p>

<h1 align="center">Cal.com</h1>

<p align="center">
  Open-source scheduling infrastructure for individuals, teams, and organizations to manage calendars and bookings.
</p>

<p align="center">
  <a href="https://cal.com"><strong>Website</strong></a> ·
  <a href="https://cal.com/docs"><strong>Documentation</strong></a> ·
  <a href="https://github.com/calcom/cal.com/issues">Issues</a> ·
  <a href="https://cal.com/roadmap">Roadmap</a> ·
  <a href="https://github.com/calcom/cal.com/discussions">Discussions</a>
</p>

<p align="center">
  <a href="https://github.com/calcom/cal.com/stargazers"><img src="https://img.shields.io/github/stars/calcom/cal.com" alt="GitHub Stars"></a>
  <a href="https://github.com/calcom/cal.com/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
  <a href="https://github.com/calcom/cal.com/pulse"><img src="https://img.shields.io/github/commit-activity/m/calcom/cal.com" alt="Commits per month"></a>
  <a href="https://hub.docker.com/r/calcom/cal.com"><img src="https://img.shields.io/docker/pulls/calcom/cal.com" alt="Docker Pulls"></a>
  <a href="https://status.cal.com"><img height="20px" src="https://betteruptime.com/status-badges/v1/monitor/a9kf.svg" alt="Uptime"></a>
</p>

## Table of Contents

- [About](#about)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Integrations](#integrations)
- [Contributing](#contributing)
- [License](#license)

## About

Cal.com is the open-source Calendly alternative that gives you full control over your scheduling data, workflow, and appearance. Whether self-hosted or using our managed service, Cal.com provides white-label scheduling that's API-driven and ready to deploy on your own domain.

<img width="100%" alt="Cal.com booking screen" src="https://github.com/calcom/cal.com/assets/8019099/407e727e-ff19-4ca4-bcae-049dca05cf02">

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

## Quick Start

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 13.x
- Yarn >= 4.12.0

### Option 1: Docker (Recommended for Evaluation)

```bash
# Clone the repository
git clone https://github.com/calcom/cal.com.git
cd cal.com

# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) to access Cal.com.

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/calcom/cal.com.git
cd cal.com

# Install dependencies
yarn

# Copy environment file and configure
cp .env.example .env
# Generate secrets for NEXTAUTH_SECRET and CALENDSO_ENCRYPTION_KEY:
# openssl rand -base64 32

# Quick start with Docker-based database
yarn dx

# Or manual setup with your own database
yarn workspace @calcom/prisma db-migrate
yarn dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
cal.com/
├── apps/
│   ├── web/                 # Main Next.js application
│   └── api/
│       ├── v1/              # Legacy API
│       └── v2/              # Modern NestJS API
├── packages/
│   ├── prisma/              # Database schema and migrations
│   ├── trpc/                # tRPC API layer
│   ├── ui/                  # Shared UI components
│   ├── features/            # Business logic
│   ├── lib/                 # Shared utilities
│   ├── embeds/              # Embed system (iframe, React)
│   └── app-store/           # Third-party integrations
└── docs/                    # Documentation
```

## Development

### Running the Development Server

```bash
yarn dev
```

### Running Tests

```bash
# Unit tests
TZ=UTC yarn test

# E2E tests
yarn test-e2e
```

### Building for Production

```bash
yarn build
yarn start
```

### Database Operations

```bash
# Run migrations (development)
yarn workspace @calcom/prisma db-migrate

# Run migrations (production)
yarn workspace @calcom/prisma db-deploy

# Open Prisma Studio
yarn db-studio

# Seed the database
yarn db-seed
```

### Upgrading

```bash
git pull
yarn
yarn workspace @calcom/prisma db-migrate  # or db-deploy for production
yarn dev
```

## Deployment

Cal.com can be deployed using various platforms:

| Platform | Description |
|----------|-------------|
| [Docker](https://hub.docker.com/r/calcom/cal.com) | Official Docker image with docker-compose support |
| [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcalcom%2Fcal.com) | One-click deploy (Pro plan required) |
| [Railway](https://railway.app/new/template/cal) | One-click deploy with managed database |
| [Northflank](https://northflank.com/stacks/deploy-calcom) | Container-based deployment |
| [Render](https://render.com/deploy?repo=https://github.com/calcom/docker) | Cloud application platform |
| [Elestio](https://elest.io/open-source/cal.com) | Managed open-source hosting |

For Docker deployments, ARM users should use the `{version}-arm` suffix (e.g., `calcom/cal.com:v5.6.19-arm`).

### Environment Variables

Key environment variables to configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for session encryption (generate with `openssl rand -base64 32`) |
| `CALENDSO_ENCRYPTION_KEY` | Key for data encryption (generate with `openssl rand -base64 32`) |
| `NEXT_PUBLIC_WEBAPP_URL` | Base URL of your Cal.com instance |

See [.env.example](.env.example) for the complete list of configuration options.

## Integrations

Cal.com supports numerous calendar and video conferencing integrations:

### Calendars
- Google Calendar
- Microsoft Outlook
- Apple Calendar
- Zoho Calendar

### Video Conferencing
- Zoom
- Google Meet
- Microsoft Teams
- Daily.co

### CRM
- HubSpot
- Salesforce
- Zoho CRM
- Pipedrive

### Workflows
- SendGrid (email reminders)
- Twilio (SMS reminders)

For detailed setup instructions for each integration, see the [integration documentation](https://cal.com/docs/introduction/quick-start/self-hosting/integrations) or the respective README files in `packages/app-store/`.

## Contributing

We welcome contributions from the community. Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

### Good First Issues

Looking to contribute? Check out our [help wanted](https://github.com/calcom/cal.com/issues?q=is:issue+is:open+label:%22%F0%9F%99%8B%F0%9F%8F%BB%E2%80%8D%E2%99%82%EF%B8%8Fhelp+wanted%22) issues for beginner-friendly tasks.

### Bounties

<a href="https://console.algora.io/org/cal/bounties?status=open">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://console.algora.io/api/og/cal/bounties.png?p=0&status=open&theme=dark">
    <img alt="Open Bounties" src="https://console.algora.io/api/og/cal/bounties.png?p=0&status=open&theme=light">
  </picture>
</a>

### Translations

Help translate Cal.com into your language. Join our [Translations discussion](https://github.com/calcom/cal.com/discussions/categories/translations) to get started.

## License

Cal.com is an open-core project. The core platform (99%) is licensed under [AGPLv3](LICENSE), while enterprise features in the `/ee` directory require a [commercial license](https://cal.com/sales).

| Feature | AGPLv3 | Enterprise |
|---------|--------|------------|
| Self-host for commercial purposes | Yes | Yes |
| Fork publicly | Yes | Yes |
| Official Support | No | Yes |
| SSO / SAML | No | Yes |
| Organizations | No | Yes |
| Teams | No | Yes |
| Managed Event Types | No | Yes |

For enterprise licensing inquiries, [contact our sales team](https://cal.com/sales).

## Acknowledgements

Special thanks to these projects that help power Cal.com:

- [Vercel](https://vercel.com/)
- [Next.js](https://nextjs.org/)
- [Day.js](https://day.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)

---

<p align="center">
  <sub>Originally written and maintained by contributors and <a href="https://devin.ai">Devin</a>, with updates from the core team.</sub>
</p>
