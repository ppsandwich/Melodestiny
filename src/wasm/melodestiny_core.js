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
        "T02", "T03", "T04", "T05", "T08", "T09", "T10", "T13", "T15", "T16", "T18", "T19", "T25", "T28", "T29", "T30", "T34", "T35",
        "T38", "T39", "T40", "T41", "T42", "T45", "T46", "T48", "T50", "T51", "T53", "T55"
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
            // T21 is recalculated below after clean_lines is initialized
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

    // Recalculate T09, T17, and T21 to ensure accuracy and fairness
    data.techniques.forEach(t => {
        const num = parseInt(t.id.replace(/\D/g, ''));
        if (num === 9) {
            recalculate_t09(clean_lines, lines, t);
        } else if (num === 17) {
            recalculate_t17(clean_lines, lines, t);
        } else if (num === 21) {
            recalculate_t21(clean_lines, lines, t);
        }
    });

    // 2. Compute T26 to T55
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
    const t36 = run_t36(clean_lines, lines);
    const t37 = run_t37(clean_lines, lines);
    const t38 = run_t38(clean_lines, lines);
    const t39 = run_t39(clean_lines, lines, input);
    const t40 = run_t40(clean_lines, lines);
    const t41 = run_t41(clean_lines, lines);
    const t42 = run_t42(clean_lines, lines);
    const t43 = run_t43(clean_lines, lines);
    const t44 = run_t44(clean_lines, lines);
    const t45 = run_t45(clean_lines, lines);
    const t46 = run_t46(clean_lines, lines);
    const t47 = run_t47(clean_lines, lines);
    const t48 = run_t48(clean_lines, lines);
    const t49 = run_t49(clean_lines, lines);
    const t50 = run_t50(clean_lines, lines, input);
    const t51 = run_t51(clean_lines, lines);
    const t52 = run_t52(clean_lines, lines);
    const t53 = run_t53(clean_lines, lines);
    const t54 = run_t54(clean_lines, lines);
    const t55 = run_t55(clean_lines, lines);

    data.techniques.push(
        t26, t27, t28, t29, t30, t31, t32, t33, t34, t35,
        t36, t37, t38, t39, t40, t41, t42, t43, t44, t45,
        t46, t47, t48, t49, t50, t51, t52, t53, t54, t55
    );

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

function run_t36(clean_lines, lines) {
    const flags = [];
    const temporal_words = new Set([
        "morning", "night", "midnight", "afternoon", "evening", "dawn", "dusk",
        "summer", "winter", "spring", "autumn", "fall", "clock", "hour", "minute",
        "second", "yesterday", "today", "tomorrow", "tonight", "week", "month",
        "year", "o'clock", "pm", "am", "january", "february", "march", "april",
        "may", "june", "july", "august", "september", "october", "november", "december"
    ]);

    let count = 0;
    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);
        
        let found = false;
        words.forEach(w => {
            if (temporal_words.has(w)) {
                found = true;
            }
        });

        if (found) {
            count++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Temporal narrative anchor detected: setting a clear timeline."
            });
        }
    });

    let raw_score, feedback;
    if (count >= 2) {
        raw_score = 1.0;
        feedback = "Excellent time-oriented narrative anchors! You set a clear temporal setting for your listener.";
    } else if (count === 1) {
        raw_score = 0.6;
        feedback = "Only one temporal reference. Consider adding another time anchor (like a season, hour, or time of day) to paint a vivid timeline.";
    } else {
        raw_score = 0.2;
        feedback = "No temporal anchors found. Ground your story in time using words like 'midnight', 'summer', '2 AM', or 'december'.";
    }

    return {
        id: "T36",
        name: "Time-Oriented Narrative Anchors",
        author: "Taylor Swift / Bruce Springsteen",
        description: "Placing temporal anchors (e.g. morning, midnight, summer, 2 AM, years, seasons) grounds the listener's timeline.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t37(clean_lines, lines) {
    const flags = [];
    const sight = new Set(["see", "look", "watch", "red", "blue", "green", "black", "white", "bright", "dark", "light", "glow", "shine", "colors", "shadow", "stare"]);
    const sound = new Set(["hear", "listen", "sound", "loud", "quiet", "scream", "whisper", "sing", "voice", "noise", "silence", "shout", "melody", "rhythm"]);
    const touch = new Set(["touch", "cold", "warm", "hot", "feel", "soft", "rough", "sharp", "smooth", "heavy", "light", "skin", "hold", "freeze"]);
    const tasteSmell = new Set(["sweet", "sour", "bitter", "taste", "smell", "scent", "fragrance", "salt", "spicy", "honey"]);

    let sightCount = 0;
    let soundCount = 0;
    let touchCount = 0;
    let tasteSmellCount = 0;

    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);

        let lineSight = false, lineSound = false, lineTouch = false, lineTasteSmell = false;
        words.forEach(w => {
            if (sight.has(w)) { sightCount++; lineSight = true; }
            if (sound.has(w)) { soundCount++; lineSound = true; }
            if (touch.has(w)) { touchCount++; lineTouch = true; }
            if (tasteSmell.has(w)) { tasteSmellCount++; lineTasteSmell = true; }
        });

        if (lineSight || lineSound || lineTouch || lineTasteSmell) {
            const sensesFound = [];
            if (lineSight) sensesFound.push("sight");
            if (lineSound) sensesFound.push("sound");
            if (lineTouch) sensesFound.push("touch");
            if (lineTasteSmell) sensesFound.push("taste/smell");
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Sensory language detected: " + sensesFound.join(", ") + "."
            });
        }
    });

    let activeSenses = 0;
    if (sightCount > 0) activeSenses++;
    if (soundCount > 0) activeSenses++;
    if (touchCount > 0) activeSenses++;
    if (tasteSmellCount > 0) activeSenses++;

    let raw_score, feedback;
    if (activeSenses >= 3) {
        raw_score = 1.0;
        feedback = "Sensory masterpiece! You engage at least " + activeSenses + " distinct senses, making your lyrics three-dimensional.";
    } else if (activeSenses === 2) {
        raw_score = 0.7;
        feedback = "Good, but could be richer. You engage 2 senses. Try introducing words describing sounds or tastes/smells.";
    } else if (activeSenses === 1) {
        raw_score = 0.4;
        feedback = "Your imagery is single-sensory. Add auditory, tactile, or flavor/scent details to immerse the listener.";
    } else {
        raw_score = 0.0;
        feedback = "No clear sensory words found. Write about cold skin, bright lights, loud screams, or sweet honey to trigger senses.";
    }

    return {
        id: "T37",
        name: "Sensory Plurality (Visual, Auditory, Tactile)",
        author: "Joni Mitchell / Lorde",
        description: "Engaging multiple senses (sound, touch, sight, taste, smell) makes the lyrical world feel three-dimensional.",
        raw_score,
        weight: 0.035,
        weighted_score: raw_score * 0.035 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t38(clean_lines, lines) {
    const flags = [];
    let outroSyllables = 0;
    let outroLineCount = 0;
    let otherSyllables = 0;
    let otherLineCount = 0;

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        if (line.section && line.section.toLowerCase().includes("outro")) {
            outroSyllables += line.syllables || 0;
            outroLineCount++;
        } else {
            otherSyllables += line.syllables || 0;
            otherLineCount++;
        }
    });

    let raw_score, feedback;
    if (outroLineCount === 0) {
        raw_score = 0.5;
        feedback = "No Outro section detected. Label your final section as '[Outro]' to analyze syllabic release.";
    } else {
        const outroAvg = outroSyllables / outroLineCount;
        const otherAvg = otherLineCount > 0 ? (otherSyllables / otherLineCount) : 0;
        const ratio = otherAvg > 0 ? (outroAvg / otherAvg) : 1.0;

        if (ratio <= 0.8) {
            raw_score = 1.0;
            feedback = "Excellent Outro syllabic release! Outro lines are " + Math.round((1 - ratio) * 100) + "% shorter on average, giving a nice breath at the end.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Outro syllable density is significantly lower, resolving the song's energy."
            });
        } else if (ratio <= 1.0) {
            raw_score = 0.7;
            feedback = "Moderate syllabic release. Outro lines are slightly shorter (" + Math.round((1 - ratio) * 100) + "% shorter). Shorter Outro lines help wind down the track.";
        } else {
            raw_score = 0.4;
            feedback = "The Outro lines are longer than the rest of the song (" + Math.round((ratio - 1) * 100) + "% longer). Consider wrapping up with fewer syllables to resolve tension.";
        }
    }

    return {
        id: "T38",
        name: "Climax/Outro Syllabic Release",
        author: "Billie Eilish / Finneas",
        description: "The Outro or final section should have shorter, more spacious lines to resolve the song's energy.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t39(clean_lines, lines, input) {
    const flags = [];
    const title = (input.title || "").trim().toLowerCase();
    
    let count = 0;
    if (title.length > 0) {
        clean_lines.forEach(line => {
            const lineText = line.text.toLowerCase();
            let idx = lineText.indexOf(title);
            while (idx !== -1) {
                count++;
                idx = lineText.indexOf(title, idx + 1);
            }
        });
    }

    let raw_score, feedback;
    if (title.length === 0) {
        raw_score = 0.0;
        feedback = "Please specify a song title to compute this metric.";
    } else if (count >= 4 && count <= 10) {
        raw_score = 1.0;
        feedback = "Perfect title repetition! The title is repeated " + count + " times. It's memorable without becoming overbearing.";
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Title repeated " + count + " times, fitting the commercial sweet spot (4-10)."
        });
    } else if ((count >= 2 && count <= 3) || (count >= 11 && count <= 15)) {
        raw_score = 0.7;
        feedback = "Decent title repetition. It is repeated " + count + " times. Aim for 4-10 times for a commercial hook sweet spot.";
    } else if (count === 1 || count > 15) {
        raw_score = 0.4;
        feedback = "Title repeated " + count + " times. " + (count === 1 ? "Repeat it more in the chorus to build familiarity." : "Avoid over-repetition so it doesn't fatigue listeners.");
    } else {
        raw_score = 0.0;
        feedback = "The song title '" + input.title + "' is never mentioned in the lyrics!";
    }

    return {
        id: "T39",
        name: "Title Repetition Quotient",
        author: "Max Martin / Ryan Tedder",
        description: "A commercial hook needs its title repeated enough times to stick, but not so much that it becomes annoying.",
        raw_score,
        weight: 0.040,
        weighted_score: raw_score * 0.040 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t40(clean_lines, lines) {
    const flags = [];
    const sectionAvgs = {};
    const sectionSyllables = {};
    const sectionLineCounts = {};
    const sectionOrder = [];

    let currentSectionName = null;
    lines.forEach(line => {
        const text = line.text.trim();
        if (text.startsWith('[') || text.startsWith('{')) {
            currentSectionName = text.replace(/[\[\]\{\}]/g, "").trim();
            if (!sectionSyllables[currentSectionName]) {
                sectionSyllables[currentSectionName] = 0;
                sectionLineCounts[currentSectionName] = 0;
                sectionOrder.push(currentSectionName);
            }
        } else if (currentSectionName && text.length > 0) {
            sectionSyllables[currentSectionName] += line.syllables || 0;
            sectionLineCounts[currentSectionName]++;
        }
    });

    sectionOrder.forEach(sec => {
        sectionAvgs[sec] = sectionLineCounts[sec] > 0 ? (sectionSyllables[sec] / sectionLineCounts[sec]) : 0;
    });

    let preChorusCount = 0;
    let passCount = 0;

    for (let i = 1; i < sectionOrder.length; i++) {
        const sec = sectionOrder[i];
        if (sec.toLowerCase().includes("pre-chorus")) {
            preChorusCount++;
            const prevSec = sectionOrder[i - 1];
            const preChorusAvg = sectionAvgs[sec];
            const prevAvg = sectionAvgs[prevSec];

            if (prevAvg > 0 && preChorusAvg >= prevAvg * 1.15) {
                passCount++;
            }
        }
    }

    let raw_score, feedback;
    if (preChorusCount === 0) {
        raw_score = 0.5;
        feedback = "No '[Pre-Chorus]' section detected to evaluate pacing transitions.";
    } else {
        const ratio = preChorusCount > 0 ? (passCount / preChorusCount) : 0;
        if (ratio === 1.0) {
            raw_score = 1.0;
            feedback = "Excellent Pre-Chorus transition pacing! Your Pre-Chorus accelerates syllable density to build energy before the chorus.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Pre-Chorus increases syllable density by at least 15% to build anticipation."
            });
        } else if (ratio > 0.0) {
            raw_score = 0.7;
            feedback = "Some Pre-Chorus sections accelerate pacing, but not all. Ensure every Pre-Chorus is wordier and faster than the verse.";
        } else {
            raw_score = 0.4;
            feedback = "Pre-Chorus doesn't accelerate. Pre-Chorus lines should be punchier or wordier (15%+ more syllables per line) than the Verse to build tension.";
        }
    }

    return {
        id: "T40",
        name: "Pre-Chorus Transition Pacing",
        author: "Max Martin / Shellback",
        description: "The Pre-Chorus builds anticipation by accelerating the lyrical density (more syllables per line) before the Chorus explodes.",
        raw_score,
        weight: 0.035,
        weighted_score: raw_score * 0.035 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t41(clean_lines, lines) {
    const flags = [];
    const water = new Set(["water", "ocean", "sea", "wave", "drown", "swim", "rain", "river", "flood", "tide", "shore", "storm", "sink", "deep"]);
    const fire = new Set(["fire", "burn", "flame", "hot", "heat", "smoke", "spark", "ash", "warm", "melt", "blaze", "glow"]);
    const space = new Set(["space", "sky", "star", "moon", "sun", "planet", "galaxy", "orbit", "cloud", "heaven", "flight", "comet"]);
    const battle = new Set(["fight", "war", "battle", "soldier", "shield", "sword", "weapon", "wound", "scars", "enemy", "army", "bleed", "pain"]);

    const matchWater = new Set();
    const matchFire = new Set();
    const matchSpace = new Set();
    const matchBattle = new Set();

    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);

        words.forEach(w => {
            if (water.has(w)) matchWater.add(w);
            if (fire.has(w)) matchFire.add(w);
            if (space.has(w)) matchSpace.add(w);
            if (battle.has(w)) matchBattle.add(w);
        });
    });

    const maxCount = Math.max(matchWater.size, matchFire.size, matchSpace.size, matchBattle.size);
    let themeName = "";
    if (maxCount === matchWater.size) themeName = "Water/Ocean";
    else if (maxCount === matchFire.size) themeName = "Fire/Heat";
    else if (maxCount === matchSpace.size) themeName = "Space/Sky";
    else themeName = "Physical Battle";

    let raw_score, feedback;
    if (maxCount >= 3) {
        raw_score = 1.0;
        feedback = "Excellent thematic coherence! You established a strong " + themeName + " metaphor cluster with " + maxCount + " distinct terms.";
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Strong thematic word cluster in domain: " + themeName + " (" + maxCount + " distinct words)."
        });
    } else if (maxCount === 2) {
        raw_score = 0.7;
        feedback = "Developing thematic cluster. You have 2 distinct terms in " + themeName + ". Try adding one more related metaphor word to solidify the imagery.";
    } else if (maxCount === 1) {
        raw_score = 0.4;
        feedback = "Weak metaphor coherence. You only have isolated words. Ground the lyrics with a consistent theme (e.g. water, space, fire, or battle).";
    } else {
        raw_score = 0.1;
        feedback = "No thematic word clusters detected. Pick a conceptual metaphor domain and sprinkle related words throughout the track.";
    }

    return {
        id: "T41",
        name: "Thematic Word Clustering (Metaphor Coherence)",
        author: "Leonard Cohen / Bob Dylan",
        description: "A strong song sticks to a central semantic domain (e.g., weather, ocean/water, fire, war, space) rather than mixing metaphors.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t42(clean_lines, lines) {
    const flags = [];
    const actionVerbs = new Set([
        "run", "walk", "jump", "scream", "fall", "drive", "break", "burn", "kiss", "hold",
        "fight", "hide", "seek", "throw", "pull", "push", "cry", "dance", "fly", "sing",
        "ride", "chase", "write", "call", "wait", "leave", "stay", "meet", "lose", "win",
        "laugh", "touch", "grow", "save", "help", "find", "take", "give", "make", "know",
        "love", "hate", "want", "need", "runs", "walks", "jumps", "screams", "falls",
        "drives", "breaks", "burns", "kisses", "holds", "fights", "hides", "seeks",
        "throws", "pulls", "pushes", "cries", "dances", "flies", "sings", "rides",
        "chases", "writes", "calls", "waits", "leaves", "stays", "meets", "loses",
        "wins", "laughs", "touches", "grows", "saves", "helps", "finds", "takes",
        "gives", "makes", "knows", "loves", "hates", "wants", "needs", "running",
        "walking", "jumping", "screaming", "falling", "driving", "breaking", "burning",
        "kissing", "holding", "fighting", "hiding", "seeking", "throwing", "pulling",
        "pushing", "crying", "dancing", "flying", "singing", "riding", "chasing",
        "writing", "calling", "waiting", "leaving", "staying", "meeting", "losing",
        "winning", "laughing", "touching", "growing", "saving", "helping", "finding",
        "taking", "giving", "making", "knowing", "loving", "hating", "wanting", "needing"
    ]);

    const linkingVerbs = new Set(["is", "are", "was", "were", "be", "been", "am", "seem", "became", "become", "seems", "becomes", "seemed", "became"]);

    let actionCount = 0;
    let linkingCount = 0;

    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);

        words.forEach(w => {
            if (actionVerbs.has(w)) actionCount++;
            if (linkingVerbs.has(w)) linkingCount++;
        });
    });

    let raw_score, feedback;
    if (actionCount === 0 && linkingCount === 0) {
        raw_score = 0.5;
        feedback = "No verbs detected. Write active lines containing verbs.";
    } else {
        const ratio = linkingCount > 0 ? (actionCount / linkingCount) : actionCount;
        if (ratio >= 2.0) {
            raw_score = 1.0;
            feedback = "Excellent active narrative! Action verbs (" + actionCount + ") outnumber passive/linking verbs (" + linkingCount + ") by at least 2:1.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "High ratio of action-to-linking verbs (" + ratio.toFixed(1) + "x), driving narrative motion."
            });
        } else if (ratio >= 1.0) {
            raw_score = 0.7;
            feedback = "Good verb balance. You have " + actionCount + " action verbs and " + linkingCount + " linking verbs. Try to replace a few linking verbs ('is', 'was') with active verbs.";
        } else {
            raw_score = 0.4;
            feedback = "Your writing feels passive (" + actionCount + " action vs " + linkingCount + " linking verbs). Rely less on description ('she was sad') and more on action ('she cried').";
        }
    }

    return {
        id: "T42",
        name: "Action Verb Density",
        author: "Mick Jagger / Keith Richards",
        description: "Keep the narrative moving forward by using active verbs rather than passive descriptions or linking verbs (is, was).",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t43(clean_lines, lines) {
    const flags = [];
    const questionWords = new Set(["why", "how", "what", "where", "who", "when"]);

    let count = 0;
    clean_lines.forEach(line => {
        const trimmed = line.text.trim();
        const hasQuestionMark = trimmed.includes('?');
        
        const firstWord = trimmed.toLowerCase().split(/\s+/)[0] || "";
        const cleanFirst = firstWord.replace(/[^a-z]/g, "");
        const isInterrogativeStart = questionWords.has(cleanFirst);

        if (hasQuestionMark || isInterrogativeStart) {
            count++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Interrogative hook: posing a question to engage curiosity."
            });
        }
    });

    let raw_score, feedback;
    if (count >= 2 && count <= 5) {
        raw_score = 1.0;
        feedback = "Perfect amount of interrogative hooks! Posing " + count + " questions builds interest and dialogue-like tension.";
    } else if (count === 1) {
        raw_score = 0.7;
        feedback = "Only one question. Consider adding another inquiry in the verses to deepen the listener's engagement.";
    } else if (count > 5) {
        raw_score = 0.6;
        feedback = "Too many questions (" + count + "). Don't overwhelm the listener with queries; provide some emotional answers.";
    } else {
        raw_score = 0.3;
        feedback = "No questions found. Incorporate questions to create curiosity loops in your storytelling.";
    }

    return {
        id: "T43",
        name: "Interrogative Hooks (Curiosity Loops)",
        author: "John Mayer / Julia Michaels",
        description: "Scatter questions throughout the verses or bridge to engage the listener in the song's internal conflict.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t44(clean_lines, lines) {
    const flags = [];
    const contrastPairs = [
        { w1: "love", w2: "hate" },
        { w1: "light", w2: "dark" },
        { w1: "cold", w2: "hot" },
        { w1: "cold", w2: "fire" },
        { w1: "hello", w2: "goodbye" },
        { w1: "hello", w2: "bye" },
        { w1: "win", w2: "lose" },
        { w1: "up", w2: "down" },
        { w1: "night", w2: "day" },
        { w1: "young", w2: "old" },
        { w1: "high", w2: "low" },
        { w1: "good", w2: "bad" },
        { w1: "right", w2: "wrong" }
    ];

    const words = new Set();
    clean_lines.forEach(line => {
        line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0)
            .forEach(w => words.add(w));
    });

    let pairsCount = 0;
    const detectedWords = new Set();

    contrastPairs.forEach(pair => {
        if (words.has(pair.w1) && words.has(pair.w2)) {
            pairsCount++;
            detectedWords.add(pair.w1);
            detectedWords.add(pair.w2);
        }
    });

    clean_lines.forEach(line => {
        const lineWords = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);
        
        let foundWord = null;
        for (const w of lineWords) {
            if (detectedWords.has(w)) {
                foundWord = w;
                break;
            }
        }

        if (foundWord) {
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Contrast word '" + foundWord + "' detected, forming antithesis."
            });
        }
    });

    let raw_score, feedback;
    if (pairsCount >= 2) {
        raw_score = 1.0;
        feedback = "Excellent rhetorical contrast! You used " + pairsCount + " opposing word pairs to build emotional friction.";
    } else if (pairsCount === 1) {
        raw_score = 0.7;
        feedback = "Good rhetorical contrast. You have 1 opposing pair. Try to insert another contrasting concept (like night/day or win/lose).";
    } else {
        raw_score = 0.3;
        feedback = "No strong rhetorical contrast pairs. Build lyrical friction by juxtaposing opposite words like 'light' and 'dark'.";
    }

    return {
        id: "T44",
        name: "Rhetorical Contrast (Antithesis)",
        author: "Paul McCartney / Bernie Taupin",
        description: "Juxtapose opposing ideas (e.g. love/hate, light/dark, cold/fire) to create lyrical friction.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t45(clean_lines, lines) {
    const flags = [];
    let chorusLines = 0;
    let oddChorusLines = 0;

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        if (line.section && line.section.toLowerCase().includes("chorus")) {
            chorusLines++;
            if (line.syllables % 2 !== 0) {
                oddChorusLines++;
            }
        }
    });

    let raw_score, feedback;
    if (chorusLines === 0) {
        raw_score = 0.5;
        feedback = "No Chorus section detected. Add '[Chorus]' to evaluate syncopation parity.";
    } else {
        const ratio = oddChorusLines / chorusLines;
        if (ratio >= 0.4 && ratio <= 0.7) {
            raw_score = 1.0;
            feedback = "Perfect rhythmic syncopation in Chorus! " + Math.round(ratio * 100) + "% of lines have odd syllable counts, creating a modern, groovy feel.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Excellent ratio of odd-syllable lines in Chorus (" + Math.round(ratio * 100) + "%), creating rhythmic syncopation."
            });
        } else if (ratio >= 0.3 && ratio <= 0.8) {
            raw_score = 0.7;
            feedback = "Moderate syncopation. Chorus has " + Math.round(ratio * 100) + "% odd-numbered syllable lines. Ideal range is 40% to 70%.";
        } else {
            raw_score = 0.4;
            feedback = "Low/high syncopation sync (" + Math.round(ratio * 100) + "% odd lines). Pop choruses groove best when 40%-70% of lines are odd-syllable paced.";
        }
    }

    return {
        id: "T45",
        name: "Syllabic Syncopation",
        author: "Pharrell Williams",
        description: "Create rhythmic groove by utilizing lines with odd syllable counts (e.g. 7 or 9 syllables) which naturally feel syncopated.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t46(clean_lines, lines) {
    const flags = [];
    const pronouns = new Set([
        "i", "me", "my", "mine", "myself", "you", "your", "yours", "yourself",
        "he", "him", "his", "himself", "she", "her", "hers", "herself",
        "it", "its", "itself", "we", "us", "our", "ours", "ourselves",
        "they", "them", "their", "theirs", "themselves"
    ]);

    let pronounCount = 0;
    let wordCount = 0;

    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ""))
            .filter(w => w.length > 0);

        wordCount += words.length;
        words.forEach(w => {
            if (pronouns.has(w)) pronounCount++;
        });
    });

    let raw_score, feedback;
    if (wordCount === 0) {
        raw_score = 0.5;
        feedback = "No words to evaluate.";
    } else {
        const ratio = pronounCount / wordCount;
        if (ratio >= 0.08 && ratio <= 0.15) {
            raw_score = 1.0;
            feedback = "Excellent pronoun density! Pronouns make up " + Math.round(ratio * 100) + "% of words, providing an intimate yet grounded feel.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Intimate pronoun-to-word ratio: " + Math.round(ratio * 100) + "%."
            });
        } else if (ratio >= 0.05 && ratio <= 0.20) {
            raw_score = 0.7;
            feedback = "Good pronoun density (" + Math.round(ratio * 100) + "%). Shoot for 8%-15% to maintain direct accessibility.";
        } else {
            raw_score = 0.4;
            feedback = "Suboptimal pronoun ratio (" + Math.round(ratio * 100) + "%). " + (ratio < 0.05 ? "Add more personal connections ('I', 'you')." : "Too many pronouns; add real-world nouns for concrete details.");
        }
    }

    return {
        id: "T46",
        name: "Pronoun-to-Noun Ratio",
        author: "Ed Sheeran",
        description: "Relatable storytelling balances personal pronouns (I, you) with real-world nouns.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t47(clean_lines, lines) {
    const flags = [];
    
    function getRhymeSuffix(word) {
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        if (clean.length < 2) return clean;
        const vowels = "aeiouy";
        let vowelIdx = -1;
        for (let i = clean.length - 1; i >= 0; i--) {
            if (vowels.includes(clean.charAt(i))) {
                vowelIdx = i;
                break;
            }
        }
        if (vowelIdx === -1) return clean;
        const rawSuffix = clean.substring(vowelIdx);
        return rawSuffix
            .replace(/^ea/, "ee").replace(/^ie/, "ee")
            .replace(/^ai/, "ay").replace(/^ey/, "ay")
            .replace(/^ou/, "ow")
            .replace(/^ue/, "oo")
            .replace(/^oa/, "oh").replace(/^oe/, "oh");
    }

    let rhymeLines = 0;

    clean_lines.forEach(line => {
        const words = line.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(w => w.length > 1);
        if (words.length < 3) return;

        let hasInternalRhyme = false;
        const suffixes = words.map(w => getRhymeSuffix(w));

        for (let i = 0; i < words.length - 1; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (words[i] !== words[j] && suffixes[i] === suffixes[j] && suffixes[i].length > 1) {
                    hasInternalRhyme = true;
                    flags.push({
                        type_: "Positive",
                        line_number: line.line_number,
                        message: "Internal rhyme detected: '" + words[i] + "' and '" + words[j] + "'."
                    });
                    break;
                }
            }
            if (hasInternalRhyme) break;
        }

        if (hasInternalRhyme) rhymeLines++;
    });

    let raw_score, feedback;
    if (rhymeLines >= 3) {
        raw_score = 1.0;
        feedback = "Outstanding internal rhyming! You have " + rhymeLines + " lines with internal rhyme patterns, creating a highly musical flow.";
    } else if (rhymeLines === 2) {
        raw_score = 0.8;
        feedback = "Good internal rhymes in 2 lines. Add one more to achieve optimal density.";
    } else if (rhymeLines === 1) {
        raw_score = 0.5;
        feedback = "Found internal rhyming in 1 line. Try inserting another internal rhyme within a verse to improve lyric flow.";
    } else {
        raw_score = 0.2;
        feedback = "No internal rhymes detected within lines. Add rhymes in the middle of lines (e.g. 'the light in the night' or 'we play in the day').";
    }

    return {
        id: "T47",
        name: "Rhyme Density (Internal Rhyming)",
        author: "Lin-Manuel Miranda / Eminem",
        description: "Rhymes shouldn't just be at the end of lines. Internal rhymes within a line create a dense, satisfying flow.",
        raw_score,
        weight: 0.040,
        weighted_score: raw_score * 0.040 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t48(clean_lines, lines) {
    const flags = [];
    const sectionSyllables = {};
    const sectionLineCounts = {};
    const sectionOrder = [];

    let currentSectionName = null;
    lines.forEach(line => {
        const text = line.text.trim();
        if (text.startsWith('[') || text.startsWith('{')) {
            currentSectionName = text.replace(/[\[\]\{\}]/g, "").trim();
            if (!sectionSyllables[currentSectionName]) {
                sectionSyllables[currentSectionName] = 0;
                sectionLineCounts[currentSectionName] = 0;
                sectionOrder.push(currentSectionName);
            }
        } else if (currentSectionName && text.length > 0) {
            sectionSyllables[currentSectionName] += line.syllables || 0;
            sectionLineCounts[currentSectionName]++;
        }
    });

    const sectionAvgs = [];
    sectionOrder.forEach(sec => {
        if (sectionLineCounts[sec] > 0) {
            sectionAvgs.push({
                name: sec,
                avg: sectionSyllables[sec] / sectionLineCounts[sec]
            });
        }
    });

    let raw_score, feedback;
    if (sectionAvgs.length < 3) {
        raw_score = 0.5;
        feedback = "Fewer than 3 sections. Add more structural sections (Verse, Chorus, Pre-Chorus) to evaluate syllable valleys.";
    } else {
        let maxDrop = 0;
        let valleySection = "";

        for (let i = 1; i < sectionAvgs.length - 1; i++) {
            const prev = sectionAvgs[i - 1].avg;
            const curr = sectionAvgs[i].avg;
            const next = sectionAvgs[i + 1].avg;

            const neighborAvg = (prev + next) / 2;
            if (neighborAvg > 0) {
                const drop = (neighborAvg - curr) / neighborAvg;
                if (drop > maxDrop) {
                    maxDrop = drop;
                    valleySection = sectionAvgs[i].name;
                }
            }
        }

        if (maxDrop >= 0.40) {
            raw_score = 1.0;
            feedback = "Excellent syllable valley found in '" + valleySection + "'! Syllable count drops by " + Math.round(maxDrop * 100) + "%, giving the listener breathing room.";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Lyrical space valley detected in section: " + valleySection + " (syllable drop of " + Math.round(maxDrop * 100) + "%)."
            });
        } else if (maxDrop >= 0.20) {
            raw_score = 0.7;
            feedback = "Moderate syllable valley in '" + valleySection + "' (drop of " + Math.round(maxDrop * 100) + "%). Target a 40%+ drop to create contrast.";
        } else {
            raw_score = 0.4;
            feedback = "No significant syllable valley. Your pacing is uniform. Create a 'lyrical space' section (like a Pre-Chorus) where line syllables drop by 40%+.";
        }
    }

    return {
        id: "T48",
        name: "Lyrical Space (Syllable Valley)",
        author: "Adele / Greg Kurstin",
        description: "A wordy verse should be followed by a spacious, slow-moving Pre-Chorus or Chorus to give the listener breathing room.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t49(clean_lines, lines) {
    const flags = [];
    let pauses = 0;

    clean_lines.forEach(line => {
        if (line.syllables > 0 && line.syllables <= 3) {
            pauses++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Negative space: short line (" + line.syllables + " syllables) acts as a breath/pause."
            });
        }
    });

    let emptyStreak = 0;
    lines.forEach(line => {
        const text = line.text.trim();
        if (text.length === 0) {
            emptyStreak++;
            if (emptyStreak >= 2) {
                pauses++;
                flags.push({
                    type_: "Positive",
                    line_number: 1,
                    message: "Negative space: consecutive empty lines create a dramatic musical pause."
                });
                emptyStreak = 0;
            }
        } else {
            emptyStreak = 0;
        }
    });

    let raw_score, feedback;
    if (pauses >= 2) {
        raw_score = 1.0;
        feedback = "Excellent use of negative space! You have " + pauses + " moments of silence/pauses to break up the dense flow.";
    } else if (pauses === 1) {
        raw_score = 0.7;
        feedback = "Good, you have 1 pause. Add another short 1-2 word line or double line break to highlight key hooks.";
    } else {
        raw_score = 0.3;
        feedback = "Lacks negative space. Add short 1-2 word lines (e.g. 'No', 'Goodbye') or double breaks to introduce dramatic breathing room.";
    }

    return {
        id: "T49",
        name: "Negative Space (Line Breaths)",
        author: "Billie Eilish / Khalid",
        description: "Silence is a lyric. Having double empty lines or short 1-2 word lines creates dramatic pauses.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t50(clean_lines, lines, input) {
    const flags = [];
    const title = (input.title || "").trim();
    const words = title.split(/\s+/).filter(w => w.length > 0);

    const avoidWords = new Set([
        "a", "an", "the", "to", "in", "on", "at", "for", "from", "with", "by", "of", "and", "but", "or",
        "i", "you", "me", "my", "he", "she", "it", "we", "they", "your", "our", "him", "her", "us", "them"
    ]);

    function estimateSyllables(word) {
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        if (clean.length === 0) return 0;
        const vowels = "aeiouy";
        let count = 0;
        let prevVowel = false;
        for (let i = 0; i < clean.length; i++) {
            const isV = vowels.includes(clean.charAt(i));
            if (isV && !prevVowel) {
                count++;
            }
            prevVowel = isV;
        }
        if (clean.endsWith("e") && count > 1) count--;
        return Math.max(1, count);
    }

    let raw_score, feedback;
    if (words.length === 0) {
        raw_score = 0.0;
        feedback = "No song title provided.";
    } else if (words.length === 1) {
        raw_score = 0.7;
        feedback = "Single-word title. Single-word titles are clean, but multi-word titles gain extra memory retention.";
    } else {
        const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, "");
        const lastWord = words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "");

        const firstSyllables = estimateSyllables(firstWord);
        const lastSyllables = estimateSyllables(lastWord);

        const firstOK = firstSyllables >= 2 && !avoidWords.has(firstWord);
        const lastOK = lastSyllables >= 2 && !avoidWords.has(lastWord);

        if (firstOK || lastOK) {
            raw_score = 1.0;
            feedback = "Excellent title weight distribution! Your title begins or ends with an emphasizing multi-syllable word ('" + (firstOK ? words[0] : words[words.length - 1]) + "').";
            flags.push({
                type_: "Positive",
                line_number: 1,
                message: "Title begins or ends with a weighted content word: '" + (firstOK ? words[0] : words[words.length - 1]) + "'."
            });
        } else {
            raw_score = 0.5;
            feedback = "Weak title weight. Your multi-word title starts and ends with short words or articles/pronouns. Consider starting or ending with a multi-syllable noun/verb.";
        }
    }

    return {
        id: "T50",
        name: "Title Weight Distribution",
        author: "Diane Warren",
        description: "In a multi-word title, placing the heaviest emphasis on the first or last word makes it more memorable.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t51(clean_lines, lines) {
    const flags = [];
    const choruses = [];
    let currentChorus = [];
    lines.forEach(line => {
        const t = line.text.trim();
        if (t.startsWith('[') || t.startsWith('{')) {
            const sec = t.replace(/[\[\]\{\}]/g, "").trim().toLowerCase();
            if (sec.includes("chorus")) {
                if (currentChorus.length > 0) {
                    choruses.push(currentChorus);
                    currentChorus = [];
                }
            } else {
                if (currentChorus.length > 0) {
                    choruses.push(currentChorus);
                    currentChorus = [];
                }
            }
        } else if (line.section && line.section.toLowerCase().includes("chorus") && t.length > 0) {
            currentChorus.push(line);
        }
    });
    if (currentChorus.length > 0) choruses.push(currentChorus);

    let hasAlliteration = false;
    let matchedLetter = "";

    for (const chorus of choruses) {
        if (chorus.length < 2) continue;
        for (let i = 0; i < chorus.length - 1; i++) {
            const w1 = chorus[i].text.trim().toLowerCase().split(/\s+/)[0] || "";
            const w2 = chorus[i + 1].text.trim().toLowerCase().split(/\s+/)[0] || "";
            
            const l1 = w1.replace(/[^a-z]/g, "").charAt(0);
            const l2 = w2.replace(/[^a-z]/g, "").charAt(0);

            const isConsonant = l1 && !"aeiou".includes(l1);

            if (l1 && l2 && l1 === l2 && isConsonant) {
                hasAlliteration = true;
                matchedLetter = l1.toUpperCase();
                flags.push({
                    type_: "Positive",
                    line_number: chorus[i].line_number,
                    message: "Alliterative hook framing! Line starts with same consonant letter '" + matchedLetter + "' as the next line."
                });
            }
        }
    }

    let raw_score, feedback;
    if (choruses.length === 0) {
        raw_score = 0.5;
        feedback = "No Chorus section found. Add a '[Chorus]' section to evaluate alliterative hooks.";
    } else if (hasAlliteration) {
        raw_score = 1.0;
        feedback = "Excellent hook framing! Consecutive chorus lines share the same starting consonant ('" + matchedLetter + "'), which locks in the melody.";
    } else {
        raw_score = 0.5;
        feedback = "No consecutive alliterative lines in Chorus. Try starting adjacent Chorus lines with the same consonant (e.g. both starting with 'S' or 'B').";
    }

    return {
        id: "T51",
        name: "Alliterative Hook Framing",
        author: "Max Martin",
        description: "The chorus lines are more memorable if their first words share the same starting consonant sound (alliteration).",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t52(clean_lines, lines) {
    const flags = [];

    function estimateSyllables(word) {
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        if (clean.length === 0) return 0;
        const vowels = "aeiouy";
        let count = 0;
        let prevVowel = false;
        for (let i = 0; i < clean.length; i++) {
            const isV = vowels.includes(clean.charAt(i));
            if (isV && !prevVowel) {
                count++;
            }
            prevVowel = isV;
        }
        if (clean.endsWith("e") && count > 1) count--;
        return Math.max(1, count);
    }

    let contrastingLines = 0;

    clean_lines.forEach(line => {
        const words = line.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(w => w.length > 0);
        if (words.length < 2) return;

        let hasShort = false;
        let hasLong = false;
        let longWord = "";

        words.forEach(w => {
            const syls = estimateSyllables(w);
            if (syls === 1) {
                hasShort = true;
            } else if (syls >= 3) {
                hasLong = true;
                longWord = w;
            }
        });

        if (hasShort && hasLong) {
            contrastingLines++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Word length contrast: short 1-syllable words mixed with long word '" + longWord + "'."
            });
        }
    });

    const ratio = clean_lines.length > 0 ? (contrastingLines / clean_lines.length) : 0.0;

    let raw_score, feedback;
    if (clean_lines.length === 0) {
        raw_score = 0.5;
        feedback = "No lyrics to evaluate.";
    } else if (ratio >= 0.20) {
        raw_score = 1.0;
        feedback = "Excellent word length contrast! " + Math.round(ratio * 100) + "% of your lines contain both very short and complex multi-syllable words.";
    } else if (ratio >= 0.10) {
        raw_score = 0.7;
        feedback = "Good contrast (" + Math.round(ratio * 100) + "% of lines). Try to mix more 1-syllable and 3+ syllable words inside the same lines.";
    } else {
        raw_score = 0.4;
        feedback = "Uniform word lengths (" + Math.round(ratio * 100) + "% contrast). Combine simple 1-syllable words with 3+ syllable words (like 'beautiful', 'surrender') in the same line.";
    }

    return {
        id: "T52",
        name: "Word Length Contrast",
        author: "Lorde",
        description: "Create sonic variety by mixing very short words (1 syllable) with long, flowing words (3+ syllables) in the same line.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: "vocabulary_style"
    };
}

function run_t53(clean_lines, lines) {
    const flags = [];

    function getVowelQuality(word) {
        const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
        if (clean.length === 0) return null;
        const lastChar = clean.charAt(clean.length - 1);
        if ("aei".includes(lastChar)) return "bright";
        if ("ou".includes(lastChar)) return "dark";
        for (let i = clean.length - 1; i >= 0; i--) {
            const char = clean.charAt(i);
            if ("aei".includes(char)) return "bright";
            if ("ou".includes(char)) return "dark";
        }
        return null;
    }

    let verseTotal = 0, verseBright = 0;
    let chorusTotal = 0, chorusBright = 0;

    lines.forEach(line => {
        const t = line.text.trim();
        if (t.length === 0 || t.startsWith('[') || t.startsWith('{')) return;

        if (line.section) {
            const sec = line.section.toLowerCase();
            const words = t.split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return;
            const lastWord = words[words.length - 1];
            const quality = getVowelQuality(lastWord);
            if (!quality) return;

            if (sec.includes("verse")) {
                verseTotal++;
                if (quality === "bright") verseBright++;
            } else if (sec.includes("chorus")) {
                chorusTotal++;
                if (quality === "bright") chorusBright++;
            }
        }
    });

    const verseRatio = verseTotal > 0 ? (verseBright / verseTotal) : 0.5;
    const chorusRatio = chorusTotal > 0 ? (chorusBright / chorusTotal) : 0.5;
    const diff = Math.abs(verseRatio - chorusRatio);

    let raw_score, feedback;
    if (verseTotal === 0 || chorusTotal === 0) {
        raw_score = 0.5;
        feedback = "Label your Verses and Choruses to evaluate vowel quality shifting between sections.";
    } else if (diff >= 0.25) {
        raw_score = 1.0;
        feedback = "Excellent vowel quality shifting! Verse bright-ending endings: " + Math.round(verseRatio * 100) + "%, Chorus: " + Math.round(chorusRatio * 100) + "% (difference of " + Math.round(diff * 100) + "%).";
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Strong phonetic shift: vowel quality difference is " + Math.round(diff * 100) + "% between sections."
        });
    } else if (diff >= 0.15) {
        raw_score = 0.7;
        feedback = "Moderate vowel quality shifting (diff of " + Math.round(diff * 100) + "%). Try to end Verses with darker vowel sounds and Choruses with brighter vowel sounds.";
    } else {
        raw_score = 0.4;
        feedback = "Suboptimal shifting (" + Math.round(diff * 100) + "% difference). Keep Verses mostly dark/somber (O, U endings) and Choruses bright/open (A, E, I endings) to build sonic contrast.";
    }

    return {
        id: "T53",
        name: "Vowel Quality Shifting",
        author: "Kurt Cobain / Sia",
        description: "Alternate between bright vowels (A, E, I) for high energy and dark, closed vowels (O, U) for somber, introspective lines.",
        raw_score,
        weight: 0.030,
        weighted_score: raw_score * 0.030 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t54(clean_lines, lines) {
    const flags = [];
    const conditionals = new Set(["if", "could", "would", "should", "maybe", "suppose", "wish", "should've", "could've", "would've"]);

    let count = 0;
    clean_lines.forEach(line => {
        const words = line.text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^a-z']/g, ""))
            .filter(w => w.length > 0);

        let found = false;
        words.forEach(w => {
            if (conditionals.has(w)) {
                found = true;
            }
        });

        if (found) {
            count++;
            flags.push({
                type_: "Positive",
                line_number: line.line_number,
                message: "Conditional narrative framing: exploring what-ifs or regrets."
            });
        }
    });

    let raw_score, feedback;
    if (count >= 3) {
        raw_score = 1.0;
        feedback = "Excellent conditional storytelling! You used " + count + " conditional clauses ('if', 'could', 'would') to frame hypothetical choices.";
    } else if (count === 2) {
        raw_score = 0.7;
        feedback = "Developing framing. You used 2 conditional clauses. Try to add one more conditional setting to deepen the narrative intrigue.";
    } else if (count === 1) {
        raw_score = 0.4;
        feedback = "Only 1 conditional word found. Use 'maybe', 'wish', or 'if' to create imaginary setups that highlight emotional conflict.";
    } else {
        raw_score = 0.2;
        feedback = "No conditional framing words. Introduce 'what-if' or regret scenarios using words like 'if you...', 'we could've...', or 'wish you were here'.";
    }

    return {
        id: "T54",
        name: "Conditional Narrative Framing",
        author: "Taylor Swift / John Prine",
        description: "Setting up conditional scenarios ('If you...', 'Then we...', 'Could have...') engages the listener's imagination.",
        raw_score,
        weight: 0.025,
        weighted_score: raw_score * 0.025 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function run_t55(clean_lines, lines) {
    const flags = [];

    const getUniqueWords = (linesList) => {
        const words = new Set();
        linesList.forEach(line => {
            line.text.toLowerCase().split(/\s+/)
                .map(w => w.replace(/[^a-z]/g, ""))
                .filter(w => w.length > 0)
                .forEach(w => words.add(w));
        });
        return words;
    };

    const chorusLines = lines.filter(l => l.section && l.section.toLowerCase().includes("chorus"));
    const outroLines = lines.filter(l => l.section && l.section.toLowerCase().includes("outro"));

    let raw_score, feedback;
    if (chorusLines.length === 0 || outroLines.length === 0) {
        raw_score = 0.5;
        feedback = "Write both a '[Chorus]' and an '[Outro]' section to evaluate the narrative echo.";
    } else {
        const chorusWords = getUniqueWords(chorusLines);
        const outroWords = getUniqueWords(outroLines);

        if (chorusWords.size === 0 || outroWords.size === 0) {
            raw_score = 0.5;
            feedback = "Write lyrics inside Chorus and Outro sections to compute overlap.";
        } else {
            let intersect = 0;
            chorusWords.forEach(w => {
                if (outroWords.has(w)) intersect++;
            });

            const union = chorusWords.size + outroWords.size - intersect;
            const jaccard = intersect / union;

            if (jaccard >= 0.30 && jaccard <= 0.70) {
                raw_score = 1.0;
                feedback = "Perfect Outro narrative echo! The Jaccard similarity of " + Math.round(jaccard * 100) + "% shows a subverted/modified echo of your chorus.";
                flags.push({
                    type_: "Positive",
                    line_number: 1,
                    message: "Lyrical echo detected! Outro shares " + Math.round(jaccard * 100) + "% of its vocabulary with the Chorus."
                });
            } else if (jaccard >= 0.15 && jaccard <= 0.85) {
                raw_score = 0.7;
                feedback = "Moderate echo similarity (" + Math.round(jaccard * 100) + "%). Target the 30% to 70% range so the Outro is familiar yet introduces final contrast.";
            } else if (jaccard < 0.15) {
                raw_score = 0.4;
                feedback = "No narrative echo in Outro (" + Math.round(jaccard * 100) + "% overlap). Integrate key hook words from the Chorus into your Outro for closure.";
            } else {
                raw_score = 0.4;
                feedback = "Outro is a direct copy of Chorus (" + Math.round(jaccard * 100) + "% overlap). Modify the Outro slightly (change ad-libs or swap a line) to resolve the narrative.";
            }
        }
    }

    return {
        id: "T55",
        name: "Outro Narrative Echo",
        author: "Taylor Swift / Jack Antonoff",
        description: "The Outro should echo a modified version of the Chorus or Verse hook to give a sense of resolution.",
        raw_score,
        weight: 0.035,
        weighted_score: raw_score * 0.035 * 100,
        feedback,
        flags,
        active: true,
        group_id: null
    };
}

function recalculate_t09(clean_lines, lines, t) {
    const flags = [];
    let rhyme_matches = 0;
    let total_pairs_checked = 0;

    function getRhymeSuffix(word) {
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        if (clean.length < 2) return clean;
        const vowels = "aeiouy";
        let vowelIdx = -1;
        for (let i = clean.length - 1; i >= 0; i--) {
            if (vowels.includes(clean.charAt(i))) {
                vowelIdx = i;
                break;
            }
        }
        if (vowelIdx === -1) return clean.substring(clean.length - 2);
        
        while (vowelIdx > 0 && vowels.includes(clean.charAt(vowelIdx - 1))) {
            vowelIdx--;
        }
        const rawSuffix = clean.substring(vowelIdx);
        return rawSuffix
            .replace(/^ea/, "ee").replace(/^ee/, "ee").replace(/^ie/, "ee").replace(/^y$/, "ee")
            .replace(/^ai/, "ay").replace(/^ay/, "ay").replace(/^ey/, "ay")
            .replace(/^ou/, "ow").replace(/^ow/, "ow")
            .replace(/^oi/, "oy").replace(/^oy/, "oy")
            .replace(/^oo/, "oo").replace(/^ue/, "oo").replace(/^ew/, "oo")
            .replace(/^oa/, "oh").replace(/^oe/, "oh").replace(/^ow$/, "oh")
            .replace(/^igh/, "y").replace(/^ie$/, "y").replace(/^y$/, "y");
    }

    const sections = {};
    lines.forEach(line => {
        const text = line.text.trim();
        if (text.length === 0 || text.startsWith('[') || text.startsWith('{')) return;
        if (line.section) {
            if (!sections[line.section]) {
                sections[line.section] = [];
            }
            sections[line.section].push(line);
        }
    });

    Object.entries(sections).forEach(([secName, secLines]) => {
        if (secLines.length < 4) return;
        
        const ends = secLines.map(l => {
            const words = l.text.split(/\s+/).filter(w => w.trim().length > 0);
            if (words.length === 0) return "";
            const lastWord = words[words.length - 1];
            return lastWord.toLowerCase().replace(/[^a-z]/g, "");
        });

        const suffixes = ends.map(w => w ? getRhymeSuffix(w) : "");

        for (let i = 0; i < ends.length - 3; i++) {
            total_pairs_checked++;
            
            const e1 = ends[i], e2 = ends[i+1], e3 = ends[i+2], e4 = ends[i+3];
            const s1 = suffixes[i], s2 = suffixes[i+1], s3 = suffixes[i+2], s4 = suffixes[i+3];

            if (!e1 || !e2 || !e3 || !e4) continue;

            const rhymes = (idx1, idx2) => {
                const w1 = ends[idx1], w2 = ends[idx2];
                const suf1 = suffixes[idx1], suf2 = suffixes[idx2];
                if (w1 === w2) return false;
                if (w1.length >= 2 && w2.length >= 2 && w1.substring(w1.length - 2) === w2.substring(w2.length - 2)) return true;
                if (suf1 && suf2 && suf1 === suf2) return true;
                return false;
            };

            const isAABB = rhymes(i, i+1) && rhymes(i+2, i+3);
            const isABAB = rhymes(i, i+2) && rhymes(i+1, i+3);
            const isABBA = rhymes(i, i+3) && rhymes(i+1, i+2);

            if (isAABB || isABAB || isABBA) {
                rhyme_matches++;
            }
        }
    });

    const consistency = total_pairs_checked > 0 ? (rhyme_matches / total_pairs_checked) : 1.0;

    let raw_score, feedback;
    if (total_pairs_checked === 0) {
        raw_score = 0.8;
        feedback = "Rhyme scheme consistency is stable. Write longer sections to fully evaluate AABB/ABAB patterns.";
    } else if (consistency >= 0.4) {
        raw_score = 1.0;
        feedback = "Consistent rhyme schemes (AABB/ABAB) detected. This creates strong listener expectations.";
        flags.push({
            type_: "Positive",
            line_number: 1,
            message: "Consistent structural rhyme scheme detected (AABB/ABAB)."
        });
    } else {
        raw_score = Math.max(0.4, consistency / 0.4);
        feedback = "The rhyme scheme feels unpredictable. Establish a strong AABB or ABAB pattern to ground the listener.";
        flags.push({
            type_: "Negative",
            line_number: 1,
            message: "Inconsistent rhyme scheme. Perfect rhymes aren't required, but consistent structures are."
        });
    }

    t.raw_score = raw_score;
    t.weighted_score = raw_score * t.weight * 100;
    t.feedback = feedback;
    t.flags = flags;
}

function recalculate_t17(clean_lines, lines, t) {
    const concrete_nouns = new Set([
        "heart", "door", "rain", "car", "street", "blood", "skin", "fire", "ice", "bed", 
        "phone", "light", "dark", "sun", "moon", "star", "water", "drink", "glass", "room", 
        "floor", "wall", "window",
        "clock", "time", "watch", "key", "doorway", "coffee", "cup", "tea", "cigarette", "smoke",
        "mirror", "shadow", "highway", "train", "station", "bus", "engine", "wheel", "road", "dust",
        "wind", "snow", "cold", "sky", "cloud", "storm", "thunder", "sea", "wave", "shore",
        "beach", "sand", "ocean", "river", "lake", "stone", "rock", "dirt", "mud", "grass",
        "flower", "rose", "tree", "leaf", "leaves", "wood", "forest", "field", "house", "home",
        "roof", "ceiling", "stairs", "kitchen", "table", "chair", "plate", "knife", "fork", "spoon",
        "bottle", "wine", "beer", "whiskey", "bar", "club", "seat", "booth", "stage", "guitar",
        "piano", "song", "note", "sound", "voice", "eyes", "lips", "face", "hair", "hands",
        "fingers", "arms", "legs", "feet", "tears", "smile", "laugh", "breath", "coat", "jacket",
        "shoes", "dress", "shirt", "jeans", "pocket", "ring", "chain", "gold", "silver", "paper",
        "pen", "book", "letter", "envelope", "picture", "photo", "frame", "bag", "box", "keyhole",
        "city", "town", "bridge", "park", "bench", "corner", "alley", "roof", "skyline", "lantern"
    ]);

    let total_words = 0;
    let concrete_count = 0;
    const flags = [];

    clean_lines.forEach(line => {
        const words = line.text.split(/\s+/);
        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[^a-z]/g, "");
            if (clean.length === 0) return;
            total_words++;
            if (concrete_nouns.has(clean)) {
                concrete_count++;
                flags.push({
                    type_: "Positive",
                    line_number: line.line_number,
                    message: "'" + clean + "' provides strong concrete imagery."
                });
            }
        });
    });

    const density = total_words > 0 ? (concrete_count / total_words) : 0.0;

    let raw_score, feedback;
    if (total_words === 0) {
        raw_score = 1.0;
        feedback = "No words to evaluate.";
    } else if (density >= 0.08 && density <= 0.25) {
        raw_score = 1.0;
        feedback = "Great use of imagery! " + (density * 100).toFixed(1) + "% of your words paint a concrete picture.";
    } else if (density < 0.08) {
        raw_score = Math.max(0.4, density / 0.08);
        feedback = "Your concrete imagery density is " + (density * 100).toFixed(1) + "%. Try replacing abstract concepts with tangible things people can see and feel.";
    } else {
        raw_score = 0.8;
        feedback = "Very high concrete imagery density (" + (density * 100).toFixed(1) + "%). Good, but don't overload with description.";
    }

    t.raw_score = raw_score;
    t.weighted_score = raw_score * t.weight * 100;
    t.feedback = feedback;
    t.flags = flags;
}

function recalculate_t21(clean_lines, lines, t) {
    const flags = [];
    const first_line = clean_lines.find(l => l.line_number > 0);
    
    if (first_line) {
        const text = first_line.text.toLowerCase();
        const words = text.split(/\s+/).map(w => w.replace(/[^a-z]/g, "")).filter(w => w.length > 0);
        
        let hasQuestion = false;
        let hasPronoun = false;
        let hasScene = false;
        let hasVague = false;
        
        if (text.includes('?')) {
            hasQuestion = true;
            flags.push({
                type_: "Positive",
                line_number: first_line.line_number,
                message: "Opening with a question instantly engages the listener's curiosity."
            });
        }
        
        const pronouns = ["i", "you", "we", "me", "my", "your", "our"];
        for (const word of words) {
            if (pronouns.includes(word)) {
                hasPronoun = true;
                flags.push({
                    type_: "Positive",
                    line_number: first_line.line_number,
                    message: "Using '" + word + "' in the first line grounds the perspective immediately."
                });
                break;
            }
        }
        
        const scene_words = ["night", "day", "morning", "street", "car", "bed", "room", "bar", "club", "clock", "door", "window", "rain", "sun", "city", "town", "light", "sky", "snow", "cold"];
        for (const word of words) {
            if (scene_words.includes(word)) {
                hasScene = true;
                flags.push({
                    type_: "Positive",
                    line_number: first_line.line_number,
                    message: "'" + word + "' sets a specific scene right away."
                });
                break;
            }
        }
        
        const vague_words = ["something", "someone", "somewhere", "feel", "feeling"];
        for (const word of words) {
            if (vague_words.includes(word)) {
                hasVague = true;
                flags.push({
                    type_: "Negative",
                    line_number: first_line.line_number,
                    message: "Opening with '" + word + "' is vague. Start in the middle of the action."
                });
            }
        }
        
        let score = 0.0;
        if (hasQuestion) score += 0.5;
        if (hasPronoun) score += 0.5;
        if (hasScene) score += 0.5;
        if (hasVague) score -= 0.3;

        const raw_score = Math.max(0.0, Math.min(1.0, score));
        t.raw_score = raw_score;
        t.weighted_score = raw_score * t.weight * 100;
        t.feedback = raw_score > 0.8 ? "Incredible opening line! It sets the scene, perspective, and hooks the listener immediately." :
                      raw_score > 0.5 ? "Good opening line, but it could be punchier. Try starting with a specific detail or a question." :
                      "Your first line is a bit weak or vague. The listener might tune out. Drop them right into the action.";
        t.flags = flags;
    } else {
        t.raw_score = 0.0;
        t.weighted_score = 0.0;
        t.feedback = "No lyrics found to evaluate.";
        t.flags = [];
    }
}
