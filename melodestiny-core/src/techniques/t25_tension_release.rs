use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut tension_shifts = 0;
    
    let mut previous_length = 0;
    let mut valid_transitions = 0;

    for line in lines {
        if line.text.trim().is_empty() { continue; }
        
        let current_length = line.syllables;
        
        if previous_length > 0 {
            valid_transitions += 1;
            let diff = (current_length as i32 - previous_length as i32).abs();
            
            // A shift of > 4 syllables creates noticeable tension/release
            if diff >= 4 {
                tension_shifts += 1;
                if tension_shifts == 1 {
                    flags.push(LyricFlag {
                        type_: FlagType::Positive,
                        line_number: line.line_number,
                        message: "Significant change in phrase length creates melodic tension and release.".to_string(),
                    });
                }
            }
        }
        
        previous_length = current_length;
    }

    let raw_score = if valid_transitions == 0 {
        1.0
    } else if tension_shifts >= 3 {
        1.0
    } else if tension_shifts > 0 {
        0.8
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "No significant changes in phrase length. The melody may feel monotonous.".to_string(),
        });
        0.3
    };

    let weight = 0.033;

    TechniqueResult {
        id: "T25".to_string(),
        name: "Tension and Release".to_string(),
        author: "Max Martin / Savan Kotecha".to_string(),
        description: "Alternate between fast, wordy phrases and long, held notes to build tension.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great structural pacing. The phrase lengths expand and contract beautifully.".to_string()
        } else {
            "Your phrases are all the exact same length. Break the pattern by following a wordy section with a long, drawn-out note.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
