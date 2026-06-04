use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut current_section = String::from("Unknown");
    let mut section_lines = Vec::new();
    let mut total_cv = 0.0;
    let mut scored_sections = 0;

    let mut process_section = |section: &str, s_lines: &[&LyricLine], flags: &mut Vec<LyricFlag>| {
        if s_lines.is_empty() { return 0.0; }
        
        let counts: Vec<f64> = s_lines.iter().map(|l| l.syllables as f64).collect();
        let mean = counts.iter().sum::<f64>() / counts.len() as f64;
        
        if mean == 0.0 { return 0.0; }
        
        let variance = counts.iter().map(|c| (c - mean).powi(2)).sum::<f64>() / counts.len() as f64;
        let std_dev = variance.sqrt();
        let cv = std_dev / mean;
        
        if cv > 0.25 {
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: s_lines[0].line_number, // mark start of section
                message: format!("High variation in line length within this section (CV: {:.2}). Ideal is < 0.25.", cv),
            });
        }
        
        cv
    };

    for line in lines {
        if let Some(sec) = &line.section {
            if !section_lines.is_empty() {
                total_cv += process_section(&current_section, &section_lines, &mut flags);
                scored_sections += 1;
                section_lines.clear();
            }
            current_section = sec.clone();
        } else if !line.text.trim().is_empty() {
            section_lines.push(line);
        }
    }
    
    if !section_lines.is_empty() {
        total_cv += process_section(&current_section, &section_lines, &mut flags);
        scored_sections += 1;
    }

    let avg_cv = if scored_sections > 0 {
        total_cv / scored_sections as f64
    } else {
        0.0
    };

    let raw_score = if scored_sections == 0 {
        1.0
    } else if avg_cv <= 0.25 {
        1.0
    } else {
        (1.0 - ((avg_cv - 0.25) * 2.0)).clamp(0.0, 0.9)
    };

    let weight = 0.048;

    TechniqueResult {
        id: "T07".to_string(),
        name: "Line Length Consistency".to_string(),
        author: "Max Martin".to_string(),
        description: "Parallel lines within a section should have similar syllable counts.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent line length consistency. Your sections have highly predictable rhythms.".to_string()
        } else {
            "Your lines vary too much in length within sections. This hurts rhythmic predictability.".to_string()
        },
        flags,,
        active: true,
        group_id: Some("melodic_complexity".to_string()),
    }
}
