export interface AnalysisInput {
  title: string;
  lyrics: string;
}

export interface AnalysisOutput {
  total_score: number;
  techniques: TechniqueResult[];
  highlighted_lyrics: LyricLine[];
  markup_download: string;
  auto_partitioned: boolean;
}

export interface TechniqueResult {
  id: string;
  name: string;
  author: string;
  description: string;
  raw_score: number;
  weight: number;
  weighted_score: number;
  feedback: string;
  flags: LyricFlag[];
  active: boolean;
  group_id: string | null;
}

export interface LyricLine {
  line_number: number;
  text: string;
  annotations: Annotation[];
  syllables: number;
  section: string | null;
  syllabified_words?: string[];
}

export interface LyricFlag {
  type_: 'Positive' | 'Neutral' | 'Negative';
  line_number: number;
  message: string;
}

export interface Annotation {
  type_: 'Highlight' | 'Warning' | 'Note';
  technique_id: string;
  technique_name: string;
  author: string;
  message: string;
  start_idx: number;
  end_idx: number;
}
