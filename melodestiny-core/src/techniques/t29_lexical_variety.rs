use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};
use std::collections::HashSet;

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut global_words = Vec::new();
    let mut verse_words = Vec::new();
    let mut chorus_words = Vec::new();

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        let words: Vec<String> = t.split_whitespace()
            .map(|w| w.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect::<String>())
            .filter(|w| !w.is_empty())
            .collect();

        for word in &words {
            global_words.push(word.clone());
        }

        if let Some(sec) = &line.section {
            let s_lower = sec.to_lowercase();
            if s_lower.contains("verse") {
                for word in &words {
                    verse_words.push(word.clone());
                }
            } else if s_lower.contains("chorus") {
                for word in &words {
                    chorus_words.push(word.clone());
                }
            }
        }
    }

    let global_ttr = calc_ttr(&global_words);
    let verse_ttr = calc_ttr(&verse_words);
    let chorus_ttr = calc_ttr(&chorus_words);

    let mut raw_score = 0.5;
    let mut feedback = "Please add more sections (verses and choruses) to evaluate lexical repetition patterns.".to_string();

    if !global_words.is_empty() {
        raw_score = 0.8; // base score if we have words

        if global_ttr >= 0.35 && global_ttr <= 0.55 {
            raw_score += 0.1;
            feedback = format!(
                "Great global vocabulary balance. Type-Token Ratio is {:.2}, which sits in the pop sweet spot of being memorable but not repetitive.",
                global_ttr
            );
        } else if global_ttr < 0.35 {
            raw_score -= 0.1;
            feedback = format!(
                "Your lyrics are highly repetitive (TTR is {:.2}). This can be great for hooks, but make sure the verses offer enough new content.",
                global_ttr
            );
        } else {
            raw_score -= 0.1;
            feedback = format!(
                "Your lyrics have very high word variety (TTR is {:.2}). Consider repeating key lines or hooks to make them easier to remember.",
                global_ttr
            );
        }

        // Check contrast between Verse and Chorus TTR
        if verse_ttr > 0.0 && chorus_ttr > 0.0 {
            if chorus_ttr < verse_ttr - 0.10 {
                raw_score += 0.1;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: 1,
                    message: format!(
                        "Strong lexical contrast! The Chorus is significantly more repetitive (TTR: {:.2}) than the Verses (TTR: {:.2}), drawing the listener into the hook.",
                        chorus_ttr, verse_ttr
                    ),
                });
            } else {
                flags.push(LyricFlag {
                    type_: FlagType::Neutral,
                    line_number: 1,
                    message: format!(
                        "Chorus repetition (TTR: {:.2}) is similar to Verse repetition (TTR: {:.2}). Making your Chorus more repetitive will make the hook pop.",
                        chorus_ttr, verse_ttr
                    ),
                });
            }
        }
    }

    let weight = 0.040;

    TechniqueResult {
        id: "T29".to_string(),
        name: "Lexical Variety Index".to_string(),
        author: "Lorde / Jack Antonoff".to_string(),
        description: "Measures repetition balance. Pop choruses should be repetitive, while verses should be lexically varied.".to_string(),
        raw_score: raw_score.clamp(0.0, 1.0),
        weight,
        weighted_score: raw_score.clamp(0.0, 1.0) * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}

fn calc_ttr(words: &[String]) -> f64 {
    if words.is_empty() { return 0.0; }
    let unique: HashSet<&String> = words.iter().collect();
    unique.len() as f64 / words.len() as f64
}
