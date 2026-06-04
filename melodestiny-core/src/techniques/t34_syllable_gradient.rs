use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut verse_syllables = 0;
    let mut verse_lines = 0;
    let mut chorus_syllables = 0;
    let mut chorus_lines = 0;

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        if let Some(sec) = &line.section {
            let s_lower = sec.to_lowercase();
            if s_lower.contains("verse") {
                verse_syllables += line.syllables;
                verse_lines += 1;
            } else if s_lower.contains("chorus") {
                chorus_syllables += line.syllables;
                chorus_lines += 1;
            }
        }
    }

    let avg_verse = if verse_lines > 0 {
        verse_syllables as f64 / verse_lines as f64
    } else {
        0.0
    };

    let avg_chorus = if chorus_lines > 0 {
        chorus_syllables as f64 / chorus_lines as f64
    } else {
        0.0
    };

    let diff = (avg_verse - avg_chorus).abs();

    let (raw_score, feedback) = if verse_lines == 0 || chorus_lines == 0 {
        (0.5, "Please label your sections (e.g. '[Verse 1]', '[Chorus]') to analyze syllable contrast.".to_string())
    } else if diff >= 2.0 {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1,
            message: format!(
                "Strong pacing gradient detected! Verses have average {:.1} syllables/line, Choruses have average {:.1} (difference of {:.1}). This contrast is excellent.",
                avg_verse, avg_chorus, diff
            ),
        });
        (1.0, format!(
            "Excellent pacing gradient! Verses and choruses have distinctly different line lengths (average {:.1} vs {:.1} syllables). This creates rhythmic release when entering the chorus.",
            avg_verse, avg_chorus
        ))
    } else if diff >= 1.0 {
        (0.7, format!(
            "Moderate pacing gradient (difference of {:.1} syllables). Try slightly compressing your verses or expanding your chorus lines to make the transition feel bigger.",
            diff
        ))
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "Verse and Chorus lines have nearly identical average lengths, risking a flat pacing feeling.".to_string(),
        });
        (0.4, format!(
            "Flat pacing gradient (difference of only {:.1} syllables/line). Your verses and choruses move at the exact same pace. Try creating contrast in line lengths.",
            diff
        ))
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T34".to_string(),
        name: "Syllable Gradient".to_string(),
        author: "Benny Blanco / Ryan Tedder".to_string(),
        description: "Pop songs build energy by shifting pacing (average syllables per line) between verses and choruses.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: Some("melodic_complexity".to_string()),
    }
}
