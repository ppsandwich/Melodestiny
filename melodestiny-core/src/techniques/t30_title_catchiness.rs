use crate::types::{AnalysisInput, TechniqueResult};

pub fn analyze(input: &AnalysisInput) -> TechniqueResult {
    let title = input.title.trim();
    if title.is_empty() {
        return TechniqueResult {
            id: "T30".to_string(),
            name: "Title Phonetic Catchiness".to_string(),
            author: "Diane Warren / Max Martin".to_string(),
            description: "Song titles are easier to memorize if they use alliteration, assonance, or rhyme.".to_string(),
            raw_score: 0.0,
            weight: 0.030,
            weighted_score: 0.0,
            feedback: "Please provide a song title to analyze phonetic catchiness.".to_string(),
            flags: vec![],
            active: true,
            group_id: None,
        };
    }

    let words: Vec<&str> = title.split_whitespace().collect();
    let mut has_alliteration = false;
    let mut has_assonance = false;
    let mut has_rhyme = false;
    let mut has_repetition = false;

    if words.len() >= 2 {
        let starting_sounds: Vec<String> = words.iter().map(|&w| get_starting_sound(w)).collect();
        let vowel_nuclei: Vec<String> = words.iter().map(|&w| normalize_vowel_nucleus(&get_vowel_nucleus(w))).collect();
        let endings: Vec<String> = words.iter().map(|&w| get_end_sound(w)).collect();

        for i in 0..words.len() - 1 {
            for j in i + 1..words.len() {
                let s1 = &starting_sounds[i];
                let s2 = &starting_sounds[j];
                if !s1.is_empty() && s1 == s2 && !is_vowel_char(s1.chars().next().unwrap()) {
                    has_alliteration = true;
                }

                let v1 = &vowel_nuclei[i];
                let v2 = &vowel_nuclei[j];
                if !v1.is_empty() && v1 == v2 {
                    has_assonance = true;
                }

                let e1 = &endings[i];
                let e2 = &endings[j];
                if !e1.is_empty() && e1 == e2 {
                    has_rhyme = true;
                }

                if words[i].to_lowercase() == words[j].to_lowercase() {
                    has_repetition = true;
                }
            }
        }
    } else if words.len() == 1 {
        // Check for internal repeating patterns (e.g. Mamma, Lalala, Ring)
        let w = words[0].to_lowercase();
        if w.len() >= 4 {
            let half = w.len() / 2;
            if w[..half] == w[half..] || (w.chars().nth(0) == w.chars().nth(2) && w.chars().nth(1) == w.chars().nth(3)) {
                has_repetition = true;
            }
        }
    }

    let (raw_score, feedback) = if has_alliteration && has_assonance {
        (1.0, "Phenomenal! Your title contains both alliteration and assonance (e.g. 'Bad Blood' patterns). It is extremely catchy and memorable.".to_string())
    } else if has_alliteration {
        (1.0, "Great! Your title uses alliteration (matching initial consonant sounds), making it punchy and easy to remember.".to_string())
    } else if has_assonance {
        (1.0, "Great! Your title uses assonance (matching internal vowel sounds), which creates a pleasing melodic texture.".to_string())
    } else if has_rhyme {
        (1.0, "Perfect! Your title contains a rhyming pattern, which immediately locks into the listener's memory.".to_string())
    } else if has_repetition {
        (0.9, "Nice! Your title uses word or syllable repetition, which increases familiarity immediately.".to_string())
    } else {
        (0.6, "Your title is phonetically simple. Consider adding alliteration, assonance, or rhyme (e.g., 'Love Lies', 'Mamma Mia') to make it stickier.".to_string())
    };

    let weight = 0.030;

    TechniqueResult {
        id: "T30".to_string(),
        name: "Title Phonetic Catchiness".to_string(),
        author: "Diane Warren / Max Martin".to_string(),
        description: "Song titles are easier to memorize if they use alliteration, assonance, or rhyme.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags: vec![],
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

fn get_end_sound(word: &str) -> String {
    let clean: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic()).collect();
    if clean.len() >= 2 {
        clean[clean.len()-2..].to_string()
    } else {
        clean
    }
}
