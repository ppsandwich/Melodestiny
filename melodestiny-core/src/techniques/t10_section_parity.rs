use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut verse_lines = 0;
    let mut chorus_lines = 0;
    let mut verse_count = 0;
    let mut chorus_count = 0;
    
    let mut current_section = String::new();
    let mut current_lines = 0;

    for line in lines {
        if let Some(sec) = &line.section {
            let sec_lower = sec.to_lowercase();
            if current_section != sec_lower {
                if current_section.contains("verse") {
                    verse_count += 1;
                    verse_lines += current_lines;
                } else if current_section.contains("chorus") {
                    chorus_count += 1;
                    chorus_lines += current_lines;
                }
                current_section = sec_lower.clone();
                current_lines = 0;
            }
        }
        
        if !line.text.trim().is_empty() {
            current_lines += 1;
        }
    }
    
    // Add the last section
    if current_section.contains("verse") {
        verse_count += 1;
        verse_lines += current_lines;
    } else if current_section.contains("chorus") {
        chorus_count += 1;
        chorus_lines += current_lines;
    }

    let mut flags = Vec::new();
    let avg_verse_len = if verse_count > 0 { verse_lines as f64 / verse_count as f64 } else { 0.0 };
    let avg_chorus_len = if chorus_count > 0 { chorus_lines as f64 / chorus_count as f64 } else { 0.0 };

    let raw_score = if verse_count == 0 || chorus_count == 0 {
        flags.push(LyricFlag {
            type_: FlagType::Neutral,
            line_number: 1,
            message: "Cannot compare verse and chorus parity (one or both are missing).".to_string(),
        });
        0.5
    } else {
        let ratio = avg_verse_len / avg_chorus_len.max(1.0);
        if ratio >= 0.8 && ratio <= 1.2 {
            1.0
        } else {
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: 1,
                message: format!("Verses average {:.1} lines, choruses {:.1} lines (Ratio {:.2}). Ideal is 0.8-1.2.", avg_verse_len, avg_chorus_len, ratio),
            });
            (1.0 - (ratio - 1.0).abs() * 0.5).clamp(0.2, 0.8)
        }
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T10".to_string(),
        name: "Section Length Parity".to_string(),
        author: "Max Martin".to_string(),
        description: "Verses and choruses should be similar in length for rhythmic predictability.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great structural balance. Verses and choruses are proportional.".to_string()
        } else {
            "There is a significant imbalance between verse and chorus lengths. This can cause pacing issues.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
