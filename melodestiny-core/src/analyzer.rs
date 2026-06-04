use crate::types::{AnalysisInput, AnalysisOutput, LyricLine};
use crate::syllable::count_line_syllables;
use crate::section::detect_section;
use crate::techniques::{t01_melodic_math, t08_title_brevity};

pub fn analyze_input(input: &AnalysisInput) -> AnalysisOutput {
    let clean_lyrics = input.lyrics.replace('·', "");
    let mut lines = Vec::new();
    let mut current_section = None;
    
    let mut line_counter = 0;
    for line in clean_lyrics.lines() {
        let text = line.trim();
        
        if let Some(sec) = detect_section(text) {
            current_section = Some(sec);
        }
        
        let is_empty = text.is_empty();
        let is_header = text.starts_with('[') || text.starts_with('{');
        
        let (line_number, syllables) = if is_empty || is_header {
            (0, 0)
        } else {
            line_counter += 1;
            (line_counter, count_line_syllables(text))
        };
        
        lines.push(LyricLine {
            line_number,
            text: line.to_string(),
            annotations: vec![],
            syllables,
            section: current_section.clone(),
        });
    }

    let has_explicit = has_explicit_sections(&lines);
    if !has_explicit {
        auto_partition(&mut lines);
    }

    let mut techniques = Vec::new();
    
    // T01 Melodic Math
    techniques.push(crate::techniques::t01_melodic_math::analyze(&lines));
    
    // T02 Chorus-First Structural Check
    techniques.push(crate::techniques::t02_chorus_first::analyze(&lines));
    
    // T03 Repetition Detection
    techniques.push(crate::techniques::t03_repetition::analyze(&lines));
    
    // T04 Mantra Density
    techniques.push(crate::techniques::t04_mantra_density::analyze(&lines));
    
    // T05 Hook Placement
    techniques.push(crate::techniques::t05_hook_placement::analyze(input, &lines));
    
    // T06 Singability Metrics
    techniques.push(crate::techniques::t06_singability::analyze(&lines));
    
    // T07 Line Length Consistency
    techniques.push(crate::techniques::t07_line_length::analyze(&lines));
    
    // T08 Title Brevity
    techniques.push(crate::techniques::t08_title_brevity::analyze(input));
    
    // T09 Rhyme Scheme Consistency
    techniques.push(crate::techniques::t09_rhyme_scheme::analyze(&lines));

    // T10 Section Length Parity
    techniques.push(crate::techniques::t10_section_parity::analyze(&lines));
    
    // T11 Vocabulary Simplicity
    techniques.push(crate::techniques::t11_vocabulary::analyze(&lines));
    
    // T12 Direct Address Pronoun Density
    techniques.push(crate::techniques::t12_pronoun_density::analyze(&lines));

    // T13 Post-Chorus Hook Fragment
    techniques.push(crate::techniques::t13_post_chorus::analyze(&lines));

    // T14 Bridge Vocabulary Novelty
    techniques.push(crate::techniques::t14_bridge_novelty::analyze(&lines));

    // T15 Structural Advisory
    techniques.push(crate::techniques::t15_structural::analyze(&lines));

    // T16 Emotional Arc Progression
    techniques.push(crate::techniques::t16_emotional_arc::analyze(&lines));

    // T17 Concrete Imagery Density
    techniques.push(crate::techniques::t17_concrete_imagery::analyze(&lines));

    // T18 Tense Consistency
    techniques.push(crate::techniques::t18_tense::analyze(&lines));

    // T19 Section Contrast Score
    techniques.push(crate::techniques::t19_section_contrast::analyze(&lines));

    // T20 Conversational Flow
    techniques.push(crate::techniques::t20_conversational::analyze(&lines));

    // T21 First Line Hook
    techniques.push(crate::techniques::t21_first_line::analyze(&lines));

    // T22 Raw Emotion Words
    techniques.push(crate::techniques::t22_raw_emotion::analyze(&lines));

    // T23 Melodic Simplicity Score
    techniques.push(crate::techniques::t23_melodic_simplicity::analyze(&lines));

    // T24 Narrative Specificity
    techniques.push(crate::techniques::t24_narrative::analyze(&lines));

    // T25 Tension and Release
    techniques.push(crate::techniques::t25_tension_release::analyze(&lines));

    // T26 Lyrical Bookends
    techniques.push(crate::techniques::t26_lyrical_bookends::analyze(&lines));

    // T27 Phonetic Alliteration & Assonance
    techniques.push(crate::techniques::t27_alliteration_assonance::analyze(&lines));

    // T28 Line-Ending Phonetic Texture
    techniques.push(crate::techniques::t28_phonetic_texture::analyze(&lines));

    // T29 Lexical Variety
    techniques.push(crate::techniques::t29_lexical_variety::analyze(&lines));

    // T30 Title Phonetic Catchiness
    techniques.push(crate::techniques::t30_title_catchiness::analyze(input));

    // T31 Parenthetical ad-libs
    techniques.push(crate::techniques::t31_parenthetical_adlibs::analyze(&lines));

    // T32 Enjambment Pacing
    techniques.push(crate::techniques::t32_enjambment_pacing::analyze(&lines));

    // T33 Title Framing
    techniques.push(crate::techniques::t33_title_framing::analyze(input, &lines));

    // T34 Syllable Gradient
    techniques.push(crate::techniques::t34_syllable_gradient::analyze(&lines));

    // T35 Narrative Pronominal Shift
    techniques.push(crate::techniques::t35_pronominal_shift::analyze(&lines));

    // Grouping & Contradiction Logic
    let groups = vec![
        "repetition_dynamics",
        "vocabulary_style",
        "melodic_complexity",
        "narrative_continuity",
        "structural_resolution",
    ];

    for group_name in groups {
        let mut indices = Vec::new();
        for (idx, t) in techniques.iter().enumerate() {
            if let Some(ref gid) = t.group_id {
                if gid == group_name {
                    indices.push(idx);
                }
            }
        }

        if !indices.is_empty() {
            let mut highest_idx = indices[0];
            let mut highest_score = techniques[highest_idx].weighted_score;

            for &idx in &indices[1..] {
                let score = techniques[idx].weighted_score;
                if score > highest_score {
                    highest_score = score;
                    highest_idx = idx;
                }
            }

            for &idx in &indices {
                if idx == highest_idx {
                    techniques[idx].active = true;
                } else {
                    techniques[idx].active = false;
                }
            }
        }
    }

    let active_weighted_sum: f64 = techniques.iter()
        .filter(|t| t.active)
        .map(|t| t.weighted_score)
        .sum();

    let active_weight_sum: f64 = techniques.iter()
        .filter(|t| t.active)
        .map(|t| t.weight)
        .sum();

    let total_score = if active_weight_sum > 0.0 {
        active_weighted_sum / active_weight_sum
    } else {
        0.0
    };

    AnalysisOutput {
        total_score,
        techniques,
        highlighted_lyrics: lines,
        markup_download: String::new(),
        auto_partitioned: !has_explicit,
    }
}

fn has_explicit_sections(lines: &[LyricLine]) -> bool {
    lines.iter().any(|line| {
        let t = line.text.trim();
        t.starts_with('[') || t.starts_with('{')
    })
}

fn auto_partition(lines: &mut [LyricLine]) {
    // 1. Group lines into blocks of indices
    let mut blocks: Vec<Vec<usize>> = Vec::new();
    let mut current_block = Vec::new();
    
    for (idx, line) in lines.iter().enumerate() {
        let trimmed = line.text.trim();
        if trimmed.is_empty() {
            if !current_block.is_empty() {
                blocks.push(current_block);
                current_block = Vec::new();
            }
        } else {
            current_block.push(idx);
        }
    }
    if !current_block.is_empty() {
        blocks.push(current_block);
    }
    
    let n = blocks.len();
    if n == 0 {
        return;
    }
    
    let mut labels = vec![None; n];
    
    if n == 1 {
        labels[0] = Some("Verse 1".to_string());
    } else {
        // Helper to get words in a block
        let get_words = |block_indices: &[usize], lines_ref: &[LyricLine]| -> std::collections::HashSet<String> {
            let mut words = std::collections::HashSet::new();
            for &idx in block_indices {
                for word in lines_ref[idx].text.split_whitespace() {
                    let clean: String = word.chars().filter(|c| c.is_alphabetic()).collect();
                    let lower = clean.to_lowercase();
                    if !lower.is_empty() {
                        words.insert(lower);
                    }
                }
            }
            words
        };
        
        // Helper to calculate block Jaccard
        let block_jaccard = |b1: &[usize], b2: &[usize], lines_ref: &[LyricLine]| -> f64 {
            let s1 = get_words(b1, lines_ref);
            let s2 = get_words(b2, lines_ref);
            if s1.is_empty() && s2.is_empty() {
                return 1.0;
            }
            if s1.is_empty() || s2.is_empty() {
                return 0.0;
            }
            let intersect = s1.intersection(&s2).count() as f64;
            let union = (s1.len() + s2.len()) as f64 - intersect;
            intersect / union
        };
        
        // Compute matches
        let mut matches = vec![Vec::new(); n];
        for i in 0..n {
            for j in 0..n {
                if i != j && block_jaccard(&blocks[i], &blocks[j], lines) >= 0.55 {
                    matches[i].push(j);
                }
            }
        }
        
        // Find repeated clusters
        let mut clusters: Vec<Vec<usize>> = Vec::new();
        let mut visited = std::collections::HashSet::new();
        for i in 0..n {
            if visited.contains(&i) {
                continue;
            }
            if !matches[i].is_empty() {
                let mut cluster = vec![i];
                cluster.extend(&matches[i]);
                for &idx in &cluster {
                    visited.insert(idx);
                }
                clusters.push(cluster);
            }
        }
        
        // Sort clusters by size desc
        clusters.sort_by(|c1, c2| c2.len().cmp(&c1.len()));
        
        let mut chorus_indices = std::collections::HashSet::new();
        if !clusters.is_empty() {
            for &idx in &clusters[0] {
                chorus_indices.insert(idx);
            }
        }
        
        let mut pre_chorus_indices = std::collections::HashSet::new();
        if clusters.len() > 1 {
            let cand = &clusters[1];
            let mut always_precedes = true;
            for &idx in cand {
                if idx + 1 >= n || !chorus_indices.contains(&(idx + 1)) {
                    always_precedes = false;
                    break;
                }
            }
            if always_precedes {
                for &idx in cand {
                    pre_chorus_indices.insert(idx);
                }
            }
        }
        
        for i in 0..n {
            if chorus_indices.contains(&i) {
                labels[i] = Some("Chorus".to_string());
            } else if pre_chorus_indices.contains(&i) {
                labels[i] = Some("Pre-Chorus".to_string());
            }
        }
        
        let mut verse_counter = 0;
        for i in 0..n {
            if labels[i].is_some() {
                continue;
            }
            
            if i == 0 && blocks[i].len() <= 3 {
                labels[i] = Some("Intro".to_string());
            } else if i == n - 1 && (blocks[i].len() <= 3 || (!clusters.is_empty() && block_jaccard(&blocks[i], &blocks[clusters[0][0]], lines) >= 0.25)) {
                labels[i] = Some("Outro".to_string());
            } else {
                let mut is_bridge = false;
                if n >= 4 && i > 0 && i < n - 1 {
                    let mut chorus_count_before = 0;
                    for k in 0..i {
                        if labels[k] == Some("Chorus".to_string()) {
                            chorus_count_before += 1;
                        }
                    }
                    if chorus_count_before >= 2 {
                        is_bridge = true;
                    }
                }
                
                if is_bridge {
                    labels[i] = Some("Bridge".to_string());
                } else {
                    verse_counter += 1;
                    labels[i] = Some(format!("Verse {}", verse_counter));
                }
            }
        }
    }
    
    // Assign sections to lines in blocks
    for (block_idx, block) in blocks.iter().enumerate() {
        if let Some(ref label) = labels[block_idx] {
            for &idx in block {
                lines[idx].section = Some(label.clone());
            }
        }
    }
    
    // Propagate section label to blank lines
    let mut current_label = None;
    for line in lines.iter_mut() {
        if line.section.is_some() {
            current_label = line.section.clone();
        } else {
            line.section = current_label.clone();
        }
    }
}
