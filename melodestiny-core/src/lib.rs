pub mod types;
pub mod analyzer;
pub mod syllable;
pub mod section;
pub mod techniques;

use wasm_bindgen::prelude::*;
use types::{AnalysisInput};
use analyzer::analyze_input;

#[wasm_bindgen]
pub fn analyze(input_json: &str) -> String {
    let input: AnalysisInput = serde_json::from_str(input_json).unwrap_or_else(|_| AnalysisInput {
        title: String::new(),
        lyrics: String::new(),
    });

    let output = analyze_input(&input);
    serde_json::to_string(&output).unwrap()
}
