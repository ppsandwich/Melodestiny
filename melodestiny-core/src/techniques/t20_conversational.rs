use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let casual_words = ["yeah", "oh", "hey", "well", "like", "so", "just", "cause", "'cause", "gonna", "wanna", "gotta"];
    let mut flags = Vec::new();
    
    let mut contraction_count = 0;
    let mut casual_count = 0;
    let mut question_count = 0;
    let mut total_lines = 0;

    for line in lines {
        if line.text.trim().is_empty() { continue; }
        total_lines += 1;

        if line.text.contains('?') {
            question_count += 1;
            flags.push(LyricFlag {
                type_: FlagType::Positive,
                line_number: line.line_number,
                message: "Asking a question creates an immediate conversational loop with the listener.".to_string(),
            });
        }

        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let lower = word.to_lowercase();
            if lower.contains('\'') {
                contraction_count += 1;
            }
            
            let clean_word: String = lower.chars().filter(|c| c.is_alphabetic() || *c == '\'').collect();
            if casual_words.contains(&clean_word.as_str()) {
                casual_count += 1;
            }
        }
    }

    let conversational_markers = contraction_count + casual_count + (question_count * 3);
    
    let marker_density = if total_lines > 0 {
        conversational_markers as f64 / total_lines as f64
    } else {
        0.0
    };

    let raw_score = if total_lines == 0 {
        1.0
    } else if marker_density > 0.5 {
        1.0
    } else {
        (marker_density / 0.5).clamp(0.1, 0.9)
    };

    let weight = 0.027;

    TechniqueResult {
        id: "T20".to_string(),
        name: "Conversational Flow".to_string(),
        author: "Pharrell Williams / Julia Michaels".to_string(),
        description: "Modern pop feels like a conversation. Lines should respond to each other naturally.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Highly conversational! The lyrics read like a natural, intimate dialogue.".to_string()
        } else {
            "The lyrics feel a bit rigid. Try using more contractions, questions, and casual filler words to make it feel like a real conversation.".to_string()
        },
        flags,
    }
}
