## ✨ Project Overview

![BookNook Platform Screenshot](https://raw.githubusercontent.com/mehedi-hasandev/assignment-8/main/public/screencapture-booknook-frontend-wheat-vercel-app-2026-11-07-02_23_31.png)

# BookNook 📖

BookNook is an all-in-one digital library and reading circulation platform created for book enthusiasts to discover diverse genres, borrow books in real time, monitor stock quantities, and curate their own reading portfolios with end-to-end security.

## 🌐 Live Application
- **Live Deployment:** [https://booknook-frontend-wheat.vercel.app/](https://booknook-frontend-wheat.vercel.app/)
- **Backend API Base:** `https://booknook-backend-peach.vercel.app/`

---

## 🛠️ Tech Stack & Architecture

- **Next.js 15 (App Router) & React:** Provides responsive client-side interactions paired with fast server-side rendering and secure route protection.
- **Tailwind CSS:** Powers an elegant, typography-focused reading interface with deep indigo and honey-gold themes optimized across all device viewports.
- **BetterAuth & Jose (JWT):** Implements modern credential and social authentication with EdDSA asymmetric keypair verification (`/api/auth/jwks`) for tamper-proof API communication.
- **Node.js & Express.js:** Manages transactional REST endpoints for inventory updates, user borrowing states, and metadata cataloging.
- **MongoDB:** Delivers high-performance document storage handling book collections, user profiles, and active borrowing logs.
- **Lucide Icons & Dynamic Feedback UI:** Delivers clean visual indicators, responsive loan status counters, and instant notification triggers.

---

## 🌟 5 Highlight Features

1. **Genre-Specific Dynamic Discovery**  
   Browse and filter an expanding library across specialized categories like Programming, Web Development, Poetry, and System Architecture—complete with synopsis previews, star ratings, and real-time inventory counts.

2. **Automated Stock-Aware Borrowing Engine**  
   Enables registered readers to borrow books with instant stock decrements while preventing duplicate checkouts of identical titles by the same member.

3. **Reader Command Center ("My Books" & "My Borrows")**  
   Private dashboard panels allowing readers to keep track of their ongoing loans, initiate hassle-free returns to restock the library, and manage personally contributed volumes.

4. **Robust Multi-Provider Security & Account Linking**  
   Offers seamless onboarding via Google OAuth 2.0 or verified email credentials, featuring cross-provider account linking and persistent session management.

5. **Crowdsourced Catalog Expansion**  
   Allows authenticated contributors to enrich the platform by cataloging new publications with personalized cover art links, page counts, publisher details, and volume quantities.

---

## 💻 Local Development & Installation

Follow these steps to set up and run BookNook locally:

### 1. Clone the Repository
```bash
git clone https://github.com/mehedi-hasandev/assignment-8.git
cd assignment-8
```

### 2. Install Project Dependencies
Ensure you have Node.js (v18+ recommended) installed, then run:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file inside the root directory and define the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_super_secret_auth_key_min_32_chars
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Access the Platform
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser to view BookNook running locally.
