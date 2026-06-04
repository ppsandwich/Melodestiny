use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let past_verbs = ["was", "were", "did", "had", "got", "went", "knew", "thought", "felt", "saw", "came", "made", "took", "left", "kept", "held"];
    let present_verbs = ["am", "is", "are", "do", "does", "have", "has", "get", "go", "know", "think", "feel", "see", "come", "make", "take", "leave", "keep", "hold"];
    let future_verbs = ["will", "shall", "gonna", "won't"];

    let mut past_count = 0;
    let mut present_count = 0;
    let mut future_count = 0;
    
    let mut flags = Vec::new();

    for line in lines {
        let words: Vec<&str> = line.text.split_whitespace().collect();
        let mut line_has_verb = false;
        let mut line_tense = "";

        for word in words {
            let clean_word: String = word.to_lowercase().chars().filter(|c| c.is_alphabetic() || *c == '\'').collect();
            let clean_str = clean_word.as_str();

            if past_verbs.contains(&clean_str) || (clean_str.ends_with("ed") && clean_str.len() > 3) {
                past_count += 1;
                line_has_verb = true;
                line_tense = "past";
            } else if present_verbs.contains(&clean_str) || clean_str.ends_with("ing") {
                present_count += 1;
                line_has_verb = true;
                if line_tense.is_empty() { line_tense = "present"; }
            } else if future_verbs.contains(&clean_str) || clean_str == "ll" {
                future_count += 1;
                line_has_verb = true;
                if line_tense.is_empty() { line_tense = "future"; }
            }
        }
    }

    let total_verbs = past_count + present_count + future_count;
    let max_tense = past_count.max(present_count).max(future_count);
    
    let consistency = if total_verbs > 0 {
        max_tense as f64 / total_verbs as f64
    } else {
        1.0
    };

    let raw_score = if consistency >= 0.8 {
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: format!("Tense inconsistency detected ({:.0}% dominant tense). Mixing past, present, and future confuses the narrative.", consistency * 100.0),
        });
        (consistency / 0.8).clamp(0.0, 0.9)
    };

    let weight = 0.027;

    TechniqueResult {
        id: "T18".to_string(),
        name: "Tense Consistency".to_string(),
        author: "Diane Warren".to_string(),
        description: "Most pop songs stay in one tense. Switching tenses confuses the listener.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great tense consistency. The timeline of the narrative is clear.".to_string()
        } else {
            "Your song jumps around between tenses. Pick one timeline (usually present or past) and stick to it.".to_string()
        },
        flags,,
        active: true,
        group_id: Some("narrative_continuity".to_string()),
    }
}
