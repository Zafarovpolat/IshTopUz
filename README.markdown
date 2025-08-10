# IshTop.Uz - Freelance Marketplace for Uzbekistan

## Overview
IshTop.Uz is the first localized freelance marketplace in Uzbekistan, designed to connect freelancers (web developers, designers, copywriters, SMM specialists, etc.) with clients (individuals and small businesses). The platform addresses local market challenges, such as high commissions, payment security, and lack of localization, by offering:

- **5% commission** (vs. 10–20% on Upwork/Fiverr).
- **Escrow system** for secure transactions.
- **Integration with local payment systems** (HUMO, Payme, Uzcard).
- **Telegram integration** for order notifications and communication.
- **Multilingual interface** (Uzbek, Russian, English).

The project is in the MVP development stage, aiming to validate demand and launch a beta version for 100–200 users.

## Features
### Must-Have (MVP)
- User registration and profile creation (freelancers and clients).
- Order posting and browsing with category filters.
- Escrow-based payment system integrated with HUMO/Payme.
- Telegram bot for notifications and order imports.
- Rating and review system for trust-building.

### Planned Features
- AI-powered order matching (using Grok API).
- Premium subscriptions for freelancers (priority visibility).
- Real-time chat via WebSocket.
- Mobile app for iOS and Android.

## Tech Stack
- **Frontend**: Next.js (TypeScript) + Tailwind CSS for a responsive UI.
- **Backend**: Node.js (Express/Fastify) for API and transaction handling.
- **Database**: PostgreSQL (user profiles, orders, transactions) + Redis (sessions, cache).
- **Payments**: Integration with HUMO, Payme, Uzcard APIs.
- **Realtime**: WebSocket for chat and notifications.
- **Hosting**: PS Cloud or Render for deployment.
- **Tools**: ESLint, Prettier, Firebase Firestore (for lead collection).

## Project Goals
1. **Idea Validation (1–2 months)**: Conduct surveys (100+ freelancers, 50+ clients) via Telegram (e.g., Myfreelance.uz) and create a landing page to collect leads.
2. **MVP Development (3–6 months)**: Build core features (registration, escrow, Telegram bot) and launch a beta for 100–200 users.
3. **Beta Testing (6–9 months)**: Onboard early users, gather feedback, and fix bugs.
4. **Scaling (12–24 months)**: Add AI features, expand to international markets (e.g., Kazakhstan, Kyrgyzstan), and integrate new payment systems.

## Getting Started
### Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+)
- Redis (v7+)
- Firebase account (for Firestore)
- API keys for HUMO/Payme (contact providers for sandbox access)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ishtopuz/ishtop.git
   cd ishtop
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ishtop
   REDIS_URL=redis://localhost:6379
   FIREBASE_CONFIG={your_firebase_config}
   PAYMENT_API_KEY={humo_or_payme_key}
   TELEGRAM_BOT_TOKEN={your_bot_token}
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Local Development
- Frontend: Run `npm run dev` to start the Next.js app at `http://localhost:3000`.
- Backend: Ensure PostgreSQL and Redis are running, then start the server with `npm run start:server`.
- Telegram Bot: Configure the bot using the Telegram Bot API and test notifications locally.

## Contributing
We welcome contributions! To get started:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and use ESLint/Prettier for code consistency.

## Roadmap
- **Q4 2025**: Launch landing page and collect 100+ survey responses.
- **Q1 2026**: Release MVP with core features and onboard 100 beta testers.
- **Q2 2026**: Integrate AI order matching and expand payment options.
- **Q3 2026**: Pitch to investors (IT-Park Uzbekistan, local accelerators) for scaling.

## Contact
- **Email**: info@ishtop.uz
- **Telegram**: @IshTopUz
- **Website**: [Insert Landing Page URL]
- **Issues**: Report bugs or suggest features in the [Issues](https://github.com/ishtopuz/ishtop/issues) section.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.