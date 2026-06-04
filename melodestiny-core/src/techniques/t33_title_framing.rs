use crate::types::{AnalysisInput, LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(input: &AnalysisInput, lines: &[LyricLine]) -> TechniqueResult {
    let title = input.title.trim().to_lowercase();
    if title.is_empty() {
        return TechniqueResult {
            id: "T33".to_string(),
            name: "Title Framing".to_string(),
            author: "Julia Michaels".to_string(),
            description: "The song title should be framed by high-emotion or sensory words immediately preceding or following it.".to_string(),
            raw_score: 0.0,
            weight: 0.030,
            weighted_score: 0.0,
            feedback: "Please provide a song title to analyze title framing.".to_string(),
            flags: vec![],
            active: true,
            group_id: None,
        };
    }

    let mut flags = Vec::new();
    let mut title_occurrences = 0;
    let mut framed_occurrences = 0;

    let emotion_words = [
        "love", "hate", "hurt", "cry", "fear", "pain", "fire", "burn", "cold", "night", 
        "dark", "light", "heart", "break", "tear", "kiss", "touch", "feel", "fall", "run", 
        "lost", "found", "never", "always", "die", "live", "kill", "save", "scream", "whisper", 
        "breath", "sweet", "bitter", "bad", "good", "wrong", "right", "sorry", "wish", "hope", 
        "need", "want", "give", "take"
    ];

    for line in lines {
        let t = line.text.trim();
        if t.is_empty() || t.starts_with('[') || t.starts_with('{') {
            continue;
        }

        let line_lower = t.to_lowercase();
        if line_lower.contains(&title) {
            title_occurrences += 1;
            
            // Check context. Let's tokenize and find index
            let words: Vec<&str> = line_lower.split_whitespace().collect();
            let title_words: Vec<&str> = title.split_whitespace().collect();
            
            if title_words.is_empty() { continue; }
            
            // Try to locate title_words in words
            let mut found_idx = None;
            for i in 0..=words.len().saturating_sub(title_words.len()) {
                let mut matches = true;
                for k in 0..title_words.len() {
                    let clean_word: String = words[i+k].chars().filter(|c| c.is_alphabetic()).collect();
                    let clean_title: String = title_words[k].chars().filter(|c| c.is_alphabetic()).collect();
                    if clean_word != clean_title {
                        matches = false;
                        break;
                    }
                }
                if matches {
                    found_idx = Some(i);
                    break;
                }
            }

            if let Some(idx) = found_idx {
                let mut is_framed = false;
                let mut matched_word = String::new();
                
                // Words before
                let check_start = idx.saturating_sub(2);
                for i in check_start..idx {
                    let clean_w = words[i].chars().filter(|c| c.is_alphabetic()).collect::<String>();
                    if emotion_words.contains(&clean_w.as_str()) {
                        is_framed = true;
                        matched_word = clean_w;
                        break;
                    }
                }

                // Words after
                if !is_framed {
                    let check_end = (idx + title_words.len() + 2).min(words.len());
                    for i in (idx + title_words.len())..check_end {
                        let clean_w = words[i].chars().filter(|c| c.is_alphabetic()).collect::<String>();
                        if emotion_words.contains(&clean_w.as_str()) {
                            is_framed = true;
                            matched_word = clean_w;
                            break;
                        }
                    }
                }

                if is_framed {
                    framed_occurrences += 1;
                    flags.push(LyricFlag {
                        type_: FlagType::Positive,
                        line_number: line.line_number,
                        message: format!(
                            "Title is beautifully framed by the high-emotion word '{}'. This highlights the hook.",
                            matched_word
                        ),
                    });
                }
            }
        }
    }

    let (raw_score, feedback) = if title_occurrences == 0 {
        (0.2, format!("The title '{}' was not found in your lyrics. Put it in the chorus to anchor the listener.", input.title))
    } else {
        let ratio = framed_occurrences as f64 / title_occurrences as f64;
        if ratio >= 0.50 {
            (1.0, format!(
                "Excellent! {:.0}% of your title mentions are framed by active or emotional words. This makes your title stand out.",
                ratio * 100.0
            ))
        } else if ratio > 0.0 {
            (0.7, format!(
                "Some of your title mentions ({:.0}%) are framed by emotional words. Try framing the other mentions with active verbs or strong nouns to give them more context.",
                ratio * 100.0
            ))
        } else {
            (0.4, "Your title mentions are surrounded by passive or generic words. Try preceding or following the title with high-impact emotional words (e.g. 'burning love', 'cry empty space').".to_string())
        }
    };

    let weight = 0.030;

    TechniqueResult {
        id: "T33".to_string(),
        name: "Title Framing".to_string(),
        author: "Julia Michaels".to_string(),
        description: "The title phrase should be surrounded by high-emotion or action-oriented words immediately preceding or following it.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback,
        flags,
        active: true,
        group_id: None,
    }
}
