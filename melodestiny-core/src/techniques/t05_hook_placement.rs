use crate::types::{AnalysisInput, LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(input: &AnalysisInput, lines: &[LyricLine]) -> TechniqueResult {
    let title_lower = input.title.to_lowercase();
    let clean_title: String = title_lower.chars().filter(|c| c.is_alphanumeric() || c.is_whitespace()).collect();
    
    let mut flags = Vec::new();
    let mut raw_score: f64 = 0.0;
    
    if clean_title.trim().is_empty() {
        return TechniqueResult {
            id: "T05".to_string(),
            name: "Hook/Title Structural Placement".to_string(),
            author: "Diane Warren".to_string(),
            description: "The title phrase should appear in the chorus, ideally at the start or end.".to_string(),
            raw_score: 0.0,
            weight: 0.08,
            weighted_score: 0.0,
            feedback: "No title provided to check placement.".to_string(),
            flags: vec![],
        };
    }

    let mut in_chorus = false;
    let mut title_found = false;

    for line in lines {
        if let Some(sec) = &line.section {
            in_chorus = sec.to_lowercase().contains("chorus");
        }
        
        let line_lower = line.text.to_lowercase();
        let clean_line: String = line_lower.chars().filter(|c| c.is_alphanumeric() || c.is_whitespace()).collect();
        
        if clean_line.contains(&clean_title) {
            title_found = true;
            if in_chorus {
                raw_score += 0.4;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: line.line_number,
                    message: "Title appears in the chorus.".to_string(),
                });
            } else {
                raw_score += 0.2;
                flags.push(LyricFlag {
                    type_: FlagType::Neutral,
                    line_number: line.line_number,
                    message: "Title appears outside the chorus.".to_string(),
                });
            }
        }
    }
    
    if !title_found {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "The title never appears in the lyrics. This makes the song extremely hard for listeners to search for.".to_string(),
        });
    }

    raw_score = raw_score.clamp(0.0, 1.0);
    let weight = 0.08;

    TechniqueResult {
        id: "T05".to_string(),
        name: "Hook/Title Structural Placement".to_string(),
        author: "Diane Warren".to_string(),
        description: "The title phrase should appear in the chorus, ideally at the start or end.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.7 {
            "Excellent title placement. Anchoring the title in the chorus ensures listeners can easily remember and search for the song.".to_string()
        } else if title_found {
            "The title is present, but could be featured more prominently in the chorus.".to_string()
        } else {
            "Title is missing from the lyrics. Consider renaming the song to match the hook.".to_string()
        },
        flags,
    }
}
