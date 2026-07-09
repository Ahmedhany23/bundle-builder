# Bundle Builder

A modern, accessible, and highly responsive E-commerce Bundle Builder application. Built with React, TypeScript, and Vite.

## 🚀 Getting Started

Follow these instructions to get the project up and running from a clean clone.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` (comes with Node.js)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd bundle-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

- **Start the Development Server**:
  ```bash
  npm run dev
  ```
  *The app will be available at `http://localhost:5173`.*

- **Run the Test Suite**:
  ```bash
  npm test
  # or run tests without watch mode
  npm run test:run
  ```

- **Run the Linter**:
  ```bash
  npm run lint
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```
  *This command runs a TypeScript type-check and then outputs the optimized build to the `dist` folder.*

---

## 🏗 Decisions & Tradeoffs

During the development of this project, several architectural and technical decisions were made to balance performance, maintainability, and development speed:

1. **State Management**: 
   - **Decision**: We opted to use React's built-in `Context API` paired with custom hooks (e.g., `useBundle`, `useSelectedVariant`) instead of pulling in an external library like Redux or Zustand.
   - **Tradeoff**: This keeps our bundle size smaller and reduces third-party dependencies. However, it required careful memoization (`useMemo`, `useCallback`) to prevent unnecessary re-renders and handle complex state synchronization (like variant selection and cart restoration).

2. **Styling Approach**:
   - **Decision**: We utilized standard/vanilla CSS modules over utility-first frameworks like Tailwind CSS.
   - **Tradeoff**: This provided us with maximum flexibility to implement highly specific, dynamic design requirements (e.g., specific accessibility focuses, glassmorphism, or custom transitions). The tradeoff is that we had to manage CSS technical debt manually, ensuring dead rules were cleaned up and complex responsive breakpoints were strictly maintained.

3. **Testing**:
   - **Decision**: Used `Vitest` and `@testing-library/react`. 
   - **Tradeoff**: Vitest integrates perfectly and extremely fast with our Vite setup compared to Jest.

## 📋 What's Next / Unfinished Features

While the core functionality for building bundles, enforcing required products, and maintaining accessible UI states is solid, a few areas remain open for future enhancement:

1. **Backend Integration**: The application currently manages cart/bundle state entirely on the client. The next major step is integrating this with a real backend API (e.g., Shopify Storefront API, GraphQL, or a custom backend) to fetch live product data and submit completed bundles to checkout.
2. **End-to-End (E2E) Testing**: While we have robust unit and integration tests (covering reducers, calculations, and hooks), implementing an E2E testing framework like Playwright or Cypress would be beneficial to test the entire user journey against a real browser environment.
3. **Frontend Monitoring**: Integrating an error-tracking solution (such as Sentry) would be highly recommended before pushing to a live production environment to capture edge-case UI errors.
