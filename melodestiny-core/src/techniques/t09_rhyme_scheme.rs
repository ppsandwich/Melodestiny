use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};
use std::collections::HashMap;

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut rhyme_matches = 0;
    let mut total_pairs_checked = 0;

    let mut current_section_lines: Vec<&LyricLine> = Vec::new();
    let mut current_section = String::new();

    let check_rhymes = |section_lines: &[&LyricLine], flags: &mut Vec<LyricFlag>, matches: &mut i32, checked: &mut i32| {
        if section_lines.len() < 4 { return; }

        let get_end_sound = |text: &str| -> String {
            let words: Vec<&str> = text.split_whitespace().collect();
            if let Some(&last_word) = words.last() {
                let clean: String = last_word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
                if clean.len() >= 2 {
                    clean[clean.len()-2..].to_string()
                } else {
                    clean
                }
            } else {
                String::new()
            }
        };

        let ends: Vec<String> = section_lines.iter().map(|l| get_end_sound(&l.text)).collect();

        // Check AABB or ABAB patterns
        for i in 0..ends.len().saturating_sub(3) {
            *checked += 1;
            let a1 = &ends[i];
            let a2 = &ends[i+1];
            let b1 = &ends[i+2];
            let b2 = &ends[i+3];

            if a1.is_empty() || a2.is_empty() || b1.is_empty() || b2.is_empty() { continue; }

            if a1 == a2 && b1 == b2 {
                *matches += 1; // AABB
            } else if a1 == b1 && a2 == b2 {
                *matches += 1; // ABAB
            } else if a1 == b2 && a2 == b1 {
                *matches += 1; // ABBA
            }
        }
    };

    for line in lines {
        if line.text.trim().is_empty() { continue; }
        
        if let Some(sec) = &line.section {
            if current_section != *sec {
                if !current_section_lines.is_empty() {
                    check_rhymes(&current_section_lines, &mut flags, &mut rhyme_matches, &mut total_pairs_checked);
                    current_section_lines.clear();
                }
                current_section = sec.clone();
            }
        }
        current_section_lines.push(line);
    }
    
    if !current_section_lines.is_empty() {
        check_rhymes(&current_section_lines, &mut flags, &mut rhyme_matches, &mut total_pairs_checked);
    }

    let consistency = if total_pairs_checked > 0 {
        rhyme_matches as f64 / total_pairs_checked as f64
    } else {
        1.0
    };

    let raw_score = if total_pairs_checked == 0 {
        0.5
    } else if consistency > 0.5 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1,
            message: "Consistent rhyme schemes (AABB/ABAB) detected. This creates strong listener expectations.".to_string(),
        });
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "Rhyme scheme is loose or inconsistent. Perfect rhymes aren't required, but consistent structural rhymes are.".to_string(),
        });
        (consistency / 0.5).clamp(0.1, 0.8)
    };

    let weight = 0.048;

    TechniqueResult {
        id: "T09".to_string(),
        name: "Rhyme Scheme Consistency".to_string(),
        author: "Max Martin".to_string(),
        description: "Consistency in rhyme scheme creates a subconscious blueprint for the listener.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Strong rhyme scheme presence. The listener always knows when the rhyme is coming.".to_string()
        } else {
            "The rhyme scheme feels unpredictable. Establish a strong AABB or ABAB pattern to ground the listener.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
