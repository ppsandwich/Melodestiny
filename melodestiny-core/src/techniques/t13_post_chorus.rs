use crate::types::{LyricLine, TechniqueResult, LyricFlag, FlagType};

pub fn analyze(lines: &[LyricLine]) -> TechniqueResult {
    let mut flags = Vec::new();
    let mut post_chorus_detected = false;
    let mut choruses_found = 0;

    let mut just_finished_chorus = false;
    let mut lines_since_chorus = 0;

    for line in lines {
        if let Some(sec) = &line.section {
            let lower = sec.to_lowercase();
            if lower.contains("chorus") {
                just_finished_chorus = true;
                lines_since_chorus = 0;
                choruses_found += 1;
            } else if lower.contains("post-chorus") || lower.contains("postchorus") {
                post_chorus_detected = true;
                flags.push(LyricFlag {
                    type_: FlagType::Positive,
                    line_number: line.line_number,
                    message: "Dedicated post-chorus section found.".to_string(),
                });
            } else if just_finished_chorus {
                just_finished_chorus = false;
            }
        }

        if just_finished_chorus && !line.text.trim().is_empty() {
            lines_since_chorus += 1;
            if lines_since_chorus <= 2 {
                let words: Vec<&str> = line.text.split_whitespace().collect();
                if words.len() <= 4 {
                    post_chorus_detected = true;
                    flags.push(LyricFlag {
                        type_: FlagType::Positive,
                        line_number: line.line_number,
                        message: "Short phrase directly after the chorus acts as a post-chorus drop/hook.".to_string(),
                    });
                }
            }
        }
    }

    let raw_score = if choruses_found == 0 {
        0.5
    } else if post_chorus_detected {
        1.0
    } else {
        flags.push(LyricFlag {
            type_: FlagType::Negative,
            line_number: 1,
            message: "No post-chorus drop detected. The chorus just ends.".to_string(),
        });
        0.4
    };

    let weight = 0.040;

    TechniqueResult {
        id: "T13".to_string(),
        name: "Post-Chorus Hook Fragment".to_string(),
        author: "Max Martin / Ian Kirkpatrick".to_string(),
        description: "The biggest songs feature a short, instrumental-driven post-chorus hook.".to_string(),
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100.0,
        feedback: if raw_score > 0.8 {
            "Great structural design! The post-chorus extends the high of the chorus.".to_string()
        } else {
            "Consider adding a 1-to-4 word post-chorus drop. Let an instrumental hook carry the melody here.".to_string()
        },
        flags,,
        active: true,
        group_id: None,
    }
}
