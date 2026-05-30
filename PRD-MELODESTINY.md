# Melodestiny — Product Requirements Document

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-05-30

---

## 1. Overview

Melodestiny is a web-based song lyric analysis tool that scores pop songs on structural and lyrical quality using 15 algorithmic techniques derived from the playbooks of the world's most successful pop songwriters. The user inputs a song title and lyrics, presses an analysis button, and receives a weighted score out of 100 with a detailed breakdown, highlighted lyrics showing technique application and improvement opportunities, and a downloadable marked-up copy of the lyrics.

---

## 2. Design Philosophy

### 2.1 Visual Aesthetic

The UI must feel **organic, hand-crafted, antique, yet minimalistic**. Think: a well-loved leather journal in a Victorian songwriter's study. Not cluttered, not loud — warm, textured, and intentional.

**Style References:**
- [Antique Artwork Collectibles App](https://dribbble.com/shots/17018577)
- [Attic E-commerce Antiques](https://dribbble.com/shots/17022927)
- [Vintage Vault Collection App](https://dribbble.com/shots/24801736)
- [Online Antiques Auction App](https://dribbble.com/shots/19700434)

**Design Tokens:**

| Token | Value | Notes |
|---|---|---|
| `--color-parchment` | `#F5F0E8` | Main background, warm off-white |
| `--color-ink` | `#2C2418` | Primary text, dark warm brown |
| `--color-sepia` | `#8B7355` | Secondary text, muted brown |
| `--color-gold` | `#C4A265` | Accent, scores, highlights |
| `--color-rust` | `#A0522D` | Warnings, improvement flags |
| `--color-sage` | `#7A8B6F` | Positive indicators, passing scores |
| `--color-cream` | `#FBF8F1` | Card backgrounds |
| `--color-charcoal` | `#3A3228` | Dark mode background (deferred to v2) |
| `--font-display` | `'Playfair Display', serif` | Headings, titles |
| `--font-body` | `'Lora', serif` | Body text, lyrics |
| `--font-mono` | `'IBM Plex Mono', monospace` | Scores, technical labels |
| `--radius-sm` | `4px` | Subtle, not perfectly round |
| `--radius-md` | `8px` | Cards |
| `--shadow-card` | `0 2px 8px rgba(44,36,24,0.08)` | Soft, warm shadow |
| `--border-subtle` | `1px solid rgba(139,115,85,0.15)` | Faint borders |

**UI Principles:**
- Textured backgrounds (subtle paper grain via CSS noise or SVG pattern)
- Serif typography throughout — no sans-serif
- Muted earth tones only — no bright colors
- Generous whitespace — let content breathe
- Thin, hand-drawn-style dividers (SVG or border-image)
- Score displayed as a wax-seal-style circular badge
- Icons: thin line-art style, like etched illustrations

### 2.2 Responsive Layout

- **Mobile (<768px):** Single-column, stacked vertically. Designed for 375px width first.
- **Desktop (≥768px):** Two-column split. Left column = input form. Right column = results.
- Touch targets minimum 44x44px
- Sticky analyze button at bottom of viewport on mobile when input is scrolled out of view
- Right column is sticky on desktop (results stay visible while scrolling lyrics input)

### 2.3 Animation

All animations must serve a purpose: guiding attention, confirming actions, or smoothing state transitions. No decoration for decoration's sake.

**Timing & Easing:**
- Duration: 150ms–400ms for UI transitions, 600ms–800ms for content reveals
- Easing: `ease-out` for entering elements, `ease-in` for exiting, `ease-in-out` for state changes
- All animations must respect `prefers-reduced-motion` — if the user has reduced motion enabled, transitions are instant (no animation)

**Animation Catalog:**

| Trigger | Animation | Purpose | Duration |
|---|---|---|---|
| **Analyze button click** | Button text fades to loading spinner, gentle pulse | Confirms action, manages expectation | 200ms fade |
| **Results appear** | Right column content fades in and slides up from 8px below | Draws eye to results without jarring | 400ms, ease-out |
| **Score badge** | Wax seal scales from 0.8 → 1.0 with subtle overshoot, then settles | Creates a "stamp" moment — the score feels official | 600ms, spring ease |
| **Score breakdown rows** | Rows stagger in from left, 30ms delay between each | Reveals information progressively, prevents overwhelm | 200ms per row, ease-out |
| **Highlighted lyrics** | Annotations underline from left to right (width 0 → 100%) | Draws attention to what's flagged, line by line | 300ms per annotation, staggered |
| **Annotation tap/click** | Popover fades in and scales from 0.95 → 1.0 | Smooth reveal of detail without abruptness | 200ms, ease-out |
| **Download button** | Subtle ink-blot expand on hover/focus | Tactile feedback, matches antique aesthetic | 300ms, ease-out |
| **Column layout shift** | Right column cross-fades from empty state to results | Smooth transition from placeholder to content | 400ms, ease-in-out |
| **Textarea auto-expand** | Height animates smoothly as user types more lines | Prevents jarring layout jumps | 150ms, ease-out |
| **Error states** | Shake animation (2px horizontal, 2 cycles) on invalid input | Draws attention without being aggressive | 300ms |

**Reduced Motion Fallback:**
When `prefers-reduced-motion: reduce` is active:
- All slides become instant fades (no translation)
- All scales become instant opacity changes
- Stagger delays are removed
- Spinner becomes a static "Analyzing..." text change
- Score badge appears instantly (no spring)

### 2.4 Accessibility (A11y)

The app must meet **WCAG 2.1 AA** compliance. Accessibility is not a polish item — it is a core requirement.

**Keyboard Navigation:**
- All interactive elements must be reachable via Tab in a logical order: Title → Lyrics → Analyze → Score Breakdown → Highlighted Lyrics → Download
- Focus indicators: 2px solid gold (`--color-gold`) outline with 2px offset — visible on all backgrounds
- Annotation popovers must be dismissible via Escape key
- Analyze button must be activatable via Enter/Space
- Tab trap: annotation popover traps focus while open, returns focus to trigger on close

**Screen Reader Support:**
- All images and icons have `alt` text or `aria-label`
- Score badge: `aria-label="Song analysis score: 72 out of 100, rated Strong Foundation"`
- Score breakdown table: proper `<table>` with `<th>` headers, `scope="col"` on all header cells
- Annotation triggers: `aria-describedby` pointing to popover content
- Annotation popovers: `role="dialog"`, `aria-modal="true"`, `aria-label` with technique name
- Highlighted lyrics: annotations use `<mark>` or `<span>` with `role="note"` and `aria-label` describing the flag
- Section headers (Verse, Chorus, Bridge): `aria-label="Verse 1, lines 1-8"` for context
- Loading state: `aria-live="polite"` region announces "Analyzing your lyrics..." and "Analysis complete. Score: 72 out of 100."
- Error messages: `role="alert"` for immediate announcement

**Visual Accessibility:**
- Minimum contrast ratio 4.5:1 for body text against background
- Minimum contrast ratio 3:1 for large text (headings, score badge number)
- Color is never the sole indicator — all flagged annotations also have text labels (Positive, Warning, Note) and distinct visual patterns (solid underline, dashed underline, dotted underline)
- Score ranges use both color and text label (e.g., green + "Strong Foundation")
- Focus indicators have sufficient contrast against all background colors

**Motor Accessibility:**
- Touch targets minimum 44x44px
- No gesture-only interactions — all actions have button/tap alternatives
- Popovers dismissible via tap-outside, Escape key, or close button
- No time-limited interactions — analysis results persist until user re-analyzes

**Cognitive Accessibility:**
- Simple, consistent layout — no unexpected repositioning of elements
- Error messages are plain language, not technical jargon
- Score breakdown uses progressive disclosure (collapsed by default, expandable)
- Copy uses plain language — no unexplained jargon (terms like "pre-chorus" link to glossary)

**Testing Requirements:**
- Automated: axe-core integration in E2E tests, zero critical/serious violations
- Manual: keyboard-only navigation test, screen reader test (VoiceOver on macOS, NVDA on Windows)
- Color contrast: verified via Storybook addon or manual check against design tokens

---

## 3. Architecture

### 3.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Analysis Engine** | Rust → WebAssembly (WASM) | Performance, portability, runs in browser |
| **Frontend Framework** | Next.js (App Router) | SSR/SSG, Vercel-optimized, React ecosystem |
| **Styling** | Tailwind CSS + CSS Variables | Rapid iteration, design token system |
| **Hosting** | Vercel Hobby Plan (serverless) | Free tier, edge functions, WASM support |
| **Future Native** | Tauri (iOS/Android) | Rust core shared with WASM, native wrappers |

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  ┌─────────────────────────────────────────┐ │
│  │          Next.js Frontend               │ │
│  │  (React, Tailwind, UI Components)       │ │
│  └──────────────┬──────────────────────────┘ │
│                 │                             │
│  ┌──────────────▼──────────────────────────┐ │
│  │        WASM Analysis Engine             │ │
│  │  (Rust compiled to WebAssembly)         │ │
│  │  - 15 algorithmic techniques            │ │
│  │  - Scoring & weighting                  │ │
│  │  - Lyric markup generation              │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

Future:
┌─────────────────────────────────────────────┐
│           Tauri Native Shell                 │
│  ┌─────────────────────────────────────────┐ │
│  │     Shared Rust Core (same crate)       │ │
│  │     + Native UI (WebView or Svelte)     │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 3.3 Vercel Hobby Plan Constraints

- **Serverless function timeout:** 10s (max)
- **Serverless function size:** 50MB (max)
- **WASM bundle size target:** < 2MB gzipped
- **Edge function payload:** < 4MB
- **Strategy:** Analysis runs entirely client-side via WASM. No serverless function needed for analysis. Serverless functions only used for optional features (e.g., saving results, sharing links).

---

## 4. User Flow

The entire app is a **single view**. No navigation, no separate screens. On mobile, everything stacks vertically. On desktop (≥768px), a two-column layout: lyrics input on the left, results on the right.

**Mobile (< 768px):**
```
┌─────────────────────┐
│  Song Title Input    │
│  Lyrics Textarea     │
│  [Analyze] Button    │
├─────────────────────┤
│  Score Badge         │
│  Score Breakdown     │
│  Highlighted Lyrics  │
│  [Download]          │
└─────────────────────┘
```

**Desktop (≥ 768px):**
```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  Song Title Input    │  Score Badge         │
│  Lyrics Textarea     │  Score Breakdown     │
│  [Analyze] Button    │  [Download]          │
│                      │                      │
│                      ├──────────────────────┤
│                      │                      │
│                      │  Highlighted Lyrics  │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

- **Left column:** Input form (title, lyrics, analyze button). Always visible.
- **Right column:** Results. Before analysis, shows an empty state or placeholder. After analysis, shows score badge, score breakdown table, and download button in the top portion, with highlighted lyrics scrolling below.
- Both columns are independently scrollable on desktop.
- The right column is sticky on desktop so results remain visible while scrolling the lyrics input.

### 4.1 Input Section (Always Visible)

- **Song Title** — Single-line text input, placeholder: "e.g., Blank Space"
  - Max 200 characters
  - Trims leading/trailing whitespace on submit
  - Empty title shows inline error: "Please enter a song title"
- **Lyrics** — Multi-line textarea, placeholder: "Paste your lyrics here...", minimum height 200px, auto-expanding
  - Max 10,000 characters
  - Preserves line breaks and whitespace as entered
  - Strips timestamps (e.g., `[01:23]`) and chord notation (e.g., `[Am]`) before analysis — these are common when pasting from chord sites
  - Empty lyrics shows inline error: "Please enter your lyrics"
- **Analyze Button** — Full-width, gold accent, serif text "Analyze", disabled until both fields have content
- **Character counter** — Subtle, bottom-right of textarea, shows `{current} / 10,000`

### 4.2 Analyzing State

- The analyze button shows a loading spinner inline (not a full-screen overlay)
- Button text changes to "Examining your lyrics..."
- Duration: typically < 500ms (WASM is fast)
- Input fields remain visible but slightly dimmed

### 4.3 Results Section

After analysis completes, results appear in the right column (desktop) or below the input (mobile). The page does not navigate — content appears in-place.

1. **Score Badge** — Wax-seal-style circular badge, number out of 100
2. **Score Breakdown** — Collapsible table of all 15 techniques with individual scores, weights, and contribution to total
3. **Highlighted Lyrics** — Full lyrics with inline annotations
4. **Download Button** — Exports marked-up lyrics as `.md`

On desktop, the top portion of the right column contains: score badge, score breakdown table, and download button. Highlighted lyrics scroll below them. The right column is independently scrollable.

### 4.4 Re-analysis

- User can edit title or lyrics at any time
- Clicking "Analyze" again replaces the current results with new ones
- On mobile: results scroll-into-view after re-analysis
- On desktop: right column updates in-place (already visible)

---

## 5. Analysis Engine (Rust/WASM)

### 5.1 Input Contract

```rust
pub struct AnalysisInput {
    pub title: String,
    pub lyrics: String,
}
```

### 5.2 Output Contract

```rust
pub struct AnalysisOutput {
    pub total_score: f64,           // 0-100
    pub techniques: Vec<TechniqueResult>,
    pub highlighted_lyrics: Vec<LyricLine>,
    pub markup_download: String,    // Markdown
    pub auto_partitioned: bool,     // true if sections were auto-detected by line count
}

pub struct TechniqueResult {
    pub id: String,
    pub name: String,
    pub author: String,
    pub description: String,
    pub raw_score: f64,             // 0-1.0
    pub weight: f64,                // contribution weight
    pub weighted_score: f64,        // raw_score * weight * 100
    pub feedback: String,           // human-readable explanation
    pub flags: Vec<LyricFlag>,      // specific locations in lyrics
}

pub struct LyricLine {
    pub line_number: usize,
    pub text: String,
    pub annotations: Vec<Annotation>,
}

pub struct LyricFlag {
    pub line_number: usize,
    pub start_char: usize,
    pub end_char: usize,
    pub flag_type: FlagType,        // Positive, Neutral, Negative
    pub technique_id: String,
    pub message: String,
}

pub struct Annotation {
    pub start_char: usize,
    pub end_char: usize,
    pub annotation_type: AnnotationType, // Highlight, Warning, Note
    pub message: String,
    pub technique_id: String,
}

pub enum FlagType {
    Positive,   // Technique applied well
    Neutral,    // Informational / optional suggestion
    Negative,   // Improvement opportunity
}

pub enum AnnotationType {
    Highlight,  // Maps to FlagType::Positive — gold underline
    Warning,    // Maps to FlagType::Negative — rust underline with dot
    Note,       // Maps to FlagType::Neutral — sepia dashed underline
}
```

### 5.3 WASM Binding

Expose a single function to JavaScript:

```rust
#[wasm_bindgen]
pub fn analyze(title: &str, lyrics: &str) -> JsValue {
    // Returns serialized AnalysisOutput
}
```

The WASM module is loaded via `wasm-loader.ts`:
1. On app mount, dynamically import the WASM module: `const wasm = await import('/wasm/melodestiny_core.js')`
2. The `.js` wrapper (generated by wasm-bindgen) loads the `.wasm` binary
3. Cache the initialized module as a singleton — subsequent calls reuse the same instance
4. The WASM `.wasm` binary is served from `/public/wasm/` with `Cache-Control: immutable` headers (configured in Vercel)

---

## 6. The 15 Algorithmic Techniques

Each technique produces a raw score from 0.0 to 1.0. Weights are normalized so they sum to 1.0. The final score is: `sum(raw_score_i * weight_i) * 100`.

### 6.1 Technique Definitions

#### T01 — Melodic Math (Lyrical Rhythm)
- **Author:** Max Martin
- **Weight:** 0.10
- **Description:** Every syllable has a rhythmic home. Treat the words like a drum pattern.
- **Algorithm:**
  1. Split lyrics into lines
  2. Count syllables per line using a syllable counting algorithm (vowel-group method)
  3. Calculate the standard deviation of syllable counts within each section (verse, chorus, etc.)
  4. Lower deviation = higher score (more consistent rhythm)
  5. Flag lines that deviate > 1.5 standard deviations from their section mean
- **Scoring:** `1.0 - min(1.0, avg_section_std_dev / 3.0)`
- **Flags:** Lines with syllable count > 1.5σ from section mean → Negative flag: "This line has {n} syllables, but your {section} averages {m}. Consider adjusting for rhythmic consistency."

#### T02 — Chorus-First Structural Check
- **Author:** Max Martin
- **Weight:** 0.09
- **Description:** The chorus IS the song. It should appear early and be the most repeated element.
- **Algorithm:**
  1. Detect sections (verse, chorus, bridge) using pattern matching on common labels or structural repetition
  2. Measure position of first chorus as percentage of total song length
  3. Count total occurrences of chorus sections
  4. Score higher if chorus appears within first 35% of song and is the most repeated section
- **Scoring:**
  - Chorus position ≤ 35%: +0.5
  - Chorus count ≥ 2: +0.3
  - Chorus is most repeated section: +0.2
- **Flags:** If chorus appears after 50% of song → Negative flag: "Your chorus doesn't appear until {n}% through the song. Max Martin's playbook says the chorus should arrive early — it IS the song."

#### T03 — Repetition Detection & Variation
- **Author:** Max Martin / Jack Antonoff
- **Weight:** 0.08
- **Description:** Repeat hooks relentlessly but change ONE element each time.
- **Algorithm:**
  1. Identify the most repeated phrase (3+ words) in the lyrics
  2. Count total occurrences
  3. For each occurrence, record surrounding context (2 lines before/after)
  4. Measure variation: how many words differ between consecutive occurrences of the hook phrase
  5. Ideal: hook repeats 3-6 times with small contextual variation
- **Scoring:**
  - Hook repeats 3-6 times: +0.5
  - Some variation between occurrences: +0.3
  - Hook exists at all: +0.2
- **Flags:** If hook repeats < 2 times → Negative flag: "Your hook phrase '{phrase}' only appears {n} time(s). Repetition is how humans encode memory — repeat it more." If hook repeats > 8 times with no variation → Neutral flag: "Your hook repeats {n} times. Consider varying the surrounding context each time to keep it fresh."

#### T04 — Mantra Density
- **Author:** Jack Antonoff
- **Weight:** 0.06
- **Description:** Repeat a phrase until it transforms from words into feeling.
- **Algorithm:**
  1. Find all repeated phrases (2+ words, 3+ occurrences)
  2. Calculate "mantra density" = total repeated phrase occurrences / total lines
  3. Ideal mantra density: 0.3-0.6 (30-60% of lines contain repeated phrases)
- **Scoring:** `1.0 - abs(mantra_density - 0.45) / 0.45`
- **Flags:** If mantra density < 0.15 → Negative flag: "Your lyrics have very little repetition. Jack Antonoff builds catharsis through obsessive restatement — consider repeating key phrases more." If mantra density > 0.7 → Neutral flag: "Heavy repetition detected. Make sure it feels intentional, not lazy."

#### T05 — Hook/Title Structural Placement
- **Author:** Diane Warren
- **Weight:** 0.10
- **Description:** The title phrase should appear in the chorus, ideally at the start or end.
- **Algorithm:**
  1. Extract the title phrase
  2. Search for exact or fuzzy matches in the lyrics
  3. For each match, record: section (verse/chorus/bridge), position within section (start/middle/end)
  4. Score based on: title in chorus (+0.4), title at start or end of chorus (+0.3), title appears multiple times (+0.2), title in final chorus (+0.1)
- **Scoring:** Sum of the above, capped at 1.0
- **Flags:** If title not found in lyrics → Negative flag: "Your title '{title}' doesn't appear anywhere in the lyrics. Diane Warren's rule: the hook IS the title." If title only in verse, not chorus → Negative flag: "Your title appears in the verse but not the chorus. Move it to the chorus — that's where it matters most."

#### T06 — Singability Metrics
- **Author:** Max Martin
- **Weight:** 0.07
- **Description:** If you can't sing it a cappella walking down the street, rewrite it.
- **Algorithm:**
  1. For each line, calculate:
     - Syllable count
     - Consonant cluster density (consecutive consonants / total characters)
     - Average syllable length (characters per syllable)
  2. Flag lines with high consonant cluster density (> 0.6) or very long syllables (> 4 chars/syllable)
  3. Score: higher when fewer lines are flagged
- **Scoring:** `1.0 - (flagged_lines / total_lines)`
- **Flags:** Flagged lines → Negative flag: "This line has dense consonant clusters that are hard to sing. Try replacing hard consonant combinations with more open vowel sounds."

#### T07 — Line Length Consistency
- **Author:** Max Martin
- **Weight:** 0.06
- **Description:** Parallel lines within a section should have similar syllable counts.
- **Algorithm:**
  1. Group lines by section (verse 1, verse 2, chorus, etc.)
  2. Within each section, calculate syllable count per line
  3. Calculate coefficient of variation (CV) for each section
  4. Ideal CV: < 0.25 (lines within a section are similar length)
- **Scoring:** `1.0 - min(1.0, avg_cv / 0.5)`
- **Flags:** Sections with CV > 0.4 → Negative flag: "Your {section} has inconsistent line lengths (ranging from {min} to {max} syllables). This disrupts the rhythmic flow."

#### T08 — Title Brevity
- **Author:** Diane Warren
- **Weight:** 0.04
- **Description:** The best titles are 2-4 words.
- **Algorithm:**
  1. Count words in title
  2. Score: 2-4 words = 1.0, 1 word = 0.7, 5 words = 0.5, 6+ words = 0.3
- **Scoring:** Lookup table based on word count
- **Flags:** If title > 5 words → Neutral flag: "Your title is {n} words long. Diane Warren's best titles are 2-4 words. Can you shorten it?"

#### T09 — Rhyme Scheme Consistency
- **Author:** Max Martin / Diane Warren
- **Weight:** 0.08
- **Description:** Pop hits use predictable rhyme patterns (AABB, ABAB, ABCB) within sections.
- **Algorithm:**
  1. For each section, extract the last word of each line
  2. Detect rhyme pairs using the rhyme detection algorithm in Section 10.2 (CMU dict primary, heuristic fallback)
  3. Detect pattern: AABB (consecutive pairs rhyme), ABAB (alternating), ABCB (2nd and 4th rhyme), or free (no pattern)
  4. Score: consistent pattern within section = high, mixed patterns = medium, no pattern = low
- **Scoring:** For each section, calculate `lines_that_fit_detected_pattern / total_lines_in_section`. Average across all sections. Sections with < 3 lines are excluded from scoring (too few lines to detect a pattern).
- **Flags:** Lines that don't fit the detected pattern → Neutral flag: "This line doesn't rhyme with the expected line in your {scheme} pattern. Consider adjusting the ending word."

#### T10 — Section Length Parity
- **Author:** Max Martin
- **Weight:** 0.05
- **Description:** Verses and choruses should be similar in length for rhythmic predictability.
- **Algorithm:**
  1. Count lines in each verse and each chorus
  2. Calculate ratio of avg verse length to avg chorus length
  3. If either avg is 0 (no verses or no choruses detected), score 0.5 and skip flagging — insufficient data
  4. Ideal ratio: 0.8-1.2 (verse and chorus are within 20% of each other)
- **Scoring:** `1.0 - min(1.0, abs(ratio - 1.0) / 0.5)`. Boundary values: ratio exactly 0.6 or 1.5 scores 0.2.
- **Flags:** If ratio < 0.6 or > 1.5 → Neutral flag: "Your verses are {n}x the length of your choruses. Consider balancing them for better flow."

#### T11 — Vocabulary Simplicity
- **Author:** Diane Warren / Julia Michaels
- **Weight:** 0.06
- **Description:** Hit songwriters use simple, common English words.
- **Algorithm:**
  1. Tokenize lyrics into individual words
  2. Score each word against a frequency list (top 1000 = very common, top 5000 = common, 5000+ = uncommon)
  3. Calculate percentage of words in top 5000
  4. Penalize words with > 4 syllables
- **Scoring:** `(percentage_in_top_5000 * 0.7) + (percentage_with_<=4_syllables * 0.3)`
- **Flags:** Uncommon words → Neutral flag: "'{word}' is uncommon in pop lyrics. Diane Warren's hits use zero obscure words. Consider a simpler synonym."
- **Data source:** Use Google Books n-gram data to generate the top 5000 most common English words. Pre-process offline into a static JSON file bundled with the WASM module (~50KB). If the n-gram data is too large to process at build time, fall back to a curated list derived from the Corpus of Contemporary American English (COCA) top 5000 words.

#### T12 — Direct Address Pronoun Density
- **Author:** Diane Warren / Julia Michaels
- **Weight:** 0.07
- **Description:** "I" and "you" create direct emotional connection.
- **Algorithm:**
  1. Count occurrences of first-person pronouns: I, me, my, mine, myself, we, us, our
  2. Count occurrences of second-person pronouns: you, your, yours, yourself
  3. Calculate pronoun density = (I_count + you_count) / total_words
  4. Ideal density: 0.08-0.18 (8-18% of words are I/you pronouns)
- **Scoring:** `1.0 - min(1.0, abs(density - 0.13) / 0.13)`
- **Flags:** If density < 0.05 → Neutral flag: "Low 'I' and 'you' usage. Direct address creates emotional immediacy — consider speaking directly to someone." If density > 0.25 → Neutral flag: "Very high pronoun density. Make sure you're also including concrete imagery and detail."

#### T13 — Post-Chorus Hook Fragment Detection
- **Author:** Pharrell Williams / Ed Sheeran
- **Weight:** 0.05
- **Description:** Modern pop repeats short hook fragments after the chorus ends.
- **Algorithm:**
  1. Detect chorus boundaries
  2. In the 1-3 lines immediately following each chorus, check for repeated short phrases (2-5 words)
  3. Check if these phrases contain vocables (oh, ah, eh, na, la, hey) or fragments of the chorus hook
  4. Score: post-chorus fragments found = high, none found = neutral (not required)
- **Scoring:** `if post_chorus_fragments_found { 1.0 } else { 0.5 }`
- **Flags:** If no post-chorus detected → Note flag: "Consider adding a short repeated hook fragment after your chorus (like 'ella, ella' or 'oh-I-oh-I'). This is a modern pop staple."

#### T14 — Bridge Vocabulary Novelty
- **Author:** Jack Antonoff / Max Martin
- **Weight:** 0.04
- **Description:** The bridge should introduce new lyrical content to create contrast.
- **Algorithm:**
  1. Build word set from all verses and choruses (excluding bridge)
  2. Build word set from bridge
  3. Calculate novelty = (bridge_words_not_in_other_sections) / (total_bridge_words)
  4. Ideal novelty: > 0.4 (40%+ of bridge words are new)
- **Scoring:** `min(1.0, novelty / 0.4)`
- **Flags:** If novelty < 0.2 → Negative flag: "Your bridge reuses too many words from your verses/chorus ({n}% new). The bridge should be a contrast — introduce new imagery or perspective."

#### T15 — Structural Advisory
- **Author:** Max Martin / Jack Antonoff / Diane Warren
- **Weight:** 0.05
- **Description:** Evaluate whether the song's overall section structure is complete and well-arranged. Suggest adding, removing, or rearranging sections.
- **Algorithm:**
  1. Build a structural map of the song (e.g., V1 → C → V2 → C → B → C)
  2. Check for missing structural elements:
     - **No bridge:** If song has ≥ 2 verses and ≥ 2 choruses but no bridge → suggest adding one. A bridge breaks repetition and provides contrast before the final chorus.
      - **No pre-chorus:** If verse and chorus have significantly different line counts (ratio > 1.5 or < 0.67) and no pre-chorus exists → suggest adding one to smooth the transition.
     - **No post-chorus:** If song has no post-chorus and the chorus is short (≤ 4 lines) → suggest adding a hook fragment.
  3. Check for structural problems:
     - **Consecutive verses:** If two or more verses appear back-to-back without a chorus between them → flag as negative. Verses need chorus payoff.
     - **Missing final chorus:** If the song ends on a verse or bridge → suggest ending on a chorus for resolution.
     - **AAA with no variation:** If the song is entirely verses (strophic) with no chorus or bridge → suggest adding a contrasting section.
     - **Excessive length:** If total section count > 8 → suggest trimming. Most pop songs have 5-7 sections.
     - **No outro/landing:** If the song ends abruptly on a chorus with no outro or tag → note as a potential improvement.
  4. Score: penalize missing critical elements (bridge, final chorus), lighter penalty for missing optional elements (pre-chorus, post-chorus)
- **Scoring:**
  - Has a bridge (if ≥ 2 verses): +0.25
  - Has a pre-chorus (only if verse/chorus line count ratio > 1.5 or < 0.67, otherwise neutral): +0.15
  - Ends on chorus: +0.25
  - No consecutive verses without chorus: +0.20
  - Reasonable length (5-7 sections): +0.15
- **Flags:**
  - No bridge → Negative flag: "Your song has {n} verses and {n} choruses but no bridge. A bridge breaks the repetition and gives the listener something new before the final chorus. Consider adding one after your second chorus."
  - No pre-chorus → Neutral flag: "Your verse transitions directly into the chorus. A pre-chorus can build tension and make the chorus hit harder. Consider adding a 2-4 line build section."
  - Consecutive verses → Negative flag: "Two verses appear back-to-back (lines {n}-{m}). The listener expects a chorus payoff after each verse. Insert a chorus between them."
  - Doesn't end on chorus → Negative flag: "Your song ends on a {section}. Ending on the chorus gives the listener resolution and leaves them with the hook."
  - AAA structure → Negative flag: "Your song is entirely verses with no contrasting section. Even a simple chorus or bridge would add structure and keep the listener engaged."
  - Too many sections → Neutral flag: "Your song has {n} sections. Most pop songs have 5-7. Consider trimming less essential sections."

### 6.2 Weight Summary

| ID | Technique | Author | Weight |
|---|---|---|---|
| T01 | Melodic Math (Lyrical Rhythm) | Max Martin | 0.10 |
| T02 | Chorus-First Structural Check | Max Martin | 0.09 |
| T03 | Repetition Detection & Variation | Max Martin / Jack Antonoff | 0.08 |
| T04 | Mantra Density | Jack Antonoff | 0.06 |
| T05 | Hook/Title Structural Placement | Diane Warren | 0.10 |
| T06 | Singability Metrics | Max Martin | 0.07 |
| T07 | Line Length Consistency | Max Martin | 0.06 |
| T08 | Title Brevity | Diane Warren | 0.04 |
| T09 | Rhyme Scheme Consistency | Max Martin / Diane Warren | 0.08 |
| T10 | Section Length Parity | Max Martin | 0.05 |
| T11 | Vocabulary Simplicity | Diane Warren / Julia Michaels | 0.06 |
| T12 | Direct Address Pronoun Density | Diane Warren / Julia Michaels | 0.07 |
| T13 | Post-Chorus Hook Fragment | Pharrell Williams / Ed Sheeran | 0.05 |
| T14 | Bridge Vocabulary Novelty | Jack Antonoff / Max Martin | 0.04 |
| T15 | Structural Advisory | Max Martin / Jack Antonoff / Diane Warren | 0.05 |
| | **Total** | | **1.00** |

### 6.3 Score Ranges

| Range | Label | Description |
|---|---|---|
| 90-100 | "Hit Potential" | Exceptional structural and lyrical quality |
| 75-89 | "Strong Foundation" | Solid songwriting with minor refinements possible |
| 60-74 | "Good Bones" | Core ideas are there, several areas for improvement |
| 45-59 | "Work in Progress" | Significant structural or lyrical issues |
| 0-44 | "Back to the Drawing Board" | Fundamental rethinking needed |

---

## 7. Highlighted Lyrics

### 7.1 Rendering Rules

The lyrics display must:

1. Show line numbers (left-aligned, muted color)
2. Visually distinguish sections (verse, chorus, bridge) with subtle headers
3. Inline annotations appear as:
   - **Gold underline** — Positive flag (technique applied well)
   - **Rust underline with dot** — Negative flag (improvement opportunity)
   - **Sepia dashed underline** — Neutral/note flag
4. Clicking/tapping an underlined segment shows a tooltip/popover with:
   - Technique name
   - Author attribution
   - Explanation of why it was flagged
   - Suggested improvement (if negative flag)
5. Section headers show section-level scores where applicable

### 7.2 Section Detection

Since the user provides plain text lyrics (not structured data), sections must be detected heuristically:

- **Explicit labels:** Lines matching `verse`, `chorus`, `bridge`, `pre-chorus`, `outro`, `intro` (case-insensitive, with or without numbers/colons)
- **Structural repetition:** Lines or line groups that appear identically 2+ times are likely choruses
- **Positional heuristics:** First distinct block = verse, repeated block = chorus, unique block near end = bridge
- **Auto-partitioning fallback:** If no sections are detected, attempt auto-partitioning by line count — group every 4 lines as a verse-like section, then apply all techniques. If auto-partitioning is used, display a notice: "We've auto-detected sections based on line grouping. For more accurate analysis, label your sections (e.g., 'Verse 1:', 'Chorus:', 'Bridge:') in the lyrics."

### 7.3 Annotation Detail Panel

When a user taps an annotation, a detail panel appears:
- **Mobile (<768px):** Bottom sheet that slides up from the bottom of the viewport, max height 50vh, dismissible by swipe-down or tapping the backdrop
- **Desktop (≥768px):** Popover anchored to the annotation, max width 320px, dismissible by clicking outside or pressing Escape

The panel contains:

```
┌─────────────────────────────────────┐
│  T05 — Hook/Title Placement         │
│  Diane Warren                       │
│                                     │
│  "Your title 'Blank Space' appears  │
│   in the chorus at the start of     │
│   the line. This is ideal — the     │
│   hook IS the title."               │
│                                     │
│  ✓ Applied well                     │
└─────────────────────────────────────┘
```

---

## 8. Downloadable Markup

### 8.1 Format

The download produces a Markdown file with the following structure:

```markdown
# Song Analysis: {title}
**Score: {score}/100** — {label}

---

## Score Breakdown

| # | Technique | Author | Score | Weight | Contribution |
|---|---|---|---|---|---|
| T01 | Melodic Math | Max Martin | {score} | {weight} | {contribution} |
| ... | ... | ... | ... | ... | ... |

---

## Lyrics with Annotations

### Verse 1
1: {line text}
   <!-- T09: ✓ This line rhymes with line 3 (ABAB pattern) -->

2: {line text}
   <!-- T01: ⚠ This line has 12 syllables, but your verse averages 8. Consider shortening. -->

### Chorus
...

---

## Improvement Opportunities

### High Priority (Negative flags)
- **T05** (Diane Warren): Your title '{title}' doesn't appear in the chorus. Move it there.
- **T01** (Max Martin): Lines 4, 7, 12 have inconsistent syllable counts.

### Medium Priority (Negative flags with lower weight, or Neutral flags on high-weight techniques)
- **T11** (Julia Michaels): 3 uncommon words detected: '{word1}', '{word2}', '{word3}'.

### Low Priority / Notes (Neutral flags on lower-weight techniques)
- **T13** (Pharrell Williams): No post-chorus hook fragment detected. Consider adding one.
```

### 8.2 Filename

`{sanitized_title}_analysis.md`

---

## 9. Component Structure

### 9.1 Frontend Components

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, global styles
│   └── page.tsx                # Single view — two-column on desktop, stacked on mobile
├── components/
│   ├── InputColumn.tsx         # Left column: title input + lyrics textarea + analyze button
│   ├── ResultsColumn.tsx       # Right column: score + breakdown + highlighted lyrics + download
│   ├── InputForm.tsx           # Title + lyrics textarea + analyze button
│   ├── ScoreBadge.tsx          # Wax-seal score display (120px mobile, 160px desktop)
│   ├── ScoreBreakdown.tsx      # 15-row collapsible table of technique scores
│   ├── HighlightedLyrics.tsx   # Lyrics with inline annotations
│   ├── AnnotationPopover.tsx   # Tooltip/popover for annotation details (bottom sheet on mobile, popover on desktop)
│   ├── DownloadButton.tsx      # Triggers markup download
│   ├── EmptyState.tsx          # Placeholder in results column before analysis — shows prompt text like "Your analysis will appear here" with an etched quill illustration
│   └── SectionHeader.tsx       # Verse/Chorus/Bridge label
├── lib/
│   ├── wasm-loader.ts          # Loads WASM module via dynamic import(), caches singleton instance
│   ├── types.ts                # TypeScript types matching Rust output
│   └── section-detector.ts     # Lightweight JS-side section preview for showing section labels before full WASM analysis runs
├── styles/
│   └── globals.css             # Tailwind + design tokens + textures
└── public/
    ├── fonts/                  # Playfair Display, Lora, IBM Plex Mono
    └── textures/               # Paper grain SVG/PNG
```

### 9.2 Rust Crate Structure

```
melodestiny-core/
├── Cargo.toml
├── src/
│   ├── lib.rs                  # WASM entry point
│   ├── analyzer.rs             # Main analysis orchestrator
│   ├── techniques/
│   │   ├── mod.rs
│   │   ├── t01_melodic_math.rs
│   │   ├── t02_chorus_first.rs
│   │   ├── t03_repetition.rs
│   │   ├── t04_mantra_density.rs
│   │   ├── t05_hook_placement.rs
│   │   ├── t06_singability.rs
│   │   ├── t07_line_consistency.rs
│   │   ├── t08_title_brevity.rs
│   │   ├── t09_rhyme_scheme.rs
│   │   ├── t10_section_parity.rs
│   │   ├── t11_vocabulary.rs
│   │   ├── t12_pronoun_density.rs
│   │   ├── t13_post_chorus.rs
│   │   ├── t14_bridge_novelty.rs
│   │   └── t15_structural_advisory.rs
│   ├── syllable.rs             # Syllable counting algorithm
│   ├── rhyme.rs                # Phonetic rhyme detection (CMU dict + fallback)
│   ├── section.rs              # Section detection with auto-partitioning
│   ├── markup.rs               # Markdown markup generation
│   └── types.rs                # Shared types
├── static/
│   ├── word_freq.json          # Top 5000 English words by frequency (Google Books n-gram)
│   └── cmu_dict_subset.json    # ~2000 common words with phonetic transcriptions (CMU Pronouncing Dictionary)
└── tests/
    ├── integration/
    │   └── full_analysis.rs
    └── unit/
        ├── t01.rs
        ├── ...
        ├── t14.rs
        └── t15_structural_advisory.rs
```

---

## 10. Key Algorithms Detail

### 10.1 Syllable Counting

Use the vowel-group method:
1. Convert word to lowercase
2. Count groups of consecutive vowels (a, e, i, o, u, y)
3. Subtract 1 for each trailing 'e' (silent e)
4. Add 1 if word ends in 'le' or 'les' preceded by a consonant
5. Minimum 1 syllable per word

```rust
fn count_syllables(word: &str) -> usize {
    let word = word.to_lowercase();
    let vowels: Vec<char> = "aeiouy".chars().collect();
    let mut count = 0;
    let mut prev_was_vowel = false;

    for ch in word.chars() {
        let is_vowel = vowels.contains(&ch);
        if is_vowel && !prev_was_vowel {
            count += 1;
        }
        prev_was_vowel = is_vowel;
    }

    // Silent e adjustment
    if word.ends_with('e') && count > 1 {
        count -= 1;
    }

    count.max(1)
}
```

### 10.2 Rhyme Detection

Primary approach using CMU Pronouncing Dictionary:
1. Bundle a subset of the CMU Pronouncing Dictionary (~2000 common words) as a static JSON asset
2. Extract last word of each line
3. Look up phonetic transcription in CMU dict (e.g., "love" → "L AH V")
4. Compare final stressed vowel and subsequent phonemes between line-ending words
5. Words rhyme if their phonetic endings match (e.g., "love" / "dove" both end in "AH V")

Fallback (words not in CMU dict):
1. Strip common suffixes (ing, ed, tion, s)
2. Compare last 2-3 characters (vowel-consonant pattern)
3. Words rhyme if their endings match after normalization

The CMU Pronouncing Dictionary subset (~2000 common words) is bundled as a static asset. For words not in the dictionary, the heuristic fallback (suffix matching) is used.

### 10.3 Section Detection

```rust
fn detect_sections(lyrics: &str) -> Vec<Section> {
    // 1. Check for explicit labels (verse, chorus, bridge, etc.)
    // 2. If no labels found, use structural repetition:
    //    - Find repeated line groups (2+ identical lines)
    //    - Mark repeated groups as chorus
    //    - Mark non-repeated groups as verse
    //    - Mark unique group near end (last 25% of lines) as bridge
    // 3. Auto-partitioning fallback: group every 4 lines as a verse-like section
    //    - Set auto_partitioned = true so UI can display the notice to the user
}
```

If auto-partitioning is used, the output includes a flag `auto_partitioned: true` so the frontend can display: "We've auto-detected sections based on line grouping. For more accurate analysis, label your sections (e.g., 'Verse 1:', 'Chorus:', 'Bridge:') in the lyrics."

---

## 11. Performance Requirements

| Metric | Target | Notes |
|---|---|---|
| WASM bundle size | < 2MB gzipped | Includes word frequency data |
| Analysis time | < 200ms | For lyrics up to 500 lines |
| First contentful paint | < 1.5s | On 3G connection |
| Time to interactive | < 3s | WASM loads async |
| Total page weight | < 5MB | Including fonts and textures |

---

## 12. Future Extensions (Out of Scope for v1)

- **LLM-powered techniques** — Layer 2 (12 LLM-required techniques) as a premium feature
- **Audio input** — Upload audio, transcribe to lyrics via Whisper WASM
- **Rhyme suggestions** — Suggest rhyming words for flagged lines
- **Multi-language support** — Extend syllable counter and word lists
- **Collaboration** — Share analysis links
- **History** — Save and compare past analyses
- **Tauri native app** — Wrap for iOS/Android using shared Rust core

---

## 13. Testing Strategy

### 13.1 Unit Tests (Rust)

Each technique module has a `tests/` directory with:
- Known-good lyrics (e.g., "Blank Space" by Taylor Swift) expected to score > 80
- Known-bad lyrics (e.g., random word soup) expected to score < 30
- Edge cases: empty lyrics, single word, no chorus, all chorus

### 13.2 Integration Tests (Rust)

- Full analysis pipeline on 10+ real pop songs
- Verify total score is weighted sum of individual scores
- Verify markup output is valid Markdown

### 13.3 E2E Tests (Frontend)

- Playwright or Cypress
- Input form → analyze → results render → download works
- Mobile viewport tests (375px)
- Desktop viewport tests (1280px) — verify two-column layout
- Annotation popover opens on tap/click
- Keyboard-only navigation test: Tab through all interactive elements, verify focus indicators
- Screen reader test: verify aria-labels, live regions, and dialog roles

### 13.4 Accessibility Tests

- axe-core integration in E2E tests — zero critical/serious violations
- Manual keyboard-only walkthrough on each viewport size
- VoiceOver (macOS) and NVDA (Windows) manual verification
- Color contrast audit against design tokens using Storybook addon
- Reduced motion: verify all animations are disabled when `prefers-reduced-motion: reduce` is active

---

## 14. Deployment

### 14.1 Vercel Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "app/api/**": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)\\.wasm",
      "headers": [
        { "key": "Content-Type", "value": "application/wasm" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 14.2 Build Pipeline

```
1. cargo build --target wasm32-unknown-unknown --release
2. wasm-bindgen --target web --out-dir ./public/wasm ./target/wasm32-unknown-unknown/release/melodestiny_core.wasm
3. npm run build (Next.js)
4. Deploy to Vercel
```

---

## 15. Glossary

| Term | Definition |
|---|---|
| **Hook** | The most memorable, catchy part of a song — usually in the chorus |
| **Pre-chorus** | A transitional section between verse and chorus that builds tension |
| **Post-chorus** | A section immediately after the chorus that repeats a hook fragment |
| **Bridge** | A contrasting section, usually appearing once after the second chorus |
| **Strophic** | A song structure that uses only verses (AAA form) with no chorus or bridge |
| **Mantra** | A phrase repeated so many times it transcends meaning and becomes feeling |
| **Vocables** | Non-lexical syllables like "oh", "ah", "la", "na" |
| **Vowel-group method** | A syllable counting approach that counts groups of consecutive vowels in a word |
| **Auto-partitioning** | Automatic section detection by grouping lines (e.g., every 4 lines) when no explicit labels are provided |
| **Syllable density** | Number of syllables per line |
| **Coefficient of variation (CV)** | Standard deviation divided by mean — measures relative variability |
| **CMU Pronouncing Dictionary** | A phonetic dictionary mapping English words to their phoneme sequences, used for rhyme detection |
| **WASM** | WebAssembly — binary instruction format for stack-based virtual machines |

---

*End of document.*
