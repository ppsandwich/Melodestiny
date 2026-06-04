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
  const [openRouterModel, setOpenRouterModel] = useState("anthropic/claude-3.5-sonnet");
  const [showApiPopover, setShowApiPopover] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredInitialAnalysis = useRef(false);

  // Load saved content and settings on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem("melodestiny_title") || "";
    const savedLyrics = localStorage.getItem("melodestiny_lyrics") || "";
    setTitle(savedTitle);
    setLyrics(savedLyrics);

    const savedKey = localStorage.getItem("melodestiny_openrouter_key") || "";
    const savedModel = localStorage.getItem("melodestiny_openrouter_model") || "anthropic/claude-3.5-sonnet";
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
Generate a song based on the user's request.

CRITICAL FORMATTING INSTRUCTIONS:
1. Respond with a valid JSON object ONLY. Do not wrap it in markdown formatting.
2. The JSON object MUST have exactly two keys:
   - "title": A catchy, brief song title (2-4 words).
   - "lyrics": The full lyrics, segmented with standard bracketed section headers (e.g., [Verse 1], [Chorus], [Bridge]).
3. Pay close attention to rhythm, flow, and structural variation.`;

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

      // Find the highest score
      const winner = graded.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), graded[0]);

      if (!winner.result) {
        throw new Error("No candidates were successfully generated and analyzed.");
      }

      // Load winning candidate
      const winningLyrics = winner.result.highlighted_lyrics.map(line => {
        return line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
      }).join('\n');

      setTitle(winner.candidate.title);
      setLyrics(winningLyrics);
      setResult(winner.result);

      localStorage.setItem("melodestiny_title", winner.candidate.title);
      localStorage.setItem("melodestiny_lyrics", winningLyrics);

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
                        <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B</option>
                        <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
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
              <label className="font-display text-xl text-ink">Lyrics Editor</label>
              
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
            
            <div className={`${(!result || isEditorExpanded) ? 'flex' : 'hidden lg:flex'} flex-col gap-2 flex-grow h-full min-h-[600px]`}>
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
              
              <ScoreBreakdown techniques={result.techniques} />
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center opacity-50 border-2 border-dashed border-subtle rounded-lg p-6 sm:p-12 text-center bg-cream/30 min-w-0 overflow-hidden">
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
