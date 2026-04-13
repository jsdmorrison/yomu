import { useState, useEffect, useCallback, useRef } from “react”;

// ─────────────────────────────────────────────────────────────────────────────
// THEME DATA — N5 units with seed vocabulary pools per theme
// ─────────────────────────────────────────────────────────────────────────────
const N5_UNITS = [
{
id: “daily”,
title: “Daily Routines”,
titleJa: “毎日の生活”,
icon: “🌅”,
description: “Morning routines, meals, sleep, and the rhythm of everyday life”,
color: “#f59e0b”,
vocabPool: [“起きる”,“寝る”,“食べる”,“飲む”,“行く”,“来る”,“見る”,“聞く”,“話す”,“読む”,“書く”,“毎日”,“朝”,“昼”,“夜”,“今日”,“明日”,“昨日”,“時間”,“分”],
grammarFocus: [”〜ます”,”〜ません”,”〜ました”,”〜ています”,”〜てください”],
passages: 0,
},
{
id: “food”,
title: “Food & Eating”,
titleJa: “食べ物と料理”,
icon: “🍱”,
description: “Restaurants, home cooking, favourite foods, and mealtimes”,
color: “#ef4444”,
vocabPool: [“食べ物”,“料理”,“ご飯”,“パン”,“肉”,“魚”,“野菜”,“果物”,“水”,“お茶”,“コーヒー”,“おいしい”,“好き”,“嫌い”,“レストラン”,“注文”,“値段”],
grammarFocus: [”〜が好きです”,”〜を食べます”,”〜はどうですか”],
passages: 0,
},
{
id: “family”,
title: “Family”,
titleJa: “家族”,
icon: “👨‍👩‍👧”,
description: “Family members, relationships, and life at home”,
color: “#8b5cf6”,
vocabPool: [“家族”,“父”,“母”,“兄”,“姉”,“弟”,“妹”,“子供”,“夫”,“妻”,“祖父”,“祖母”,“家”,“一緒”,“住む”,“好き”,“優しい”,“元気”],
grammarFocus: [”〜は〜です”,”〜がいます”,”〜と一緒に”],
passages: 0,
},
{
id: “weather”,
title: “Weather”,
titleJa: “天気”,
icon: “🌤”,
description: “Seasons, weather patterns, and talking about the sky”,
color: “#06b6d4”,
vocabPool: [“天気”,“今日”,“明日”,“晴れ”,“雨”,“雪”,“風”,“暑い”,“寒い”,“涼しい”,“暖かい”,“春”,“夏”,“秋”,“冬”,“季節”,“好き”,“嫌い”],
grammarFocus: [”〜ですね”,”〜でしょう”,”〜になります”],
passages: 0,
},
{
id: “shopping”,
title: “Shopping”,
titleJa: “買い物”,
icon: “🛍”,
description: “Shops, prices, asking for things, and everyday purchases”,
color: “#10b981”,
vocabPool: [“買う”,“売る”,“店”,“スーパー”,“値段”,“高い”,“安い”,“円”,“いくら”,“これ”,“それ”,“あれ”,“ください”,“どうぞ”,“ありがとう”,“お金”,“財布”],
grammarFocus: [”〜をください”,”〜はいくらですか”,”〜がほしい”],
passages: 0,
},
{
id: “transport”,
title: “Getting Around”,
titleJa: “交通・移動”,
icon: “🚃”,
description: “Trains, buses, directions, and navigating the city”,
color: “#3b82f6”,
vocabPool: [“電車”,“バス”,“駅”,“乗る”,“降りる”,“行く”,“来る”,“帰る”,“右”,“左”,“まっすぐ”,“近い”,“遠い”,“地図”,“時間”,“何時”,“どこ”,“道”],
grammarFocus: [”〜に乗ります”,”〜で行きます”,”〜はどこですか”],
passages: 0,
},
];

// ─────────────────────────────────────────────────────────────────────────────
// CORE VOCABULARY — N5 base list with readings & meanings
// ─────────────────────────────────────────────────────────────────────────────
const N5_VOCAB = {
“食べる”: { reading: “たべる”, meaning: “to eat”, jlpt: “N5” },
“飲む”: { reading: “のむ”, meaning: “to drink”, jlpt: “N5” },
“行く”: { reading: “いく”, meaning: “to go”, jlpt: “N5” },
“来る”: { reading: “くる”, meaning: “to come”, jlpt: “N5” },
“見る”: { reading: “みる”, meaning: “to see / watch”, jlpt: “N5” },
“聞く”: { reading: “きく”, meaning: “to listen / ask”, jlpt: “N5” },
“話す”: { reading: “はなす”, meaning: “to speak”, jlpt: “N5” },
“読む”: { reading: “よむ”, meaning: “to read”, jlpt: “N5” },
“書く”: { reading: “かく”, meaning: “to write”, jlpt: “N5” },
“買う”: { reading: “かう”, meaning: “to buy”, jlpt: “N5” },
“起きる”: { reading: “おきる”, meaning: “to wake up”, jlpt: “N5” },
“寝る”: { reading: “ねる”, meaning: “to sleep”, jlpt: “N5” },
“帰る”: { reading: “かえる”, meaning: “to return home”, jlpt: “N5” },
“乗る”: { reading: “のる”, meaning: “to ride / board”, jlpt: “N5” },
“降りる”: { reading: “おりる”, meaning: “to get off”, jlpt: “N5” },
“住む”: { reading: “すむ”, meaning: “to live (in a place)”, jlpt: “N5” },
“毎日”: { reading: “まいにち”, meaning: “every day”, jlpt: “N5” },
“今日”: { reading: “きょう”, meaning: “today”, jlpt: “N5” },
“明日”: { reading: “あした”, meaning: “tomorrow”, jlpt: “N5” },
“昨日”: { reading: “きのう”, meaning: “yesterday”, jlpt: “N5” },
“朝”: { reading: “あさ”, meaning: “morning”, jlpt: “N5” },
“昼”: { reading: “ひる”, meaning: “noon / daytime”, jlpt: “N5” },
“夜”: { reading: “よる”, meaning: “night / evening”, jlpt: “N5” },
“時間”: { reading: “じかん”, meaning: “time / hour”, jlpt: “N5” },
“家族”: { reading: “かぞく”, meaning: “family”, jlpt: “N5” },
“父”: { reading: “ちち”, meaning: “father (own)”, jlpt: “N5” },
“母”: { reading: “はは”, meaning: “mother (own)”, jlpt: “N5” },
“兄”: { reading: “あに”, meaning: “older brother (own)”, jlpt: “N5” },
“姉”: { reading: “あね”, meaning: “older sister (own)”, jlpt: “N5” },
“弟”: { reading: “おとうと”, meaning: “younger brother”, jlpt: “N5” },
“妹”: { reading: “いもうと”, meaning: “younger sister”, jlpt: “N5” },
“子供”: { reading: “こども”, meaning: “child / children”, jlpt: “N5” },
“家”: { reading: “いえ”, meaning: “house / home”, jlpt: “N5” },
“食べ物”: { reading: “たべもの”, meaning: “food”, jlpt: “N5” },
“料理”: { reading: “りょうり”, meaning: “cooking / dish”, jlpt: “N5” },
“ご飯”: { reading: “ごはん”, meaning: “rice / meal”, jlpt: “N5” },
“肉”: { reading: “にく”, meaning: “meat”, jlpt: “N5” },
“魚”: { reading: “さかな”, meaning: “fish”, jlpt: “N5” },
“野菜”: { reading: “やさい”, meaning: “vegetables”, jlpt: “N5” },
“果物”: { reading: “くだもの”, meaning: “fruit”, jlpt: “N5” },
“水”: { reading: “みず”, meaning: “water”, jlpt: “N5” },
“お茶”: { reading: “おちゃ”, meaning: “tea”, jlpt: “N5” },
“おいしい”: { reading: “おいしい”, meaning: “delicious / tasty”, jlpt: “N5” },
“好き”: { reading: “すき”, meaning: “like / favourite”, jlpt: “N5” },
“天気”: { reading: “てんき”, meaning: “weather”, jlpt: “N5” },
“晴れ”: { reading: “はれ”, meaning: “sunny / clear”, jlpt: “N5” },
“雨”: { reading: “あめ”, meaning: “rain”, jlpt: “N5” },
“雪”: { reading: “ゆき”, meaning: “snow”, jlpt: “N5” },
“暑い”: { reading: “あつい”, meaning: “hot”, jlpt: “N5” },
“寒い”: { reading: “さむい”, meaning: “cold”, jlpt: “N5” },
“春”: { reading: “はる”, meaning: “spring”, jlpt: “N5” },
“夏”: { reading: “なつ”, meaning: “summer”, jlpt: “N5” },
“秋”: { reading: “あき”, meaning: “autumn / fall”, jlpt: “N5” },
“冬”: { reading: “ふゆ”, meaning: “winter”, jlpt: “N5” },
“電車”: { reading: “でんしゃ”, meaning: “train”, jlpt: “N5” },
“バス”: { reading: “バス”, meaning: “bus”, jlpt: “N5” },
“駅”: { reading: “えき”, meaning: “station”, jlpt: “N5” },
“店”: { reading: “みせ”, meaning: “shop / store”, jlpt: “N5” },
“高い”: { reading: “たかい”, meaning: “expensive / tall”, jlpt: “N5” },
“安い”: { reading: “やすい”, meaning: “cheap / inexpensive”, jlpt: “N5” },
“大きい”: { reading: “おおきい”, meaning: “big / large”, jlpt: “N5” },
“小さい”: { reading: “ちいさい”, meaning: “small / little”, jlpt: “N5” },
“新しい”: { reading: “あたらしい”, meaning: “new”, jlpt: “N5” },
“古い”: { reading: “ふるい”, meaning: “old (thing)”, jlpt: “N5” },
“近い”: { reading: “ちかい”, meaning: “near / close”, jlpt: “N5” },
“遠い”: { reading: “とおい”, meaning: “far / distant”, jlpt: “N5” },
“右”: { reading: “みぎ”, meaning: “right (direction)”, jlpt: “N5” },
“左”: { reading: “ひだり”, meaning: “left (direction)”, jlpt: “N5” },
“道”: { reading: “みち”, meaning: “road / path”, jlpt: “N5” },
“地図”: { reading: “ちず”, meaning: “map”, jlpt: “N5” },
};

// ─────────────────────────────────────────────────────────────────────────────
// AI PASSAGE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
async function generatePassage(unit, passageIndex, knownWords, totalWordsRead) {
const difficulty = passageIndex < 3 ? “very easy” : passageIndex < 6 ? “easy” : “moderate”;
const sentenceCount = passageIndex < 3 ? 4 : passageIndex < 6 ? 6 : 8;
const knownSample = knownWords.slice(0, 30).join(”、”);

const prompt = `You are generating a graded Japanese reading passage for a JLPT N5 learner.

Theme: ${unit.titleJa} (${unit.title})
Difficulty: ${difficulty} (passage ${passageIndex + 1} in this unit)
Target length: ${sentenceCount} sentences, ~${sentenceCount * 15} characters
Grammar focus: ${unit.grammarFocus.join(”、”)}
Key vocabulary pool: ${unit.vocabPool.join(”、”)}
Words the learner already knows: ${knownSample || “basic hiragana words only”}

RULES:

- Write ONLY in Japanese (no romaji)
- Use hiragana for most grammar, kanji only for N5-level kanji (日、本、人、口、山、川、水、火、木、金、土、月、上、下、中、大、小、国、年、生、先、学、校、電、車、駅、食、飲、行、来、見、聞、書、話、読、買、時、間、今、明、昨、朝、昼、夜、毎、家、族、父、母、兄、姉、天、気、雨、雪、春、夏、秋、冬、店、道、右、左、近、遠、高、安、新、古)
- ~90% of vocabulary should be words the learner likely knows or can guess from context
- Introduce 5–8 new vocabulary items naturally woven into context
- Use ONLY N5 grammar patterns
- Write naturally — this should read like a real diary entry, short story, or scene, not a textbook
- The passage should have a coherent narrative or scene, not isolated sentences
- End with a gentle hook or feeling

Return ONLY a JSON object, no markdown fences:
{
“title”: “short evocative title in Japanese (4-8 chars)”,
“titleEn”: “English title”,
“passage”: “the full Japanese passage as a single string with 。after each sentence”,
“newWords”: [
{“word”: “漢字or word”, “reading”: “ふりがな”, “meaning”: “English meaning”, “sentence”: “the sentence it appears in”}
],
“comprehensionQuestions”: [
{“question”: “Japanese question”, “questionEn”: “English translation”, “options”: [“answer1”, “answer2”, “answer3”], “correct”: 0}
],
“grammarNote”: “One short grammar note in English about a pattern used, max 2 sentences.”
}`;

const response = await fetch("/api/chat", {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1500,
messages: [{ role: “user”, content: prompt }],
}),
});
const data = await response.json();
const text = data.content?.find((b) => b.type === “text”)?.text || “”;
const clean = text.replace(/`json|`/g, “”).trim();
return JSON.parse(clean);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKENISER — split passage into tappable tokens
// ─────────────────────────────────────────────────────────────────────────────
function tokenisePassage(passage, newWords) {
// Build a set of all known dictionary words to check against
const allVocab = { …N5_VOCAB };
newWords.forEach(w => { allVocab[w.word] = { reading: w.reading, meaning: w.meaning, jlpt: “N5” }; });

// Split on sentence boundaries first, then tokenise each char/word
const tokens = [];
let i = 0;
const text = passage;

while (i < text.length) {
// Try to match a known vocab word (longest match first)
let matched = false;
const keys = Object.keys(allVocab).sort((a, b) => b.length - a.length);
for (const key of keys) {
if (text.startsWith(key, i) && key.length > 1) {
tokens.push({ type: “word”, text: key, vocab: allVocab[key], isNew: newWords.some(w => w.word === key) });
i += key.length;
matched = true;
break;
}
}
if (!matched) {
const char = text[i];
if (char === “。” || char === “、” || char === “！” || char === “？” || char === “\n”) {
tokens.push({ type: “punct”, text: char });
} else {
// Check if last token is also a char token, merge if so
const last = tokens[tokens.length - 1];
if (last && last.type === “char”) {
last.text += char;
} else {
tokens.push({ type: “char”, text: char });
}
}
i++;
}
}
return tokens;
}

// ─────────────────────────────────────────────────────────────────────────────
// FURIGANA — render reading above kanji
// ─────────────────────────────────────────────────────────────────────────────
function FuriganaWord({ token, showFurigana, isNew, onClick, isSelected }) {
const hasReading = token.vocab && token.vocab.reading && token.vocab.reading !== token.text;
return (
<ruby
onClick={() => token.vocab && onClick(token)}
style={{
cursor: token.vocab ? “pointer” : “default”,
display: “inline-flex”,
flexDirection: “column”,
alignItems: “center”,
margin: “0 1px”,
padding: “2px 3px”,
borderRadius: 4,
background: isSelected
? “rgba(251,191,36,0.25)”
: isNew
? “rgba(99,102,241,0.15)”
: token.vocab
? “rgba(255,255,255,0.03)”
: “transparent”,
borderBottom: isNew ? “2px solid #6366f1” : token.vocab ? “1px solid rgba(255,255,255,0.1)” : “none”,
transition: “background 0.15s”,
lineHeight: 1,
}}
>
<span style={{ fontSize: “1em” }}>{token.text}</span>
{showFurigana && hasReading && (
<rt style={{
fontSize: “0.45em”,
color: “#94a3b8”,
letterSpacing: 0,
userSelect: “none”,
lineHeight: 1.4,
}}>
{token.vocab.reading}
</rt>
)}
</ruby>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOSS CARD — floats near tapped word
// ─────────────────────────────────────────────────────────────────────────────
function GlossCard({ token, isNew, onClose }) {
if (!token || !token.vocab) return null;
return (
<div style={{
position: “fixed”, bottom: 32, left: “50%”, transform: “translateX(-50%)”,
background: “#0f172a”,
border: `1px solid ${isNew ? "#6366f1" : "#334155"}`,
borderRadius: 16, padding: “16px 20px”,
minWidth: 240, maxWidth: 320,
boxShadow: “0 20px 60px rgba(0,0,0,0.6)”,
zIndex: 100,
animation: “glossIn 0.2s cubic-bezier(0.34,1.56,0.64,1)”,
}}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div>
<div style={{ display: “flex”, alignItems: “baseline”, gap: 10, marginBottom: 4 }}>
<span style={{ fontSize: 28, color: “#f1f5f9”, fontFamily: “‘Noto Serif JP’, serif” }}>{token.text}</span>
<span style={{ fontSize: 14, color: “#94a3b8”, fontFamily: “‘Noto Sans JP’, sans-serif” }}>{token.vocab.reading}</span>
</div>
<div style={{ fontSize: 15, color: “#e2e8f0”, fontWeight: 600 }}>{token.vocab.meaning}</div>
{isNew && (
<div style={{ marginTop: 8, display: “inline-flex”, alignItems: “center”, gap: 4, background: “#312e81”, borderRadius: 6, padding: “2px 8px” }}>
<span style={{ fontSize: 10, color: “#a5b4fc”, fontWeight: 700, letterSpacing: 1 }}>NEW WORD</span>
</div>
)}
</div>
<button onClick={onClose} style={{ background: “none”, border: “none”, color: “#475569”, cursor: “pointer”, fontSize: 18, padding: “0 0 0 8px” }}>✕</button>
</div>
</div>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSION CHECK
// ─────────────────────────────────────────────────────────────────────────────
function ComprehensionCheck({ questions, onComplete }) {
const [answers, setAnswers] = useState({});
const [submitted, setSubmitted] = useState(false);

const handleSubmit = () => {
setSubmitted(true);
const correct = questions.filter((q, i) => answers[i] === q.correct).length;
setTimeout(() => onComplete(correct, questions.length), 1800);
};

return (
<div style={{ marginTop: 32, animation: “fadeSlideIn 0.4s ease” }}>
<div style={{ fontSize: 11, letterSpacing: 3, color: “#475569”, textTransform: “uppercase”, marginBottom: 16 }}>
Comprehension Check
</div>
{questions.map((q, i) => (
<div key={i} style={{ marginBottom: 20, background: “#0f172a”, borderRadius: 12, padding: 16, border: “1px solid #1e293b” }}>
<div style={{ fontSize: 15, color: “#f1f5f9”, marginBottom: 4, fontFamily: “‘Noto Serif JP’, serif” }}>{q.question}</div>
<div style={{ fontSize: 12, color: “#64748b”, marginBottom: 12 }}>{q.questionEn}</div>
<div style={{ display: “flex”, flexDirection: “column”, gap: 6 }}>
{q.options.map((opt, j) => {
let bg = “#1e293b”, border = “#334155”, color = “#cbd5e1”;
if (submitted) {
if (j === q.correct) { bg = “#14532d”; border = “#4ade80”; color = “#4ade80”; }
else if (j === answers[i] && j !== q.correct) { bg = “#450a0a”; border = “#f87171”; color = “#f87171”; }
} else if (answers[i] === j) { border = “#6366f1”; color = “#a5b4fc”; }
return (
<button key={j} disabled={submitted} onClick={() => setAnswers({ …answers, [i]: j })}
style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: “10px 14px”, color, fontSize: 14, cursor: submitted ? “default” : “pointer”, textAlign: “left”, fontFamily: “‘Noto Serif JP’, sans-serif”, transition: “all 0.15s” }}>
{opt}
</button>
);
})}
</div>
</div>
))}
{!submitted && Object.keys(answers).length === questions.length && (
<button onClick={handleSubmit} style={{ background: “linear-gradient(135deg, #4f46e5, #6366f1)”, border: “none”, borderRadius: 10, padding: “12px 28px”, color: “#fff”, fontSize: 14, fontWeight: 700, cursor: “pointer”, width: “100%” }}>
Submit Answers
</button>
)}
</div>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// VOCAB SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function VocabSidebar({ lexicon, onClose }) {
const entries = Object.entries(lexicon).sort((a, b) => b[1].encounters - a[1].encounters);
const getStatus = (enc) => enc >= 10 ? “acquired” : enc >= 4 ? “familiar” : “exposed”;
const statusColor = { acquired: “#4ade80”, familiar: “#f59e0b”, exposed: “#6366f1” };

return (
<div style={{
position: “fixed”, right: 0, top: 0, bottom: 0, width: 300,
background: “#0a0f1a”, borderLeft: “1px solid #1e293b”,
display: “flex”, flexDirection: “column”, zIndex: 200,
animation: “slideInRight 0.3s ease”,
}}>
<div style={{ padding: “20px 20px 16px”, borderBottom: “1px solid #1e293b”, display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div>
<div style={{ fontSize: 14, fontWeight: 700, color: “#f1f5f9” }}>My Vocabulary</div>
<div style={{ fontSize: 11, color: “#475569”, marginTop: 2 }}>{entries.length} words encountered</div>
</div>
<button onClick={onClose} style={{ background: “none”, border: “none”, color: “#475569”, cursor: “pointer”, fontSize: 20 }}>✕</button>
</div>
<div style={{ padding: “12px 16px”, borderBottom: “1px solid #1e293b”, display: “flex”, gap: 8 }}>
{[[“exposed”,”< 4x”],[“familiar”,“4-9x”],[“acquired”,“10x+”]].map(([s, label]) => (
<div key={s} style={{ flex: 1, textAlign: “center”, padding: “6px 4px”, background: “#0f172a”, borderRadius: 8, border: `1px solid ${statusColor[s]}30` }}>
<div style={{ fontSize: 16, fontWeight: 700, color: statusColor[s] }}>{entries.filter(([,v]) => getStatus(v.encounters) === s).length}</div>
<div style={{ fontSize: 9, color: “#475569”, textTransform: “uppercase”, letterSpacing: 1, marginTop: 2 }}>{s}</div>
</div>
))}
</div>
<div style={{ flex: 1, overflowY: “auto”, padding: “8px 16px” }}>
{entries.map(([word, data]) => {
const status = getStatus(data.encounters);
return (
<div key={word} style={{ display: “flex”, alignItems: “center”, padding: “8px 0”, borderBottom: “1px solid #0f172a”, gap: 10 }}>
<div style={{ width: 6, height: 6, borderRadius: “50%”, background: statusColor[status], flexShrink: 0 }} />
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, alignItems: “baseline”, gap: 6 }}>
<span style={{ fontSize: 15, color: “#f1f5f9”, fontFamily: “‘Noto Serif JP’, serif” }}>{word}</span>
<span style={{ fontSize: 11, color: “#64748b” }}>{data.reading}</span>
</div>
<div style={{ fontSize: 12, color: “#94a3b8” }}>{data.meaning}</div>
</div>
<div style={{ fontSize: 11, color: statusColor[status], fontWeight: 700 }}>{data.encounters}×</div>
</div>
);
})}
</div>
</div>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSAGE READER SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function PassageReader({ unit, passageIndex, onComplete, onBack, lexicon, setLexicon, wordsRead, setWordsRead }) {
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [passageData, setPassageData] = useState(null);
const [tokens, setTokens] = useState([]);
const [selectedToken, setSelectedToken] = useState(null);
const [showFurigana, setShowFurigana] = useState(true);
const [showGrammarNote, setShowGrammarNote] = useState(false);
const [phase, setPhase] = useState(“reading”); // reading | check | complete
const [checkResult, setCheckResult] = useState(null);
const [showVocab, setShowVocab] = useState(false);

useEffect(() => {
(async () => {
try {
setLoading(true);
const knownWords = Object.keys(lexicon);
const data = await generatePassage(unit, passageIndex, knownWords, wordsRead);
setPassageData(data);
const toks = tokenisePassage(data.passage, data.newWords || []);
setTokens(toks);

```
    // Update lexicon with new words encountered
    const newLexicon = { ...lexicon };
    toks.forEach(tok => {
      if (tok.vocab) {
        const w = tok.text;
        if (newLexicon[w]) {
          newLexicon[w] = { ...newLexicon[w], encounters: newLexicon[w].encounters + 1 };
        } else {
          newLexicon[w] = { ...tok.vocab, encounters: 1 };
        }
      }
    });
    setLexicon(newLexicon);

    const wordCount = toks.filter(t => t.type === "word").length;
    setWordsRead(w => w + wordCount);
  } catch (e) {
    setError("Failed to generate passage. Please check your connection.");
  } finally {
    setLoading(false);
  }
})();
```

}, []);

const handleTokenClick = (token) => {
setSelectedToken(prev => prev?.text === token.text ? null : token);
};

const handleCheckComplete = (correct, total) => {
setCheckResult({ correct, total });
setPhase(“complete”);
};

if (loading) return (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, minHeight: 400, gap: 20 }}>
<div style={{ width: 48, height: 48, border: “3px solid #1e293b”, borderTopColor: “#6366f1”, borderRadius: “50%”, animation: “spin 0.8s linear infinite” }} />
<div style={{ color: “#475569”, fontSize: 14 }}>Generating passage…</div>
<div style={{ color: “#334155”, fontSize: 12 }}>Claude is crafting a story for you</div>
</div>
);

if (error) return (
<div style={{ textAlign: “center”, padding: 40 }}>
<div style={{ color: “#f87171”, marginBottom: 16 }}>{error}</div>
<button onClick={onBack} style={{ background: “#1e293b”, border: “1px solid #334155”, borderRadius: 8, padding: “10px 20px”, color: “#94a3b8”, cursor: “pointer” }}>Back</button>
</div>
);

if (!passageData) return null;

return (
<div style={{ position: “relative” }}>
{/* Toolbar */}
<div style={{ display: “flex”, alignItems: “center”, justifyContent: “space-between”, marginBottom: 24 }}>
<button onClick={onBack} style={{ background: “none”, border: “none”, color: “#475569”, cursor: “pointer”, fontSize: 13, padding: 0 }}>← Back</button>
<div style={{ display: “flex”, gap: 10 }}>
<button
onClick={() => setShowFurigana(f => !f)}
style={{ background: showFurigana ? “#312e81” : “#1e293b”, border: `1px solid ${showFurigana ? "#6366f1" : "#334155"}`, borderRadius: 8, padding: “6px 14px”, color: showFurigana ? “#a5b4fc” : “#64748b”, fontSize: 12, cursor: “pointer”, fontWeight: 600 }}
>
ふり仮名
</button>
<button
onClick={() => setShowVocab(v => !v)}
style={{ background: “#1e293b”, border: “1px solid #334155”, borderRadius: 8, padding: “6px 14px”, color: “#64748b”, fontSize: 12, cursor: “pointer” }}
>
📖 {Object.keys(lexicon).length}
</button>
</div>
</div>

```
  {/* Passage header */}
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, letterSpacing: 3, color: "#475569", textTransform: "uppercase", marginBottom: 8 }}>
      {unit.titleJa} · Passage {passageIndex + 1}
    </div>
    <div style={{ fontSize: 22, color: "#f1f5f9", fontFamily: "'Noto Serif JP', serif", marginBottom: 2 }}>
      {passageData.title}
    </div>
    <div style={{ fontSize: 13, color: "#64748b" }}>{passageData.titleEn}</div>
  </div>

  {/* New words banner */}
  {passageData.newWords && passageData.newWords.length > 0 && (
    <div style={{ background: "#0f172a", border: "1px solid #312e81", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
        {passageData.newWords.length} New Words in This Passage
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {passageData.newWords.map((w, i) => (
          <div key={i} style={{ background: "#1e1b4b", border: "1px solid #4f46e5", borderRadius: 6, padding: "4px 10px", fontSize: 13 }}>
            <span style={{ color: "#a5b4fc", fontFamily: "'Noto Serif JP', serif" }}>{w.word}</span>
            <span style={{ color: "#475569", fontSize: 11, marginLeft: 6 }}>{w.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Main passage */}
  {phase === "reading" && (
    <>
      <div style={{
        background: "linear-gradient(135deg, #0a0f1a, #0f172a)",
        border: "1px solid #1e293b",
        borderRadius: 16, padding: "28px 28px 24px",
        marginBottom: 24,
        lineHeight: 2.8,
        fontSize: 20,
        fontFamily: "'Noto Serif JP', serif",
        letterSpacing: "0.05em",
      }}>
        {tokens.map((tok, i) => {
          if (tok.type === "punct") {
            return <span key={i} style={{ color: "#475569" }}>{tok.text === "。" ? "。\n" : tok.text}</span>;
          }
          if (tok.type === "char") {
            return <span key={i} style={{ color: "#e2e8f0" }}>{tok.text}</span>;
          }
          return (
            <FuriganaWord
              key={i}
              token={tok}
              showFurigana={showFurigana}
              isNew={passageData.newWords?.some(w => w.word === tok.text)}
              isSelected={selectedToken?.text === tok.text}
              onClick={handleTokenClick}
            />
          );
        })}
      </div>

      {/* Grammar note */}
      {passageData.grammarNote && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setShowGrammarNote(g => !g)}
            style={{ background: "none", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 14px", color: "#60a5fa", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <span>📐</span> {showGrammarNote ? "Hide" : "Show"} Grammar Note
          </button>
          {showGrammarNote && (
            <div style={{ marginTop: 10, background: "#0c1929", border: "1px solid #1e3a5f", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#93c5fd", lineHeight: 1.7, animation: "fadeSlideIn 0.2s ease" }}>
              {passageData.grammarNote}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setPhase("check")}
        style={{ width: "100%", background: "linear-gradient(135deg, #4f46e5, #6366f1)", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
      >
        Check Comprehension →
      </button>
    </>
  )}

  {phase === "check" && passageData.comprehensionQuestions && (
    <>
      {/* Show passage condensed */}
      <div style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px 20px", marginBottom: 20, fontSize: 16, fontFamily: "'Noto Serif JP', serif", color: "#94a3b8", lineHeight: 2.2, opacity: 0.8 }}>
        {passageData.passage}
      </div>
      <ComprehensionCheck questions={passageData.comprehensionQuestions} onComplete={handleCheckComplete} />
    </>
  )}

  {phase === "complete" && (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeSlideIn 0.4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>
        {checkResult?.correct === checkResult?.total ? "🌸" : checkResult?.correct >= checkResult?.total / 2 ? "✨" : "📚"}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>
        {checkResult?.correct}/{checkResult?.total} correct
      </div>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>
        +{tokens.filter(t => t.type === "word").length} words read
      </div>
      {passageData.newWords?.length > 0 && (
        <div style={{ fontSize: 13, color: "#6366f1", marginBottom: 28 }}>
          +{passageData.newWords.length} new words encountered
        </div>
      )}
      <button onClick={onComplete} style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)", border: "none", borderRadius: 12, padding: "14px 36px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
        Next Passage →
      </button>
    </div>
  )}

  {/* Gloss card */}
  {selectedToken && (
    <GlossCard
      token={selectedToken}
      isNew={passageData.newWords?.some(w => w.word === selectedToken.text)}
      onClose={() => setSelectedToken(null)}
    />
  )}

  {/* Vocab sidebar */}
  {showVocab && <VocabSidebar lexicon={lexicon} onClose={() => setShowVocab(false)} />}
</div>
```

);
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT SELECT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function UnitSelect({ units, unitProgress, totalWordsRead, onSelect, onShowVocab, lexiconSize }) {
const N5_UNLOCK_WORDS = 3000;
const progressPct = Math.min(100, Math.round((totalWordsRead / N5_UNLOCK_WORDS) * 100));

return (
<div style={{ animation: “fadeSlideIn 0.4s ease” }}>
{/* Stats bar */}
<div style={{ background: “#0a0f1a”, border: “1px solid #1e293b”, borderRadius: 14, padding: “16px 20px”, marginBottom: 28, display: “flex”, gap: 20 }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 10, letterSpacing: 2, color: “#475569”, textTransform: “uppercase”, marginBottom: 4 }}>Words Read</div>
<div style={{ fontSize: 22, fontWeight: 800, color: “#f1f5f9” }}>{totalWordsRead.toLocaleString()}</div>
<div style={{ height: 3, background: “#1e293b”, borderRadius: 2, marginTop: 6, overflow: “hidden” }}>
<div style={{ height: “100%”, width: `${progressPct}%`, background: “linear-gradient(90deg, #4f46e5, #818cf8)”, borderRadius: 2, transition: “width 0.6s ease” }} />
</div>
<div style={{ fontSize: 10, color: “#334155”, marginTop: 4 }}>{totalWordsRead} / {N5_UNLOCK_WORDS} to complete N5</div>
</div>
<div style={{ textAlign: “center” }}>
<div style={{ fontSize: 10, letterSpacing: 2, color: “#475569”, textTransform: “uppercase”, marginBottom: 4 }}>Vocab</div>
<div style={{ fontSize: 22, fontWeight: 800, color: “#818cf8” }}>{lexiconSize}</div>
<button onClick={onShowVocab} style={{ marginTop: 4, background: “none”, border: “1px solid #312e81”, borderRadius: 6, padding: “3px 10px”, color: “#6366f1”, fontSize: 11, cursor: “pointer” }}>View →</button>
</div>
</div>

```
  {/* Unit grid */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {units.map((unit) => {
      const done = unitProgress[unit.id] || 0;
      return (
        <div
          key={unit.id}
          onClick={() => onSelect(unit)}
          style={{
            background: "linear-gradient(135deg, #0a0f1a, #0f172a)",
            border: `1px solid ${unit.color}25`,
            borderRadius: 14, padding: "18px 16px",
            cursor: "pointer", transition: "all 0.2s",
            position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = unit.color + "70"}
          onMouseLeave={e => e.currentTarget.style.borderColor = unit.color + "25"}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>{unit.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 3, lineHeight: 1.3 }}>{unit.title}</div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 10 }}>{unit.titleJa}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 3, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (done / 8) * 100)}%`, background: unit.color, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "#475569" }}>{done}/8</div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen] = useState(“units”); // units | reader
const [activeUnit, setActiveUnit] = useState(null);
const [passageIndex, setPassageIndex] = useState(0);
const [unitProgress, setUnitProgress] = useState({});
const [lexicon, setLexicon] = useState({});
const [wordsRead, setWordsRead] = useState(0);
const [showVocab, setShowVocab] = useState(false);

const handleSelectUnit = (unit) => {
setActiveUnit(unit);
setPassageIndex(unitProgress[unit.id] || 0);
setScreen(“reader”);
};

const handlePassageComplete = () => {
const nextIndex = passageIndex + 1;
setUnitProgress(prev => ({ …prev, [activeUnit.id]: nextIndex }));
if (nextIndex >= 8) {
setScreen(“units”);
} else {
setPassageIndex(nextIndex);
}
};

return (
<div style={{ minHeight: “100vh”, background: “#020617”, color: “#f1f5f9”, fontFamily: “‘Inter’, ‘Noto Sans JP’, sans-serif” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } } @keyframes glossIn { from { opacity:0; transform:translateX(-50%) translateY(16px) scale(0.96); } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); } } @keyframes slideInRight { from { transform:translateX(100%); } to { transform:translateX(0); } } @keyframes spin { to { transform:rotate(360deg); } } ruby { display:inline; ruby-align:center; } rt { display:block; text-align:center; } ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:#020617; } ::-webkit-scrollbar-thumb { background:#1e293b; border-radius:3px; }`}</style>

```
  <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px 60px" }}>
    {/* Header */}
    <div style={{ paddingTop: 36, paddingBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 24, fontFamily: "'Noto Serif JP', serif", color: "#818cf8" }}>読む</span>
            <span style={{ width: 1, height: 20, background: "#1e293b" }} />
            <span style={{ fontSize: 11, color: "#334155", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>YOMU · N5 Reader</span>
          </div>
          <div style={{ fontSize: 12, color: "#1e293b" }}>Graded input for Japanese acquisition</div>
        </div>
        <div style={{
          background: "#0f172a", border: "1px solid #4f46e5", borderRadius: 10,
          padding: "6px 14px", fontSize: 12, color: "#6366f1", fontWeight: 700, letterSpacing: 1
        }}>N5</div>
      </div>
    </div>

    {screen === "units" && (
      <>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>
            {wordsRead === 0 ? "Begin reading" : "Continue reading"}
          </div>
          <div style={{ fontSize: 13, color: "#475569" }}>
            Tap a theme to start. Each passage is AI-generated and personalised to your vocabulary.
          </div>
        </div>
        <UnitSelect
          units={N5_UNITS}
          unitProgress={unitProgress}
          totalWordsRead={wordsRead}
          onSelect={handleSelectUnit}
          onShowVocab={() => setShowVocab(true)}
          lexiconSize={Object.keys(lexicon).length}
        />
      </>
    )}

    {screen === "reader" && activeUnit && (
      <PassageReader
        unit={activeUnit}
        passageIndex={passageIndex}
        onComplete={handlePassageComplete}
        onBack={() => setScreen("units")}
        lexicon={lexicon}
        setLexicon={setLexicon}
        wordsRead={wordsRead}
        setWordsRead={setWordsRead}
      />
    )}
  </div>

  {showVocab && <VocabSidebar lexicon={lexicon} onClose={() => setShowVocab(false)} />}
</div>
```

);
}
