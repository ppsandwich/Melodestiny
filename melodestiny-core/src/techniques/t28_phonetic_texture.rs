use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_lines = 0;
    let mut legato_lines = 0;

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        total_lines += 1;
        let words: Vec<&str> = t.split_whitespace().collect();
        if let Some(&last_word) = words.last() {
            if is_legato_ending(last_word) {
                legato_lines += 1;
            }
        }
    }

    let legato_ratio = if total_lines > 0 {
        legato_lines as f64 / total_lines as f64
    } else {
        0.5
    };

    let (raw_score, feedback) = if total_lines == 0 {
        (0.5, "Please write some lyrics to evaluate phonetic line texture.".to_string())
    } else if legato_ratio >= 0.35 && legato_ratio <= 0.65 {
        (1.0, format!(
            "Excellent phonetic texture! A balanced {:.0}% of lines end in soft, open sounds (legato), providing natural release without losing punchiness.",
            legato_ratio * 100.0
        ))
    } else if legato_ratio < 0.35 {
        flags.push(LyricFlag {
            type_: FlagType::Neutral,
            line_number: 1,
            message: "Many lines end in hard consonants. Try adding soft vowel endings to give singers breathing room.".to_string(),
        });
        (0.7, format!(
            "Your song leans staccato ({:.0}% legato endings). This creates a rhythmic, rap-like or punchy feel, but may lack soaring vocal releases.",
            legato_ratio * 100.0
        ))
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Neutral,
            line_number: 1,
            message: "Many lines end in open vowel/legato sounds. Consider ending some lines with hard consonants to create sharp rhythmic stops.".to_string(),
        });
        (0.7, format!(
            "Your song leans legato ({:.0}% legato endings). It sounds very flowing and soft, but might benefit from occasional punchy, consonant endings.",
            legato_ratio * 100.0
        ))
    };

    let weight = 0.035;

    TechniqueResult {
        id: "T28".to_string(),
        name: "Line-Ending Phonetic Texture".to_string(),
        author: "Max Martin".to_string(),
        description: "Balances open vowel endings (legato) with stop consonant endings (staccato) to shape vocal energy.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}

fn is_legato_ending(word: &str) -> bool {
    let clean: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
    if let Some(last_char) = clean.chars().last() {
        matches!(last_char, 'a' | 'e' | 'i' | 'o' | 'u' | 'y' | 'l' | 'm' | 'n' | 'r' | 'w')
    } else {
        true
    }
}
