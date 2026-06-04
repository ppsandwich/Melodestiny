"use client";

import { TechniqueResult } from "@/lib/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export function TechniqueScoresCard({ techniques, total_score }: { techniques: TechniqueResult[], total_score: number }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Group name mapping (without the suffix "Group")
  const groupNames: { [key: string]: string } = {
    repetition_dynamics: "Repetition Strategy",
    vocabulary_style: "Lyric Phrasing & Vocabulary",
    melodic_complexity: "Rhythmic & Melodic Complexity",
    narrative_continuity: "Narrative Continuity",
    structural_resolution: "Structural Resolution",
  };

  // Organize techniques into groups and independent categories
  const groups: { [key: string]: TechniqueResult[] } = {};
  const independent: TechniqueResult[] = [];

  techniques.forEach(t => {
    if (t.group_id) {
      if (!groups[t.group_id]) {
        groups[t.group_id] = [];
      }
      groups[t.group_id].push(t);
    } else {
      independent.push(t);
    }
  });

  // Sort groups internally by ID
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => a.id.localeCompare(b.id));
  });

  // Sort independent list by ID
  independent.sort((a, b) => a.id.localeCompare(b.id));

  const renderCell = (t: TechniqueResult) => (
    <div key={t.id} className={`group relative ${!t.active ? 'opacity-40 hover:opacity-100 transition-opacity' : ''}`}>
      <div className={`
        h-12 border rounded flex flex-col justify-center px-2 cursor-help transition-colors
        ${!t.active ? 'bg-sepia/5 border-sepia/20 hover:border-sepia/40' :
          t.raw_score >= 0.8 ? 'bg-sage/10 border-sage/30 hover:border-sage' : 
          t.raw_score >= 0.5 ? 'bg-gold/10 border-gold/30 hover:border-gold' : 
          'bg-rust/10 border-rust/30 hover:border-rust'}
      `}>
        <div className="flex justify-between items-center text-xs font-mono font-medium text-ink">
          <span>{t.id}</span>
          <span className={!t.active ? 'line-through text-sepia' : ''}>
            {Math.round(t.raw_score * 100)}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-parchment h-1.5 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full ${!t.active ? 'bg-sepia/40' : t.raw_score >= 0.8 ? 'bg-sage' : t.raw_score >= 0.5 ? 'bg-gold' : 'bg-rust'}`}
            style={{ width: `${t.raw_score * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="hidden sm:block absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-ink text-cream p-3 rounded-lg shadow-popover z-50 text-sm">
        <div className="font-display text-base font-bold text-gold flex items-center justify-between">
          {t.name}
          {!t.active && <span className="text-[9px] tracking-wide uppercase bg-sepia/40 text-cream px-1.5 py-0.5 rounded font-mono">Bypassed</span>}
        </div>
        <div className="text-xs text-cream/70 mb-2 italic">by {t.author}</div>
        <p className="font-body text-xs leading-relaxed mb-1">{t.description}</p>
        {!t.active && (
          <p className="text-[10px] text-gold/80 italic font-body mt-1 border-t border-cream/10 pt-1">
            * Bypassed in favor of a higher score in the "{t.group_id ? groupNames[t.group_id] : ''}" contradiction set.
          </p>
        )}
        
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
      </div>
    </div>
  );

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
        <div className="p-6 pt-0 border-t border-subtle/30 mt-2 flex flex-col gap-6">
          
          {/* Grouped Contradictions */}
          <div className="flex flex-col gap-4 pt-4">
            <h4 className="font-display text-lg border-b border-subtle/30 pb-1 text-ink">
              Contradiction Sets (Highest Score Preserved)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groups).map(([groupId, members]) => (
                <div key={groupId} className="bg-parchment/20 border border-subtle/40 rounded p-4 flex flex-col gap-3">
                  <h5 className="font-display text-sm text-sepia uppercase tracking-wider font-bold">
                    {groupNames[groupId]}
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                    {members.map(t => renderCell(t))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core/Independent Techniques */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-lg border-b border-subtle/30 pb-1 text-ink">
              Core Techniques
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {independent.map(t => renderCell(t))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
