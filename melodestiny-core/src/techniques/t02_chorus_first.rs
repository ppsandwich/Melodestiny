use std::collections::HashMap;
use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut section_counts: HashMap<String, usize> = HashMap::new();
    let mut first_chorus_line = None;
    let mut current_section = String::new();
    let mut total_lines = 0;

    for line in lines {
        if !line.text.trim().is_empty() {
            total_lines += 1;
        }

        if let Some(sec) = &line.section {
            let sec_lower = sec.to_lowercase();
            if current_section != sec_lower {
                current_section = sec_lower.clone();
                *section_counts.entry(current_section.clone()).or_insert(0) += 1;
                
                if current_section.contains("chorus") && first_chorus_line.is_none() {
                    first_chorus_line = Some(total_lines);
                }
            }
        }
    }

    let mut flags = Vec::new();
    let mut raw_score = 1.0;
    
    // Check chorus position
    let position_score = if let Some(first_pos) = first_chorus_line {
        let pct = first_pos as f64 / total_lines.max(1) as f64;
        if pct < 0.25 {
            1.0 // Appears in first 25% of song
        } else if pct < 0.4 {
            flags.push(LyricFlag {
                type_: FlagType::Neutral,
                line_number: first_pos,
                message: format!("Chorus appears at {:.0}% of the song. A bit late.", pct * 100.0),
            });
            0.6
        } else {
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: first_pos,
                message: format!("Chorus appears very late ({:.0}%). Get to the hook faster.", pct * 100.0),
            });
            0.2
        }
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "No chorus detected. The chorus is the most important part of a pop song!".to_string(),
        });
        0.0
    };

    // Check repetition
    let mut max_repetition = 0;
    let mut most_repeated = String::new();
    for (sec, count) in &section_counts {
        if *count > max_repetition {
            max_repetition = *count;
            most_repeated = sec.clone();
        }
    }

    let repetition_score = if most_repeated.contains("chorus") {
        1.0
    } else {
        if let Some(&chorus_count) = section_counts.get("chorus") {
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: 1,
                message: format!("'{}' is repeated more times ({}) than the chorus ({}).", most_repeated, max_repetition, chorus_count),
            });
            0.5
        } else {
            0.0
        }
    };

    raw_score = (position_score * 0.6) + (repetition_score * 0.4);
    let weight = 0.072;

    TechniqueResult {
        id: "T02".to_string(),
        name: "Chorus-First Structural Check".to_string(),
        author: "Max Martin".to_string(),
        description: "The chorus IS the song. It should appear early and be the most repeated element.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Strong structural foundation. The chorus hits early and repeats often.".to_string()
        } else {
            "Structural issues detected. Ensure the chorus is the focal point of the song.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
