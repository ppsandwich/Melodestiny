use crate::types::{AnalysisInput, TechniqueResult};

pub fn analyze(input: &AnalysisInput) -> TechniqueResult {
    let word_count = input.title.split_whitespace().count();
    let (t08_raw, t08_feedback) = match word_count {
        1 => (0.7, "One-word titles are strong but can lack specificity.".to_string()),
        2..=4 => (1.0, "Perfect length! 2-4 words is the sweet spot for a pop title.".to_string()),
        5 => (0.5, "A bit long. Consider trimming to make it punchier.".to_string()),
        _ => (0.3, "Very long title. Hard to remember and feature on a hook.".to_string()),
    };
    
    let t08_weight = 0.032;
    
    TechniqueResult {
        id: "T08".to_string(),
        name: "Title Brevity".to_string(),
        author: "Diane Warren".to_string(),
        description: "The best titles are 2-4 words.".to_string(),
        raw_score: t08_raw,
        weight: t08_weight,
        weighted_score: t08_raw * t08_weight * 100.0,
        feedback: t08_feedback,
        flags: vec![],,
        active: true,
        group_id: None,
    }
}
