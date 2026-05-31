pub fn count_syllables(word: &str) -> usize {
    let word = word.to_lowercase();
    // Strip punctuation
    let word: String = word.chars().filter(|c| c.is_alphabetic()).collect();
    if word.is_empty() {
        return 0;
    }
    
    let mut count = 0;
    let mut prev_is_vowel = false;
    let chars: Vec<char> = word.chars().collect();
    
    for (i, &c) in chars.iter().enumerate() {
        let is_vowel = matches!(c, 'a' | 'e' | 'i' | 'o' | 'u' | 'y');
        
        // Magic 'e' at the end of a word (not a syllable if it follows a consonant)
        if is_vowel && c == 'e' && i == chars.len() - 1 {
            // Check for consonant + le (e.g. "table", "handle")
            if i > 1 && chars[i-1] == 'l' && !matches!(chars[i-2], 'a' | 'e' | 'i' | 'o' | 'u' | 'y') {
                count += 1;
            }
            continue;
        }

        // Silent -ed
        if is_vowel && c == 'e' && i == chars.len() - 2 && chars[i+1] == 'd' {
            if i > 0 && !matches!(chars[i-1], 't' | 'd') {
                continue; // Silent e in -ed
            }
        }
        
        if is_vowel && !prev_is_vowel {
            count += 1;
        }
        prev_is_vowel = is_vowel;
    }
    
    if count == 0 {
        1
    } else {
        count
    }
}

pub fn count_line_syllables(line: &str) -> usize {
    let mut in_bracket = false;
    let mut in_curly = false;
    let mut cleaned_line = String::new();
    
    for c in line.chars() {
        match c {
            '[' => in_bracket = true,
            ']' => { in_bracket = false; continue; },
            '{' => in_curly = true,
            '}' => { in_curly = false; continue; },
            _ => {}
        }
        if !in_bracket && !in_curly {
            cleaned_line.push(c);
        }
    }
    
    cleaned_line.split_whitespace().map(count_syllables).sum()
}
