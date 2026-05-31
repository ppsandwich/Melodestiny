# 🖋️ Melodestiny

> **The songwriter's analytical companion.**

Melodestiny is a modern, responsive web application designed to act as a powerful analytical tool for songwriters. By combining a beautiful, handcrafted antique aesthetic with a high-performance Rust/WASM engine, Melodestiny evaluates the structural and lyrical quality of your pop songs in real-time.

---

## ✨ Features

- **Real-Time Phonetic Analysis:** Type or paste your lyrics into the unified editor. As you pause, the engine automatically calculates syllable counts using advanced English typesetting algorithms and overlays phonetic delimiters (e.g., `in·cred·i·ble`) seamlessly into your text.
- **25 Algorithmic Songwriting Techniques:** Melodestiny evaluates your song against 25 proven songwriting techniques (such as "Chorus First", "Melodic Math", "Title Brevity", and "Direct Address Pronoun Density").
- **Dynamic Scoring Dashboard:** Get an instant aggregate score for your song. The interactive dashboard breaks down exactly which techniques you nailed and which need improvement, sorted from lowest score to highest to help you focus your rewrites.
- **Line-by-Line Feedback:** Receive specific, actionable feedback tied exactly to the line numbers in your editor.
- **Annotation Smart-Parsing:** The engine intelligently ignores structural annotations like `[Verse 1]` or `{Chorus}`, ensuring they don't skew your syllable counts or structural analysis.
- **Responsive Antique Design:** A gorgeous UI built with custom Tailwind themes, featuring a "Parchment & Ink" aesthetic, Syamsiah Arabic typography, and a flawlessly responsive layout that looks incredible on both 4K monitors and mobile phones.

---

## 🛠 Tech Stack

Melodestiny leverages a cutting-edge, hybrid architecture to ensure both a snappy UI and high-performance text parsing:

### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React 
- **Styling:** TailwindCSS v4 (Custom themed with organic, parchment-inspired design tokens)
- **Icons:** FontAwesome
- **Typography:** Google Fonts (Playfair Display, Lora, IBM Plex Mono) & Custom Local Fonts (Syamsiah Arabic)

### Backend Engine (Client-Side)
- **Language:** Rust 🦀
- **Compilation:** WebAssembly (WASM) via `wasm-bindgen`
- **Purpose:** Executes the heavy-lifting of the 25 proprietary songwriting algorithms at lightning speed, entirely in the user's browser.

### Server Actions
- **Library:** `hypher` & `syllable-count-english`
- **Purpose:** Next.js Server Actions are utilized to securely run phonetic hyphenation algorithms (which require Node.js file-system access) before piping the cleanly separated syllables back to the client.

---

## 🚀 Installation & Setup

To run Melodestiny locally, you will need **Node.js** (v18+) and **Rust** installed on your machine.

### 1. Prerequisites
- **Node & npm**: Download from [nodejs.org](https://nodejs.org/).
- **Rust**: Install via rustup:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- **Wasm-Pack**: The Rust-to-WASM build tool:
  ```bash
  cargo install wasm-pack
  ```

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Melodestiny.git
cd Melodestiny
```

### 3. Build the WASM Engine
Before running the Next.js frontend, you must compile the Rust engine into WebAssembly:
```bash
cd melodestiny-core
wasm-pack build --target web --out-dir ../src/wasm
cd ..
```
*Note: You must re-run this command whenever you make changes to the Rust files in `melodestiny-core/`.*

### 4. Install Dependencies
Install the required Node packages for the frontend:
```bash
npm install
```

### 5. Run the Development Server
Start the Next.js local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start analyzing your lyrics!

---

## 🎨 Design Philosophy

Melodestiny rejects the clinical, sterile look of standard SaaS platforms. We opted for a **"Parchment & Ink"** motif—utilizing rich sepias, vibrant golds, and a custom SVG noise filter to give the background the tactile feel of physical paper. The goal is to make the app feel like a digital extension of a songwriter's physical notebook.
