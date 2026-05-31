use std::collections::HashMap;
use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut phrase_counts: HashMap<String, usize> = HashMap::new();
    let mut total_lines = 0;

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        if words.is_empty() { continue; }
        total_lines += 1;

        // Extract 3-word to 5-word phrases
        for len in 3..=5 {
            if words.len() >= len {
                for i in 0..=(words.len() - len) {
                    let phrase = words[i..i+len].join(" ").to_lowercase();
                    // Clean punctuation from phrase
                    let clean_phrase: String = phrase.chars().filter(|c| c.is_alphanumeric() || c.is_whitespace()).collect();
                    *phrase_counts.entry(clean_phrase).or_insert(0) += 1;
                }
            }
        }
    }

    let mut max_count = 0;
    let mut most_repeated = String::new();
    for (phrase, &count) in &phrase_counts {
        if count > max_count {
            max_count = count;
            most_repeated = phrase.clone();
        }
    }

    let mut flags = Vec::new();
    let raw_score = if total_lines == 0 {
        1.0
    } else if max_count >= 3 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1, // Just attaching to the beginning
            message: format!("Strong repetition detected: '{}' occurs {} times.", most_repeated, max_count),
        });
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "Low repetition. Pop songs thrive on relentless, varied repetition of hooks.".to_string(),
        });
        0.4
    };

    let weight = 0.064;

    TechniqueResult {
        id: "T03".to_string(),
        name: "Repetition Detection".to_string(),
        author: "Max Martin / Jack Antonoff".to_string(),
        description: "Repeat hooks relentlessly but change ONE element each time.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great use of repetition to drill the hook into the listener's ear.".to_string()
        } else {
            "Consider repeating your strongest phrases more frequently to create a stickier hook.".to_string()
        },
        flags,
    }
}
