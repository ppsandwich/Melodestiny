"use client";

import { useState } from "react";
import { AnalysisOutput, AnalysisInput } from "@/lib/types";
// Import the WASM module dynamically to avoid SSR issues
// Import the WASM module dynamically to avoid SSR issues
import init, { analyze } from "@/wasm/melodestiny-core";
import { TechniqueScoresCard } from "@/components/TechniqueScoresCard";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { LyricEditor } from "@/components/LyricEditor";
import { processSyllables } from "@/app/actions";
import { demoSongs } from "@/lib/demoSongs";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenFancy, faChevronDown, faChevronUp, faUndo, faKey, faSave, faFolderOpen, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wasmReady, setWasmReady] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const [openRouterKey, setOpenRouterKey] = useState("");
  const [openRouterModel, setOpenRouterModel] = useState("anthropic/claude-opus-4.7");
  const [showApiPopover, setShowApiPopover] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for last generated prompt to support regeneration
  const [lastPrompt, setLastPrompt] = useState("");

  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [showLibraryPopover, setShowLibraryPopover] = useState(false);
  const [savedSongsList, setSavedSongsList] = useState<any[]>([]);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredInitialAnalysis = useRef(false);

  // Load saved content and settings on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem("melodestiny_title") || "";
    const savedLyrics = localStorage.getItem("melodestiny_lyrics") || "";
    setTitle(savedTitle);
    setLyrics(savedLyrics);

    const savedKey = localStorage.getItem("melodestiny_openrouter_key") || "";
    const savedModel = localStorage.getItem("melodestiny_openrouter_model") || "anthropic/claude-opus-4.7";
    setOpenRouterKey(savedKey);
    setOpenRouterModel(savedModel);

    const savedPrompt = localStorage.getItem("melodestiny_last_prompt") || "";
    setLastPrompt(savedPrompt);

    const savedSongsStr = localStorage.getItem("melodestiny_saved_songs") || "[]";
    try {
      setSavedSongsList(JSON.parse(savedSongsStr));
    } catch (e) {
      setSavedSongsList([]);
    }
  }, []);

  // Initialize WASM
  useEffect(() => {
    init().then(() => setWasmReady(true)).catch(console.error);
  }, []);

  // Trigger initial analysis once WASM is ready and content is loaded
  useEffect(() => {
    if (wasmReady && title && lyrics && !hasTriggeredInitialAnalysis.current) {
      hasTriggeredInitialAnalysis.current = true;
      triggerAnalysis(title, lyrics);
    }
  }, [wasmReady, title, lyrics]);

  const triggerAnalysis = (currentTitle: string, currentLyrics: string) => {
    if (!wasmReady || !currentTitle || !currentLyrics) {
      if (!currentLyrics) setResult(null);
      return;
    }
    
    setIsAnalyzing(true);
    
    // Process asynchronously to not block main thread
    setTimeout(async () => {
      try {
        const input: AnalysisInput = { title: currentTitle, lyrics: currentLyrics };
        const resultJson = analyze(JSON.stringify(input));
        const parsed = JSON.parse(resultJson) as AnalysisOutput;
        parsed.highlighted_lyrics = await processSyllables(parsed.highlighted_lyrics);
        
        // Auto-inject delimiters back into the raw text so the transparent overlay aligns!
        const newLyrics = parsed.highlighted_lyrics.map(line => {
          return line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
        }).join('\n');
        
        // Only update if it actually changed to avoid cursor jumps
        if (newLyrics !== currentLyrics) {
          setLyrics(newLyrics);
          localStorage.setItem("melodestiny_lyrics", newLyrics);
        }
        
        setResult(parsed);
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 50);
  };

  // Debounce the lyrics input by 2 seconds
  const handleLyricsChange = (newLyrics: string) => {
    setLyrics(newLyrics);
    localStorage.setItem("melodestiny_lyrics", newLyrics);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      triggerAnalysis(title, newLyrics);
    }, 2000);
  };

  // Also re-analyze if title changes (with debounce)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    localStorage.setItem("melodestiny_title", newTitle);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      triggerAnalysis(newTitle, lyrics);
    }, 2000);
  };

  const handleLoadDemo = () => {
    const randomSong = demoSongs[Math.floor(Math.random() * demoSongs.length)];
    setTitle(randomSong.title);
    setLyrics(randomSong.lyrics);
    localStorage.setItem("melodestiny_title", randomSong.title);
    localStorage.setItem("melodestiny_lyrics", randomSong.lyrics);
    triggerAnalysis(randomSong.title, randomSong.lyrics);
  };

  const handleGenerateLyrics = async (userPrompt: string) => {
    if (!openRouterKey) {
      alert("Please configure your OpenRouter API Key in the top-right menu first.");
      return;
    }
    
    setIsGenerating(true);
    const promptSubject = userPrompt.trim() || "a random catchy subject (e.g. love, summer, late nights, or moving on)";
    
    const systemPrompt = `You are a multi-platinum, award-winning pop songwriter.
Your task is to generate a song based on the user's request. To achieve the highest possible quality and rating, you must strategically optimize for these songwriting rules:

Structure & Repetition:
- Place the [Chorus] section early (before the third section, e.g., Verse 1 -> Chorus) and repeat it at least twice.
- Repeat the key hook line inside the [Chorus] or [Post-Chorus] 3 to 4 times.
- Ensure 30% to 60% of all lines in the song are repeated lines.
- Sections of the same category (e.g., [Verse 1] and [Verse 2]) must have the exact same number of lines.
- Include a [Post-Chorus] section immediately following each [Chorus] containing a short, repetitive hook.
- Follow the standard structure: Intro, Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus, Outro.
- Make the first line of the song and the last line of the song (in Outro or last Chorus) identical or highly similar in vocabulary.
- Repeat the exact song title between 4 and 10 times across the entire song.
- Start consecutive lines inside the Chorus with words sharing the same starting consonant letter.
- The Outro must echo the Chorus, sharing between 30% and 70% of its vocabulary (a modified echo, not a direct copy).

Rhythm & Pacing:
- Keep syllable counts per line consistent within each section (e.g., all verse lines are 8 syllables; all chorus lines are 6 syllables).
- Ensure parallel lines within a section have nearly identical syllable counts (Coefficient of Variation <= 0.25).
- Write the majority (>= 60%) of all lines in the song with exactly 4 to 8 syllables.
- Alternate long lines with short lines within sections.
- Shift average syllable counts per line significantly between Verses and Choruses.
- Make the lines in the [Outro] section at least 20% shorter in syllables on average than the rest of the song.
- Ensure the [Pre-Chorus] contains at least 15% more syllables per line on average than the preceding Verse.
- Write Chorus lines so that 40% to 70% of them have odd syllable counts (e.g., 5, 7, or 9 syllables).
- Include a section (like a Pre-Chorus) where the average syllable count per line drops by 40% or more compared to surrounding sections.
- Insert at least two pauses: either short 1-2 word lines or consecutive empty lines.

Titles, Hooks & Framing:
- Place the exact song title in the [Chorus], ideally as the first and/or last line of the section.
- Make the song title exactly 2, 3, or 4 words long.
- Choose a title that uses alliteration, assonance, or rhyme.
- Include 1-2 parenthetical backing ad-libs (e.g., "(yeah)", "(want you)") in the Chorus and Outro.
- Precede or follow occurrences of the song title with high-emotion or sensory words.
- If the title has multiple words, start or end it with a multi-syllable noun or verb (avoiding articles/pronouns).

Phonetics & Texture:
- Use fluid words with open vowels; avoid words with hard consonant clusters.
- Use adjacent words with repeating initial consonants or repeating vowel sounds inside lines.
- End a balanced mix (35% to 65%) of lines on soft vowel sounds (legato) versus hard consonant stops (staccato).
- End Verse lines mostly with dark, closed vowels (O, U, OO sounds) and Chorus lines with bright, open vowels (A, E, I sounds).

Narrative & Lexicon:
- Direct address pronouns (I, you, me, my, we, us, your) must represent between 8% and 18% of total words.
- Introduce entirely new metaphors and vocabulary in the [Bridge] section (at least 40% new words not used elsewhere).
- The [Chorus] must contain higher emotional and high-arousal word density than the [Verse].
- Use concrete nouns (e.g., car, rain, window, coffee, mirror) representing 8% to 25% of total words.
- Keep the entire song in a single grammatical tense (present or past), targeting >= 80% consistency.
- Use different vocabulary in Verses vs. Choruses (Jaccard similarity < 30%).
- Sprinkle conversational ad-libs ("oh", "yeah", "hey") and call-and-response questions.
- Start the first line of the song with at least two of: a question, a pronoun, or a concrete scene word.
- Use concrete details like proper nouns, street names, days, times, or specific numbers.
- Shift pronouns across sections (e.g., singular "I/you" in verses to collective "we/our" in the Chorus/Bridge).
- Include at least 2 temporal anchors (morning, night, summer, years, seasons).
- Engage at least 3 distinct senses (Sight, Sound, Touch, Taste/Smell).
- Use at least 3 distinct words belonging to a single metaphor domain (Water/Ocean, Fire/Heat, Space/Sky, or Battle).
- Use active action verbs over passive/linking verbs in a ratio of at least 2:1.
- Pose between 2 and 5 questions throughout the verses or bridge.
- Juxtapose at least 2 contrasting antonym word pairs.
- Balance pronouns with concrete nouns; pronouns should represent 8% to 15% of all words.
- Include internal rhymes in at least 3 lines.
- Use conditional words/phrases (if, could, would, wish, maybe) at least 3 times.
- Keep rhyme schemes consistent across parallel sections.
- Use simple, common English words of 2 or fewer syllables.
- Use visceral, body-focused language (e.g., bones, lungs, skin, blood).
- Ensure verses are lexically varied (high vocabulary diversity) while choruses are highly repetitive.
- Mix run-on thoughts (enjambed lines) with complete, punctuated thoughts (end-stopped lines).
- Mix short 1-syllable and long 3+ syllable words in at least 20% of lines.

Style Choices (Choose exactly one option per group):
- Repetition: Relentless key hook line repetition inside Chorus/Post-Chorus OR 30% to 60% of all lines are repeated.
- Rhythm/Melody: Keep parallel lines' syllable counts consistent OR write at least 60% of lines with 4 to 8 syllables OR shift average syllable counts between Verse and Chorus.
- Vocabulary: Use simple words of <= 2 syllables OR use visceral body terms OR mix short and long words in >= 20% of lines.
- Structure: Follow standard pop outline OR make first and last lines identical.
- Narrative: Keep a single grammatical tense OR shift pronouns across sections.

CRITICAL FORMATTING INSTRUCTIONS:
1. Respond with a valid JSON object ONLY. Do not wrap it in markdown formatting or code blocks.
2. The JSON object MUST have exactly two keys:
   - "title": A catchy title matching the rules.
   - "lyrics": The full lyrics structured with headers.`;


    try {
      const callCandidate = async () => {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://melodestiny.com",
            "X-Title": "Melodestiny"
          },
          body: JSON.stringify({
            model: openRouterModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Write a pop song about: ${promptSubject}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.9
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        return JSON.parse(content) as { title: string; lyrics: string };
      };

      const candidate = await callCandidate();
      
      const input = { title: candidate.title, lyrics: candidate.lyrics };
      const resultJson = analyze(JSON.stringify(input));
      const parsedResult = JSON.parse(resultJson) as AnalysisOutput;
      parsedResult.highlighted_lyrics = await processSyllables(parsedResult.highlighted_lyrics);
      
      const winningLyrics = parsedResult.highlighted_lyrics.map(line => {
        return line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
      }).join('\n');

      setTitle(candidate.title);
      setLyrics(winningLyrics);
      setResult(parsedResult);

      localStorage.setItem("melodestiny_title", candidate.title);
      localStorage.setItem("melodestiny_lyrics", winningLyrics);
      
      setLastPrompt(userPrompt);
      localStorage.setItem("melodestiny_last_prompt", userPrompt);

    } catch (err: any) {
      alert("Lyric generation failed: " + (err.message || err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("melodestiny_title");
    localStorage.removeItem("melodestiny_lyrics");
    setTitle("");
    setLyrics("");
    setResult(null);
  };

  const handleSaveSong = () => {
    if (!title.trim() && !lyrics.trim()) {
      alert("Cannot save an empty song. Please enter a title or lyrics first.");
      return;
    }

    const songTitle = title.trim() || "Untitled Song";
    const savedSongsStr = localStorage.getItem("melodestiny_saved_songs") || "[]";
    let songs: any[] = [];
    try {
      songs = JSON.parse(savedSongsStr);
    } catch (e) {
      songs = [];
    }

    // Check if song with same title exists
    const existingIndex = songs.findIndex(s => s.title.toLowerCase() === songTitle.toLowerCase());
    
    const newSong = {
      id: existingIndex >= 0 ? songs[existingIndex].id : Date.now().toString(),
      title: songTitle,
      lyrics: lyrics,
      savedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      const confirmOverwrite = window.confirm(`A song with the title "${songTitle}" already exists. Do you want to overwrite it?`);
      if (!confirmOverwrite) {
        return;
      }
      songs[existingIndex] = newSong;
    } else {
      songs.push(newSong);
    }

    localStorage.setItem("melodestiny_saved_songs", JSON.stringify(songs));
    setSavedSongsList(songs);

    setIsSaveSuccess(true);
    setTimeout(() => {
      setIsSaveSuccess(false);
    }, 1500);
  };

  const handleRestoreSong = (song: any) => {
    if (lyrics.trim().length > 0) {
      const isDifferent = title !== song.title || lyrics !== song.lyrics;
      if (isDifferent) {
        const confirmRestore = window.confirm(
          "Warning: Restoring this song will overwrite your current work in the editor. Any unsaved edits will be lost. Proceed?"
        );
        if (!confirmRestore) {
          return;
        }
      }
    }

    setTitle(song.title);
    setLyrics(song.lyrics);
    localStorage.setItem("melodestiny_title", song.title);
    localStorage.setItem("melodestiny_lyrics", song.lyrics);

    triggerAnalysis(song.title, song.lyrics);
    setShowLibraryPopover(false);
  };

  const handleDeleteSavedSong = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this song from your library?");
    if (!confirmDelete) return;

    const savedSongsStr = localStorage.getItem("melodestiny_saved_songs") || "[]";
    let songs: any[] = [];
    try {
      songs = JSON.parse(savedSongsStr);
    } catch (e) {
      songs = [];
    }

    const filtered = songs.filter(s => s.id !== id);
    localStorage.setItem("melodestiny_saved_songs", JSON.stringify(filtered));
    setSavedSongsList(filtered);
  };

  const handleExportLyrics = () => {
    const cleanLyrics = lyrics.replace(/·/g, '');
    const blob = new Blob([cleanLyrics], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "lyrics"}_raw.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center w-full overflow-hidden">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-8 min-w-0 mt-[30px]">
        
        {/* Left Column: Unified Editor */}
        <div className="flex flex-col gap-6 min-w-0">
          <header className="mb-4 relative">
            <div className="absolute top-0 right-0 z-20 flex items-center gap-3">
              {/* API Settings Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowApiPopover(!showApiPopover)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-cream shadow-card border transition-colors focus:outline-none cursor-pointer ${
                    showApiPopover ? 'border-gold text-gold' : 'border-subtle text-sepia hover:text-gold'
                  }`}
                  aria-label="OpenRouter API Configuration"
                  title="Configure OpenRouter API"
                >
                  <FontAwesomeIcon icon={faKey} className="text-sm" />
                </button>
                
                {showApiPopover && (
                  <div className="absolute right-0 mt-2 bg-cream border border-subtle rounded-md shadow-lg p-4 w-72 z-50 flex flex-col gap-3.5 text-left text-ink">
                    <h4 className="font-display font-semibold text-sm border-b border-subtle/50 pb-1.5 text-gold uppercase tracking-wider">
                      OpenRouter Config
                    </h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] text-sepia uppercase tracking-widest font-bold">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-or-..."
                        value={openRouterKey}
                        onChange={(e) => {
                          setOpenRouterKey(e.target.value);
                          localStorage.setItem("melodestiny_openrouter_key", e.target.value);
                        }}
                        className="w-full text-xs font-mono p-2 border border-subtle bg-parchment/20 rounded outline-none focus:border-gold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] text-sepia uppercase tracking-widest font-bold">
                        Model
                      </label>
                      <select
                        value={openRouterModel}
                        onChange={(e) => {
                          setOpenRouterModel(e.target.value);
                          localStorage.setItem("melodestiny_openrouter_model", e.target.value);
                        }}
                        className="w-full text-xs font-body p-2 border border-subtle bg-parchment/20 rounded outline-none focus:border-gold cursor-pointer"
                      >
                        <option value="anthropic/claude-opus-4.7">Claude Opus 4.7</option>
                        <option value="deepseek/deepseek-v4-pro">DeepSeek V4 Pro</option>
                        <option value="xiaomi/mimo-v2.5-pro">MiMo-V2.5-Pro</option>
                        <option value="minimax/minimax-m2.7">Minimax M2.7</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setShowApiPopover(false)}
                      className="mt-1.5 px-3 py-2 rounded bg-gold text-cream hover:bg-gold-hover transition-colors font-display font-medium text-xs tracking-wider uppercase shadow-sm cursor-pointer text-center"
                    >
                      Save Configuration
                    </button>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSong}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-cream shadow-card border border-subtle text-sepia hover:text-gold transition-colors focus:outline-none cursor-pointer"
                aria-label="Save current song"
                title="Save Current Song"
              >
                <FontAwesomeIcon icon={isSaveSuccess ? faCheck : faSave} className={`text-sm ${isSaveSuccess ? 'text-sage' : ''}`} />
              </button>

              {/* Restore Library Button */}
              <div className="relative">
                <button
                  onClick={() => setShowLibraryPopover(!showLibraryPopover)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-cream shadow-card border transition-colors focus:outline-none cursor-pointer ${
                    showLibraryPopover ? 'border-gold text-gold' : 'border-subtle text-sepia hover:text-gold'
                  }`}
                  aria-label="Open Saved Songs Library"
                  title="Saved Songs Library"
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="text-sm" />
                </button>
                
                {showLibraryPopover && (
                  <div className="absolute right-0 mt-2 bg-cream border border-subtle rounded-md shadow-lg p-4 w-72 z-50 flex flex-col gap-3.5 text-left text-ink">
                    <h4 className="font-display font-semibold text-sm border-b border-subtle/50 pb-1.5 text-gold uppercase tracking-wider">
                      Saved Songs
                    </h4>
                    {savedSongsList.length === 0 ? (
                      <p className="font-body text-xs text-sepia/70 italic py-2">
                        No saved songs in library.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                        {savedSongsList.map((song) => (
                          <li key={song.id} className="flex justify-between items-center gap-2 p-1.5 rounded hover:bg-parchment/30 transition-colors group">
                            <button
                              onClick={() => handleRestoreSong(song)}
                              className="flex-1 text-left text-xs font-body font-medium hover:text-gold transition-colors truncate cursor-pointer pr-1"
                              title={`Restore: ${song.title}`}
                            >
                              {song.title || "Untitled Song"}
                              <span className="block text-[9px] text-sepia/55 font-mono">
                                {new Date(song.savedAt).toLocaleDateString()}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteSavedSong(song.id)}
                              className="text-sepia/50 hover:text-rust opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1"
                              title="Delete song"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-cream shadow-card border border-subtle text-sepia hover:text-gold transition-colors focus:outline-none cursor-pointer"
                aria-label="Reset Application"
                title="Reset Application State"
              >
                <FontAwesomeIcon icon={faUndo} className="text-sm" />
              </button>
              <ThemeToggle />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-title mb-2 text-ink flex items-center gap-3 sm:gap-4 flex-wrap break-words pr-12">
              <FontAwesomeIcon icon={faPenFancy} className="text-gold opacity-90 flex-shrink-0" />
              Melodestiny
            </h1>
            <p className="font-body text-sepia italic text-lg break-words">
              The songwriter's analytical companion.
            </p>
          </header>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3">
              <label htmlFor="title" className="font-display text-xl text-ink">Song Title</label>
              {lyrics.trim() && (
                <button
                  onClick={() => handleGenerateLyrics(lastPrompt || title || "a pop song")}
                  className="font-mono text-xs text-sepia hover:text-gold transition-colors underline cursor-pointer"
                  title="Regenerate lyrics using the same prompt"
                >
                  Regenerate
                </button>
              )}
            </div>
            <input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-transparent border-b border-sepia/30 focus:border-gold outline-none p-2 font-body text-xl transition-colors w-full min-w-0"
              placeholder="e.g. Blank Space"
            />
          </div>

          <div className="flex flex-col gap-2 flex-grow h-full">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-3">
                <label className="font-display text-xl text-ink">Lyrics Editor</label>
                {lyrics.trim() && (
                  <button
                    onClick={handleExportLyrics}
                    className="font-mono text-xs text-sepia hover:text-gold transition-colors underline cursor-pointer"
                  >
                    Export
                  </button>
                )}
              </div>
              
              {/* Mobile Editor Accordion */}
              {result && (
                <button
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className="lg:hidden text-sepia hover:text-gold transition-colors text-sm font-mono flex items-center gap-2 outline-none"
                >
                  {isEditorExpanded ? (
                    <><span>Collapse</span><FontAwesomeIcon icon={faChevronUp} /></>
                  ) : (
                    <><span>Expand</span><FontAwesomeIcon icon={faChevronDown} /></>
                  )}
                </button>
              )}
            </div>
            
            <div className={`${(!result || isEditorExpanded) ? 'flex' : 'hidden lg:flex'} flex-col gap-2 flex-grow h-full min-h-[300px] sm:min-h-[900px]`}>
              <LyricEditor 
                value={lyrics} 
                onChange={handleLyricsChange} 
                lines={result?.highlighted_lyrics || null}
                isAnalyzing={isAnalyzing}
                onLoadDemo={handleLoadDemo}
                onGenerateLyrics={handleGenerateLyrics}
                isGenerating={isGenerating}
                hasApiKey={!!openRouterKey}
              />
              
              <div className="text-sm text-sepia/60 italic mt-2 text-right">
                Analysis runs automatically when you stop typing.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="flex flex-col gap-6 pt-0 lg:pt-[108px] min-w-0">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out min-w-0">

              <TechniqueScoresCard techniques={result.techniques} total_score={result.total_score} />
              
              <ScoreBreakdown techniques={result.techniques} lines={result.highlighted_lyrics} />
            </div>
          ) : (
            <div className="h-[300px] sm:h-[900px] flex flex-col items-center justify-center opacity-50 border-2 border-dashed border-subtle rounded-lg p-6 sm:p-12 text-center bg-cream/30 min-w-0 overflow-hidden">
              <div className="w-16 h-16 rounded-full border border-sepia/30 flex items-center justify-center mb-4 text-2xl flex-shrink-0">✍️</div>
              <p className="font-display text-2xl text-sepia mb-2 break-words">Awaiting Masterpiece</p>
              <p className="font-body text-sepia/80 max-w-sm break-words">Enter a title and start typing your lyrics. The engine will automatically analyze your song structure and phrasing.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
