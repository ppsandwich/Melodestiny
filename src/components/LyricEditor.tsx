import { useRef, useEffect } from "react";
import { LyricLine } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface LyricEditorProps {
  value: string;
  onChange: (val: string) => void;
  lines: LyricLine[] | null;
  isAnalyzing: boolean;
}

export function LyricEditor({ value, onChange, lines, isAnalyzing }: LyricEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and background
  const handleScroll = () => {
    if (textareaRef.current && bgRef.current) {
      bgRef.current.scrollTop = textareaRef.current.scrollTop;
      bgRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative w-full h-[600px] border border-subtle rounded-md bg-cream shadow-inner overflow-hidden font-mono text-lg leading-relaxed flex flex-col">
      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="absolute top-2 right-4 z-20 text-xs font-bold text-gold uppercase tracking-widest animate-pulse">
          Analyzing...
        </div>
      )}
      
      {/* Unified container for perfect alignment */}
      <div className="relative flex-grow overflow-hidden">
        
        {/* Background Render Layer (Visuals) */}
        <div 
          ref={bgRef}
          className="absolute inset-0 pt-6 pb-6 pr-6 pl-14 overflow-hidden pointer-events-none whitespace-pre-wrap break-words text-transparent"
          aria-hidden="true"
        >
          {lines ? (
            lines.map((line, idx) => {
              const textWithDots = line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
              const prevLine = idx > 0 ? lines[idx - 1] : null;
              const sectionChanged = line.section && (!prevLine || prevLine.section !== line.section);
              const showSectionLabel = sectionChanged && !line.text.trim().startsWith('[') && !line.text.trim().startsWith('{');

              return (
                <div key={idx} className="relative min-h-[1.5em] group">
                  {showSectionLabel && (
                    <div className="absolute bottom-full left-0 mb-0.5 font-display text-[10px] text-gold/80 uppercase tracking-widest font-bold select-none pointer-events-none">
                      [{line.section}]
                    </div>
                  )}
                  {line.line_number > 0 && (
                    <div className="absolute left-[-2.25rem] top-0 text-sepia/40 font-mono text-xs select-none w-8 text-right">
                      {line.line_number}
                    </div>
                  )}
                  <span className="text-transparent selection:bg-transparent">
                    {textWithDots || ' '}
                  </span>
                  
                  {/* Visual Formatting Layer for this line */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none">
                    <div className="pointer-events-none">
                      {/* We could render syntax highlighting here if we wanted! */}
                    </div>
                    {line.text.trim() && !line.text.trim().startsWith('[') && !line.text.trim().startsWith('{') && (
                      <div className="flex-shrink-0 flex items-center gap-2 text-right pr-2 pointer-events-none">
                        {line.flags && line.flags.length > 0 && (
                          <div className="relative group/tooltip pointer-events-auto z-20 cursor-pointer">
                            <span 
                              onClick={() => textareaRef.current?.focus()}
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold hover:bg-gold/30 hover:text-gold-hover transition-colors"
                              title="Show Line Feedback"
                            >
                              <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3" />
                            </span>
                            
                            {/* Popover */}
                            <div className="absolute right-full mr-2 bottom-1/2 translate-y-1/2 w-64 bg-slate-900 border border-slate-800 text-white rounded-lg shadow-xl p-3 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 z-50 text-left font-body text-xs leading-relaxed">
                              <h5 className="font-display font-semibold text-gold border-b border-slate-800 pb-1 mb-2">Line Feedback</h5>
                              <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {line.flags.map((flag, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-1.5">
                                    <span className={`
                                      mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0
                                      ${flag.type_ === 'Positive' ? 'bg-sage' : 
                                        flag.type_ === 'Negative' ? 'bg-rust' : 'bg-blue-grey'}
                                    `}></span>
                                    <span className="flex-1">
                                      <strong className="text-[10px] text-sepia/70 font-mono mr-1">{flag.technique_id}</strong>
                                      {flag.message}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              {/* Arrow */}
                              <div className="absolute top-1/2 -translate-y-1/2 left-full w-2 h-2 bg-slate-900 border-t border-r border-slate-800 rotate-45 -ml-1"></div>
                            </div>
                          </div>
                        )}

                        <span className={`
                          inline-block font-mono text-[11px] px-2 py-0.5 rounded transition-opacity duration-500
                          ${isAnalyzing ? 'opacity-30' : 'opacity-100'}
                          ${line.syllables > 12 ? 'bg-rust/20 text-rust' : 'bg-sepia/10 text-sepia'}
                        `}>
                          {line.syllables} syl
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Empty state placeholder to match textarea
            <div className="text-transparent whitespace-pre-wrap">{value}</div>
          )}
        </div>

        {/* Foreground Input Layer (Interaction) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full pt-6 pb-6 pr-6 pl-14 bg-transparent text-ink caret-ink resize-none outline-none whitespace-pre-wrap break-words z-10"
          placeholder="Paste your lyrics here...&#10;&#10;[Verse 1]&#10;Nice to meet you, where you been?&#10;I could show you in·cred·i·ble things..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
