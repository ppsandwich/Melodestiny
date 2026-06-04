# Melodestiny Songwriting Skill Guide (Score Optimization Playbook)

This songwriting blueprint outlines all **35 songwriting evaluation techniques** implemented in the Melodestiny analysis engine. By adhering to the constraints and styling rules documented below, you can engineer lyrics that achieve a perfect **100/100** score.

---

## The Scoring Architecture

The Melodestiny grading engine calculates a **weighted average** of the active techniques:
$$\text{Total Score} = \frac{\sum (\text{Raw Score}_i \times \text{Weight}_i)}{\sum \text{Weight}_i} \times 100$$

### Feature Grouping (Mutual Exclusion)
To prevent conflicting metrics from penalizing different songwriting styles, the engine classifies certain techniques into 5 groups. Within each group, only the technique that scores the **highest** is marked active; other inactive techniques do not penalize the overall average:
1. **`repetition_dynamics`**: `T03` (Repetition) vs. `T04` (Mantra Density)
2. **`melodic_complexity`**: `T07` (Line Length) vs. `T23` (Melodic Simplicity) vs. `T34` (Syllable Gradient)
3. **`vocabulary_style`**: `T11` (Vocabulary Simplicity) vs. `T22` (Raw Emotion Words)
4. **`structural_resolution`**: `T15` (Structural Advisory) vs. `T26` (Lyrical Bookends)
5. **`narrative_continuity`**: `T18` (Tense Consistency) vs. `T35` (Pronominal Shift)

---

## Detailed Technique Playbook

### T01: Melodic Math (Lyrical Rhythm)
* **Author**: Max Martin
* **Weight**: 0.080
* **Group**: None
* **Description**: Every syllable has a rhythmic home. Treat the words like a drum pattern.
* **Scoring Logic**: Computes average syllable count within each section. Penalizes lines that deviate by more than $1.5\sigma$ from the section average.
* **How to Optimize**: Ensure all lines within a single section have nearly identical syllable counts (e.g., all verse lines are exactly 8 syllables; all chorus lines are exactly 6 syllables).

### T02: Chorus-First Structural Check
* **Author**: Max Martin
* **Weight**: 0.072
* **Group**: None
* **Description**: The chorus IS the song. It should appear early and be the most repeated element.
* **Scoring Logic**: Verifies that the `[Chorus]` section appears before the 3rd section (ideally right after Verse 1) and repeats at least twice.
* **How to Optimize**: Place your `[Chorus]` early and repeat it.

### T03: Repetition Detection
* **Author**: Max Martin / Jack Antonoff
* **Weight**: 0.064
* **Group**: `repetition_dynamics`
* **Description**: Repeat hooks relentlessly but change ONE element each time.
* **Scoring Logic**: Scans for exact line repetitions. High raw score if a line repeats 3 or more times.
* **How to Optimize**: Repeat your hook line in the Chorus/Post-Chorus at least 3-4 times.

### T04: Mantra Density
* **Author**: Jack Antonoff
* **Weight**: 0.048
* **Group**: `repetition_dynamics`
* **Description**: Repeat a phrase until it transforms from words into feeling.
* **Scoring Logic**: Checks ratio of repeated lines. The sweet spot is 30% to 60% of all lines being repetitions.
* **How to Optimize**: Balance repetitions. Make sure roughly 40% of the lines in the song are repeating hooks.

### T05: Hook/Title Structural Placement
* **Author**: Diane Warren
* **Weight**: 0.080
* **Group**: None
* **Description**: The title phrase should appear in the chorus, ideally at the start or end.
* **Scoring Logic**: Checks if the exact song title occurs in the `[Chorus]` section. Perfect score if it is the first or last line of the Chorus.
* **How to Optimize**: Place the song title as the first and/or last line of the `[Chorus]`.

### T06: Singability Metrics
* **Author**: Max Martin
* **Weight**: 0.056
* **Group**: None
* **Description**: If you can't sing it a cappella walking down the street, rewrite it.
* **Scoring Logic**: Analyzes the ratio of hard consonant clusters to open vowel sounds.
* **How to Optimize**: Use fluid, open words (e.g., "you", "go", "away", "night", "sky", "free"). Avoid consonant-heavy words (e.g., "strengths", "crisps", "promptly").

### T07: Line Length Consistency
* **Author**: Max Martin
* **Weight**: 0.048
* **Group**: `melodic_complexity`
* **Description**: Parallel lines within a section should have similar syllable counts.
* **Scoring Logic**: Evaluates the Coefficient of Variation (CV) of syllable counts within sections. Perfect score if CV is $\le 0.25$.
* **How to Optimize**: Keep parallel lines identical in syllable lengths (e.g., AABB lines have counts 8, 8, 8, 8).

### T08: Title Brevity
* **Author**: Diane Warren
* **Weight**: 0.032
* **Group**: None
* **Description**: The best titles are 2-4 words.
* **Scoring Logic**: Returns 1.0 if title is 2-4 words; 0.7 for 1 word; 0.5 for 5 words; 0.3 for $\ge 6$ words.
* **How to Optimize**: Limit your song title to exactly 2, 3, or 4 words.

### T09: Rhyme Scheme Consistency
* **Author**: Max Martin
* **Weight**: 0.048
* **Group**: None
* **Description**: Consistency in rhyme scheme creates a subconscious blueprint for the listener.
* **Scoring Logic**: Compares line endings in sections. Rewards traditional patterns (AABB, ABAB, AAAA).
* **How to Optimize**: Maintain clear, structured rhyme schemes throughout (e.g., standard AABB/ABAB). Use clear, easy-to-rhyme word endings.

### T10: Section Length Parity
* **Author**: Max Martin
* **Weight**: 0.040
* **Group**: None
* **Description**: Verses and choruses should be similar in length for rhythmic predictability.
* **Scoring Logic**: Matches lengths of sections of the same category (e.g., Verse 1 vs. Verse 2).
* **How to Optimize**: Ensure `[Verse 1]` and `[Verse 2]` have the exact same number of lines.

### T11: Vocabulary Simplicity
* **Author**: Diane Warren / Julia Michaels
* **Weight**: 0.048
* **Group**: `vocabulary_style`
* **Description**: Hit songwriters use simple, common English words.
* **Scoring Logic**: Penalizes complex, multi-syllabic words ($> 2$ syllables) or rare vocab.
* **How to Optimize**: Restrict the lyrics to common, everyday emotional vocabulary.

### T12: Direct Address Pronoun Density
* **Author**: Diane Warren / Julia Michaels
* **Weight**: 0.056
* **Group**: None
* **Description**: Speak directly to the listener using relational pronouns.
* **Scoring Logic**: Targets a pronoun density (I, you, me, my, we, us, your) between 8% and 18% of total words.
* **How to Optimize**: Direct the narrative to "you" and refer to "I" or "we" frequently.

### T13: Post-Chorus Hook Fragment
* **Author**: Max Martin / Ian Kirkpatrick
* **Weight**: 0.040
* **Group**: None
* **Description**: The biggest songs feature a short, instrumental-driven post-chorus hook.
* **Scoring Logic**: Scans for a `[Post-Chorus]` section containing short, repetitive hooks.
* **How to Optimize**: Always include a `[Post-Chorus]` immediately following each `[Chorus]`.

### T14: Bridge Vocabulary Novelty
* **Author**: Jack Antonoff / Max Martin
* **Weight**: 0.032
* **Group**: None
* **Description**: The bridge should introduce new lyrical content to create contrast.
* **Scoring Logic**: Evaluates the ratio of new words in the `[Bridge]` that haven't appeared previously. Target is $\ge 40\%$ novelty.
* **How to Optimize**: Use entirely new metaphors, nouns, and verbs in the `[Bridge]` section.

### T15: Structural Advisory
* **Author**: Max Martin / Diane Warren
* **Weight**: 0.040
* **Group**: `structural_resolution`
* **Description**: Evaluate overall section structure completeness.
* **Scoring Logic**: Looks for standard pop structures: Verses, Choruses, and a Bridge.
* **How to Optimize**: Format the song explicitly as: Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus.

### T16: Emotional Arc Progression
* **Author**: Max Martin / Julia Michaels
* **Weight**: 0.033
* **Group**: None
* **Description**: Great pop songs build emotional energy from verse to chorus.
* **Scoring Logic**: Checks if the `[Chorus]` contains higher emotional and high-arousal word density than the `[Verse]`.
* **How to Optimize**: Use stronger, high-arousal emotional words in the Chorus compared to Verses.

### T17: Concrete Imagery Density
* **Author**: Julia Michaels / Diane Warren
* **Weight**: 0.040
* **Group**: None
* **Description**: Hit songs paint pictures with concrete nouns and sensory details.
* **Scoring Logic**: Checks for concrete nouns/sensory terms. Target density is 10% to 25%.
* **How to Optimize**: Ground the verses with concrete objects (e.g., "cup", "car", "door", "coffee", "clock").

### T18: Tense Consistency
* **Author**: Diane Warren
* **Weight**: 0.027
* **Group**: `narrative_continuity`
* **Description**: Most pop songs stay in one tense. Switching tenses confuses the listener.
* **Scoring Logic**: Measures the dominance of a single grammatical tense. Perfect score if consistency is $\ge 80\%$.
* **How to Optimize**: Write the entire song in a single tense (present or past).

### T19: Section Contrast Score
* **Author**: Jack Antonoff
* **Weight**: 0.033
* **Group**: None
* **Description**: Verses and choruses should feel distinctly different.
* **Scoring Logic**: Measures vocabulary similarity (Jaccard) between Verses and Choruses. Score is 1.0 if similarity is $< 30\%$.
* **How to Optimize**: Use different verbs, nouns, and rhymes in the Choruses compared to the Verses.

### T20: Conversational Flow
* **Author**: Pharrell Williams / Julia Michaels
* **Weight**: 0.027
* **Group**: None
* **Description**: Modern pop feels like a conversation. Lines should respond to each other naturally.
* **Scoring Logic**: Looks for conversational cues (e.g., "oh", "yeah", "hey", question marks, etc.).
* **How to Optimize**: Sprinkle conversational ad-libs and question/answers throughout the verses.

### T21: First Line Hook
* **Author**: Ryan Tedder
* **Weight**: 0.033
* **Group**: None
* **Description**: The first line should grab attention immediately — no slow buildups.
* **Scoring Logic**: Evaluates the very first line of the song for emotional arousal, short length, or concrete imagery.
* **How to Optimize**: Start the song with a punchy, visual, or highly emotional opening sentence.

### T22: Raw Emotion Words
* **Author**: Sia
* **Weight**: 0.040
* **Group**: `vocabulary_style`
* **Description**: Sia uses visceral, body-focused language — bones breaking, lungs collapsing.
* **Scoring Logic**: Counts body-focused raw emotion words. Target is $\ge 3$ words.
* **How to Optimize**: Add visceral terms like "bones", "lungs", "blood", "skin", "screaming", "crying".

### T23: Melodic Simplicity Score
* **Author**: Max Martin
* **Weight**: 0.040
* **Group**: `melodic_complexity`
* **Description**: Keep melodies incredibly simple. 4-8 syllables per line is the sweet spot.
* **Scoring Logic**: Measures ratio of lines with 4 to 8 syllables. Target is $\ge 60\%$.
* **How to Optimize**: Write the majority of lines with exactly 4 to 8 syllables.

### T24: Narrative Specificity
* **Author**: Ilsey Juber
* **Weight**: 0.033
* **Group**: None
* **Description**: Specific details make songs feel lived-in — street names, times, colors, seasons.
* **Scoring Logic**: Counts specific nouns (proper nouns, days, hours, months, specific numbers).
* **How to Optimize**: Use concrete details like "Friday", "2 AM", "green eyes", "December".

### T25: Tension and Release
* **Author**: Max Martin / Savan Kotecha
* **Weight**: 0.033
* **Group**: None
* **Description**: Alternate between fast, wordy phrases and long, held notes to build tension.
* **Scoring Logic**: Checks for alternating line lengths within sections (e.g. 10 syllables followed by 5 syllables).
* **How to Optimize**: Alternate long, descriptive lines with short, spacious release lines.

### T26: Lyrical Bookends
* **Author**: Taylor Swift / Paul McCartney
* **Weight**: 0.035
* **Group**: `structural_resolution`
* **Description**: The song begins and ends with matching or slightly subverted lyrical motifs.
* **Scoring Logic**: Compares vocabulary overlap between the first line of the song and the last line of the song.
* **How to Optimize**: Make the first line of Verse 1 and the last line of the Outro (or last Chorus) identical or highly similar.

### T27: Phonetic Alliteration & Assonance
* **Author**: Paul Simon
* **Weight**: 0.045
* **Group**: None
* **Description**: Enhances lyrical flow and memorability using adjacent repeating consonant or vowel sounds.
* **Scoring Logic**: Checks for consonant (alliteration) and vowel (assonance) repetitions in close proximity.
* **How to Optimize**: Compose phonetically rich lines (e.g., "cold clay coffee cup" or "midnight light shines bright").

### T28: Line-Ending Phonetic Texture
* **Author**: Max Martin
* **Weight**: 0.035
* **Group**: None
* **Description**: Balances open vowel endings (legato) with stop consonant endings (staccato) to shape vocal energy.
* **Scoring Logic**: Scans phonetic endings of lines to ensure a mix of open vowels (a, e, i, o, u sounds) and hard stops (t, d, k, p, etc.).
* **How to Optimize**: End some lines on soft legato sounds and others on hard staccato sounds.

### T29: Lexical Variety Index
* **Author**: Lorde / Jack Antonoff
* **Weight**: 0.040
* **Group**: None
* **Description**: Measures repetition balance. Pop choruses should be repetitive, while verses should be lexically varied.
* **Scoring Logic**: Type-Token Ratio (TTR) check. The Chorus should have a lower TTR (highly repetitive), while the Verses should have a high TTR (diverse vocabulary).
* **How to Optimize**: Keep Chorus lyrics simple and repeated, but use a wide vocabulary pool in the Verses.

### T30: Title Phonetic Catchiness
* **Author**: Diane Warren / Max Martin
* **Weight**: 0.030
* **Group**: None
* **Description**: Song titles are easier to memorize if they use alliteration, assonance, or rhyme.
* **Scoring Logic**: Evaluates the title string for phonetic features like alliteration, rhyme, or repeating vowel sounds.
* **How to Optimize**: Choose a title like "Silver Shiver", "Doubt Out", "Back to Black".

### T31: Parenthetical Backing Vocal Density
* **Author**: Jack Antonoff
* **Weight**: 0.035
* **Group**: None
* **Description**: Backing vocals and ad-libs in parentheses add thickness and call-and-response dynamics to hooks.
* **Scoring Logic**: Scans for the density of bracketed/parenthetical lines (e.g., "(yeah)").
* **How to Optimize**: Add 1-2 backing vocal calls in parentheses in the Chorus and Outro.

### T32: Enjambment vs. End-Stopped Pacing
* **Author**: Olivia Rodrigo
* **Weight**: 0.030
* **Group**: None
* **Description**: Measures run-on thoughts (enjambment) versus complete punctuated lines (end-stopped).
* **Scoring Logic**: Measures the balance of punctuated line endings vs. unpunctuated run-on sentences.
* **How to Optimize**: End some lines with periods/commas, and leave others running on to the next line with no punctuation.

### T33: Title Framing
* **Author**: Julia Michaels
* **Weight**: 0.030
* **Group**: None
* **Description**: The song title should be framed by high-emotion or sensory words immediately preceding or following it.
* **Scoring Logic**: Checks for emotional/sensory words surrounding instances of the title.
* **How to Optimize**: Precede or follow the title with terms like "crying", "cold", "burning", "touch", "lost".

### T34: Syllable Gradient
* **Author**: Benny Blanco / Ryan Tedder
* **Weight**: 0.040
* **Group**: `melodic_complexity`
* **Description**: Pop songs build energy by shifting pacing (average syllables per line) between verses and choruses.
* **Scoring Logic**: Computes average syllables per line in Verses vs. Choruses. High score if Chorus lines are significantly shorter or longer than Verses.
* **How to Optimize**: Make Verses wordy (e.g. 10 syllables per line) and the Chorus spacious (e.g. 5 syllables per line).

### T35: Narrative Pronominal Shift
* **Author**: Taylor Swift / Olivia Rodrigo
* **Weight**: 0.040
* **Group**: `narrative_continuity`
* **Description**: Tracks narrative relationship progression by shifting pronouns (e.g. from 'I/you' to 'we') across sections.
* **Scoring Logic**: Looks for pronoun usage shifts between the Verses and the Chorus/Bridge.
* **How to Optimize**: Use "I/You" in the Verses, and shift to "We/Our" in the Chorus and Bridge to show relationship progression.
