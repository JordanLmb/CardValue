# 🗺️ The "Montreal Hired" Portfolio Roadmap

**Goal**: Build a cohesive "TCG Ecosystem" ensuring mastery of Full Stack, AI, DevOps, and Real-Time Systems.
**Narrative**: "I am building the infrastructure for the next generation of TCG commerce."
**Design Signature**: "The Void Aesthetic" (Deep Purple #4c1d95, Dark Glass, Holographic, Framer Motion 3D).

---

## Phase 1: The Visualizer (Frontend Mastery)
**Project Name**: `CardValue`
**Startup Mapping**: **The Scanner App**
**Tech**: Next.js, Magic MCP (Thrifty), Postgres, Recharts/Tremor.
**Challenge**: "Make data beautiful."
**Core Features**:
- CSV Upload (later Camera Scan).
- Dashboard: Value Line Chart, Rarity Donut.
- UI: "Holo-Table" with tilt effects.
**Command**:
> `/feature-ship "Build 'CardValue'. 1) Research TCG grading scales (NM/LP). 2) Backend: Parse CSV to this model. 3) Frontend: Void Aesthetic Dashboard (Purple/Glass). Use Framer Motion for 3D hover effects. Components: Collection Line Chart, Rarity Donut, and Card List. Use supabase for database."`

/feature-ship "Project: CardValue - TCG Collection Visualizer
1.  PLAN & CONTRACT: Research TCG card grading scales (NM/LP). Define the core data contract in `contracts/card.ts` (fields: name, set, condition, estimatedValue).
2.  BACKEND: Create a POST `/api/upload` endpoint to parse a CSV matching the contract. Use `zod` for validation. Store data in Supabase via Postgres MCP.
3.  FRONTEND (VOID AESTHETIC): Build a dashboard with:
    - A 'Holo-Table' (glassmorphic table) listing cards with Framer Motion tilt effects on hover.
    - A 'Collection Value' line chart (Recharts/Tremor) showing trend.
    - A 'Rarity Distribution' donut chart.
    Use the 21st.dev Magic MCP for all component generation. Apply the 'Void Aesthetic' (Deep Purple, Glassmorphism).
4.  VERIFICATION: The QA agent must create a test for the CSV upload and data display."
---

## Phase 2: The Judge (AI Engineering)
**Project Name**: `Recall`
**Startup Mapping**: **The Automated Lister (eBay)**
**Tech**: OpenAI/Anthropic API, Supabase (pgvector), RAG.
**Challenge**: "Make AI accurate."
**Core Features**:
- Upload PDF Rulebooks/Set Lists.
- Chat: "Can I play Pot of Greed in Phase 2?" -> Cites exact rule paragraph.
**Key Selling Point**: Deep understanding of RAG and Vector Embeddings (not just broad AI).

---

## Phase 3: The Gatekeeper (DevOps & Scale)
**Project Name**: `QueueMaster`
**Startup Mapping**: **The Marketplace Drops**
**Tech**: Node.js, Redis, Docker, k6 (Load Testing).
**Challenge**: "Handle the flood."
**Core Features**:
- Simulates a "High Demand Card Drop" (1000 users/sec).
- Queue system to prevent overselling.
**Key Selling Point**: A README showing a load-test report handling 500+ requests/second.

---

## Phase 4: The Pulse (FinTech/Real-Time)
**Project Name**: `CryptoSentinel` (or `CardTicker`)
**Startup Mapping**: **Live Marketplace Trends**
**Tech**: WebSockets (Socket.io), Time-Series Data.
**Challenge**: "Zero Latency."
**Core Features**:
- Live "Stock Ticker" for card prices.
- Flashing Green/Red indicators on price change.
**Key Selling Point**: Managing complex state updates in real-time.
