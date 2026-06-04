# 🖋️ Melodestiny

> **The songwriter's analytical companion.**

Melodestiny is a modern, responsive web application designed to act as a powerful analytical tool for songwriters. By combining a beautiful, handcrafted antique aesthetic with a high-performance Rust/WASM engine, Melodestiny evaluates the structural and lyrical quality of your pop songs in real-time.

---

## ✨ Features

- **Real-Time Phonetic Analysis:** Type or paste your lyrics into the unified editor. As you pause, the engine automatically calculates syllable counts using advanced English typesetting algorithms and overlays phonetic delimiters (e.g., `in·cred·i·ble`) seamlessly into your text (stripping them out cleanly before running structural analysis to avoid interference).
- **Demo Song Loader:** If the editor is blank, a centered `✨ Load Demo Song` button overlays the canvas. Clicking it loads one of ten global #1 hit pop songs from the last 20 years at random (fully populating their titles and complete lyrics) and triggers immediate analysis.
- **AI Lyric Generator (Best-of-Three):** Paste your OpenRouter API Key and select your preferred model (Claude Opus 4.7, DeepSeek V4 Pro, MiMo-V2.5-Pro, Minimax M2.7) via a header popover. Enter a prompt to trigger three parallel generation streams; the client-side WebAssembly engine immediately grades each variation and loads the highest-scoring candidate.
- **25 Algorithmic Songwriting Techniques:** Melodestiny evaluates your song against 25 proven songwriting techniques (such as "Chorus First", "Melodic Math", "Title Brevity", and "Direct Address Pronoun Density") across both line-level and global structures.
- **Advanced Auto-Partitioning Engine:** If no section markers (like `[Verse 1]`) are provided in the lyrics, the engine automatically partitions the song into its logical structural sections (Verse, Chorus, Bridge, etc.) and tags them appropriately.
- **Interactive Line-by-Line Feedback Popovers:** Receive specific, actionable feedback tied directly to the line numbers. Lines with feedback display a hoverable info badge `(i)` next to the syllable counts. If the line has a negative impact flag, the badge is colored red to highlight optimization opportunities. Mousing over the badge presents a detailed feedback popover.
- **State Persistence:** Automatically saves your song title and lyrics in `localStorage` in real-time as you edit or load templates, seamlessly restoring and re-analyzing your work on page refresh or reload. API configuration keys are also securely saved to local storage, insulated from editor state resets.
- **Lyrical & Report Export:** Export triggers allow you to save clean text `.txt` files: one next to "Lyrics Editor" containing raw lyrics devoid of syllable formatting (`·`), and one next to "Detailed Feedback" compiling a full text evaluation report featuring integrated original line lyrics and the complete numbered lyric text at the bottom.
- **Application Reset:** Instantly clears all application React states (song title, lyrics text, analysis output) and resets the cached `localStorage` data at the press of a header button.
- **Responsive Antique Design with Dark Mode:** A gorgeous UI built with custom Tailwind themes, featuring a "Parchment & Ink" aesthetic, Mustopha calligraphic display typography, and a low-light Dark Mode toggle. The layout is flawlessly responsive and looks premium on both 4K monitors and mobile phones.

---

## 🛠 Tech Stack

Melodestiny leverages a cutting-edge, hybrid architecture to ensure both a snappy UI and high-performance text parsing:

### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React 
- **Styling:** TailwindCSS v4 (Custom themed with organic, parchment-inspired design tokens)
- **Icons:** FontAwesome
- **Typography:** Google Fonts (Lora, IBM Plex Mono) & Custom Local Fonts (Mustopha, Syamsiah Arabic)

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

Additionally, the interface includes a toggleable low-contrast **Dark Mode** utilizing a dark-slate palette with subtle gold highlights to prevent eye strain during late-night songwriting sessions.
