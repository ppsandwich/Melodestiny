use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_lines = 0;
    let mut enjambed_lines = 0;

    let clean_lines: Vec<&LyricLine> = lines.iter()
        .filter(|l| {
            let t = l.text.trim();
            !t.is_empty() && !t.starts_with('[') && !t.starts_with('{')
        })
        .collect();

    if clean_lines.is_empty() {
        return TechniqueResult {
            id: "T32".to_string(),
            name: "Enjambment vs. End-Stopped Pacing".to_string(),
            author: "Olivia Rodrigo".to_string(),
            description: "Measures run-on thoughts (enjambment) versus complete punctuated lines (end-stopped).".to_string(),
            raw_score: 0.5,
            weight: 0.030,
            weighted_score: 1.5,
            feedback: "Please write some lyrics to evaluate sentence enjambment.".to_string(),
            flags: vec![],
            active: true,
            group_id: None,
        };
    }

    total_lines = clean_lines.len();

    for i in 0..total_lines {
        let line = clean_lines[i];
        let t = line.text.trim();
        
        let has_end_punctuation = t.ends_with('.') || t.ends_with(',') || t.ends_with('?') || t.ends_with('!') || t.ends_with(';') || t.ends_with(':') || t.ends_with('-') || t.ends_with('—');
        
        let is_enjambed = if !has_end_punctuation && i + 1 < total_lines {
            let next_t = clean_lines[i+1].text.trim();
            if !next_t.is_empty() {
                let first_char = next_t.chars().next().unwrap_or(' ');
                // Check if next line starts with lowercase (signaling run-on sentence)
                // or if it's a known conjunction
                first_char.is_lowercase() || starts_with_conjunction(next_t)
            } else {
                false
            }
        } else {
            false
        };

        if is_enjambed {
            enjambed_lines += 1;
            flags.push(LyricFlag {
                type_: FlagType::Neutral,
                line_number: line.line_number,
                message: "Enjambment detected. Grammatical phrase spills into the next line, creating a run-on pacing.".to_string(),
            });
        }
    }

    let enjamb_ratio = enjambed_lines as f64 / total_lines as f64;

    let (raw_score, feedback) = if enjamb_ratio >= 0.15 && enjamb_ratio <= 0.50 {
        (1.0, format!(
            "Excellent phrasing variety! {:.0}% of your lines use enjambment (run-on phrasing) while the rest are end-stopped. This keeps the phrasing natural and conversational.",
            enjamb_ratio * 100.0
        ))
    } else if enjamb_ratio < 0.15 {
        (0.7, format!(
            "Your phrasing is heavily end-stopped (only {:.0}% enjambment). Every line is a complete thought, which can sound stilted or blocky. Try letting some thoughts spill over lines.",
            enjamb_ratio * 100.0
        ))
    } else {
        (0.7, format!(
            "Your phrasing has very high enjambment ({:.0}%). With so many run-on sentences, it might be hard for the listener to find a rhythmic resting point. Try end-stopping some lines.",
            enjamb_ratio * 100.0
        ))
    };

    let weight = 0.030;

    TechniqueResult {
        id: "T32".to_string(),
        name: "Enjambment vs. End-Stopped Pacing".to_string(),
        author: "Olivia Rodrigo".to_string(),
        description: "Balances complete, punctuated lines (end-stopped) with run-on thoughts (enjambment) for conversational realism.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}

fn starts_with_conjunction(text: &str) -> bool {
    let lower = text.to_lowercase();
    let words: Vec<&str> = lower.split_whitespace().collect();
    if let Some(&first) = words.first() {
        matches!(first, "and" | "but" | "or" | "so" | "because" | "that" | "if" | "when" | "while" | "then" | "as")
    } else {
        false
    }
}
