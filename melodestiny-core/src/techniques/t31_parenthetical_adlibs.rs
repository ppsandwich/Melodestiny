use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_lines = 0;
    let mut adlib_lines = 0;
    let mut chorus_adlibs = 0;
    let mut verse_adlibs = 0;

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        total_lines += 1;
        let contains_adlib = (t.contains('(') && t.contains(')')) || (t.contains('{') && t.contains('}'));
        
        if contains_adlib {
            adlib_lines += 1;
            
            flags.push(LyricFlag {
                type_: FlagType::Positive,
                line_number: line.line_number,
                message: "Parenthetical backing vocal or ad-lib detected. This adds vocal layers and rhythm.".to_string(),
            });

            if let Some(sec) = &line.section {
                let s_lower = sec.to_lowercase();
                if s_lower.contains("chorus") {
                    chorus_adlibs += 1;
                } else if s_lower.contains("verse") {
                    verse_adlibs += 1;
                }
            }
        }
    }

    let (raw_score, feedback) = if total_lines == 0 {
        (0.5, "Please write some lyrics to evaluate backing vocal layering.".to_string())
    } else if adlib_lines == 0 {
        (0.5, "No parenthetical ad-libs detected. Adding simple backing vocal markers (e.g. '(yeah)', '(over you)') can double your hook's impact.".to_string())
    } else if chorus_adlibs > verse_adlibs {
        (1.0, format!(
            "Excellent backing vocal placement! You have {} ad-libs, with a higher concentration in the Chorus. This makes the hook feel thick and energetic.",
            adlib_lines
        ))
    } else {
        (0.8, format!(
            "Ad-libs detected ({}), but they are spread across the song or heavily in the verses. Consider shifting them to the chorus/outro to build dynamic layers.",
            adlib_lines
        ))
    };

    let weight = 0.035;

    TechniqueResult {
        id: "T31".to_string(),
        name: "Parenthetical Backing Vocal Density".to_string(),
        author: "Jack Antonoff".to_string(),
        description: "Backing vocals and ad-libs in parentheses add thickness and call-and-response dynamics to hooks.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}
