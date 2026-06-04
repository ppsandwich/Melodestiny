use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_words = 0;
    let mut alliteration_matches = 0;
    let mut assonance_matches = 0;

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        let words: Vec<&str> = line.text.split_whitespace().collect();
        if words.len() < 2 { continue; }

        let starting_sounds: Vec<String> = words.iter().map(|&w| get_starting_sound(w)).collect();
        let vowel_nuclei: Vec<String> = words.iter().map(|&w| normalize_vowel_nucleus(&get_vowel_nucleus(w))).collect();

        total_words += words.len();

        let mut line_allit = 0;
        let mut line_asson = 0;

        for i in 0..words.len() - 1 {
            let s1 = &starting_sounds[i];
            let s2 = &starting_sounds[i+1];

            if !s1.is_empty() && !s2.is_empty() && s1 == s2 && !is_vowel_char(s1.chars().next().unwrap()) {
                alliteration_matches += 1;
                line_allit += 1;
            }

            let v1 = &vowel_nuclei[i];
            let v2 = &vowel_nuclei[i+1];

            if !v1.is_empty() && !v2.is_empty() && v1 == v2 {
                assonance_matches += 1;
                line_asson += 1;
            }
        }

        if line_allit >= 2 || line_asson >= 2 {
            flags.push(LyricFlag {
                type_: FlagType::Positive,
                line_number: line.line_number,
                message: format!(
                    "Nice phonetic flow! Line has {} alliterative and {} assonant connections.",
                    line_allit, line_asson
                ),
            });
        }
    }

    let combined_matches = alliteration_matches + assonance_matches;
    let density = if total_words > 0 {
        combined_matches as f64 / total_words as f64
    } else {
        0.0
    };

    // Ideal range: 10% to 25% density
    let (raw_score, feedback) = if total_words == 0 {
        (0.5, "Please write some lyrics to evaluate phonetic harmony.".to_string())
    } else if density >= 0.10 && density <= 0.25 {
        (1.0, format!("Excellent phonetic harmony! Your density of {:.1}% creates a beautiful, natural rhythm.", density * 100.0))
    } else if density < 0.10 {
        (0.6, format!("Low phonetic harmony ({:.1}% density). Try using more adjacent words with repeating initial consonant or vowel sounds.", density * 100.0))
    } else {
        (0.8, format!("Very high phonetic harmony ({:.1}% density). It sounds highly musical, but be careful it doesn't sound like a tongue twister.", density * 100.0))
    };

    let weight = 0.045;

    TechniqueResult {
        id: "T27".to_string(),
        name: "Phonetic Alliteration & Assonance".to_string(),
        author: "Paul Simon".to_string(),
        description: "Enhances lyrical flow and memorability using adjacent repeating consonant or vowel sounds.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}

fn is_vowel_char(c: char) -> bool {
    matches!(c, 'a' | 'e' | 'i' | 'o' | 'u' | 'y')
}

fn get_starting_sound(word: &str) -> String {
    let w = word.to_lowercase();
    let clean: String = w.chars().filter(|c| c.is_alphabetic()).collect();
    if clean.len() >= 2 {
        let prefix = &clean[0..2];
        if matches!(prefix, "ch" | "sh" | "th" | "ph" | "kn" | "wr" | "wh") {
            return prefix.to_string();
        }
    }
    if let Some(c) = clean.chars().next() {
        c.to_string()
    } else {
        String::new()
    }
}

fn get_vowel_nucleus(word: &str) -> String {
    let w = word.to_lowercase();
    let clean: String = w.chars().filter(|c| c.is_alphabetic()).collect();
    let mut nucleus = String::new();
    let mut found_vowel = false;
    for c in clean.chars() {
        let is_vowel = is_vowel_char(c);
        if is_vowel {
            found_vowel = true;
            nucleus.push(c);
        } else if found_vowel {
            break;
        }
    }
    nucleus
}

fn normalize_vowel_nucleus(n: &str) -> String {
    match n {
        "ea" | "ee" | "ie" => "ee".to_string(),
        "ai" | "ay" | "ey" => "ay".to_string(),
        "ou" | "ow" => "ow".to_string(),
        "oi" | "oy" => "oy".to_string(),
        "oo" | "ue" => "oo".to_string(),
        "oa" | "oe" => "oh".to_string(),
        other => other.to_string(),
    }
}
