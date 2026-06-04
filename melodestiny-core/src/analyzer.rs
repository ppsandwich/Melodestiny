use crate::types::{AnalysisInput, AnalysisOutput, LyricLine};
use crate::syllable::count_line_syllables;
use crate::section::detect_section;
use crate::techniques::{t01_melodic_math, t08_title_brevity};

pub fn analyze_input(input: &AnalysisInput) -> AnalysisOutput {
    let mut lines = Vec::new();
    let mut current_section = None;
    
    let mut line_counter = 0;
    for line in input.lyrics.lines() {
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
        auto_partitioned: false,
    }
}
