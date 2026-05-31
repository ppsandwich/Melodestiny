use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};
use std::collections::HashSet;

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut raw_score: f64 = 1.0;
    
    let mut sections = Vec::new();
    let mut unique_sections = HashSet::new();

    for line in lines {
        if let Some(sec) = &line.section {
            let sec_lower = sec.to_lowercase();
            if sections.last() != Some(&sec_lower) {
                sections.push(sec_lower.clone());
                unique_sections.insert(sec_lower.clone());
            }
        }
    }

    // Check for missing elements
    let has_bridge = unique_sections.iter().any(|s| s.contains("bridge"));
    let has_prechorus = unique_sections.iter().any(|s| s.contains("pre-chorus") || s.contains("prechorus"));
    let ends_on_chorus = sections.last().map(|s| s.contains("chorus") || s.contains("outro")).unwrap_or(false);

    if !has_bridge {
        raw_score -= 0.3;
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "Missing a bridge. A bridge introduces vital contrast before the final chorus.".to_string(),
        });
    }

    if !has_prechorus {
        raw_score -= 0.1;
        flags.push(LyricFlag {
            type_: FlagType::Neutral,
            line_number: 1,
            message: "Consider adding a pre-chorus to build tension into the hook.".to_string(),
        });
    }

    if !ends_on_chorus && !sections.is_empty() {
        raw_score -= 0.2;
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: lines.last().unwrap().line_number,
            message: "Song doesn't end on a chorus or outro. Pop songs should leave the listener with the hook.".to_string(),
        });
    }

    // Consecutive verses
    let mut consec_verses = 0;
    for s in &sections {
        if s.contains("verse") {
            consec_verses += 1;
            if consec_verses > 2 {
                raw_score -= 0.2;
                flags.push(LyricFlag {
                    type_: FlagType::Negative,
                    line_number: 1,
                    message: "Too many consecutive verses before hitting a chorus. Listener will lose interest.".to_string(),
                });
                break;
            }
        } else {
            consec_verses = 0;
        }
    }

    raw_score = raw_score.clamp(0.0, 1.0);
    let weight = 0.040;

    TechniqueResult {
        id: "T15".to_string(),
        name: "Structural Advisory".to_string(),
        author: "Max Martin / Diane Warren".to_string(),
        description: "Evaluate overall section structure completeness.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent pop structure with necessary contrast and tension-building sections.".to_string()
        } else {
            "Structural issues detected. A standard pop song needs verses, a chorus, and usually a bridge for contrast.".to_string()
        },
        flags,
    }
}
