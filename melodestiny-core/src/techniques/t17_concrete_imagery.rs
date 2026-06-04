use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let concrete_nouns = ["heart", "door", "rain", "car", "street", "blood", "skin", "fire", "ice", "bed", "phone", "light", "dark", "sun", "moon", "star", "water", "drink", "glass", "room", "floor", "wall", "window"];
    
    let mut total_words = 0;
    let mut concrete_count = 0;
    let mut flags = Vec::new();

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if clean_word.is_empty() { continue; }
            total_words += 1;

            if concrete_nouns.contains(&clean_word.as_str()) {
                concrete_count += 1;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: line.line_number,
                    message: format!("'{}' provides strong concrete imagery.", clean_word),
                });
            }
        }
    }

    let density = if total_words > 0 {
        concrete_count as f64 / total_words as f64
    } else {
        0.0
    };

    // Ideal is 10-25%
    let raw_score = if total_words == 0 {
        1.0
    } else if density >= 0.10 && density <= 0.25 {
        1.0
    } else if density < 0.10 {
        (density / 0.10).clamp(0.2, 0.9)
    } else {
        0.8 // too much imagery is okay, just slightly penalized
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T17".to_string(),
        name: "Concrete Imagery Density".to_string(),
        author: "Julia Michaels / Diane Warren".to_string(),
        description: "Hit songs paint pictures with concrete nouns and sensory details.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            format!("Great use of imagery! {:.1}% of your words paint a concrete picture.", density * 100.0)
        } else {
            format!("Your concrete imagery density is {:.1}%. Try replacing abstract concepts (love, time) with tangible things people can see and feel.", density * 100.0)
        },
        flags,,
        active: true,
        group_id: None,
    }
}
