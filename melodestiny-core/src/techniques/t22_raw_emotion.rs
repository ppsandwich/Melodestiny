use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let emotion_words = ["bone", "skin", "lung", "heart", "blood", "tear", "break", "breaking", "burn", "burning", "ache", "aching", "choke", "choking", "breathe", "drown", "drowning", "bleed", "bleeding"];
    
    let mut flags = Vec::new();
    let mut hits = 0;

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if emotion_words.contains(&clean_word.as_str()) {
                hits += 1;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: line.line_number,
                    message: format!("'{}' evokes raw, visceral emotion.", clean_word),
                });
            }
        }
    }

    let raw_score = if hits >= 3 {
        1.0
    } else if hits == 2 {
        0.8
    } else if hits == 1 {
        0.5
    } else {
        0.2
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T22".to_string(),
        name: "Raw Emotion Words".to_string(),
        author: "Sia".to_string(),
        description: "Sia uses visceral, body-focused language — bones breaking, lungs collapsing.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent visceral language. The emotion feels bodily and raw.".to_string()
        } else {
            "Lacking raw emotional words. Consider describing the physical sensation of the emotion (e.g., 'lungs collapsing' instead of 'feeling sad').".to_string()
        },
        flags,
    }
}
