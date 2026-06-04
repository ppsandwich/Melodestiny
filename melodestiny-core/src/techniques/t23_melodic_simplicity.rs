use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_lines = 0;
    let mut simple_lines = 0;

    for line in lines {
        if line.text.trim().is_empty() { continue; }
        total_lines += 1;

        // Syllable count is already in the line struct!
        let count = line.syllables;

        if count >= 4 && count <= 8 {
            simple_lines += 1;
        } else if count > 12 {
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: line.line_number,
                message: format!("Too many syllables ({}). This melody is likely overly complex.", count),
            });
        }
    }

    let simplicity_ratio = if total_lines > 0 {
        simple_lines as f64 / total_lines as f64
    } else {
        1.0
    };

    let raw_score = if simplicity_ratio >= 0.6 {
        1.0
    } else {
        (simplicity_ratio / 0.6).clamp(0.2, 0.9)
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T23".to_string(),
        name: "Melodic Simplicity Score".to_string(),
        author: "Max Martin".to_string(),
        description: "Keep melodies incredibly simple. 4-8 syllables per line is the sweet spot.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent melodic simplicity. Your line lengths suggest highly catchy, straightforward melodies.".to_string()
        } else {
            "Your melodies might be overcomplicated. Try stripping out unnecessary syllables and focusing the core rhythm.".to_string()
        },
        flags,,
        active: true,
        group_id: Some("melodic_complexity".to_string()),
    }
}
