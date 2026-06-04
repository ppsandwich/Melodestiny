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

### T36: Time-Oriented Narrative Anchors
* **Author**: Taylor Swift / Bruce Springsteen
* **Weight**: 0.030
* **Group**: None
* **Description**: Placing temporal anchors (e.g. morning, midnight, summer, 2 AM, years, seasons) grounds the listener's timeline.
* **Scoring Logic**: Scans lyrics for temporal/time terms. High score if at least 2 distinct temporal anchors are present in the song.
* **How to Optimize**: Sprinkle at least two specific time/date references in your verses (e.g., "summer night", "2 AM", "December").

### T37: Sensory Plurality (Visual, Auditory, Tactile)
* **Author**: Joni Mitchell / Lorde
* **Weight**: 0.035
* **Group**: None
* **Description**: Engaging multiple senses (sound, touch, sight, taste, smell) makes the lyrical world feel three-dimensional.
* **Scoring Logic**: Evaluates word choices in Sight, Sound, Touch, and Taste/Smell categories. High score if at least 3 distinct senses are represented.
* **How to Optimize**: Combine visual cues ("neon glow"), auditory words ("quiet scream"), and tactile descriptions ("cold skin") inside your song.

### T38: Climax/Outro Syllabic Release
* **Author**: Billie Eilish / Finneas
* **Weight**: 0.030
* **Group**: None
* **Description**: The Outro or final section should have shorter, more spacious lines to resolve the song's energy.
* **Scoring Logic**: Compares the average syllable count of the Outro lines to the average syllable count of the rest of the song. Target is a drop of 20% or more.
* **How to Optimize**: Make the lines in your `[Outro]` section significantly shorter (e.g., 3-5 syllables) compared to your verses.

### T39: Title Repetition Quotient
* **Author**: Max Martin / Ryan Tedder
* **Weight**: 0.040
* **Group**: None
* **Description**: A commercial hook needs its title repeated enough times to stick, but not so much that it becomes annoying.
* **Scoring Logic**: Counts occurrences of the exact song title. Perfect score if it is repeated 4 to 10 times.
* **How to Optimize**: Place the song title inside your choruses so that it repeats between 4 and 10 times across the entire track.

### T40: Pre-Chorus Transition Pacing
* **Author**: Max Martin / Shellback
* **Weight**: 0.035
* **Group**: None
* **Description**: The Pre-Chorus builds anticipation by accelerating the lyrical density (more syllables per line) before the Chorus explodes.
* **Scoring Logic**: Evaluates if the average syllable count per line in the Pre-Chorus is at least 15% higher than the preceding Verse.
* **How to Optimize**: Write Pre-Chorus lines with higher syllable density (faster, wordier rhythm) than the preceding verse lines.

### T41: Thematic Word Clustering (Metaphor Coherence)
* **Author**: Leonard Cohen / Bob Dylan
* **Weight**: 0.030
* **Group**: None
* **Description**: A strong song sticks to a central semantic domain (e.g., weather, ocean/water, fire, war, space) rather than mixing metaphors.
* **Scoring Logic**: Checks for matching words in 4 domains: Water, Fire, Space, and Battle. High score if a dominant domain has at least 3 distinct terms.
* **How to Optimize**: Select a conceptual domain (e.g., water) and use multiple related terms (like "ocean", "drown", "tide", "storm") throughout the lyrics.

### T42: Action Verb Density
* **Author**: Mick Jagger / Keith Richards
* **Weight**: 0.030
* **Group**: None
* **Description**: Keep the narrative moving forward by using active verbs rather than passive descriptions or linking verbs (is, was).
* **Scoring Logic**: Compares count of action verbs (run, drive, break) to linking verbs (is, was, were). Perfect score if the action verb ratio is at least 2:1.
* **How to Optimize**: Replace passive expressions ("I was sad") with active verbs ("I cried and broke the glass").

### T43: Interrogative Hooks (Curiosity Loops)
* **Author**: John Mayer / Julia Michaels
* **Weight**: 0.025
* **Group**: None
* **Description**: Scatter questions throughout the verses or bridge to engage the listener in the song's internal conflict.
* **Scoring Logic**: Counts lines containing question marks or starting with interrogatives. Perfect score if there are 2 to 5 question lines.
* **How to Optimize**: Pose questions to the listener or the subject ("Why did you leave?", "What do we do now?") within the verses.

### T44: Rhetorical Contrast (Antithesis)
* **Author**: Paul McCartney / Bernie Taupin
* **Weight**: 0.030
* **Group**: None
* **Description**: Juxtapose opposing ideas (e.g. love/hate, light/dark, cold/fire, win/lose) to create lyrical friction.
* **Scoring Logic**: Checks for pairs of contrasting words in close proximity. High score if at least 2 contrasting pairs are present.
* **How to Optimize**: Frame conflicts with contrasting terms in the same section ("frozen fire", "winning is losing", "hello and goodbye").

### T45: Syllabic Syncopation (Odd-Numbered Lines)
* **Author**: Pharrell Williams
* **Weight**: 0.025
* **Group**: None
* **Description**: Create rhythmic groove by utilizing lines with odd syllable counts (e.g., 7 or 9 syllables) which naturally feel syncopated.
* **Scoring Logic**: Measures the percentage of lines in the Chorus/Hook that have odd syllable counts. Sweet spot is 40% to 70%.
* **How to Optimize**: Ensure that roughly half of the lines in your Chorus section contain an odd number of syllables.

### T46: Pronoun-to-Noun Ratio
* **Author**: Ed Sheeran
* **Weight**: 0.025
* **Group**: None
* **Description**: Relatable storytelling balances personal pronouns (I, you) with real-world nouns.
* **Scoring Logic**: Measures the total pronoun density (I, you, he, she, we, they, etc.) against total words. Target is 8% to 15%.
* **How to Optimize**: Keep pronouns common but ground them with specific nouns (don't write "I went to it," write "I walked to the house").

### T47: Rhyme Density (Internal Rhyming)
* **Author**: Lin-Manuel Miranda / Eminem
* **Weight**: 0.040
* **Group**: None
* **Description**: Rhymes shouldn't just be at the end of lines. Internal rhymes within a line create a dense, satisfying flow.
* **Scoring Logic**: Scans for rhyming words *within* single lines or adjacent lines (excluding the end words). Perfect score if internal rhymes occur in >= 3 lines.
* **How to Optimize**: Add matching sounds within lines ("a bright light in the night", "we play every day").

### T48: Lyrical Space (Syllable Valley)
* **Author**: Adele / Greg Kurstin
* **Weight**: 0.030
* **Group**: None
* **Description**: A wordy verse should be followed by a spacious, slow-moving Pre-Chorus or Chorus to give the listener breathing room.
* **Scoring Logic**: Checks for a middle section where the average syllable count per line drops by 40% or more compared to neighboring sections.
* **How to Optimize**: Write a wordy, fast verse followed by a Chorus or Pre-Chorus where lines have very few syllables.

### T49: Negative Space (Line Breaths)
* **Author**: Billie Eilish / Khalid
* **Weight**: 0.025
* **Group**: None
* **Description**: Silence is a lyric. Having double empty lines or short 1-2 word lines creates dramatic pauses.
* **Scoring Logic**: Scans for short 1-2 word lines or multiple consecutive empty lines inside sections. Perfect score if at least 2 pauses are detected.
* **How to Optimize**: Insert short, dramatic one-word lines ("No", "Run") followed by a double line break to create dramatic pauses.

### T50: Title Weight Distribution
* **Author**: Diane Warren
* **Weight**: 0.030
* **Group**: None
* **Description**: In a multi-word title, placing the heaviest emphasis on the first or last word makes it more memorable.
* **Scoring Logic**: Checks if a multi-word title begins or ends with a multi-syllable noun or verb (2+ syllables), rather than an article/preposition/pronoun.
* **How to Optimize**: If your title has multiple words, start or end it with a strong content word (e.g. "Silver Shiver", "Back to Black").

### T51: Alliterative Hook Framing
* **Author**: Max Martin
* **Weight**: 0.030
* **Group**: None
* **Description**: The chorus lines are more memorable if their first words share the same starting consonant sound (alliteration).
* **Scoring Logic**: Checks if consecutive lines in the Chorus start with words sharing the same starting consonant letter.
* **How to Optimize**: Compose Chorus lines so that adjacent lines begin with the same consonant letter (e.g. "Silent nights / Shadow fights").

### T52: Word Length Contrast
* **Author**: Lorde
* **Weight**: 0.025
* **Group**: `vocabulary_style`
* **Description**: Create sonic variety by mixing very short words (1 syllable) with long, flowing words (3+ syllables) in the same line.
* **Scoring Logic**: Measures ratio of lines containing both 1-syllable and 3+ syllable words. Perfect score if >= 20% of lines exhibit this contrast.
* **How to Optimize**: Pair short monosyllabic words with flowing complex words in the same sentence (e.g., "I feel so beautiful in this town").

### T53: Vowel Quality Shifting
* **Author**: Kurt Cobain / Sia
* **Weight**: 0.030
* **Group**: None
* **Description**: Alternate between bright vowels (A, E, I) for high energy and dark, closed vowels (O, U) for somber, introspective lines.
* **Scoring Logic**: Compares the ratio of bright ending vowels in Verses vs. Choruses. Perfect score if ratio difference is >= 0.25.
* **How to Optimize**: End your Verse lines with darker, closed sounds ("down", "ghost") and Chorus lines with bright, open vowel sounds ("free", "light", "sky").

### T54: Conditional Narrative Framing (If-Then Logic)
* **Author**: Taylor Swift / John Prine
* **Weight**: 0.025
* **Group**: None
* **Description**: Setting up conditional scenarios ("If you...", "Then we...", "Could have...") engages the listener's imagination.
* **Scoring Logic**: Counts occurrences of conditional words (if, could, would, wish, maybe). Perfect score if >= 3 conditional structures are present.
* **How to Optimize**: Frame narrative regrets or scenarios conditionally ("If you called me, I would come", "Maybe we could have tried").

### T55: Outro Narrative Echo
* **Author**: Taylor Swift / Jack Antonoff
* **Weight**: 0.035
* **Group**: None
* **Description**: The Outro should echo a modified version of the Chorus or Verse hook to give a sense of resolution.
* **Scoring Logic**: Measures vocabulary Jaccard similarity between the Outro and Chorus. Perfect score if similarity is between 30% and 70% (subverted echo).
* **How to Optimize**: Incorporate familiar Chorus vocabulary in the Outro, but rewrite the order or phrasing slightly to create contrast.
