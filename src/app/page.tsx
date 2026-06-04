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
import { faPenFancy, faChevronDown, faChevronUp, faUndo, faKey } from "@fortawesome/free-solid-svg-icons";
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

  // States for generated candidates selection sequence
  const [candidates, setCandidates] = useState<any[]>([]);
  const [winnerIndex, setWinnerIndex] = useState<number>(-1);
  const [generationState, setGenerationState] = useState<"idle" | "preview" | "selecting" | "expanding">("idle");
  
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

  // Orchestrate candidate selection and expansion transition sequence
  useEffect(() => {
    if (generationState === "preview") {
      const timer = setTimeout(() => {
        setGenerationState("selecting");
      }, 3500); // Allow 3.5s for cards and stamps to animate in
      return () => clearTimeout(timer);
    } else if (generationState === "selecting") {
      const timer = setTimeout(() => {
        setGenerationState("expanding");
      }, 2500); // 2.5s showing winner selection glow
      return () => clearTimeout(timer);
    } else if (generationState === "expanding") {
      const timer = setTimeout(() => {
        if (winnerIndex >= 0 && candidates[winnerIndex]) {
          const winner = candidates[winnerIndex];
          const winningLyrics = winner.result.highlighted_lyrics.map((line: any) => {
            return line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
          }).join('\n');

          setTitle(winner.candidate.title);
          setLyrics(winningLyrics);
          setResult(winner.result);

          localStorage.setItem("melodestiny_title", winner.candidate.title);
          localStorage.setItem("melodestiny_lyrics", winningLyrics);
        }
        setGenerationState("idle");
        setCandidates([]);
        setWinnerIndex(-1);
      }, 1000); // 1s to scale up winning card and blur/fade overlay
      return () => clearTimeout(timer);
    }
  }, [generationState, winnerIndex, candidates]);

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
    
    const systemPrompt = `You are a multi-platinum, award-winning pop songwriter.
Generate a song based on the user's request, strictly optimizing for the following Melodestiny grading engine criteria to achieve a perfect 100/100 score:

1. STRUCTURE & PLAYLIST PATHWAYS (T02, T13, T15):
   - Use standard structural progression: [Verse 1], [Chorus], [Post-Chorus], [Verse 2], [Chorus], [Post-Chorus], [Bridge], [Chorus], [Outro].
   - Place the [Chorus] early (right after Verse 1).
   - The [Post-Chorus] must be a short, repetitive fragment of the hook.

2. MELODIC MATH & CONSISTENCY (T01, T07, T10, T23, T34):
   - Syllables per line must be identical/consistent within each section (e.g., all lines in [Verse 1] have exactly 8 syllables; all lines in [Chorus] have exactly 6 syllables).
   - Keep sections symmetric: [Verse 1] and [Verse 2] must have the exact same number of lines.
   - Keep the pacing simple: at least 60% of all lines should have 4 to 8 syllables.
   - Syllable Gradient: Verses should have a fast, wordy syllable count (e.g., 9-10 syllables/line), while the Chorus is spacious (e.g., 5-6 syllables/line).

3. HOOKS, REPETITIONS & TITLES (T03, T04, T05, T08, T26, T30, T31, T33):
   - Choose a title of exactly 2 to 4 words. Use alliteration or assonance in it (e.g. "Silver Shiver").
   - Place the title as the exact first line AND last line of the [Chorus].
   - Repeat the title hook phrase relentlessly in the Chorus and Post-Chorus (aim for 30%-60% repetition density in the whole song).
   - Frame the title with highly emotional or sensory words (e.g., "lost in Silver Shiver", "crying Silver Shiver").
   - Add parenthetical backing vocals or backing ad-libs (e.g., "I want you (want you)").
   - Bookends: Make the first line of the song (Verse 1 Line 1) and the last line of the song (Outro/Chorus last line) identical or share the same vocabulary.

4. PHONETICS & SINGABILITY (T06, T27, T28):
   - Write using singable, open-vowel fluid words (legato). Avoid hard consonant clusters ("strengths", "promptly").
   - Incorporate clear alliteration and assonance (e.g. "cold clay coffee cup").
   - End lines with a balance of legato (vowels like "go", "sky") and staccato (stop consonants like "back", "night").

5. NARRATIVE, TENSE & IMAGERY (T11, T12, T14, T16, T17, T18, T19, T20, T21, T22, T24, T29, T32, T35):
   - Vocabulary: Use extremely simple, common English words (T11).
   - Direct Address: Relational pronouns (I, you, me, my, we, us) should represent 8%-18% of all words (T12).
   - Concrete Imagery: Use sensory objects (T17) (e.g., "red car", "cold rain", "paper cup").
   - Narrative Specificity: Use specific nouns (T24) ("Friday", "2 AM", "Sunset Blvd").
   - Raw Emotion: Include at least 3 visceral, body-focused terms (T22) ("bones", "lungs", "blood", "skin").
   - Tense: Keep the entire song in a single consistent tense (e.g., present tense) (T18).
   - Jaccard Contrast: Verses and Choruses must share less than 30% of their vocabulary (T19). Verses should be descriptive (high lexical variety T29), while Choruses are repetitive.
   - Pronominal Shift: Use "I/You" in the Verses, and shift to "We/Our" in the Chorus/Bridge (T35).
   - Conversational: Sprinkle conversational words ("oh", "yeah", "hey") and call-response pacing (T20).
   - Pacing: Alternate punctuated line endings (end-stopped) with unpunctuated run-on lines (enjambment) (T32).

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
              { role: "user", content: `Write a pop song about: ${userPrompt}` }
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

      // Fetch 3 candidates in parallel
      const candidates = await Promise.all([
        callCandidate(),
        callCandidate(),
        callCandidate()
      ]);

      // Grade candidates
      const graded = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const input = { title: candidate.title, lyrics: candidate.lyrics };
            const resultJson = analyze(JSON.stringify(input));
            const parsedResult = JSON.parse(resultJson) as AnalysisOutput;
            parsedResult.highlighted_lyrics = await processSyllables(parsedResult.highlighted_lyrics);
            return {
              candidate,
              result: parsedResult,
              score: parsedResult.total_score
            };
          } catch (e) {
            console.error("Evaluation failed", e);
            return { candidate, result: null, score: -1 };
          }
        })
      );

      // Filter out any candidates that failed to generate (highly unlikely, but keep it robust)
      const validGraded = graded.filter(g => g.result !== null);
      if (validGraded.length === 0) {
        throw new Error("No candidates were successfully generated and analyzed.");
      }

      // Find highest score among valid ones
      let winningItem = validGraded[0];
      validGraded.forEach((item) => {
        if (item.score > winningItem.score) {
          winningItem = item;
        }
      });

      // Find the original index of this winner in the graded array (so it aligns with cards)
      const winIdx = graded.indexOf(winningItem);

      setCandidates(graded);
      setWinnerIndex(winIdx);
      setGenerationState("preview");

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
            <label htmlFor="title" className="font-display text-xl text-ink">Song Title</label>
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

      {/* Draft Candidates Selection Overlay */}
      {generationState !== "idle" && candidates.length > 0 && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 bg-parchment/95 dark:bg-parchment/95 backdrop-blur-md overflow-hidden transition-opacity duration-1000 ${
            generationState === "expanding" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")` }}
        >
          {/* Header Section */}
          <div className={`text-center max-w-2xl mb-8 transition-opacity duration-500 ${generationState === "expanding" ? "opacity-0" : "opacity-100"}`}>
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              OpenRouter Multi-Draft Evaluation
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3 text-ink">
              {generationState === "preview" 
                ? "Comparing Generated Drafts" 
                : "Winner Draft Selected!"}
            </h2>
            <p className="font-body italic text-sepia text-sm">
              {generationState === "preview" 
                ? "Analyzing and scoring lyric variations in WebAssembly..." 
                : "The highest-graded lyric composition is expanding..."}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-stretch justify-center w-full max-w-6xl overflow-y-auto max-h-[70vh] md:overflow-visible md:max-h-none px-4 py-2">
            {candidates.map((cand, idx) => {
              const isWinner = idx === winnerIndex;
              const isSelecting = generationState === "selecting";
              const isExpanding = generationState === "expanding";
              
              // Animated card classes
              let cardClass = "relative bg-cream border border-subtle rounded-lg shadow-card p-6 flex flex-col gap-4 overflow-hidden w-full max-w-sm md:w-1/3 md:max-w-none min-h-[360px] md:min-h-[420px]";
              
              // Add staggered entry animation
              if (idx === 0) cardClass += " animate-card-1";
              if (idx === 1) cardClass += " animate-card-2";
              if (idx === 2) cardClass += " animate-card-3";
              
              // Add selection & expansion states
              if (isSelecting) {
                if (isWinner) {
                  cardClass += " scale-105 border-gold winner-glow z-10 transition-all duration-[600ms] ease-out";
                } else {
                  cardClass += " opacity-30 blur-[1.5px] scale-95 transition-all duration-[600ms] ease-out";
                }
              } else if (isExpanding) {
                if (isWinner) {
                  cardClass += " scale-[3.5] rotate-3 opacity-0 blur-md transition-all duration-[900ms] ease-in-out z-50";
                } else {
                  cardClass += " opacity-0 scale-75 blur-lg transition-all duration-[900ms] ease-in-out";
                }
              } else {
                cardClass += " transition-all duration-[600ms] ease-out";
              }

              // Get first 6 lines of candidate's lyrics
              const lyricLines = cand.candidate.lyrics
                .split("\n")
                .filter((l: string) => l.trim().length > 0)
                .slice(0, 6);

              return (
                <div key={idx} className={cardClass}>
                  {/* Card Title Header */}
                  <div className="flex justify-between items-center border-b border-subtle/50 pb-2.5">
                    <span className="font-mono text-[10px] tracking-wider text-sepia/70 uppercase">
                      Draft {idx === 0 ? "Alpha" : idx === 1 ? "Beta" : "Gamma"}
                    </span>
                    {isSelecting && isWinner && (
                      <span className="font-display text-[10px] font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30 tracking-widest uppercase animate-pulse">
                        ⭐ Winner
                      </span>
                    )}
                  </div>

                  {/* Song Title */}
                  <div className="text-center py-2">
                    <h3 className="font-display text-xl font-bold text-ink transition-colors leading-snug">
                      {cand.candidate.title || "Untitled draft"}
                    </h3>
                  </div>

                  {/* Lyrics Snippet */}
                  <div className="relative overflow-hidden flex-grow my-2">
                    <div className="font-body text-xs text-sepia/80 whitespace-pre-line italic leading-relaxed text-left">
                      {lyricLines.map((line: string, lIdx: number) => (
                        <div key={lIdx} className="mb-1 truncate">
                          {line}
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-cream to-transparent pointer-events-none"></div>
                  </div>

                  {/* Score Area */}
                  <div className="mt-auto flex flex-col items-center justify-center pt-4 border-t border-subtle/50">
                    <div className={`relative w-20 h-20 rounded-full border border-dashed border-sepia/40 flex flex-col items-center justify-center font-mono select-none ${
                      idx === 0 ? "animate-stamp-1" : idx === 1 ? "animate-stamp-2" : "animate-stamp-3"
                    }`}>
                      <span className="text-[9px] text-sepia/50 tracking-wider uppercase leading-none mb-1">Score</span>
                      <span className="text-2xl font-bold text-ink leading-none">{cand.score}</span>
                      <span className="text-[8px] text-sepia/50 tracking-widest uppercase leading-none mt-1">Pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
