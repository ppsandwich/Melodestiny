"use client";

import { TechniqueResult } from "@/lib/types";

export function ScoreBreakdown({ techniques }: { techniques: TechniqueResult[] }) {
  const groupNames: { [key: string]: string } = {
    repetition_dynamics: "Repetition Strategy",
    vocabulary_style: "Lyric Phrasing & Vocabulary",
    melodic_complexity: "Rhythmic & Melodic Complexity",
    narrative_continuity: "Narrative Continuity",
    structural_resolution: "Structural Resolution",
  };

  const sorted = [...techniques].sort((a, b) => {
    // Sort active ones first
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }
    if (a.raw_score !== b.raw_score) return a.raw_score - b.raw_score;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="bg-cream border border-subtle rounded-md shadow-card overflow-hidden">
      <div className="p-4 border-b border-subtle bg-parchment/30">
        <h3 className="font-display text-xl">Detailed Feedback</h3>
      </div>
      
      <div className="divide-y divide-subtle">
        {sorted.map(t => {
          return (
            <div 
              key={t.id} 
              className={`flex flex-col p-4 bg-transparent hover:bg-parchment/10 transition-colors ${
                !t.active ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''
              }`}
            >
              <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className={`
                    w-12 text-center py-1 rounded text-sm font-mono font-medium flex-shrink-0
                    ${!t.active ? 'bg-sepia/20 text-sepia' :
                      t.raw_score >= 0.8 ? 'bg-sage text-white' : 
                      t.raw_score >= 0.5 ? 'bg-gold text-black' : 
                      'bg-rust text-white'}
                  `}>
                    {Math.round(t.raw_score * 100)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base sm:text-lg text-ink break-words flex items-center flex-wrap gap-x-2 gap-y-1">
                      <div>
                        <span className="text-sepia text-sm font-mono mr-2">{t.id}</span>
                        <span className={!t.active ? 'line-through text-sepia' : ''}>{t.name}</span>
                        <span className="block sm:inline text-sm font-body italic text-sepia/80 sm:ml-3 font-normal mt-1 sm:mt-0">by {t.author}</span>
                      </div>
                      {!t.active && (
                        <span className="inline-block bg-sepia/10 text-sepia text-[10px] font-mono px-2 py-0.5 rounded border border-sepia/20 uppercase tracking-wide">
                          Bypassed ({t.group_id ? groupNames[t.group_id] : ''})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block text-sm text-sepia font-mono flex-shrink-0">
                  {t.active ? `Weight: ${(t.weight * 100).toFixed(1)}%` : "Bypassed"}
                </div>
              </div>
              
              <div className="pl-0 sm:pl-16 mt-2 sm:mt-0">
                <p className="font-body text-ink leading-relaxed mb-4">
                  {t.feedback}
                </p>
                
                {t.flags.length > 0 && (() => {
                  const groupedFlags: { [msg: string]: { type_: string, lines: number[] } } = {};
                  t.flags.forEach(flag => {
                    if (!groupedFlags[flag.message]) {
                      groupedFlags[flag.message] = { type_: flag.type_, lines: [] };
                    }
                    groupedFlags[flag.message].lines.push(flag.line_number);
                  });
                  const uniqueFlags = Object.entries(groupedFlags).map(([message, data]) => {
                    const sortedLines = data.lines.sort((a, b) => a - b);
                    return { message, type_: data.type_, firstLine: sortedLines[0], otherLines: sortedLines.slice(1) };
                  }).sort((a, b) => a.firstLine - b.firstLine);

                  return (
                    <div className="mt-4 pt-4 border-t border-subtle/30">
                      <h4 className="text-sm font-bold text-sepia uppercase tracking-wider mb-2">Specific Flags</h4>
                      <ul className="space-y-2">
                        {uniqueFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm w-full">
                            <span className={`
                              mt-0.5 inline-block w-2 h-2 rounded-full flex-shrink-0
                              ${flag.type_ === 'Positive' ? 'bg-sage' : 
                                flag.type_ === 'Negative' ? 'bg-rust' : 'bg-blue-grey'}
                            `}></span>
                            <span className="font-mono text-sepia min-w-[50px] flex-shrink-0">Line {flag.firstLine}:</span>
                            <span className="font-body text-ink/90 flex-1 min-w-0 break-words">
                              {flag.message}
                              {flag.otherLines.length > 0 && (
                                <span className="text-sepia/80 ml-1">
                                  (also Line {flag.otherLines.join(', Line ')})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
        
        {sorted.length === 0 && (
          <div className="p-8 text-center text-sepia font-body italic">
            No techniques have been evaluated yet.
          </div>
        )}
      </div>
    </div>
  );
}
