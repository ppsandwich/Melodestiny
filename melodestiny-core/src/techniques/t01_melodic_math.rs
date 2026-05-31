use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    // T01: Melodic Math (Lyrical Rhythm)
    // Count syllables per line, calculate standard deviation within sections, flag lines deviating > 1.5σ
    
    let mut flags = Vec::new();
    let mut total_deviation = 0.0;
    let mut scored_sections = 0;
    let mut valid_lines = 0;

    // Group lines by section
    let mut current_section = String::from("Unknown");
    let mut section_lines = Vec::new();

    let mut process_section = |section: &str, s_lines: &[&LyricLine], flags: &mut Vec<LyricFlag>| {
        if s_lines.is_empty() { return 0.0; }
        
        let counts: Vec<f64> = s_lines.iter().map(|l| l.syllables as f64).collect();
        let mean = counts.iter().sum::<f64>() / counts.len() as f64;
        
        let variance = counts.iter().map(|c| (c - mean).powi(2)).sum::<f64>() / counts.len() as f64;
        let std_dev = variance.sqrt();
        
        let mut section_deviation = 0.0;
        
        for (i, &count) in counts.iter().enumerate() {
            let dev = (count - mean).abs();
            if dev > 1.5 * std_dev && std_dev > 1.0 { // Ensure some baseline deviation exists
                flags.push(LyricFlag {
                    type_: FlagType::Negative,
                    line_number: s_lines[i].line_number,
                    message: format!("Rhythmic deviation: {} syllables (section avg is {:.1})", count, mean),
                });
                section_deviation += dev;
            }
        }
        
        section_deviation
    };

    for line in lines {
        if let Some(sec) = &line.section {
            if !section_lines.is_empty() {
                total_deviation += process_section(&current_section, &section_lines, &mut flags);
                scored_sections += 1;
                valid_lines += section_lines.len();
                section_lines.clear();
            }
            current_section = sec.clone();
        } else if !line.text.trim().is_empty() {
            section_lines.push(line);
        }
    }
    
    if !section_lines.is_empty() {
        total_deviation += process_section(&current_section, &section_lines, &mut flags);
        scored_sections += 1;
        valid_lines += section_lines.len();
    }

    let raw_score = if valid_lines == 0 {
        1.0 // Empty song, defaults to perfect to avoid penalizing
    } else {
        // More deviation = lower score
        let avg_dev_per_line = total_deviation / (valid_lines as f64);
        (1.0 - (avg_dev_per_line / 3.0)).clamp(0.0, 1.0)
    };

    let weight = 0.08;

    TechniqueResult {
        id: "T01".to_string(),
        name: "Melodic Math (Lyrical Rhythm)".to_string(),
        author: "Max Martin".to_string(),
        description: "Every syllable has a rhythmic home. Treat the words like a drum pattern.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent rhythmic consistency within sections.".to_string()
        } else {
            "Some lines deviate heavily from their section's rhythmic average. Consider adjusting syllable counts to match the pattern.".to_string()
        },
        flags,
    }
}
