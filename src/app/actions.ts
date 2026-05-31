"use server";

import { LyricLine } from "@/lib/types";

export async function processSyllables(lines: LyricLine[]): Promise<LyricLine[]> {
  const sce = require("syllable-count-english");
  const Hypher = require("hypher");
  const english = require("hyphenation.en-us");
  
  // Override typography rules to force phonetics
  english.leftmin = 1;
  english.rightmin = 1;
  const h = new Hypher(english);

  function syllabify(word: string): string {
    const cleanWord = word.replace(/[.,;!?·]/g, '');
    if (cleanWord.length === 0) return word;
    
    try {
      if (sce.syllableCount(cleanWord) <= 1) {
        return word; // Don't split 1-syllable words!
      }
    } catch (e) {
      // fallback
    }

    return h.hyphenate(word).join('·');
  }

  return lines.map(line => {
    let inBracket = false;
    let inCurly = false;
    
    const syllabified_words = line.text.split(' ').map(word => {
      if (word.includes('[')) inBracket = true;
      if (word.includes('{')) inCurly = true;
      
      let res = word;
      if (!inBracket && !inCurly) {
         res = syllabify(word);
      }
      
      if (word.includes(']')) inBracket = false;
      if (word.includes('}')) inCurly = false;
      
      return res;
    });

    return {
      ...line,
      syllabified_words
    };
  });
}
