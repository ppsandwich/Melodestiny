use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AnalysisInput {
    pub title: String,
    pub lyrics: String,
}

#[derive(Serialize, Deserialize)]
pub struct AnalysisOutput {
    pub total_score: f64,
    pub techniques: Vec<TechniqueResult>,
    pub highlighted_lyrics: Vec<LyricLine>,
    pub markup_download: String,
    pub auto_partitioned: bool,
}

#[derive(Serialize, Deserialize)]
pub struct TechniqueResult {
    pub id: String,
    pub name: String,
    pub author: String,
    pub description: String,
    pub raw_score: f64,
    pub weight: f64,
    pub weighted_score: f64,
    pub feedback: String,
    pub flags: Vec<LyricFlag>,
}

#[derive(Serialize, Deserialize)]
pub struct LyricLine {
    pub line_number: usize,
    pub text: String,
    pub annotations: Vec<Annotation>,
    pub syllables: usize,
    pub section: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct LyricFlag {
    pub type_: FlagType,
    pub line_number: usize,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub enum FlagType {
    Positive,
    Neutral,
    Negative,
}

#[derive(Serialize, Deserialize)]
pub struct Annotation {
    pub type_: AnnotationType,
    pub technique_id: String,
    pub technique_name: String,
    pub author: String,
    pub message: String,
    pub start_idx: usize,
    pub end_idx: usize,
}

#[derive(Serialize, Deserialize)]
pub enum AnnotationType {
    Highlight,
    Warning,
    Note,
}
