import { LyricLine } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export function AnalyzedLyrics({ lines }: { lines: LyricLine[] }) {
  let currentSection: string | null = null;

  return (
    <div className="bg-cream border border-subtle rounded-md shadow-card overflow-hidden mt-6">
      <div className="p-4 border-b border-subtle bg-parchment/30">
        <h3 className="font-display text-xl">Analyzed Lyrics</h3>
        <p className="text-sepia italic text-sm">Line-by-line breakdown with syllable counts.</p>
      </div>

      <div className="p-6 font-body text-ink/90 leading-relaxed space-y-1">
        {lines.map((line, idx) => {
          const sectionChanged = line.section && line.section !== currentSection;
          if (line.section) currentSection = line.section;

          return (
            <div key={idx} className="flex flex-col">
              {sectionChanged && (
                <div className="mt-6 mb-2 font-display text-gold uppercase tracking-widest text-sm font-bold border-b border-subtle/30 pb-1">
                  [{line.section}]
                </div>
              )}
              
              <div className="flex gap-4 group py-1 hover:bg-parchment/40 rounded transition-colors px-2 -mx-2 items-center">
                <div className="w-8 flex-shrink-0 text-right text-sepia/40 font-mono text-xs select-none">
                  {line.line_number > 0 ? line.line_number : ""}
                </div>
                
                <div className="flex-grow">
                  {line.text.trim() === "" ? (
                    <span className="block h-4"></span>
                  ) : (
                    <span>
                      {(line.syllabified_words || line.text.split(' ')).map((word, wIdx, arr) => {
                        return <span key={wIdx}>{word}{wIdx < arr.length - 1 ? ' ' : ''}</span>;
                      })}
                    </span>
                  )}
                </div>
                
                {line.text.trim() !== "" && !line.text.trim().startsWith('[') && !line.text.trim().startsWith('{') && (
                  <div className="flex-shrink-0 flex items-center gap-2 text-right">
                    {line.flags && line.flags.length > 0 && (
                      <div className="relative group/tooltip cursor-pointer">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold hover:bg-gold/30 hover:text-gold-hover transition-colors">
                          <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5" />
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

                    <span className="inline-block bg-sepia/10 text-sepia font-mono text-xs px-2 py-1 rounded">
                      {line.syllables} syl
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
