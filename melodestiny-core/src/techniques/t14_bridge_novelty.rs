use std::collections::HashSet;
use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    
    let mut non_bridge_words = HashSet::new();
    let mut bridge_words = Vec::new();
    let mut bridge_start_line = None;

    for line in lines {
        let is_bridge = line.section.as_ref().map_or(false, |s| s.to_lowercase().contains("bridge"));
        
        if is_bridge && bridge_start_line.is_none() {
            bridge_start_line = Some(line.line_number);
        }

        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if clean_word.is_empty() { continue; }
            
            // Skip extremely common stop words
            if matches!(clean_word.as_str(), "a"|"the"|"and"|"to"|"of"|"in"|"it"|"is"|"that"|"i"|"you") {
                continue;
            }

            if is_bridge {
                bridge_words.push(clean_word);
            } else {
                non_bridge_words.insert(clean_word);
            }
        }
    }

    if bridge_words.is_empty() {
        return TechniqueResult {
            id: "T14".to_string(),
            name: "Bridge Vocabulary Novelty".to_string(),
            author: "Jack Antonoff / Max Martin".to_string(),
            description: "The bridge should introduce new lyrical content to create contrast.".to_string(),
            raw_score: 0.5,
            weight: 0.032,
            weighted_score: 0.5 * 0.032 * 100.0,
            feedback: "No bridge detected. Bridges provide vital contrast.".to_string(),
            flags: vec![],
        };
    }

    let mut novel_words = 0;
    for bw in &bridge_words {
        if !non_bridge_words.contains(bw) {
            novel_words += 1;
        }
    }

    let novelty_ratio = novel_words as f64 / bridge_words.len() as f64;
    
    let raw_score = if novelty_ratio >= 0.4 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: bridge_start_line.unwrap_or(1),
            message: format!("Strong bridge contrast! {:.0}% of the vocabulary here is new.", novelty_ratio * 100.0),
        });
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: bridge_start_line.unwrap_or(1),
            message: format!("Bridge lacks lyrical contrast. Only {:.0}% new vocabulary (aim for > 40%).", novelty_ratio * 100.0),
        });
        (novelty_ratio / 0.4).clamp(0.0, 0.9)
    };

    let weight = 0.032;

    TechniqueResult {
        id: "T14".to_string(),
        name: "Bridge Vocabulary Novelty".to_string(),
        author: "Jack Antonoff / Max Martin".to_string(),
        description: "The bridge should introduce new lyrical content to create contrast.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent novelty. The bridge provides a fresh lyrical perspective.".to_string()
        } else {
            "The bridge recycles too much vocabulary from the rest of the song. Introduce new concepts here for contrast.".to_string()
        },
        flags,
    }
}
