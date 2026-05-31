import { LyricLine } from "@/lib/types";

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
                  {line.line_number}
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
                
                {line.text.trim() !== "" && (
                  <div className="flex-shrink-0 w-16 text-right">
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
