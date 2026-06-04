use std::collections::HashSet;
use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut verse_words = HashSet::new();
    let mut chorus_words = HashSet::new();
    let mut flags = Vec::new();

    let stop_words = ["a", "the", "and", "to", "of", "in", "it", "is", "that", "i", "you", "my", "me"];

    for line in lines {
        let is_verse = line.section.as_ref().map_or(false, |s| s.to_lowercase().contains("verse"));
        let is_chorus = line.section.as_ref().map_or(false, |s| s.to_lowercase().contains("chorus"));
        
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if clean_word.is_empty() || stop_words.contains(&clean_word.as_str()) { continue; }
            
            if is_verse {
                verse_words.insert(clean_word.clone());
            } else if is_chorus {
                chorus_words.insert(clean_word);
            }
        }
    }

    if verse_words.is_empty() || chorus_words.is_empty() {
        return TechniqueResult {
            id: "T19".to_string(),
            name: "Section Contrast Score".to_string(),
            author: "Jack Antonoff".to_string(),
            description: "Verses and choruses should feel distinctly different.".to_string(),
            raw_score: 0.5,
            weight: 0.033,
            weighted_score: 0.5 * 0.033 * 100.0,
            feedback: "Could not detect both verses and choruses to evaluate contrast.".to_string(),
            flags: vec![],
        };
    }

    let intersection_count = verse_words.intersection(&chorus_words).count();
    let union_count = verse_words.union(&chorus_words).count();

    let jaccard_sim = if union_count > 0 {
        intersection_count as f64 / union_count as f64
    } else {
        0.0
    };

    let raw_score = if jaccard_sim < 0.3 {
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: format!("Verse and chorus share {:.0}% of their vocabulary. Need more contrast.", jaccard_sim * 100.0),
        });
        (1.0 - ((jaccard_sim - 0.3) * 2.0)).clamp(0.0, 0.9)
    };

    let weight = 0.033;

    TechniqueResult {
        id: "T19".to_string(),
        name: "Section Contrast Score".to_string(),
        author: "Jack Antonoff".to_string(),
        description: "Verses and choruses should feel distinctly different.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            format!("Excellent contrast. Verse and chorus share only {:.0}% of their vocabulary.", jaccard_sim * 100.0)
        } else {
            "Verses and choruses use too much of the same vocabulary. Differentiate them to make the chorus hit harder.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
