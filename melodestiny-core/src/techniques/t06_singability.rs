use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut total_lines = 0;
    let mut difficult_lines = 0;

    for line in lines {
        if line.text.trim().is_empty() { continue; }
        total_lines += 1;

        let chars: Vec<char> = line.text.to_lowercase().chars().filter(|c| c.is_alphabetic() || c.is_whitespace()).collect();
        
        let mut consonant_clusters = 0;
        let mut current_cluster = 0;
        let mut total_alphabetic = 0;

        for &c in &chars {
            if c.is_whitespace() { continue; }
            total_alphabetic += 1;

            if !matches!(c, 'a' | 'e' | 'i' | 'o' | 'u' | 'y') {
                current_cluster += 1;
                if current_cluster > 2 {
                    consonant_clusters += 1; // cluster of 3+ consonants
                }
            } else {
                current_cluster = 0;
            }
        }

        let density = if total_alphabetic > 0 {
            consonant_clusters as f64 / total_alphabetic as f64
        } else {
            0.0
        };

        if density > 0.15 { // threshold adjusted for the metric logic
            difficult_lines += 1;
            flags.push(LyricFlag {
                type_: FlagType::Negative,
                line_number: line.line_number,
                message: "High consonant cluster density. This line might be hard to sing quickly.".to_string(),
            });
        }
    }

    let diff_ratio = if total_lines > 0 {
        difficult_lines as f64 / total_lines as f64
    } else {
        0.0
    };

    let raw_score = if total_lines == 0 {
        1.0
    } else {
        (1.0 - diff_ratio).clamp(0.0, 1.0)
    };

    let weight = 0.056;

    TechniqueResult {
        id: "T06".to_string(),
        name: "Singability Metrics".to_string(),
        author: "Max Martin".to_string(),
        description: "If you can't sing it a cappella walking down the street, rewrite it.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Excellent singability. Consonant clusters are kept to a minimum.".to_string()
        } else {
            "Some lines have dense consonant clusters, making them difficult to enunciate at tempo.".to_string()
        },
        flags,
    }
}
