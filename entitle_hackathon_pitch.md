# ENTITLE: India's First Autonomous Civic Rights Agent

## The Problem
Every year, the Indian government allocates billions for welfare schemes, yet millions of eligible citizens never receive them due to:
1. **Information Asymmetry:** People don't know what they are eligible for.
2. **Friction:** Complex forms, language barriers, and documentation hurdles.
3. **Corruption:** Last-mile delivery fails because officials dispute eligibility or demand bribes.

## Our Solution: ENTITLE
**ENTITLE** is an AI agent that actively scans 1,200+ government schemes, tracks unclaimed assets, and automatically applies for them on behalf of the user. No middlemen. No fees.

---

## Key Features & Technical Architecture

### 1. Autonomous AI Agent (Core Engine)
*   **Feature:** A multilingual conversational AI that asks the user simple questions (age, income, occupation) and instantly finds every matching scheme across state and central governments.
*   **Tech Stack:** LLM (Gemini/Claude) + Vector Database for RAG (Retrieval-Augmented Generation).
*   **Why it wins:** Instead of just showing a list of links, the agent uses browser automation (Playwright/Puppeteer) to autonomously fill and submit government forms on the user's behalf.

### 2. Geospatial Intelligence (Satellite + AI Layer)
*   **Feature:** Active land monitoring for farmers. Instead of waiting for a farmer to report crop failure, the system watches from space.
*   **Tech Stack:** Sentinel-2 Satellite API + NDVI (Normalized Difference Vegetation Index) Analysis.
*   **Why it wins:** If the system detects a sharp drop in NDVI indicating drought in a registered farmer's area, a webhook automatically triggers the AI to apply for SDRF Drought Relief on their behalf. This makes the platform an **active** intelligence engine, not just a passive database.

### 3. Immutable Records (Polygon Blockchain Layer)
*   **Feature:** "Proof of Entitlement." When the AI determines a user is eligible for a scheme, it mints a cryptographic, tamper-proof certificate on the blockchain.
*   **Tech Stack:** Polygon PoS + Solidity Smart Contracts + ethers.js.
*   **Why it wins:** It eliminates last-mile corruption. If a local official denies a citizen their right, the citizen possesses a permanent, timestamped on-chain record proving their eligibility. 

### 4. Unclaimed Asset Discovery
*   **Feature:** Automatically tracing dormant bank accounts, unclaimed insurance, and forgotten provident funds.
*   **Tech Stack:** Secure PAN/Aadhaar hashing interfacing with the RBI UDGAM portal and EPFO registries.
*   **Why it wins:** There is currently over ₹78,000 Crore lying unclaimed in Indian banks. ENTITLE actively hunts down this "lost money" and guides users on how to reclaim it.

---

## The Demo Flow (Video Script Strategy)
1. **The Hook:** Start with the ₹78,000 Crore unclaimed money stat. Introduce ENTITLE.
2. **The AI Demo:** Show the user chatting with the AI in natural language, and the AI instantly matching them with PM Kisan or PM Awas Yojana.
3. **The "Wow" Factor (Satellite):** Transition to the satellite view. Explain how we don't wait for farmers to ask for help; we detect droughts from space and auto-apply for relief funds.
4. **The Trust Factor (Web3):** Show the Polygon Proof of Entitlement card. Explain how this permanently solves local corruption by putting eligibility on an immutable public ledger.
5. **The Vision:** "Your money. Your rights. Automatically claimed."
