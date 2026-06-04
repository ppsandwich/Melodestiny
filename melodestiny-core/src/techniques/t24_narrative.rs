use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    
    // Heuristic lists for specificity
    let specific_words = ["red", "blue", "black", "white", "gold", "silver", "green", "yellow", 
                          "morning", "midnight", "2am", "tuesday", "sunday", "summer", "winter", 
                          "new york", "la", "paris", "london", "hollywood", "brooklyn", "chicago", 
                          "coffee", "wine", "beer", "whiskey", "smoke", "cigarette", "lipstick", 
                          "jeans", "jacket", "dress", "shoes"];
                          
    let vague_words = ["things", "stuff", "somewhere", "somehow", "someone", "something", "anywhere", "everything", "anything", "nothing", "time", "way"];

    let mut specific_hits = 0;
    let mut vague_hits = 0;

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphanumeric()).collect();
            let clean_str = clean_word.as_str();

            if specific_words.contains(&clean_str) {
                specific_hits += 1;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: line.line_number,
                    message: format!("'{}' provides narrative specificity.", clean_word),
                });
            } else if vague_words.contains(&clean_str) {
                vague_hits += 1;
                flags.push(LyricFlag {
                    type_: FlagType::Negative,
                    line_number: line.line_number,
                    message: format!("'{}' is vague. Replace with a specific detail.", clean_word),
                });
            }
        }
    }

    let raw_score = if specific_hits > vague_hits * 2 {
        1.0
    } else if specific_hits > vague_hits {
        0.8
    } else if specific_hits == vague_hits && specific_hits > 0 {
        0.5
    } else if specific_hits < vague_hits {
        0.3
    } else {
        0.5 // Neutral if neither are heavily present
    };

    let weight = 0.033;

    TechniqueResult {
        id: "T24".to_string(),
        name: "Narrative Specificity".to_string(),
        author: "Ilsey Juber".to_string(),
        description: "Specific details make songs feel lived-in — street names, times, colors, seasons.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.7 {
            "Excellent specificity! The song feels lived-in and real.".to_string()
        } else {
            "The narrative relies too much on vague words (things, somewhere). Ground the story with specific colors, times, or places.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
