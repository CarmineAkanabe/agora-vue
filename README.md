# Agora: Secure Campus Marketplace

## Executive Summary

Agora is a specialized, peer-to-peer marketplace engineered exclusively for university communities. It mitigates the inherent risks of public classifieds by enforcing strict identity verification protocols and utilizing a robust, localized escrow payment system. The platform guarantees that every participant is a verified student, and all financial exchanges are protected until physical goods are exchanged and verified on campus.

## Core Value Proposition & Security Tenets

1. **Mandatory Identity Verification**: Access to the platform's transactional features is restricted to users who have successfully passed manual administrative verification, which involves auditing a valid university student ID and a registered `.edu` (or equivalent) email address.
2. **K-PAY Integrated Escrow**: To eliminate fraudulent transactions, all payments are routed through an escrow mechanism. Funds are deducted from the buyer's mobile money account and held securely by the platform.
3. **Cryptographic Meetup Verification**: Escrowed funds are only released to the seller upon the entry of a unique, single-use "Pickup Code" provided by the buyer at the physical point of exchange.
4. **Governed Dispute Resolution**: In the event of a disagreement, the escrow system freezes the transaction state. Platform administrators are equipped with a dedicated interface to review transaction history, communicate with parties, and issue binding financial resolutions.

## Technology Stack

The application is built leveraging a modern, performant, and reactive frontend ecosystem:

- **Framework**: [Vue.js 3](https://vuejs.org/) utilizing the Composition API for scalable logic encapsulation.
- **Build Tool**: [Vite](https://vitejs.dev/) for instantaneous Hot Module Replacement (HMR) and optimized production bundling.
- **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) operating as a utility-first design system.
- **State Management**: [Pinia](https://pinia.vuejs.org/), providing type-safe, modular, and reactive global state stores.
- **Routing**: [Vue Router](https://router.vuejs.org/) with robust navigation guards protecting authenticated and verified-only routes.
- **HTTP Client**: [Axios](https://axios-http.com/) configured with global interceptors for seamless JWT authentication handling.
- **Form Validation**: [Vee-Validate](https://vee-validate.logaretm.com/) coupled with [Yup](https://github.com/jquense/yup) schemas for rigorous client-side input sanitization.
- **Data Visualization**: [ApexCharts](https://apexcharts.com/) powering the administrative and student analytical dashboards.

---

## Local Development Setup

The following instructions outline the procedure to bootstrap the application in a local development environment.

### 1. Prerequisites
Ensure the host machine meets the following requirements:
- **Node.js**: Version `22.18.0` or `>=24.12.0` (as strictly defined in the engine configuration).
- **Package Manager**: `npm` (bundled with Node.js).
- **Backend API**: The Agora Laravel backend must be running and accessible.

### 2. Repository Initialization
Clone the repository and transition into the working directory:
```bash
git clone <repository_url>
cd agora-vue
```

### 3. Dependency Installation
Execute a clean installation of the required node modules:
```bash
npm install
```

### 4. Environment Configuration
The application requires specific environment variables to interface with the backend services. 
Create a `.env` file in the root directory by duplicating the provided example:
```bash
cp .env.example .env
```
Ensure the `.env` file contains the correct routing for the backend API. By default, it expects:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```
*(Modify this URI if your local backend is operating on a different port or network interface).*

### 5. Launching the Development Server
Initiate the Vite development server:
```bash
npm run dev
```
The console will output the local network address (typically `http://localhost:5173/`).

---

## Available NPM Scripts

The `package.json` defines several utility scripts to maintain code quality and build the project:

- `npm run dev`: Boots the Vite development server with HMR.
- `npm run build`: Compiles the application into static, optimized assets placed in the `/dist` directory.
- `npm run preview`: Hosts the compiled `/dist` directory locally to verify the production build prior to deployment.
- `npm run lint`: Executes the full linting pipeline across the codebase.
- `npm run lint:oxlint`: Runs the high-performance Oxlint tool to catch severe syntax and logical errors.
- `npm run lint:eslint`: Runs ESLint to enforce code style and architectural rules.
- `npm run format`: Triggers Prettier to automatically format all files within the `/src` directory to standard configurations.

---

## Testing Framework Implementation (Pending)

*Note: The test suite infrastructure is currently slated for implementation in the next milestone.*
Future iterations will incorporate localized unit testing for Pinia state logic and component rendering, alongside end-to-end (E2E) testing for critical user journeys such as the escrow transaction flow and administrative dispute resolution.
