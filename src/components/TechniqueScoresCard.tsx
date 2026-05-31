"use client";

import { TechniqueResult } from "@/lib/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export function TechniqueScoresCard({ techniques, total_score }: { techniques: TechniqueResult[], total_score: number }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // Sort by id (e.g., T01, T02)
  const sorted = [...techniques].sort((a, b) => a.id.localeCompare(b.id));
  
  return (
    <div className="bg-cream border border-subtle rounded-md shadow-card mb-6 relative z-10 overflow-hidden">
      
      <div 
        className="p-4 sm:p-6 flex justify-between items-start sm:items-center cursor-pointer hover:bg-parchment/30 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-display text-xl sm:text-2xl mb-1 flex items-center gap-3 text-ink flex-wrap">
            Technique Breakdown
            <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} className="text-sm text-sepia flex-shrink-0" />
          </h3>
          <p className="text-sepia font-body italic text-xs sm:text-sm break-words">
            {isCollapsed ? "Click to expand details." : "Hover over a technique for details."}
          </p>
        </div>
        
        {/* Score Badge */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold shadow-card flex items-center justify-center text-black border-4 border-double border-ink/20 flex-shrink-0">
          <div className="text-center">
            <div className="text-3xl font-display font-bold leading-none">{Math.round(total_score)}</div>
            <div className="text-[10px] uppercase tracking-widest font-mono mt-1 opacity-80">Score</div>
          </div>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-6 pt-0 border-t border-subtle/30 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
            {sorted.map(t => (
              <div key={t.id} className="group relative">
                <div className={`
                  h-12 border rounded flex flex-col justify-center px-2 cursor-help transition-colors
                  ${t.raw_score >= 0.8 ? 'bg-sage/10 border-sage/30 hover:border-sage' : 
                    t.raw_score >= 0.5 ? 'bg-gold/10 border-gold/30 hover:border-gold' : 
                    'bg-rust/10 border-rust/30 hover:border-rust'}
                `}>
                  <div className="flex justify-between items-center text-xs font-mono font-medium text-ink">
                    <span>{t.id}</span>
                    <span>{Math.round(t.raw_score * 100)}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-parchment h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${t.raw_score >= 0.8 ? 'bg-sage' : t.raw_score >= 0.5 ? 'bg-gold' : 'bg-rust'}`}
                      style={{ width: `${t.raw_score * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="hidden sm:block absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-ink text-cream p-3 rounded-lg shadow-popover z-50 text-sm">
                  <div className="font-display text-base font-bold text-gold">{t.name}</div>
                  <div className="text-xs text-cream/70 mb-2 italic">by {t.author}</div>
                  <p className="font-body text-xs leading-relaxed">{t.description}</p>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
                </div>
              </div>
            ))}
            
            {/* Placeholder for unimplemented techniques */}
            {Array.from({length: 25 - sorted.length}).map((_, i) => (
              <div key={`placeholder-${i}`} className="h-12 bg-parchment/50 border border-subtle/50 rounded flex items-center justify-center font-mono text-sm text-sepia/30">
                T{String(sorted.length + i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
