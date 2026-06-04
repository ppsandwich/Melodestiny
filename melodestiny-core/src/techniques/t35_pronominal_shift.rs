use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut verse_singular_count = 0;
    let mut verse_plural_count = 0;
    let mut chorus_singular_count = 0;
    let mut chorus_plural_count = 0;

    let self_pronouns = ["i", "me", "my", "mine", "myself"];
    let other_pronouns = ["you", "your", "yours", "yourself"];
    let plural_pronouns = ["we", "us", "our", "ours", "ourselves"];

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        let words: Vec<String> = t.split_whitespace()
            .map(|w| w.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect::<String>())
            .filter(|w| !w.is_empty())
            .collect();

        if let Some(sec) = &line.section {
            let s_lower = sec.to_lowercase();
            let is_verse = s_lower.contains("verse");
            let is_chorus = s_lower.contains("chorus");

            for word in &words {
                if is_verse {
                    if self_pronouns.contains(&word.as_str()) || other_pronouns.contains(&word.as_str()) {
                        verse_singular_count += 1;
                    } else if plural_pronouns.contains(&word.as_str()) {
                        verse_plural_count += 1;
                    }
                } else if is_chorus {
                    if self_pronouns.contains(&word.as_str()) || other_pronouns.contains(&word.as_str()) {
                        chorus_singular_count += 1;
                    } else if plural_pronouns.contains(&word.as_str()) {
                        chorus_plural_count += 1;
                    }
                }
            }
        }
    }

    let verse_total = verse_singular_count + verse_plural_count;
    let chorus_total = chorus_singular_count + chorus_plural_count;

    let verse_plural_ratio = if verse_total > 0 {
        verse_plural_count as f64 / verse_total as f64
    } else {
        0.0
    };

    let chorus_plural_ratio = if chorus_total > 0 {
        chorus_plural_count as f64 / chorus_total as f64
    } else {
        0.0
    };

    let shift = (verse_plural_ratio - chorus_plural_ratio).abs();

    let (raw_score, feedback) = if verse_total == 0 || chorus_total == 0 {
        (0.5, "Please label your sections and include pronouns (e.g. 'I', 'you', 'we') to evaluate relational shift.".to_string())
    } else if shift >= 0.15 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1,
            message: format!(
                "Relational pronoun shift detected! Verse plural ratio: {:.0}%, Chorus: {:.0}% (shift of {:.0}%). Beautiful narrative progression.",
                verse_plural_ratio * 100.0, chorus_plural_ratio * 100.0, shift * 100.0
            ),
        });
        (1.0, format!(
            "Excellent narrative shift! Your pronoun usage changes significantly between verses and chorus (shift of {:.0}%). This reflects a transition from individual feelings to a shared perspective.",
            shift * 100.0
        ))
    } else {
        (0.6, format!(
            "Static pronoun perspective (only {:.0}% shift). The relationship dynamic remains unchanged between sections. Try shifting from individual 'I/you' verses to a collective 'we' chorus.",
            shift * 100.0
        ))
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T35".to_string(),
        name: "Narrative Pronominal Shift".to_string(),
        author: "Taylor Swift / Olivia Rodrigo".to_string(),
        description: "Tracks narrative relationship progression by shifting pronouns (e.g. from 'I/you' to 'we') across sections.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: Some("narrative_continuity".to_string()),
    }
}
