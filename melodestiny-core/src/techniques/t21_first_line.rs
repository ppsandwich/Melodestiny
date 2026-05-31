use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    
    let first_line_opt = lines.iter().find(|l| !l.text.trim().is_empty());

    if let Some(first_line) = first_line_opt {
        let text = first_line.text.to_lowercase();
        let words: Vec<&str> = text.split_whitespace().collect();
        
        let mut score: f64 = 0.0;
        
        // Check for questions
        if text.contains('?') {
            score += 0.4;
            flags.push(LyricFlag {
                type_: FlagType::Positive,
                line_number: first_line.line_number,
                message: "Opening with a question instantly engages the listener's curiosity.".to_string(),
            });
        }

        // Check for direct address or "I"
        let pronouns = ["i", "you", "we"];
        for word in &words {
            let clean_word: String = word.chars().filter(|c| c.is_alphabetic()).collect();
            if pronouns.contains(&clean_word.as_str()) {
                score += 0.3;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: first_line.line_number,
                    message: format!("Using '{}' in the first line grounds the perspective immediately.", clean_word),
                });
                break;
            }
        }

        // Check for concrete imagery / specific scene setting
        let scene_words = ["night", "day", "morning", "street", "car", "bed", "room", "bar", "club", "clock", "door", "window", "rain", "sun", "city", "town"];
        for word in &words {
            let clean_word: String = word.chars().filter(|c| c.is_alphabetic()).collect();
            if scene_words.contains(&clean_word.as_str()) {
                score += 0.3;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: first_line.line_number,
                    message: format!("'{}' sets a specific scene right away.", clean_word),
                });
                break;
            }
        }

        // Penalize vague openings
        let vague_words = ["something", "someone", "somewhere", "feel", "feeling"];
        for word in &words {
            let clean_word: String = word.chars().filter(|c| c.is_alphabetic()).collect();
            if vague_words.contains(&clean_word.as_str()) {
                flags.push(LyricFlag {
                    type_: FlagType::Negative,
                    line_number: first_line.line_number,
                    message: format!("Opening with '{}' is vague. Start in the middle of the action.", clean_word),
                });
                score -= 0.3;
            }
        }

        let raw_score = score.clamp(0.0, 1.0);
        let weight = 0.033;

        TechniqueResult {
            id: "T21".to_string(),
            name: "First Line Hook".to_string(),
            author: "Ryan Tedder".to_string(),
            description: "The first line should grab attention immediately — no slow buildups.".to_string(),
            raw_score,
            weight,
            weighted_score: raw_score * weight * 100.0,
            feedback: if raw_score > 0.8 {
                "Incredible opening line! It sets the scene, perspective, and hooks the listener immediately.".to_string()
            } else if raw_score > 0.5 {
                "Good opening line, but it could be punchier. Try starting with a specific detail or a question.".to_string()
            } else {
                "Your first line is a bit weak or vague. The listener might tune out. Drop them right into the action.".to_string()
            },
            flags,
        }
    } else {
        TechniqueResult {
            id: "T21".to_string(),
            name: "First Line Hook".to_string(),
            author: "Ryan Tedder".to_string(),
            description: "The first line should grab attention immediately — no slow buildups.".to_string(),
            raw_score: 0.0,
            weight: 0.033,
            weighted_score: 0.0,
            feedback: "No lyrics found to evaluate.".to_string(),
            flags: vec![],
        }
    }
}
