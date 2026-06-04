use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};
use crate::syllable::count_syllables;

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut complex_words = 0;
    let mut total_words = 0;

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.chars().filter(|c| c.is_alphabetic()).collect();
            if clean_word.is_empty() { continue; }
            
            total_words += 1;
            let syls = count_syllables(&clean_word);
            
            if syls > 4 {
                complex_words += 1;
                flags.push(LyricFlag {
                    type_: FlagType::Negative,
                    line_number: line.line_number,
                    message: format!("'{}' has {} syllables. Complex words break conversational pop flow.", clean_word, syls),
                });
            }
        }
    }

    let complex_ratio = if total_words > 0 {
        complex_words as f64 / total_words as f64
    } else {
        0.0
    };

    let raw_score = if total_words == 0 {
        1.0
    } else if complex_ratio == 0.0 {
        1.0
    } else {
        (1.0 - (complex_ratio * 10.0)).clamp(0.0, 0.9)
    };

    let weight = 0.048;

    TechniqueResult {
        id: "T11".to_string(),
        name: "Vocabulary Simplicity".to_string(),
        author: "Diane Warren / Julia Michaels".to_string(),
        description: "Hit songwriters use simple, common English words.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Simple, conversational vocabulary that connects immediately.".to_string()
        } else {
            "You are using too many multi-syllabic or complex words. Simplify to make it conversational.".to_string()
        },
        flags,,
        active: true,
        group_id: Some("vocabulary_style".to_string()),
    }
}
