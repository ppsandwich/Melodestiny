"use client";

import { TechniqueResult } from "@/lib/types";

export function ScoreBreakdown({ techniques }: { techniques: TechniqueResult[] }) {
  const sorted = [...techniques].sort((a, b) => {
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
            <div key={t.id} className="flex flex-col p-4 bg-transparent hover:bg-parchment/10 transition-colors">
              <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className={`
                    w-12 text-center py-1 rounded text-sm font-mono font-medium flex-shrink-0
                    ${t.raw_score >= 0.8 ? 'bg-sage text-white' : 
                      t.raw_score >= 0.5 ? 'bg-gold text-black' : 
                      'bg-rust text-white'}
                  `}>
                    {Math.round(t.raw_score * 100)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base sm:text-lg text-ink break-words">
                      <span className="text-sepia text-sm font-mono mr-2">{t.id}</span>
                      {t.name}
                      <span className="block sm:inline text-sm font-body italic text-sepia/80 sm:ml-3 font-normal mt-1 sm:mt-0">by {t.author}</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block text-sm text-sepia font-mono flex-shrink-0">
                  Weight: {(t.weight * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="pl-0 sm:pl-16 mt-2 sm:mt-0">
                <p className="font-body text-ink leading-relaxed mb-4">
                  {t.feedback}
                </p>
                
                {t.flags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-subtle/30">
                    <h4 className="text-sm font-bold text-sepia uppercase tracking-wider mb-2">Specific Flags</h4>
                    <ul className="space-y-2">
                      {t.flags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm w-full">
                          <span className={`
                            mt-0.5 inline-block w-2 h-2 rounded-full flex-shrink-0
                            ${flag.type_ === 'Positive' ? 'bg-sage' : 
                              flag.type_ === 'Negative' ? 'bg-rust' : 'bg-blue-grey'}
                          `}></span>
                          <span className="font-mono text-sepia min-w-[50px] flex-shrink-0">Line {flag.line_number}:</span>
                          <span className="font-body text-ink/90 flex-1 min-w-0 break-words">{flag.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
