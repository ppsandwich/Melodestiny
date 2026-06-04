use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let pronouns = ["i", "me", "my", "mine", "myself", "we", "us", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves"];
    
    let mut total_words = 0;
    let mut pronoun_count = 0;
    let mut flags = Vec::new();

    for line in lines {
        let mut line_pronouns = 0;
        let words: Vec<&str> = line.text.split_whitespace().collect();
        let word_count = words.len();
        
        if word_count == 0 { continue; }
        
        total_words += word_count;

        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if pronouns.contains(&clean_word.as_str()) {
                pronoun_count += 1;
                line_pronouns += 1;
            }
        }
        
        if line_pronouns > 3 {
            flags.push(LyricFlag {
                type_: FlagType::Positive,
                line_number: line.line_number,
                message: "High density of direct address pronouns creates intimacy.".to_string(),
            });
        }
    }

    let density = if total_words > 0 {
        pronoun_count as f64 / total_words as f64
    } else {
        0.0
    };

    // Ideal density: 0.08 to 0.18
    let raw_score = if total_words == 0 {
        1.0 // don't penalize empty
    } else if density >= 0.08 && density <= 0.18 {
        1.0
    } else if density > 0.18 {
        0.8 - ((density - 0.18) * 2.0).clamp(0.0, 0.8) // penalize slightly for too many
    } else {
        (density / 0.08).clamp(0.0, 0.9) // penalize for too few
    };

    let weight = 0.056;

    TechniqueResult {
        id: "T12".to_string(),
        name: "Direct Address Pronoun Density".to_string(),
        author: "Diane Warren / Julia Michaels".to_string(),
        description: "\"I\" and \"you\" create direct emotional connection.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            format!("Great intimacy! {:.1}% of your words are direct address pronouns (ideal is 8-18%).", density * 100.0)
        } else {
            format!("Your direct address density is {:.1}%. Consider using more 'I' and 'you' to connect with the listener.", density * 100.0)
        },
        flags,,
        active: true,
        group_id: None,
    }
}
