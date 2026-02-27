# Smart Travel Scout

## 🌍 Live Demo
https://smart-travel-scout-xi.vercel.app/

Smart Travel Scout is a grounded AI-powered travel recommendation application built with Next.js and the Gemini API.

Users describe their ideal travel experience in natural language, and the system returns matching travel packages strictly from a predefined inventory.

The system is designed to prevent hallucinations by enforcing grounding, schema validation, and server-side constraint filtering.

---

## 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API
- Zod (schema validation)

---

## 🧠 How It Works

### 1. User Input
The user enters a natural language query such as:

> "a chilled beach weekend with surfing vibes under $100"

---

### 2. Server-Side AI Processing

The frontend sends the query to:


The API route:

- Sends a constrained prompt to Gemini
- Forces the model to respond in structured JSON format
- Validates the response using Zod
- Filters results strictly to known inventory IDs
- Enforces budget constraints server-side

---

### 3. Grounding Strategy

To prevent hallucinations:

- The AI is instructed to select only from a fixed travel inventory.
- The response must conform to a strict Zod schema.
- Any item not in the local inventory is discarded.
- Budget constraints (e.g., "$100") are extracted and enforced server-side.
- The UI clearly states that results are limited to available inventory.

This ensures deterministic and grounded recommendations.

---

## 💰 Budget Constraint Handling

If a user includes a price constraint (e.g., "$50"), the system:

1. Extracts the budget using regex.
2. Filters AI-selected results to only include packages within that budget.
3. Returns only valid matches.

This prevents the model from suggesting items outside user constraints.

---

## 📦 Inventory Design

The travel inventory is defined locally as typed data.

Each item includes:

- id
- title
- location
- price
- tags

The AI is only allowed to select from these items.

---

## 📂 Project Structure

src/
├── app/
│ ├── api/scout/route.ts
│ └── page.tsx
├── components/
│ ├── PromptForm.tsx
│ └── ResultsList.tsx
├── data/
│ └── inventory.ts
├── lib/
│ ├── gemini.ts
│ └── query.ts
└── types/

## 🛠 Running Locally

1. Install dependencies

 In bash
npm install

2. Create:
   environment file named .env.local 

3. Add your Gemini API key:
   GEMINI_API_KEY=your_api_key_here

4. Start development server
   npm run dev

5. Open:
   http://localhost:3000


## 🏗 Architecture Overview

Client → API Route → Gemini → Zod Validation → Inventory Filtering → Budget Enforcement → Response

All AI interaction happens server-side. The frontend never communicates directly with the Gemini API.