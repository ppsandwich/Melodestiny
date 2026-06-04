use std::collections::HashMap;
use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut phrase_counts: HashMap<String, usize> = HashMap::new();
    let mut total_lines = 0;

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        if words.is_empty() { continue; }
        total_lines += 1;

        // Extract 2-word phrases
        let len = 2;
        if words.len() >= len {
            for i in 0..=(words.len() - len) {
                let phrase = words[i..i+len].join(" ").to_lowercase();
                let clean_phrase: String = phrase.chars().filter(|c| c.is_alphanumeric() || c.is_whitespace()).collect();
                *phrase_counts.entry(clean_phrase).or_insert(0) += 1;
            }
        }
    }

    let mut mantra_occurrences = 0;
    for (_, &count) in &phrase_counts {
        if count >= 3 {
            mantra_occurrences += count;
        }
    }

    let mut flags = Vec::new();
    let density = if total_lines > 0 {
        mantra_occurrences as f64 / total_lines as f64
    } else {
        0.0
    };

    let raw_score = if total_lines == 0 {
        1.0
    } else if density >= 0.3 && density <= 0.6 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1,
            message: format!("Mantra density is {:.1}%. Perfect sweet spot.", density * 100.0),
        });
        1.0
    } else if density > 0.6 {
        0.7 // A bit too repetitive
    } else {
        (density / 0.3).clamp(0.1, 0.9)
    };

    let weight = 0.048;

    TechniqueResult {
        id: "T04".to_string(),
        name: "Mantra Density".to_string(),
        author: "Jack Antonoff".to_string(),
        description: "Repeat a phrase until it transforms from words into feeling.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent mantra density. The lyrics transform into a hypnotic feeling.".to_string()
        } else {
            format!("Mantra density is {:.1}% (ideal is 30-60%). Try locking into a short phrase and repeating it as a chant.", density * 100.0)
        },
        flags,,
        active: true,
        group_id: Some("repetition_dynamics".to_string()),
    }
}
