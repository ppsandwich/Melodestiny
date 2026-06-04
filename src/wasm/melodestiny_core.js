/* @ts-self-types="./melodestiny_core.d.ts" */

/**
 * @param {string} input_json
 * @returns {string}
 */
export function analyze(input_json) {
    let cleaned_input_json = input_json;
    try {
        const parsed = JSON.parse(input_json);
        if (parsed.lyrics) {
            parsed.lyrics = parsed.lyrics.replace(/·/g, '');
        }
        cleaned_input_json = JSON.stringify(parsed);
    } catch(e) {}
    let deferred2_0;
    let deferred2_1;
    let raw_result;
    try {
        const ptr0 = passStringToWasm0(cleaned_input_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.analyze(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        raw_result = getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
    return process_analysis_in_js(cleaned_input_json, raw_result);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./melodestiny_core_bg.js": import0,
    };
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('melodestiny_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };

function process_analysis_in_js(input_json_str, raw_result_str) {
    let input;
    try {
        input = JSON.parse(input_json_str);
    } catch(e) {
        input = { title: "", lyrics: "" };
    }
    
    let data;
    try {
        data = JSON.parse(raw_result_str);
    } catch(e) {
        return raw_result_str;
    }

    if (!data.techniques || !Array.isArray(data.techniques)) {
        return raw_result_str;
    }

    // Re-index lines and build mapping of old line numbers to new ones
    const oldToNew = {};
    let newLineNum = 0;
    const generalTechniques = new Set([
        "T02", "T03", "T04", "T05", "T08", "T09", "T10", "T13", "T15", "T16", "T18", "T19", "T25", "T28", "T29", "T30", "T34", "T35"
    ]);

    if (data.highlighted_lyrics && Array.isArray(data.highlighted_lyrics)) {
        data.highlighted_lyrics.forEach((line, idx) => {
            const oldLineNum = line.line_number || (idx + 1);
            const trimmed = line.text.trim();
            const is_empty = trimmed.length === 0;
            const is_header = trimmed.startsWith('[') || trimmed.startsWith('{');
            
            if (is_empty || is_header) {
                line.line_number = 0;
                line.syllables = 0;
                oldToNew[oldLineNum] = 0;
            } else {
                newLineNum++;
                line.line_number = newLineNum;
                oldToNew[oldLineNum] = newLineNum;
            }
        });
    }

    // Auto-partition song structure if no explicit section headers are present
    function hasExplicitSections(lines) {
        return lines.some(line => {
            const t = line.text.trim();
            return t.startsWith('[') || t.startsWith('{');
        });
    }

    if (data.highlighted_lyrics && Array.isArray(data.highlighted_lyrics) && !hasExplicitSections(data.highlighted_lyrics)) {
        data.auto_partitioned = true;
        
        const blocks = [];
        let currentBlock = [];
        data.highlighted_lyrics.forEach((line) => {
            const trimmed = line.text.trim();
            if (trimmed.length === 0) {
                if (currentBlock.length > 0) {
                    blocks.push(currentBlock);
                    currentBlock = [];
                }
            } else {
                currentBlock.push(line);
            }
        });
        if (currentBlock.length > 0) {
            blocks.push(currentBlock);
        }
        
        const N = blocks.length;
        if (N > 0) {
            const blockJaccard = (b1, b2) => {
                const getWords = (block) => {
                    return block.map(l => l.text.toLowerCase().split(/\s+/)).flat()
                        .map(w => w.replace(/[^a-zA-Z]/g, ""))
                        .filter(w => w.length > 0);
                };
                const w1 = getWords(b1);
                const w2 = getWords(b2);
                const s1 = new Set(w1);
                const s2 = new Set(w2);
                if (s1.size === 0 && s2.size === 0) return 1.0;
                if (s1.size === 0 || s2.size === 0) return 0.0;
                let intersect = 0;
                s1.forEach(w => {
                    if (s2.has(w)) intersect++;
                });
                return intersect / (s1.size + s2.size - intersect);
            };
            
            const matches = Array(N).fill(0).map(() => []);
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    if (i !== j && blockJaccard(blocks[i], blocks[j]) >= 0.55) {
                        matches[i].push(j);
                    }
                }
            }
            
            const clusters = [];
            const visited = new Set();
            for (let i = 0; i < N; i++) {
                if (visited.has(i)) continue;
                if (matches[i].length > 0) {
                    const cluster = [i, ...matches[i]];
                    cluster.forEach(idx => visited.add(idx));
                    clusters.push(cluster);
                }
            }
            
            clusters.sort((c1, c2) => c2.length - c1.length);
            const chorusIndices = new Set(clusters[0] || []);
            
            const preChorusIndices = new Set();
            if (clusters.length > 1) {
                const cand = clusters[1];
                let alwaysPrecedes = true;
                cand.forEach(idx => {
                    if (idx + 1 >= N || !chorusIndices.has(idx + 1)) {
                        alwaysPrecedes = false;
                    }
                });
                if (alwaysPrecedes) {
                    cand.forEach(idx => preChorusIndices.add(idx));
                }
            }
            
            const labels = Array(N).fill(null);
            if (N === 1) {
                labels[0] = "Verse 1";
            } else {
                for (let i = 0; i < N; i++) {
                    if (chorusIndices.has(i)) {
                        labels[i] = "Chorus";
                    } else if (preChorusIndices.has(i)) {
                        labels[i] = "Pre-Chorus";
                    }
                }
                
                let verseCounter = 0;
                for (let i = 0; i < N; i++) {
                    if (labels[i] !== null) continue;
                    
                    if (i === 0 && blocks[i].length <= 3) {
                        labels[i] = "Intro";
                    } else if (i === N - 1 && (blocks[i].length <= 3 || (clusters[0] && blockJaccard(blocks[i], blocks[clusters[0][0]]) >= 0.25))) {
                        labels[i] = "Outro";
                    } else {
                        let isBridge = false;
                        if (N >= 4 && i > 0 && i < N - 1) {
                            let chorusCountBefore = 0;
                            for (let k = 0; k < i; k++) {
                                if (labels[k] === "Chorus") chorusCountBefore++;
                            }
                            if (chorusCountBefore >= 2) {
                                isBridge = true;
                            }
                        }
                        
                        if (isBridge) {
                            labels[i] = "Bridge";
                        } else {
                            verseCounter++;
                            labels[i] = `Verse ${verseCounter}`;
                        }
                    }
                }
            }
            
            blocks.forEach((block, blockIdx) => {
                const label = labels[blockIdx];
                block.forEach(line => {
                    line.section = label;
                });
            });
            
            let currentLabel = null;
            data.highlighted_lyrics.forEach(line => {
                if (line.section) {
                    currentLabel = line.section;
                } else {
                    line.section = currentLabel;
                }
            });
        }
    } else {
        data.auto_partitioned = false;
    }

    // Update existing technique flags based on new line numbering
    if (data.techniques && Array.isArray(data.techniques)) {
        data.techniques.forEach(t => {
            if (t.flags && Array.isArray(t.flags)) {
                t.flags = t.flags.map(f => {
                    const oldL = f.line_number;
                    let newL = oldToNew[oldL];
                    if (newL === undefined || newL === 0) {
                        if (generalTechniques.has(t.id)) {
                            newL = 1; // general flags fallback to Line 1
                        } else {
                            newL = 0; // filter out specific flags on empty/header lines
                        }
                    }
                    f.line_number = newL;
                    return f;
                }).filter(f => f.line_number > 0);
            }
        });
    }

    // 1. Assign groups to existing T01-T25
    data.techniques.forEach(t => {
        t.active = true;
        const num = parseInt(t.id.replace(/\D/g, ''));
        
        if (num === 21) {
            // Recalculate T21 (First Line Hook) in JavaScript to bypass the Rust header-line bug!
            const linesList = data.highlighted_lyrics || [];
            const first_line = linesList.find(l => l.line_number > 0);
            if (first_line) {
                const text = first_line.text.toLowerCase();
                const words = text.split(/\s+/).map(w => w.replace(/[^a-z]/g, "")).filter(w => w.length > 0);
                
                let score = 0.0;
                const newFlags = [];
                
                // Check for questions
                if (text.includes('?')) {
                    score += 0.4;
                    newFlags.push({
                        type_: "Positive",
                        line_number: first_line.line_number,
                        message: "Opening with a question instantly engages the listener's curiosity."
                    });
                }
                
                // Check for direct address
                const pronouns = ["i", "you", "we"];
                for (const word of words) {
                    if (pronouns.includes(word)) {
                        score += 0.3;
                        newFlags.push({
                            type_: "Positive",
                            line_number: first_line.line_number,
                            message: `Using '${word}' in the first line grounds the perspective immediately.`
                        });
                        break;
                    }
                }
                
                // Check for concrete imagery
                const scene_words = ["night", "day", "morning", "street", "car", "bed", "room", "bar", "club", "clock", "door", "window", "rain", "sun", "city", "town"];
                for (const word of words) {
                    if (scene_words.includes(word)) {
                        score += 0.3;
                        newFlags.push({
                            type_: "Positive",
                            line_number: first_line.line_number,
                            message: `'${word}' sets a specific scene right away.`
                        });
                        break;
                    }
                }
                
                // Check for vague openings
                const vague_words = ["something", "someone", "somewhere", "feel", "feeling"];
                for (const word of words) {
                    if (vague_words.includes(word)) {
                        score -= 0.3;
                        newFlags.push({
                            type_: "Negative",
                            line_number: first_line.line_number,
                            message: `Opening with '${word}' is vague. Start in the middle of the action.`
                        });
                    }
                }
                
                const raw_score = Math.max(0.0, Math.min(1.0, score));
                t.raw_score = raw_score;
                t.weighted_score = raw_score * t.weight * 100.0;
                t.flags = newFlags;
                
                if (raw_score > 0.8) {
                    t.feedback = "Incredible opening line! It sets the scene, perspective, and hooks the listener immediately.";
                } else if (raw_score > 0.5) {
                    t.feedback = "Good opening line, but it could be punchier. Try starting with a specific detail or a question.";
                } else {
                    t.feedback = "Your first line is a bit weak or vague. The listener might tune out. Drop them right into the action.";
                }
            } else {
                t.raw_score = 0.0;
                t.weighted_score = 0.0;
                t.feedback = "No lyrics found to evaluate.";
                t.flags = [];
            }
        }

        if (num === 3 || num === 4) {
            t.group_id = "repetition_dynamics";
        } else if (num === 7 || num === 23) {
            t.group_id = "melodic_complexity";
        } else if (num === 11 || num === 22) {
            t.group_id = "vocabulary_style";
        } else if (num === 15) {
            t.group_id = "structural_resolution";
        } else if (num === 18) {
            t.group_id = "narrative_continuity";
        } else {
            t.group_id = null;
        }
    });

    const lines = data.highlighted_lyrics || [];
    const clean_lines = lines.filter(l => {
        const t = l.text.trim();
        return t.length > 0 && !t.startsWith('[') && !t.startsWith('{');
    });

    // 2. Compute T26 to T35
    const t26 = run_t26(clean_lines);
    const t27 = run_t27(clean_lines);
    const t28 = run_t28(clean_lines);
    const t29 = run_t29(clean_lines, lines);
    const t30 = run_t30(input);
    const t31 = run_t31(clean_lines, lines);
    const t32 = run_t32(clean_lines);
    const t33 = run_t33(input, clean_lines);
    const t34 = run_t34(clean_lines, lines);
    const t35 = run_t35(clean_lines, lines);

    data.techniques.push(t26, t27, t28, t29, t30, t31, t32, t33, t34, t35);

    // 3. Grouping & Contradiction logic
    const groups = [
        "repetition_dynamics",
        "vocabulary_style",
        "melodic_complexity",
        "narrative_continuity",
        "structural_resolution",
    ];

    groups.forEach(group_name => {
        const group_indices = [];
        data.techniques.forEach((t, idx) => {
            if (t.group_id === group_name) {
                group_indices.push(idx);
            }
        });

        if (group_indices.length > 0) {
            let highest_idx = group_indices[0];
            let highest_score = data.techniques[highest_idx].weighted_score;

            for (let i = 1; i < group_indices.length; i++) {
                const idx = group_indices[i];
                const score = data.techniques[idx].weighted_score;
                if (score > highest_score) {
                    highest_score = score;
                    highest_idx = idx;
                }
            }

            group_indices.forEach(idx => {
                data.techniques[idx].active = (idx === highest_idx);
            });
        }
    });

    // 4. Calculate normalized overall score
    let active_weighted_sum = 0;
    let active_weight_sum = 0;

    data.techniques.forEach(t => {
        if (t.active) {
            active_weighted_sum += t.weighted_score;
            active_weight_sum += t.weight;
        }
    });

    data.total_score = active_weight_sum > 0 ? (active_weighted_sum / active_weight_sum) : 0;

    // 5. Populate lines with their associated active feedback flags
    if (data.highlighted_lyrics && Array.isArray(data.highlighted_lyrics)) {
        data.highlighted_lyrics.forEach(line => {
            line.flags = [];
        });

        data.techniques.forEach(t => {
            if (t.active && t.flags && Array.isArray(t.flags)) {
                t.flags.forEach(f => {
                    if (f.line_number > 0 && !generalTechniques.has(t.id)) {
                        const targetLine = data.highlighted_lyrics.find(l => l.line_number === f.line_number);
                        if (targetLine) {
                            targetLine.flags.push({
                                technique_id: t.id,
                                technique_name: t.name,
                                type_: f.type_,
                                message: f.message
                            });
                        }
                    }
                });
            }
        });
    }

    return JSON.stringify(data);
}

function run_t26(clean_lines) {
    let raw_score = 0.0;
    let feedback = "No lyrical bookends detected. Consider adding a thematic or word callback in the outro to frame the narrative.";

    if (clean_lines.length >= 4) {
        const first_line = clean_lines[0].text.toLowerCase();
        const last_line = clean_lines[clean_lines.length - 1].text.toLowerCase();
        const jaccard_1 = word_jaccard(first_line, last_line);

        const first_two = (clean_lines[0].text + " " + clean_lines[1].text).toLowerCase();
        const last_two = (clean_lines[clean_lines.length - 2].text + " " + clean_lines[clean_lines.length - 1].text).toLowerCase();
        const jaccard_2 = word_jaccard(first_two, last_two);

        const max_jaccard = Math.max(jaccard_1, jaccard_2);

        if (max_jaccard >= 0.95) {
            raw_score = 0.85;
            feedback = "Exact lyrical bookend callback detected! Repeating the opening motif builds a strong thematic loop.";
        } else if (max_jaccard >= 0.40) {
            raw_score = 1.0;
            feedback = "Excellent! Lyrical bookend callback with a twist detected (" + Math.round(max_jaccard * 100) + "% word overlap). Perfect way to show growth or change in perspective.";
        } else if (max_jaccard >= 0.15) {
            raw_score = 0.6;
            feedback = "Subtle lyrical bookend callback detected. Consider aligning a few more key words to make the connection punchier.";
        }
    }

    const weight = 0.035;
    return {
        id: "T26",
        name: "Lyrical Bookends",
        author: "Taylor Swift / Paul McCartney",
        description: "The song begins and ends with matching or slightly subverted lyrical motifs.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags: [],
        active: true,
        group_id: "structural_resolution"
    };
}

function word_jaccard(s1, s2) {
    const clean_words = s => {
        return new Set(
            s.split(/\s+/)
                .map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
                .filter(w => w.length > 0)
        );
    };
    const w1 = clean_words(s1);
    const w2 = clean_words(s2);
    if (w1.size === 0 && w2.size === 0) return 1.0;
    if (w1.size === 0 || w2.size === 0) return 0.0;
    
    let intersect = 0;
    w1.forEach(w => {
        if (w2.has(w)) intersect++;
    });
    const union = w1.size + w2.size - intersect;
    return intersect / union;
}

function run_t27(clean_lines) {
    const flags = [];
    let total_words = 0;
    let alliteration_matches = 0;
    let assonance_matches = 0;

    clean_lines.forEach(line => {
        const words = line.text.split(/\s+/).filter(w => w.trim().length > 0);
        if (words.length < 2) return;

        const starting_sounds = words.map(w => getStartingSound(w));
        const vowel_nuclei = words.map(w => normalizeVowelNucleus(getVowelNucleus(w)));

        total_words += words.length;
        let line_allit = 0;
        let line_asson = 0;

        for (let i = 0; i < words.length - 1; i++) {
            const s1 = starting_sounds[i];
            const s2 = starting_sounds[i+1];
            if (s1 && s2 && s1 === s2 && !isVowelChar(s1.charAt(0))) {
                alliteration_matches++;
                line_allit++;
            }

            const v1 = vowel_nuclei[i];
            const v2 = vowel_nuclei[i+1];
            if (v1 && v2 && v1 === v2) {
                assonance_matches++;
                line_asson++;
            }
        }

        if (line_allit >= 2 || line_asson >= 2) {
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Nice phonetic flow! Line has " + line_allit + " alliterative and " + line_asson + " assonant connections."
            });
        }
    });

    const combined = alliteration_matches + assonance_matches;
    const density = total_words > 0 ? (combined / total_words) : 0.0;

    let raw_score, feedback;
    if (total_words === 0) {
        raw_score = 0.5;
        feedback = "Please write some lyrics to evaluate phonetic harmony.";
    } else if (density >= 0.10 && density <= 0.25) {
        raw_score = 1.0;
        feedback = "Excellent phonetic harmony! Your density of " + Math.round(density * 100) + "% creates a beautiful, natural rhythm.";
    } else if (density < 0.10) {
        raw_score = 0.6;
        feedback = "Low phonetic harmony (" + Math.round(density * 100) + "% density). Try using more adjacent words with repeating initial consonant or vowel sounds.";
    } else {
        raw_score = 0.8;
        feedback = "Very high phonetic harmony (" + Math.round(density * 100) + "% density). It sounds highly musical, but be careful it doesn't sound like a tongue twister.";
    }

    const weight = 0.045;
    return {
        id: "T27",
        name: "Phonetic Alliteration & Assonance",
        author: "Paul Simon",
        description: "Enhances lyrical flow and memorability using adjacent repeating consonant or vowel sounds.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function isVowelChar(c) {
    return "aeiouyAEIOUY".includes(c);
}

function getStartingSound(word) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length >= 2) {
        const prefix = clean.substring(0, 2);
        if (["ch", "sh", "th", "ph", "kn", "wr", "wh"].includes(prefix)) {
            return prefix;
        }
    }
    return clean.charAt(0) || "";
}

function getVowelNucleus(word) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    let nucleus = "";
    let found = false;
    for (let i = 0; i < clean.length; i++) {
        const c = clean.charAt(i);
        const is_v = isVowelChar(c);
        if (is_v) {
            found = true;
            nucleus += c;
        } else if (found) {
            break;
        }
    }
    return nucleus;
}

function normalizeVowelNucleus(n) {
    switch (n) {
        case "ea": case "ee": case "ie": return "ee";
        case "ai": case "ay": case "ey": return "ay";
        case "ou": case "ow": return "ow";
        case "oi": case "oy": return "oy";
        case "oo": case "ue": return "oo";
        case "oa": case "oe": return "oh";
        default: return n;
    }
}

function run_t28(clean_lines) {
    const flags = [];
    let total_lines = 0;
    let legato_count = 0;

    clean_lines.forEach(line => {
        total_lines++;
        const words = line.text.split(/\s+/).filter(w => w.trim().length > 0);
        if (words.length > 0) {
            const last = words[words.length - 1];
            if (is_legato_ending(last)) {
                legato_count++;
            }
        }
    });

    const legato_ratio = total_lines > 0 ? (legato_count / total_lines) : 0.5;

    let raw_score, feedback;
    if (total_lines === 0) {
        raw_score = 0.5;
        feedback = "Please write some lyrics to evaluate phonetic line texture.";
    } else if (legato_ratio >= 0.35 && legato_ratio <= 0.65) {
        raw_score = 1.0;
        feedback = "Excellent phonetic texture! A balanced " + Math.round(legato_ratio * 100) + "% of lines end in soft, open sounds (legato), providing natural release without losing punchiness.";
    } else if (legato_ratio < 0.35) {
        flags.push({
            type_: "Neutral",
            line_number: 1,
            message: "Many lines end in hard consonants. Try adding soft vowel endings to give singers breathing room."
        });
        raw_score = 0.7;
        feedback = "Your song leans staccato (" + Math.round(legato_ratio * 100) + "% legato endings). This creates a rhythmic, rap-like or punchy feel, but may lack soaring vocal releases.";
    } else {
        flags.push({
            type_: "Neutral",
            line_number: 1,
            message: "Many lines end in open vowel/legato sounds. Consider ending some lines with hard consonants to create sharp rhythmic stops."
        });
        raw_score = 0.7;
        feedback = "Your song leans legato (" + Math.round(legato_ratio * 100) + "% legato endings). It sounds very flowing and soft, but might benefit from occasional punchy, consonant endings.";
    }

    const weight = 0.035;
    return {
        id: "T28",
        name: "Line-Ending Phonetic Texture",
        author: "Max Martin",
        description: "Balances open vowel endings (legato) with stop consonant endings (staccato) to shape vocal energy.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function is_legato_ending(word) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length > 0) {
        const last = clean.charAt(clean.length - 1);
        return "aeiouylmnrwAEIOUYLMNRW".includes(last);
    }
    return true;
}

function run_t29(clean_lines, lines) {
    const flags = [];
    const global_words = [];
    const verse_words = [];
    const chorus_words = [];

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        const words = t.split(/\s+/)
            .map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
            .filter(w => w.length > 0);

        words.forEach(w => global_words.push(w));

        if (line.section) {
            const sec_lower = line.section.toLowerCase();
            if (sec_lower.includes("verse")) {
                words.forEach(w => verse_words.push(w));
            } else if (sec_lower.includes("chorus")) {
                words.forEach(w => chorus_words.push(w));
            }
        }
    });

    const global_ttr = calc_ttr(global_words);
    const verse_ttr = calc_ttr(verse_words);
    const chorus_ttr = calc_ttr(chorus_words);

    let raw_score = 0.5;
    let feedback = "Please add more sections (verses and choruses) to evaluate lexical repetition patterns.";

    if (global_words.length > 0) {
        raw_score = 0.8;
        if (global_ttr >= 0.35 && global_ttr <= 0.55) {
            raw_score += 0.1;
            feedback = "Great global vocabulary balance. Type-Token Ratio is " + global_ttr.toFixed(2) + ", which sits in the pop sweet spot of being memorable but not repetitive.";
        } else if (global_ttr < 0.35) {
            raw_score -= 0.1;
            feedback = "Your lyrics are highly repetitive (TTR is " + global_ttr.toFixed(2) + "). This can be great for hooks, but make sure the verses offer enough new content.";
        } else {
            raw_score -= 0.1;
            feedback = "Your lyrics have very high word variety (TTR is " + global_ttr.toFixed(2) + "). Consider repeating key lines or hooks to make them easier to remember.";
        }

        if (verse_ttr > 0 && chorus_ttr > 0) {
            if (chorus_ttr < verse_ttr - 0.10) {
                raw_score += 0.1;
                flags.push({
                    type_: "Positive",
                    line_number: 1,
                    message: "Strong lexical contrast! The Chorus is significantly more repetitive (TTR: " + chorus_ttr.toFixed(2) + ") than the Verses (TTR: " + verse_ttr.toFixed(2) + "), drawing the listener into the hook."
                });
            } else {
                flags.push({
                    type_: "Neutral",
                    line_number: 1,
                    message: "Chorus repetition (TTR: " + chorus_ttr.toFixed(2) + ") is similar to Verse repetition (TTR: " + verse_ttr.toFixed(2) + "). Making your Chorus more repetitive will make the hook pop."
                });
            }
        }
    }

    const weight = 0.040;
    const clamped = Math.max(0.0, Math.min(1.0, raw_score));
    return {
        id: "T29",
        name: "Lexical Variety Index",
        author: "Lorde / Jack Antonoff",
        description: "Measures repetition balance. Pop choruses should be repetitive, while verses should be lexically varied.",
        raw_score: clamped,
        weight,
        weighted_score: clamped * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function calc_ttr(words) {
    if (words.length === 0) return 0.0;
    const unique = new Set(words);
    return unique.size / words.length;
}

function run_t30(input) {
    const title = (input.title || "").trim();
    if (!title) {
        return {
            id: "T30",
            name: "Title Phonetic Catchiness",
            author: "Diane Warren / Max Martin",
            description: "Song titles are easier to memorize if they use alliteration, assonance, or rhyme.",
            raw_score: 0.0,
            weight: 0.030,
            weighted_score: 0,
            feedback: "Please provide a song title to analyze phonetic catchiness.",
            flags: [],
            active: true,
            group_id: null
        };
    }

    const words = title.split(/\s+/).filter(w => w.length > 0);
    let has_alliteration = false;
    let has_assonance = false;
    let has_rhyme = false;
    let has_repetition = false;

    if (words.length >= 2) {
        const starting_sounds = words.map(w => getStartingSound(w));
        const vowel_nuclei = words.map(w => normalizeVowelNucleus(getVowelNucleus(w)));
        const endings = words.map(w => {
            const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
            return clean.length >= 2 ? clean.substring(clean.length - 2) : clean;
        });

        for (let i = 0; i < words.length - 1; i++) {
            for (let j = i + 1; j < words.length; j++) {
                const s1 = starting_sounds[i];
                const s2 = starting_sounds[j];
                if (s1 && s1 === s2 && !isVowelChar(s1.charAt(0))) {
                    has_alliteration = true;
                }
                const v1 = vowel_nuclei[i];
                const v2 = vowel_nuclei[j];
                if (v1 && v1 === v2) {
                    has_assonance = true;
                }
                const e1 = endings[i];
                const e2 = endings[j];
                if (e1 && e1 === e2) {
                    has_rhyme = true;
                }
                if (words[i].toLowerCase() === words[j].toLowerCase()) {
                    has_repetition = true;
                }
            }
        }
    } else if (words.length === 1) {
        const w = words[0].toLowerCase();
        if (w.length >= 4) {
            const half = Math.floor(w.length / 2);
            if (w.substring(0, half) === w.substring(half) || (w.charAt(0) === w.charAt(2) && w.charAt(1) === w.charAt(3))) {
                has_repetition = true;
            }
        }
    }

    let raw_score, feedback;
    if (has_alliteration && has_assonance) {
        raw_score = 1.0;
        feedback = "Phenomenal! Your title contains both alliteration and assonance (e.g. 'Bad Blood' patterns). It is extremely catchy and memorable.";
    } else if (has_alliteration) {
        raw_score = 1.0;
        feedback = "Great! Your title uses alliteration (matching initial consonant sounds), making it punchy and easy to remember.";
    } else if (has_assonance) {
        raw_score = 1.0;
        feedback = "Great! Your title uses assonance (matching internal vowel sounds), which creates a pleasing melodic texture.";
    } else if (has_rhyme) {
        raw_score = 1.0;
        feedback = "Perfect! Your title contains a rhyming pattern, which immediately locks into the listener's memory.";
    } else if (has_repetition) {
        raw_score = 0.9;
        feedback = "Nice! Your title uses word or syllable repetition, which increases familiarity immediately.";
    } else {
        raw_score = 0.6;
        feedback = "Your title is phonetically simple. Consider adding alliteration, assonance, or rhyme (e.g., 'Love Lies', 'Mamma Mia') to make it stickier.";
    }

    const weight = 0.030;
    return {
        id: "T30",
        name: "Title Phonetic Catchiness",
        author: "Diane Warren / Max Martin",
        description: "Song titles are easier to memorize if they use alliteration, assonance, or rhyme.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags: [],
        active: true,
        group_id: null
    };
}

function run_t31(clean_lines, lines) {
    const flags = [];
    let total_lines = 0;
    let adlib_lines = 0;
    let chorus_adlibs = 0;
    let verse_adlibs = 0;

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        total_lines++;
        const contains_adlib = (t.includes('(') && t.includes(')')) || (t.includes('{') && t.includes('}'));
        
        if (contains_adlib) {
            adlib_lines++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Parenthetical backing vocal or ad-lib detected. This adds vocal layers and rhythm."
            });

            if (line.section) {
                const sec_lower = line.section.toLowerCase();
                if (sec_lower.includes("chorus")) {
                    chorus_adlibs++;
                } else if (sec_lower.includes("verse")) {
                    verse_adlibs++;
                }
            }
        }
    });

    let raw_score, feedback;
    if (total_lines === 0) {
        raw_score = 0.5;
        feedback = "Please write some lyrics to evaluate backing vocal layering.";
    } else if (adlib_lines === 0) {
        raw_score = 0.5;
        feedback = "No parenthetical ad-libs detected. Adding simple backing vocal markers (e.g. '(yeah)', '(over you)') can double your hook's impact.";
    } else if (chorus_adlibs > verse_adlibs) {
        raw_score = 1.0;
        feedback = "Excellent backing vocal placement! You have " + adlib_lines + " ad-libs, with a higher concentration in the Chorus. This makes the hook feel thick and energetic.";
    } else {
        raw_score = 0.8;
        feedback = "Ad-libs detected (" + adlib_lines + "), but they are spread across the song or heavily in the verses. Consider shifting them to the chorus/outro to build dynamic layers.";
    }

    const weight = 0.035;
    return {
        id: "T31",
        name: "Parenthetical Backing Vocal Density",
        author: "Jack Antonoff",
        description: "Backing vocals and ad-libs in parentheses add thickness and call-and-response dynamics to hooks.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t32(clean_lines) {
    const flags = [];
    const total_lines = clean_lines.length;

    if (total_lines === 0) {
        return {
            id: "T32",
            name: "Enjambment vs. End-Stopped Pacing",
            author: "Olivia Rodrigo",
            description: "Measures run-on thoughts (enjambment) versus complete punctuated lines (end-stopped).",
            raw_score: 0.5,
            weight: 0.030,
            weighted_score: 1.5,
            feedback: "Please write some lyrics to evaluate sentence enjambment.",
            flags: [],
            active: true,
            group_id: null
        };
    }

    let enjambed_lines = 0;
    const punctuation = ".,?!;:—-";

    for (let i = 0; i < total_lines; i++) {
        const line = clean_lines[i];
        const t = line.text.trim();
        const last = t.charAt(t.length - 1);
        const has_end_punc = punctuation.includes(last);

        let is_enjambed = false;
        if (!has_end_punc && i + 1 < total_lines) {
            const next_t = clean_lines[i+1].text.trim();
            if (next_t.length > 0) {
                const first = next_t.charAt(0);
                is_enjambed = (first === first.toLowerCase() && first !== first.toUpperCase()) || startsWithConjunction(next_t);
            }
        }

        if (is_enjambed) {
            enjambed_lines++;
            flags.push({
                type_: "Neutral",
                line_number: line.line_number,
                message: "Enjambment detected. Grammatical phrase spills into the next line, creating a run-on pacing."
            });
        }
    }

    const enjamb_ratio = enjambed_lines / total_lines;

    let raw_score, feedback;
    if (enjamb_ratio >= 0.15 && enjamb_ratio <= 0.50) {
        raw_score = 1.0;
        feedback = "Excellent phrasing variety! " + Math.round(enjamb_ratio * 100) + "% of your lines use enjambment (run-on phrasing) while the rest are end-stopped. This keeps the phrasing natural and conversational.";
    } else if (enjamb_ratio < 0.15) {
        raw_score = 0.7;
        feedback = "Your phrasing is heavily end-stopped (only " + Math.round(enjamb_ratio * 100) + "% enjambment). Every line is a complete thought, which can sound stilted or blocky. Try letting some thoughts spill over lines.";
    } else {
        raw_score = 0.7;
        feedback = "Your phrasing has very high enjambment (" + Math.round(enjamb_ratio * 100) + "%). With so many run-on sentences, it might be hard for the listener to find a rhythmic resting point. Try end-stopping some lines.";
    }

    const weight = 0.030;
    return {
        id: "T32",
        name: "Enjambment vs. End-Stopped Pacing",
        author: "Olivia Rodrigo",
        description: "Balances complete, punctuated lines (end-stopped) with run-on thoughts (enjambment) for conversational realism.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function startsWithConjunction(text) {
    const first = text.trim().toLowerCase().split(/\s+/)[0] || "";
    return ["and", "but", "or", "so", "because", "that", "if", "when", "while", "then", "as"].includes(first);
}

function run_t33(input, clean_lines) {
    const title = (input.title || "").trim().toLowerCase();
    if (!title) {
        return {
            id: "T33",
            name: "Title Framing",
            author: "Julia Michaels",
            description: "The song title should be surrounded by high-emotion or action-oriented words immediately preceding or following it.",
            raw_score: 0.0,
            weight: 0.030,
            weighted_score: 0.0,
            feedback: "Please provide a song title to analyze title framing.",
            flags: [],
            active: true,
            group_id: null
        };
    }

    const flags = [];
    let title_occurrences = 0;
    let framed_occurrences = 0;

    const emotion_words = new Set([
        "love", "hate", "hurt", "cry", "fear", "pain", "fire", "burn", "cold", "night", 
        "dark", "light", "heart", "break", "tear", "kiss", "touch", "feel", "fall", "run", 
        "lost", "found", "never", "always", "die", "live", "kill", "save", "scream", "whisper", 
        "breath", "sweet", "bitter", "bad", "good", "wrong", "right", "sorry", "wish", "hope", 
        "need", "want", "give", "take"
    ]);

    clean_lines.forEach(line => {
        const line_lower = line.text.toLowerCase();
        if (line_lower.includes(title)) {
            title_occurrences++;
            
            const words = line_lower.split(/\s+/);
            const title_words = title.split(/\s+/);

            if (title_words.length === 0) return;

            let idx = -1;
            for (let i = 0; i <= words.length - title_words.length; i++) {
                let matches = true;
                for (let k = 0; k < title_words.length; k++) {
                    const clean_w = words[i+k].replace(/[^a-z]/g, "");
                    const clean_t = title_words[k].replace(/[^a-z]/g, "");
                    if (clean_w !== clean_t) {
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    idx = i;
                    break;
                }
            }

            if (idx !== -1) {
                let is_framed = false;
                let matched_word = "";

                // check before
                const check_start = Math.max(0, idx - 2);
                for (let i = check_start; i < idx; i++) {
                    const clean_w = words[i].replace(/[^a-z]/g, "");
                    if (emotion_words.has(clean_w)) {
                        is_framed = true;
                        matched_word = clean_w;
                        break;
                    }
                }

                // check after
                if (!is_framed) {
                    const check_end = Math.min(words.length, idx + title_words.length + 2);
                    for (let i = idx + title_words.length; i < check_end; i++) {
                        const clean_w = words[i].replace(/[^a-z]/g, "");
                        if (emotion_words.has(clean_w)) {
                            is_framed = true;
                            matched_word = clean_w;
                            break;
                        }
                    }
                }

                if (is_framed) {
                    framed_occurrences++;
                    flags.push({
                        type_: "Positive",
                        line_number: line.line_number,
                        message: "Title is beautifully framed by the high-emotion word '" + matched_word + "'. This highlights the hook."
                    });
                }
            }
        }
    });

    let raw_score, feedback;
    if (title_occurrences === 0) {
        raw_score = 0.2;
        feedback = "The title '" + input.title + "' was not found in your lyrics. Put it in the chorus to anchor the listener.";
    } else {
        const ratio = framed_occurrences / title_occurrences;
        if (ratio >= 0.50) {
            raw_score = 1.0;
            feedback = "Excellent! " + Math.round(ratio * 100) + "% of your title mentions are framed by active or emotional words. This makes your title stand out.";
        } else if (ratio > 0.0) {
            raw_score = 0.7;
            feedback = "Some of your title mentions (" + Math.round(ratio * 100) + "%) are framed by emotional words. Try framing the other mentions with active verbs or strong nouns.";
        } else {
            raw_score = 0.4;
            feedback = "Your title mentions are surrounded by passive or generic words. Try preceding or following the title with high-impact emotional words.";
        }
    }

    const weight = 0.030;
    return {
        id: "T33",
        name: "Title Framing",
        author: "Julia Michaels",
        description: "The title phrase should be surrounded by high-emotion or action-oriented words immediately preceding or following it.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t34(clean_lines, lines) {
    const flags = [];
    let verse_syllables = 0;
    let verse_lines = 0;
    let chorus_syllables = 0;
    let chorus_lines = 0;

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        if (line.section) {
            const sec_lower = line.section.toLowerCase();
            if (sec_lower.includes("verse")) {
                verse_syllables += (line.syllables || 0);
                verse_lines++;
            } else if (sec_lower.includes("chorus")) {
                chorus_syllables += (line.syllables || 0);
                chorus_lines++;
            }
        }
    });

    const avg_verse = verse_lines > 0 ? (verse_syllables / verse_lines) : 0.0;
    const avg_chorus = chorus_lines > 0 ? (chorus_syllables / chorus_lines) : 0.0;
    const diff = Math.abs(avg_verse - avg_chorus);

    let raw_score, feedback;
    if (verse_lines === 0 || chorus_lines === 0) {
        raw_score = 0.5;
        feedback = "Please label your sections (e.g. '[Verse 1]', '[Chorus]') to analyze syllable contrast.";
    } else if (diff >= 2.0) {
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Strong pacing gradient detected! Verses have average " + avg_verse.toFixed(1) + " syllables/line, Choruses have average " + avg_chorus.toFixed(1) + " (difference of " + diff.toFixed(1) + ")."
        });
        raw_score = 1.0;
        feedback = "Excellent pacing gradient! Verses and choruses have distinctly different line lengths (average " + avg_verse.toFixed(1) + " vs " + avg_chorus.toFixed(1) + " syllables). This creates rhythmic release when entering the chorus.";
    } else if (diff >= 1.0) {
        raw_score = 0.7;
        feedback = "Moderate pacing gradient (difference of " + diff.toFixed(1) + " syllables). Try slightly compressing your verses or expanding your chorus lines to make the transition feel bigger.";
    } else {
        flags.push({
            type_: "Negative",
            line_number: 1,
            message: "Verse and Chorus lines have nearly identical average lengths, risking a flat pacing feeling."
        });
        raw_score = 0.4;
        feedback = "Flat pacing gradient (difference of only " + diff.toFixed(1) + " syllables/line). Your verses and choruses move at the exact same pace. Try creating contrast in line lengths.";
    }

    const weight = 0.040;
    return {
        id: "T34",
        name: "Syllable Gradient",
        author: "Benny Blanco / Ryan Tedder",
        description: "Pop songs build energy by shifting pacing (average syllables per line) between verses and choruses.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: "melodic_complexity"
    };
}

function run_t35(clean_lines, lines) {
    const flags = [];
    let verse_singular = 0;
    let verse_plural = 0;
    let chorus_singular = 0;
    let chorus_plural = 0;

    const self_pronouns = new Set(["i", "me", "my", "mine", "myself"]);
    const other_pronouns = new Set(["you", "your", "yours", "yourself"]);
    const plural_pronouns = new Set(["we", "us", "our", "ours", "ourselves"]);

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        if (line.section) {
            const sec_lower = line.section.toLowerCase();
            const is_verse = sec_lower.includes("verse");
            const is_chorus = sec_lower.includes("chorus");

            if (!is_verse && !is_chorus) return;

            const words = t.split(/\s+/)
                .map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
                .filter(w => w.length > 0);

            words.forEach(w => {
                if (is_verse) {
                    if (self_pronouns.has(w) || other_pronouns.has(w)) {
                        verse_singular++;
                    } else if (plural_pronouns.has(w)) {
                        verse_plural++;
                    }
                } else if (is_chorus) {
                    if (self_pronouns.has(w) || other_pronouns.has(w)) {
                        chorus_singular++;
                    } else if (plural_pronouns.has(w)) {
                        chorus_plural++;
                    }
                }
            });
        }
    });

    const verse_total = verse_singular + verse_plural;
    const chorus_total = chorus_singular + chorus_plural;

    const verse_plural_ratio = verse_total > 0 ? (verse_plural / verse_total) : 0.0;
    const chorus_plural_ratio = chorus_total > 0 ? (chorus_plural / chorus_total) : 0.0;
    const shift = Math.abs(verse_plural_ratio - chorus_plural_ratio);

    let raw_score, feedback;
    if (verse_total === 0 || chorus_total === 0) {
        raw_score = 0.5;
        feedback = "Please label your sections and include pronouns (e.g. 'I', 'you', 'we') to evaluate relational shift.";
    } else if (shift >= 0.15) {
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Relational pronoun shift detected! Verse plural ratio: " + Math.round(verse_plural_ratio * 100) + "%, Chorus: " + Math.round(chorus_plural_ratio * 100) + "% (shift of " + Math.round(shift * 100) + "%)."
        });
        raw_score = 1.0;
        feedback = "Excellent narrative shift! Your pronoun usage changes significantly between verses and chorus (shift of " + Math.round(shift * 100) + "%). This reflects a transition from individual feelings to a shared perspective.";
    } else {
        raw_score = 0.6;
        feedback = "Static pronoun perspective (only " + Math.round(shift * 100) + "% shift). The relationship dynamic remains unchanged between sections. Try shifting from individual 'I/you' verses to a collective 'we' chorus.";
    }

    const weight = 0.040;
    return {
        id: "T35",
        name: "Narrative Pronominal Shift",
        author: "Taylor Swift / Olivia Rodrigo",
        description: "Tracks narrative relationship progression by shifting pronouns (e.g. from 'I/you' to 'we') across sections.",
        raw_score,
        weight,
        weighted_score: raw_score * weight * 100,
        feedback,
        flags,
        active: true,
        group_id: "narrative_continuity"
    };
}
