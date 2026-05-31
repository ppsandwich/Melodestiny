use crate::types::{AnalysisInput, AnalysisOutput, LyricLine};
use crate::syllable::count_line_syllables;
use crate::section::detect_section;
use crate::techniques::{t01_melodic_math, t08_title_brevity};

pub fn analyze_input(input: &AnalysisInput) -> AnalysisOutput {
    let mut lines = Vec::new();
    let mut current_section = None;
    
    for (i, line) in input.lyrics.lines().enumerate() {
        let text = line.trim();
        
        if let Some(sec) = detect_section(text) {
            current_section = Some(sec);
            // We can decide to either include section labels as empty text or parse them out.
            // The PRD says "Filters out section labels (lines matching section patterns)".
            // For now, let's keep them with a special flag or just empty syllables.
        }
        
        let syllables = count_line_syllables(text);
        
        lines.push(LyricLine {
            line_number: i + 1,
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

    let total_score = techniques.iter().map(|t| t.weighted_score).sum();

    AnalysisOutput {
        total_score,
        techniques,
        highlighted_lyrics: lines,
        markup_download: String::new(),
        auto_partitioned: false,
    }
}
