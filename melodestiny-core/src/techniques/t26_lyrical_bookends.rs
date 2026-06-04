use crate::types::{LyricLine, TechniqueResult};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let clean_lines: Vec<&LyricLine> = lines.iter()
        .filter(|l| {
            let t = l.text.trim();
            !t.is_empty() && !t.starts_with('[') && !t.starts_with('{')
        })
        .collect();

    let mut raw_score = 0.0;
    let mut feedback = "No lyrical bookends detected. Consider adding a thematic or word callback in the outro to frame the narrative.".to_string();

    if clean_lines.len() >= 4 {
        // Compare the first line vs the last line
        let first_line = clean_lines[0].text.to_lowercase();
        let last_line = clean_lines[clean_lines.len() - 1].text.to_lowercase();
        
        let jaccard_1 = word_jaccard(&first_line, &last_line);

        // Also compare first two lines combined vs last two lines combined
        let first_two = format!("{} {}", clean_lines[0].text, clean_lines[1].text).to_lowercase();
        let last_two = format!("{} {}", clean_lines[clean_lines.len() - 2].text, clean_lines[clean_lines.len() - 1].text).to_lowercase();
        
        let jaccard_2 = word_jaccard(&first_two, &last_two);

        let max_jaccard = jaccard_1.max(jaccard_2);

        if max_jaccard >= 0.95 {
            raw_score = 0.85;
            feedback = "Exact lyrical bookend callback detected! Repeating the opening motif builds a strong thematic loop.".to_string();
        } else if max_jaccard >= 0.40 {
            raw_score = 1.0;
            feedback = format!(
                "Excellent! Lyrical bookend callback with a twist detected ({:.0}% word overlap). Perfect way to show growth or change in perspective.",
                max_jaccard * 100.0
            );
        } else if max_jaccard >= 0.15 {
            raw_score = 0.6;
            feedback = "Subtle lyrical bookend callback detected. Consider aligning a few more key words to make the connection punchier.".to_string();
        }
    }

    let weight = 0.035;

    TechniqueResult {
        id: "T26".to_string(),
        name: "Lyrical Bookends".to_string(),
        author: "Taylor Swift / Paul McCartney".to_string(),
        description: "The song begins and ends with matching or slightly subverted lyrical motifs.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags: vec![],
        active: true,
        group_id: Some("structural_resolution".to_string()),
    }
}

fn word_jaccard(s1: &str, s2: &str) -> f64 {
    let clean_words = |s: &str| -> std::collections::HashSet<String> {
        s.split_whitespace()
            .map(|w| w.chars().filter(|c| c.is_alphabetic()).collect::<String>())
            .filter(|w| !w.is_empty())
            .collect()
    };

    let w1 = clean_words(s1);
    let w2 = clean_words(s2);

    if w1.is_empty() && w2.is_empty() { return 1.0; }
    if w1.is_empty() || w2.is_empty() { return 0.0; }

    let intersect = w1.intersection(&w2).count() as f64;
    let union = w1.union(&w2).count() as f64;
    intersect / union
}
