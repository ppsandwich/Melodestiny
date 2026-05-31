pub fn detect_section(line: &str) -> Option<String> {
    let trimmed = line.trim();
    if trimmed.is_empty() {
        return None;
    }

    // Check for [Section]
    if trimmed.starts_with('[') && trimmed.ends_with(']') {
        return Some(trimmed[1..trimmed.len()-1].trim().to_string());
    }

    // Check for Section:
    if trimmed.ends_with(':') {
        return Some(trimmed[0..trimmed.len()-1].trim().to_string());
    }

    // Check for standalone keywords
    let lower = trimmed.to_lowercase();
    let keywords = ["verse", "chorus", "bridge", "pre-chorus", "post-chorus", "intro", "outro", "hook", "interlude", "refrain"];
    
    for kw in keywords {
        if lower.starts_with(kw) {
            return Some(trimmed.to_string());
        }
    }

    None
}
