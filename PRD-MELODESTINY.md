# Melodestiny — Product Requirements Document

**Version:** 2.0
**Status:** In Development
**Last Updated:** 2026-05-30

---

## 1. Overview

Melodestiny is a web-based song lyric analysis tool that scores pop songs on structural and lyrical quality using **25 algorithmic techniques** derived from the playbooks of the world's most successful pop songwriters. The user inputs a song title and lyrics, presses an analysis button, and receives a weighted score out of 100 with a detailed breakdown, highlighted lyrics showing technique application and improvement opportunities, syllable markers, and a downloadable marked-up copy of the lyrics.

### Key Features (v2.0)
- **25 algorithmic techniques** from 10+ award-winning songwriters
- **Inline annotations** directly on the input lyrics after analysis
- **Syllable counting and markers** showing rhythmic structure
- **Multi-annotation popovers** for lyrics with multiple flags
- **Section detection** with support for square brackets and various label formats
- **Improved rhyme detection** with magic-e and diphthong handling
- **Responsive design** optimized for mobile and desktop

---

## 2. Design Philosophy

### 2.1 Visual Aesthetic

The UI must feel **organic, hand-crafted, antique, yet minimalistic**. Think: a well-loved leather journal in a Victorian songwriter's study. Not cluttered, not loud — warm, textured, and intentional.

**Design Tokens:**

| Token | Value | Notes |
|---|---|---|
| `--color-parchment` | `#F5F0E8` | Main background, warm off-white |
| `--color-ink` | `#2C2418` | Primary text, dark warm brown |
| `--color-sepia` | `#8B7355` | Secondary text, muted brown |
| `--color-gold` | `#C4A265` | Accent, scores, highlights, syllable markers |
| `--color-rust` | `#A0522D` | Warnings, improvement flags |
| `--color-sage` | `#7A8B6F` | Positive indicators, passing scores |
| `--color-cream` | `#FBF8F1` | Card backgrounds |
| `--color-blue-grey` | `#7B8FA1` | Note annotations |
| `--font-display` | `'Playfair Display', serif` | Headings, titles |
| `--font-body` | `'Lora', serif` | Body text, lyrics |
| `--font-mono` | `'IBM Plex Mono', monospace` | Scores, technical labels |
| `--radius-sm` | `4px` | Subtle, not perfectly round |
| `--radius-md` | `8px` | Cards |
| `--radius-lg` | `12px` | Popovers |
| `--shadow-card` | `0 2px 8px rgba(44,36,24,0.08)` | Soft, warm shadow |
| `--shadow-popover` | `0 4px 12px rgba(44,36,24,0.03)` | Subtle popover shadow |
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
- Technique scores grid: 3 columns on mobile, 5 columns on desktop
- Score breakdown table hides weight column on mobile

### 2.3 Animation

All animations must serve a purpose: guiding attention, confirming actions, or smoothing state transitions. No decoration for decoration's sake.

**Timing & Easing:**
- Duration: 150ms–400ms for UI transitions, 600ms–800ms for content reveals
- Easing: `ease-out` for entering elements, `ease-in` for exiting, `ease-in-out` for state changes
- All animations must respect `prefers-reduced-motion` — if the user has reduced motion enabled, transitions are instant (no animation)

### 2.4 Accessibility (A11y)

The app must meet **WCAG 2.1 AA** compliance.

**Key Requirements:**
- All interactive elements reachable via Tab in logical order
- Focus indicators: 2px solid gold (`--color-gold`) outline with 2px offset
- Annotation popovers dismissible via Escape key
- Screen reader support with ARIA labels and live regions
- Color is never the sole indicator — text labels accompany all visual indicators
- Minimum contrast ratio 4.5:1 for body text

---

## 3. Architecture

### 3.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Analysis Engine** | Rust → WebAssembly (WASM) | Performance, portability, runs in browser |
| **Frontend Framework** | Next.js (App Router) | SSR/SSG, Vercel-optimized, React ecosystem |
| **Styling** | Tailwind CSS + CSS Variables | Rapid iteration, design token system |
| **Hosting** | Vercel Hobby Plan (serverless) | Free tier, edge functions, WASM support |

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
│  │  - 25 algorithmic techniques            │ │
│  │  - Scoring & weighting                  │ │
│  │  - Lyric markup generation              │ │
│  │  - Syllable counting                    │ │
│  │  - Rhyme detection                      │ │
│  │  - Section detection                    │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 4. User Flow

The entire app is a **single view**. No navigation, no separate screens.

### 4.1 Input Section

- **Song Title** — Single-line text input, max 200 characters
- **Lyrics Textarea** — Multi-line input, max 10,000 characters
  - Supports section labels in square brackets: `[Verse 1]`, `[Chorus]`, `[Bridge]`
  - Supports section labels with colons: `Verse 1:`, `Chorus:`
  - Blank lines are treated as separators, not lyrics
  - Strips timestamps (`[01:23]`) and chord notation (`[Am]`) before analysis
- **Analyze Button** — Full-width, sticky on mobile, disabled until both fields have content

### 4.2 After Analysis

After analysis, the lyrics area transforms:

1. **View Analysis mode** — Shows lyrics with:
   - Section dividers with gold labels
   - Line numbers
   - Syllable markers (·) at syllable boundaries
   - Syllable count at end of each line
   - Inline annotations (gold = positive, rust = warning, blue-grey = note)
   - Click/tap any annotation to see popover with details

2. **Edit Lyrics mode** — Standard textarea for editing
   - Toggle between modes via "View Analysis" / "Edit Lyrics" button
   - Analysis results remain visible in the sidebar

### 4.3 Results Panel

- **Score Badge** — Wax-seal-style circular badge, number out of 100
- **Technique Scores Card** — 5×3 grid (desktop) or 3×5 grid (mobile) showing all 25 technique scores with progress bars
  - Hover/focus shows tooltip with technique details and author
- **Score Breakdown** — Collapsible table with all 25 techniques
  - Click any row to expand details with description and feedback
- **Download Button** — Exports analysis as Markdown file

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
    pub auto_partitioned: bool,     // true if sections were auto-detected
}

pub struct TechniqueResult {
    pub id: String,                 // e.g., "T01"
    pub name: String,
    pub author: String,
    pub description: String,
    pub raw_score: f64,             // 0-1.0
    pub weight: f64,                // contribution weight
    pub weighted_score: f64,        // raw_score * weight * 100
    pub feedback: String,
    pub flags: Vec<LyricFlag>,
}

pub struct LyricLine {
    pub line_number: usize,
    pub text: String,
    pub annotations: Vec<Annotation>,
}

pub enum FlagType {
    Positive,   // Technique applied well
    Neutral,    // Informational / optional suggestion
    Negative,   // Improvement opportunity
}

pub enum AnnotationType {
    Highlight,  // Gold underline
    Warning,    // Rust underline
    Note,       // Blue-grey dashed underline
}
```

### 5.3 Preprocessing

Before analysis, the engine:
1. Filters out section labels (lines matching section patterns)
2. Filters out blank lines
3. Strips timestamps and chord notation
4. Adjusts section line numbers to account for filtered lines

---

## 6. The 25 Algorithmic Techniques

Each technique produces a raw score from 0.0 to 1.0. The final score is: `sum(raw_score_i * weight_i) * 100`.

### 6.1 Technique Definitions (T01-T15)

#### T01 — Melodic Math (Lyrical Rhythm)
- **Author:** Max Martin
- **Weight:** 0.08
- **Description:** Every syllable has a rhythmic home. Treat the words like a drum pattern.
- **Algorithm:** Count syllables per line, calculate standard deviation within sections, flag lines deviating > 1.5σ from section mean.

#### T02 — Chorus-First Structural Check
- **Author:** Max Martin
- **Weight:** 0.072
- **Description:** The chorus IS the song. It should appear early and be the most repeated element.
- **Algorithm:** Measure chorus position as % of song length, count chorus occurrences, verify chorus is most repeated section.

#### T03 — Repetition Detection & Variation
- **Author:** Max Martin / Jack Antonoff
- **Weight:** 0.064
- **Description:** Repeat hooks relentlessly but change ONE element each time.
- **Algorithm:** Find most repeated phrase (3+ words), count occurrences, measure contextual variation between occurrences.

#### T04 — Mantra Density
- **Author:** Jack Antonoff
- **Weight:** 0.048
- **Description:** Repeat a phrase until it transforms from words into feeling.
- **Algorithm:** Find repeated phrases (2+ words, 3+ occurrences), calculate mantra density (repeated phrase occurrences / total lines). Ideal: 0.3-0.6.

#### T05 — Hook/Title Structural Placement
- **Author:** Diane Warren
- **Weight:** 0.08
- **Description:** The title phrase should appear in the chorus, ideally at the start or end.
- **Algorithm:** Search for title in lyrics, score based on position (chorus = +0.4, start/end = +0.3, multiple = +0.2, final chorus = +0.1).

#### T06 — Singability Metrics
- **Author:** Max Martin
- **Weight:** 0.056
- **Description:** If you can't sing it a cappella walking down the street, rewrite it.
- **Algorithm:** Calculate consonant cluster density per line, flag lines with density > 0.6.

#### T07 — Line Length Consistency
- **Author:** Max Martin
- **Weight:** 0.048
- **Description:** Parallel lines within a section should have similar syllable counts.
- **Algorithm:** Calculate coefficient of variation (CV) of syllable counts within each section. Ideal CV: < 0.25.

#### T08 — Title Brevity
- **Author:** Diane Warren
- **Weight:** 0.032
- **Description:** The best titles are 2-4 words.
- **Algorithm:** Count words in title, score via lookup table (2-4 words = 1.0, 1 = 0.7, 5 = 0.5, 6+ = 0.3).

#### T09 — Rhyme Scheme Consistency
- **Author:** Max Martin / Diane Warren
- **Weight:** 0.064
- **Description:** Pop hits use predictable rhyme patterns (AABB, ABAB, ABCB) within sections.
- **Algorithm:** Extract last words, detect rhymes (CMU dict + heuristic), identify pattern, score consistency.

#### T10 — Section Length Parity
- **Author:** Max Martin
- **Weight:** 0.04
- **Description:** Verses and choruses should be similar in length for rhythmic predictability.
- **Algorithm:** Calculate ratio of avg verse length to avg chorus length. Ideal: 0.8-1.2.

#### T11 — Vocabulary Simplicity
- **Author:** Diane Warren / Julia Michaels
- **Weight:** 0.048
- **Description:** Hit songwriters use simple, common English words.
- **Algorithm:** Score words against frequency list (top 5000), penalize words with > 4 syllables.

#### T12 — Direct Address Pronoun Density
- **Author:** Diane Warren / Julia Michaels
- **Weight:** 0.056
- **Description:** "I" and "you" create direct emotional connection.
- **Algorithm:** Count first/second person pronouns, calculate density. Ideal: 8-18% of words.

#### T13 — Post-Chorus Hook Fragment Detection
- **Author:** Pharrell Williams / Ed Sheeran
- **Weight:** 0.04
- **Description:** Modern pop repeats short hook fragments after the chorus ends.
- **Algorithm:** Check 1-3 lines after each chorus for repeated short phrases or vocables.

#### T14 — Bridge Vocabulary Novelty
- **Author:** Jack Antonoff / Max Martin
- **Weight:** 0.032
- **Description:** The bridge should introduce new lyrical content to create contrast.
- **Algorithm:** Calculate % of bridge words not appearing in verses/chorus. Ideal: > 40%.

#### T15 — Structural Advisory
- **Author:** Max Martin / Jack Antonoff / Diane Warren
- **Weight:** 0.04
- **Description:** Evaluate overall section structure completeness.
- **Algorithm:** Check for missing elements (bridge, pre-chorus), consecutive verses, ending on chorus, reasonable length (5-7 sections).

### 6.2 New Technique Definitions (T16-T25)

#### T16 — Emotional Arc Progression
- **Author:** Max Martin / Julia Michaels
- **Weight:** 0.033
- **Description:** Great pop songs build emotional energy from verse to chorus.
- **Algorithm:** Count "energy words" per section, verify chorus energy > verse energy.

#### T17 — Concrete Imagery Density
- **Author:** Julia Michaels / Diane Warren
- **Weight:** 0.04
- **Description:** Hit songs paint pictures with concrete nouns and sensory details.
- **Algorithm:** Count concrete nouns (heart, door, rain) vs abstract (love, time, feeling). Ideal: 10-25% concrete.

#### T18 — Tense Consistency
- **Author:** Diane Warren
- **Weight:** 0.027
- **Description:** Most pop songs stay in one tense. Switching tenses confuses the listener.
- **Algorithm:** Detect verb tenses, calculate consistency score. Ideal: 80%+ same tense.

#### T19 — Section Contrast Score
- **Author:** Jack Antonoff
- **Weight:** 0.033
- **Description:** Verses and choruses should feel distinctly different.
- **Algorithm:** Calculate Jaccard similarity between verse and chorus word sets. Ideal: < 30% overlap.

#### T20 — Conversational Flow
- **Author:** Pharrell Williams / Julia Michaels
- **Weight:** 0.027
- **Description:** Modern pop feels like a conversation. Lines should respond to each other naturally.
- **Algorithm:** Count contractions and casual words, check for question-answer patterns.

#### T21 — First Line Hook
- **Author:** Ryan Tedder
- **Weight:** 0.033
- **Description:** The first line should grab attention immediately — no slow buildups.
- **Algorithm:** Check for questions, direct address, concrete imagery, penalize generic openers.

#### T22 — Raw Emotion Words
- **Author:** Sia
- **Weight:** 0.04
- **Description:** Sia uses visceral, body-focused language — bones breaking, lungs collapsing.
- **Algorithm:** Count body words (heart, bone, skin) and sensation words (burning, aching, breaking).

#### T23 — Melodic Simplicity Score
- **Author:** Benny Blanco
- **Weight:** 0.027
- **Description:** The best melodies can be sung by a child. Simple syllable patterns.
- **Algorithm:** Count unique syllable patterns per section, fewer unique patterns = simpler = better.

#### T24 — Narrative Specificity
- **Author:** Ilsey Juber
- **Weight:** 0.033
- **Description:** Specific details make songs feel lived-in — street names, times, colors, seasons.
- **Algorithm:** Count specific details (colors, times, places) vs vague words (things, somewhere, somehow).

#### T25 — Tension and Release
- **Author:** Linda Perry
- **Weight:** 0.033
- **Description:** Build tension in verses and release it in choruses through word choice and line length.
- **Algorithm:** Measure tension words in verses, release words in choruses, score contrast.

### 6.3 Weight Summary

| ID | Technique | Author | Weight |
|---|---|---|---|
| T01 | Melodic Math | Max Martin | 0.080 |
| T02 | Chorus-First | Max Martin | 0.072 |
| T03 | Repetition | Max Martin / Jack Antonoff | 0.064 |
| T04 | Mantra Density | Jack Antonoff | 0.048 |
| T05 | Hook Placement | Diane Warren | 0.080 |
| T06 | Singability | Max Martin | 0.056 |
| T07 | Line Consistency | Max Martin | 0.048 |
| T08 | Title Brevity | Diane Warren | 0.032 |
| T09 | Rhyme Scheme | Max Martin / Diane Warren | 0.064 |
| T10 | Section Parity | Max Martin | 0.040 |
| T11 | Vocabulary | Diane Warren / Julia Michaels | 0.048 |
| T12 | Pronoun Density | Diane Warren / Julia Michaels | 0.056 |
| T13 | Post-Chorus | Pharrell Williams / Ed Sheeran | 0.040 |
| T14 | Bridge Novelty | Jack Antonoff / Max Martin | 0.032 |
| T15 | Structural Advisory | Max Martin / Jack Antonoff / Diane Warren | 0.040 |
| T16 | Emotional Arc | Max Martin / Julia Michaels | 0.033 |
| T17 | Concrete Imagery | Julia Michaels / Diane Warren | 0.040 |
| T18 | Tense Consistency | Diane Warren | 0.027 |
| T19 | Section Contrast | Jack Antonoff | 0.033 |
| T20 | Conversational Flow | Pharrell Williams / Julia Michaels | 0.027 |
| T21 | First Line Hook | Ryan Tedder | 0.033 |
| T22 | Raw Emotion | Sia | 0.040 |
| T23 | Melodic Simplicity | Benny Blanco | 0.027 |
| T24 | Narrative Specificity | Ilsey Juber | 0.033 |
| T25 | Tension & Release | Linda Perry | 0.033 |
| | **Total** | | **1.000** |

### 6.4 Score Ranges

| Range | Label | Description |
|---|---|---|
| 90-100 | "Hit Potential" | Exceptional structural and lyrical quality |
| 75-89 | "Strong Foundation" | Solid songwriting with minor refinements possible |
| 60-74 | "Good Bones" | Core ideas are there, several areas for improvement |
| 45-59 | "Work in Progress" | Significant structural or lyrical issues |
| 0-44 | "Back to the Drawing Board" | Fundamental rethinking needed |

---

## 7. Highlighted Lyrics & Annotations

### 7.1 Annotation Types

| Type | Visual Style | Color |
|---|---|---|
| **Highlight** (Positive) | Solid underline | Gold (#C4A265) |
| **Warning** (Negative) | Solid underline (thicker) | Rust (#A0522D) |
| **Note** (Neutral) | Dashed underline | Blue-grey (#7B8FA1) |

### 7.2 Multi-Annotation Support

When a text segment has multiple annotations:
- Text appears only once (no duplication)
- Clicking shows a popover listing all annotations
- Popover header shows count (e.g., "3 Notes")
- Each annotation listed with type badge, technique name, author, and message

### 7.3 Section Detection

Sections are detected from lyrics using:
- **Square brackets:** `[Verse 1]`, `[Chorus]`, `[Bridge]`
- **Colons:** `Verse 1:`, `Chorus:`
- **Keywords:** verse, chorus, bridge, pre-chorus, post-chorus, intro, outro, hook, interlude, refrain, break, solo, instrumental

Section labels are filtered out before analysis and displayed as visual dividers in the lyrics view.

### 7.4 Syllable Display

Each line shows:
- **Syllable markers** (·) at syllable boundaries (excluding the first syllable)
- **Syllable count** at the end of the line (e.g., "8s")

Syllable detection handles:
- Vowel groups (consecutive vowels = one syllable)
- Silent -e (magic e pattern)
- Silent -ed (after consonants other than t/d)
- Consonant + le endings

---

## 8. Key Algorithms

### 8.1 Syllable Counting

Vowel-group method with special handling:
1. Count groups of consecutive vowels (a, e, i, o, u, y)
2. Handle magic-e pattern (consonant-vowel-consonant-e)
3. Handle silent -ed (after consonants other than t/d)
4. Handle consonant + le endings
5. Minimum 1 syllable per word

### 8.2 Rhyme Detection

**Primary:** CMU Pronouncing Dictionary (~2000 common words)
- Compare final stressed vowel and subsequent phonemes

**Fallback:** Heuristic suffix matching
- Vowel ending detection
- Common rhyme patterns (ee/e, ea/e, ow/o, etc.)

### 8.3 Syllable Splitting

For syllable markers:
1. Identify vowel groups (consecutive vowels = one nucleus)
2. Handle silent-e and silent-ed endings
3. Apply onset principle (single consonant goes with following syllable)
4. Multiple consonants split after first consonant

---

## 9. Component Structure

### 9.1 Frontend Components

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, global styles
│   └── page.tsx                # Main page with responsive layout
├── components/
│   ├── AnnotatedTextarea.tsx   # Combined lyrics input + annotation display
│   ├── ScoreBadge.tsx          # Wax-seal score display
│   ├── TechniqueScoresCard.tsx # 25-technique grid with tooltips
│   ├── ScoreBreakdown.tsx      # Collapsible technique table
│   ├── MultiAnnotationPopover.tsx  # Popover for multiple annotations
│   ├── AnnotationPopover.tsx   # Single annotation popover
│   ├── DownloadButton.tsx      # Export analysis
│   └── EmptyState.tsx          # Placeholder
├── lib/
│   ├── wasm-loader.ts          # WASM module loader
│   ├── types.ts                # TypeScript types
│   ├── section-detector.ts     # Section detection
│   └── syllable.ts             # Frontend syllable counting
└── styles/
    └── globals.css             # Design tokens
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
│   │   ├── ... (25 technique files)
│   │   └── t25_tension_release.rs
│   ├── syllable.rs             # Syllable counting
│   ├── rhyme.rs                # Rhyme detection
│   ├── section.rs              # Section detection
│   ├── markup.rs               # Markdown generation
│   └── types.rs                # Shared types
└── tests/
    └── unit/                   # Unit tests for each technique
```

---

## 10. Performance Requirements

| Metric | Target | Notes |
|---|---|---|
| WASM bundle size | < 2MB gzipped | Includes word frequency data |
| Analysis time | < 200ms | For lyrics up to 500 lines |
| First contentful paint | < 1.5s | On 3G connection |
| Time to interactive | < 3s | WASM loads async |
| Total page weight | < 5MB | Including fonts and textures |

---

## 11. Glossary

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
| **Magic e** | Pattern where final -e makes preceding vowel long (e.g., "rate", "time") |
| **Onset principle** | Consonants before a vowel belong to the following syllable |
| **Coefficient of variation (CV)** | Standard deviation divided by mean — measures relative variability |
| **CMU Pronouncing Dictionary** | A phonetic dictionary mapping English words to their phoneme sequences |
| **WASM** | WebAssembly — binary instruction format for stack-based virtual machines |

---

*End of document — Version 2.0*
