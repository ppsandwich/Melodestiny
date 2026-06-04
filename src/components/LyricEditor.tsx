import { useRef, useEffect } from "react";
import { LyricLine } from "@/lib/types";

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
          className="absolute inset-0 p-6 overflow-hidden pointer-events-none whitespace-pre-wrap break-words text-transparent"
          aria-hidden="true"
        >
          {lines ? (
            lines.map((line, idx) => {
              const textWithDots = line.syllabified_words ? line.syllabified_words.join(' ') : line.text;
              
              // We render the exact text to maintain spacing, but the text is transparent.
              // We render the pill absolutely positioned to the right of the container.
              // Wait! If the container is absolute inset-0, we can't reliably position a pill "at the end of the line" unless we make the line a flex container.
              // But if we make it a flex container, white-space: pre-wrap on newlines might break alignment with the textarea.
              // The safest way is to let the text flow exactly like the textarea, and attach the pill via float or flex.
              // Since the background text exactly matches the textarea text, we can just render block divs for each line!
              // BUT textarea lines wrap naturally. A block div wrapping naturally perfectly mimics a textarea!
              return (
                <div key={idx} className="relative min-h-[1.5em] group">
                  <span className="text-transparent selection:bg-transparent">
                    {textWithDots || ' '}
                  </span>
                  
                  {/* Visual Formatting Layer for this line */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none">
                    <div className="pointer-events-none">
                      {/* We could render syntax highlighting here if we wanted! */}
                    </div>
                    {line.text.trim() && !line.text.trim().startsWith('[') && !line.text.trim().startsWith('{') && (
                      <div className="flex-shrink-0 text-right pr-2">
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
          className="absolute inset-0 w-full h-full p-6 bg-transparent text-ink caret-ink resize-none outline-none whitespace-pre-wrap break-words z-10"
          placeholder="Paste your lyrics here...&#10;&#10;[Verse 1]&#10;Nice to meet you, where you been?&#10;I could show you in·cred·i·ble things..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
