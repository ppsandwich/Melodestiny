use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    // A simple heuristic list of high-energy and emotive words
    let energy_words = ["now", "go", "stop", "never", "always", "fire", "burn", "shatter", "break", "run", "fall", "fly", "scream", "shout", "fight", "love", "hate", "die", "live"];
    
    let mut verse_energy = 0;
    let mut verse_lines = 0;
    let mut chorus_energy = 0;
    let mut chorus_lines = 0;
    
    let mut flags = Vec::new();

    for line in lines {
        let is_chorus = line.section.as_ref().map_or(false, |s| s.to_lowercase().contains("chorus"));
        let is_verse = line.section.as_ref().map_or(false, |s| s.to_lowercase().contains("verse"));
        
        let mut line_energy = 0;
        let words: Vec<&str> = line.text.split_whitespace().collect();
        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
            if energy_words.contains(&clean_word.as_str()) {
                line_energy += 1;
            }
        }
        
        if is_chorus {
            chorus_energy += line_energy;
            if !line.text.trim().is_empty() { chorus_lines += 1; }
        } else if is_verse {
            verse_energy += line_energy;
            if !line.text.trim().is_empty() { verse_lines += 1; }
        }
    }

    let verse_density = if verse_lines > 0 { verse_energy as f64 / verse_lines as f64 } else { 0.0 };
    let chorus_density = if chorus_lines > 0 { chorus_energy as f64 / chorus_lines as f64 } else { 0.0 };

    let raw_score = if verse_lines == 0 || chorus_lines == 0 {
        0.5 // Cannot evaluate properly
    } else if chorus_density > verse_density {
        flags.push(LyricFlag {
            type_: FlagType::Positive,
            line_number: 1,
            message: "The chorus has higher emotional energy than the verses.".to_string(),
        });
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "The verses have higher or equal emotional energy compared to the chorus. Ensure the chorus is the climax.".to_string(),
        });
        0.4
    };

    let weight = 0.033;

    TechniqueResult {
        id: "T16".to_string(),
        name: "Emotional Arc Progression".to_string(),
        author: "Max Martin / Julia Michaels".to_string(),
        description: "Great pop songs build emotional energy from verse to chorus.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great emotional progression. The energy effectively peaks in the chorus.".to_string()
        } else {
            "The emotional arc is flat or inverted. Use more evocative, high-energy words in the chorus to build a climax.".to_string()
        },
        flags,
    }
}
