# 🌿 Camino — Life Planning & Career Navigation Platform

> An accessible, multilingual life-mapping platform and guided assistant designed for underserved communities, immigrants, refugees, and first-generation students navigating life in the United States.

---

## Overview

Many individuals from underserved backgrounds face systemic hurdles: navigating complex immigration laws, opening bank accounts without a Social Security Number, finding affordable medical care, and having unstable internet access. 

**Camino** bridges this gap through:
1. **Interactive "Tech Tree" Life Map**: Visualizes micro-milestones (e.g., *"Open a checking account"*, *"Translate informal skills"*, *"Find an FQHC clinic"*) across tiers, unlocking advanced opportunities only after foundational steps are complete.
2. **Offline-Capable PDF Plan Export**: Compiles customized milestones, next steps, and resource summaries into a downloadable PDF that users can save to their mobile device and access without an internet connection.
3. **Local Knowledge Engine (No API Key Required)**: Streams expert, plain-language guidance directly derived from community resource guides without incurring LLM API costs or requiring external keys for MVP testing.
4. **Native Trilingual & RTL Support**: Seamless switching between **English**, **Español**, and **فارسی (Farsi)**, including complete right-to-left (RTL) layout mirroring.

---

## Key Features

###  1. Interactive Life Map (Gamified Tech Tree)
- **3 Core Pathways**:
  -  **Finance & Jobs**: Banking without SSN, secured credit cards, budgeting (50/30/20 rule), resume skill translation, and entry roles (Phlebotomy, IT Helpdesk).
  -  **Health & Wellness**: Community Health Centers (FQHCs), Medicaid/CHIP, Trauma-Informed mental health, campus wellness, and 988 support.
  -  **Immigration & Legal**: Constitutional rights, avoiding fraudulent "notarios", EAD work authorization, Green Card timeline, F-1 student visas, and DACA support.
- **Tiered Progression**:
  - **Tier 1 (Foundation)**: Readily accessible starter steps.
  - **Tier 2 (Building Up)**: Unlocks only after prerequisite foundational nodes are completed.
  - **Tier 3 (Advanced)**: Long-term mobility goals.
- **Dynamic Connectors**: SVG bezier curves visually link dependencies, turning from dashed grey to vibrant sage green upon unlock.
- **Auto-Unlock & Interactive Click**: Click any unlocked node to inspect details or mark it complete; conversation in the chat also automatically detects milestone keywords and unlocks nodes with a celebration toast.

### 📄 2. Offline PDF Plan Generator
- Designed specifically for users with limited data or unstable internet.
- Synthesizes the user's active Life Map, completed checklist, upcoming action items, and curated community tips directly in the browser using `@react-pdf/renderer`.
- Zero server round-trips required — fully offline-capable after the initial page load.

### 💬 3. Streamed Guidance from Resource Guides
- Built directly on three curated resource guides:
  - `financialcareertoolkitmvp.pdf`
  - `healthwellnessnavigationmvp.pdf`
  - `immigrationresourceguidemvp.pdf`
- Implements the AI SDK streaming protocol (`createUIMessageStreamResponse`), delivering natural, word-by-word conversational replies with zero API key dependencies.

###  4. Multilingual & RTL Infrastructure
- Native translations across English, Spanish, and Farsi for all chat responses, milestone nodes, tab labels, and PDF documents.
- Automatically adjusts document direction (`dir="rtl"`) and flips UI alignment for Persian.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Chat Transport** | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` + `@ai-sdk/react`) |
| **Document Export** | [@react-pdf/renderer](https://react-pdf.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Persistence** | Browser `localStorage` (client-side, no login required) |

---

## 📂 Project Structure

```text
camino-design-main/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Local streaming knowledge engine (PDF-powered)
│   ├── globals.css               # Warm earthy palette & pulse animations
│   ├── layout.tsx                # App root layout & font setup
│   └── page.tsx                  # Home route rendering PlannerApp
├── components/
│   ├── chat/
│   │   ├── chat-panel.tsx        # Guided conversational UI & milestone triggers
│   │   └── message-bubble.tsx    # Accessible message bubbles (user / assistant)
│   ├── map/
│   │   ├── life-map-tree.tsx     # Tech tree container, SVG connectors, tabs & progress
│   │   └── milestone-node.tsx    # 3-state interactive node (locked, unlocked, complete)
│   ├── pdf/
│   │   ├── download-pdf-button.tsx # Client-side download trigger with loading states
│   │   └── life-map-document.tsx   # React-PDF layout, multi-tier checklist, RTL support
│   ├── language-switcher.tsx     # EN / ES / FA language selector
│   ├── planner-app.tsx           # Main application coordinator & view tab switcher
│   └── rotating-hello.tsx        # Trilingual animated greeting
├── hooks/
│   └── use-milestones.ts         # Progress state manager, localStorage sync & unlock logic
├── lib/
│   ├── i18n.ts                   # Dictionaries, topic definitions, and situation types
│   ├── milestones.ts             # 27 node definitions with keywords & dependencies
│   └── utils.ts                  # Classname utilities (cn)
└── public/                       # Static assets and reference MVP PDFs
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **Package Manager**: `npm` or `pnpm`

### Installation

1. Navigate to the project directory:
   ```bash
   cd camino-design-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

##  Testing the MVP Features

### 1. Exploring the Life Map
- Click the **"My Map"** tab at the top right (or the *"View Interactive Life Map →"* button on the left).
- Toggle between **Finance & Jobs**, **Health**, and **Immigration**.
- Notice the **Tier 1** nodes are unlocked with a glowing pulse. Click any unlocked node to view its description and click **"✓ Mark as Complete"**.
- Watch the dependent **Tier 2** node automatically illuminate and the progress bar advance!

### 2. Conversing with the Knowledge Engine
- Switch back to the **"Chat"** tab.
- Walk through the welcome flow or type any query covered in the guides, such as:
  - *"How do I open a bank account without an SSN?"*
  - *"What are community health centers or FQHCs?"*
  - *"Can refugees work right away and get an EAD?"*
- Observe the streaming response. When the assistant discusses key topics, notice the milestone toast pop up at the bottom: *"🌿 New milestone unlocked!"*.

### 3. Downloading Your Offline PDF Plan
- In the **"My Map"** view, scroll below the node tree.
- Click **"Download My Plan (PDF)"**.
- A customized, beautifully styled PDF will generate locally in your browser and download with your name, current progress, completed items, and reference tips.

### 4. Language & RTL Switching
- Click **Español** or **فارسی** in the top navigation bar.
- Notice that all text, placeholders, milestone descriptions, and layout orientation (`dir="rtl"`) adapt instantly.

---

##  Privacy & Accessibility
- **No Sign-In Required**: Progress is stored locally in the user's browser, respecting user privacy.
- **WCAG Standards**: High-contrast ratios, focus rings for keyboard navigation, screen-reader friendly labels (`aria-label`, `role="tablist"`, `aria-live`).
- **Low Bandwidth Optimization**: Minimal external dependencies; zero heavy graphics libraries.

---

## 📄 License
This project is open-source and intended for humanitarian, educational, and community benefit.
