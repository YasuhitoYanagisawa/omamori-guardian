# ⛩️ Omamori — AI Travel Guardian for Japan
### Protecting International Tourists with Gemma 4 Local Intelligence

---

## Project Summary

**Omamori** (お守り — Japanese for "protective charm") is a Progressive Web App that serves as a digital guardian for the 34 million international tourists who visit Japan annually. By combining **Gemma 4 E2B local inference** via Ollama with a comprehensive 332,000-record offline database, Omamori provides three critical services: multilingual festival discovery, AI-powered real-time translation, and emergency assistance — all functioning **100% offline** without any cloud dependency.

The app addresses a fundamental gap: Japan's incredible cultural richness and natural disaster risk are poorly served by existing tools for non-Japanese speakers. Tourist information exists almost exclusively in Japanese, emergency infrastructure signage is untranslated, and when an earthquake strikes, foreign visitors have no quick way to locate the nearest shelter in their language.

**GitHub**: https://github.com/YasuhitoYanagisawa/omamori-guardian
**Track**: Global Resilience + Ollama Integration

---

## The Problem: Lost in Translation, Vulnerable in Crisis

Japan welcomed 34.2 million international visitors in 2024 — a new record. Yet critical barriers persist:

**Language Isolation**: Restaurant menus, train station signage, hospital registration forms, and festival event details are overwhelmingly in Japanese only. Existing translation apps require internet connectivity, which tourists often lack.

**Disaster Vulnerability**: Japan experiences approximately 1,500 earthquakes per year. The country maintains 121,965 designated evacuation shelters, but their names, addresses, and directional signage are entirely in Japanese. During the 2024 Noto Peninsula earthquake, foreign residents reported being unable to locate shelters or communicate medical needs.

**Cultural Access Gap**: Over 29,000 local festivals occur across Japan's 47 prefectures annually — from Kyoto's Gion Matsuri to tiny village shrine celebrations. These festivals represent Japan's living cultural heritage, yet virtually all information exists only in Japanese, locking out the very tourists Japan is eager to welcome.

---

## Solution Architecture

Omamori is built as a zero-dependency vanilla PWA (HTML/CSS/JS) with three core tabs:

### 1. Festival Discovery (29,165 events)
Festival data was sourced from national databases and enriched using Gemini 2.5 Flash to generate AI summaries, GPS coordinates (99.6% coverage), nearest stations, and categorical tags. The app renders festival cards with smart search, prefecture/month filters, and category chips.

**The breakthrough**: When a user selects a non-Japanese language, Gemma 4 E2B **replaces** the Japanese content with translated text via streaming — not as subtitles, but as the primary display. The Japanese original appears as a small 🇯🇵 reference below. This creates a native-feeling experience: a Korean tourist sees Korean text first, with Japanese for reference when showing the phone to a local.

### 2. AI Assistant (Streaming Chat + Voice)
The AI Assistant tab provides free-form conversation with Gemma 4, powered by Ollama's streaming API. Responses appear character-by-character for natural interaction speed. The system prompt adapts to the user's selected language, ensuring responses in Korean, Chinese, Thai, Vietnamese, Spanish, French, or English.

**Voice I/O** leverages the Web Speech API: users tap the microphone for speech-to-text input (with language-appropriate recognition), and a 🔊 button on each AI response enables text-to-speech playback.

**27 Quick Phrases** across 6 categories (restaurant, transport, hotel, medical, shopping, general) are pre-translated into all 8 languages — no AI required. Each phrase shows the user's language prominently, with the Japanese original and romaji pronunciation below.

### 3. Emergency Hub (100% Offline)
The Emergency tab embeds Japan's critical phone numbers (110 Police, 119 Fire/Ambulance, 118 Coast Guard, 171 Disaster Message Dial) with one-tap calling. A Leaflet.js map powered by GPS shows the nearest shelters and hospitals from our 303,277-record database (121,965 shelters + 181,312 medical facilities).

Facility names and addresses are translated via Gemma 4 streaming, with the same replace-not-subtitle pattern used in festival cards. An earthquake survival guide and medical show cards provide critical offline reference material.

---

## Gemma 4 Technical Integration

### Model Choice: `gemma4:e2b` via Ollama

We chose the E2B (2-billion parameter) variant for three strategic reasons:
1. **Speed**: At 2B parameters, streaming responses begin within 1-2 seconds on consumer hardware
2. **Offline**: Ollama runs entirely locally — no internet, no API keys, no cloud costs
3. **Multilingual strength**: Despite its compact size, Gemma 4 E2B produces high-quality translations across CJK and European languages

### Streaming Architecture

All Gemma 4 interactions use `stream: true` for real-time output:

```javascript
async function gemmaStream(msg, sys, onChunk) {
  const r = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gemma4:e2b',
      messages: [{role:'system', content:sys}, {role:'user', content:msg}],
      stream: true
    })
  });
  const reader = r.body.getReader();
  let full = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    // Parse NDJSON chunks, update DOM in real-time
    const lines = new TextDecoder().decode(value).split('\n');
    for (const line of lines) {
      const j = JSON.parse(line);
      if (j.message?.content) { full += j.message.content; onChunk(full); }
    }
  }
  return full;
}
```

### Structured Output Parsing

For festival and facility translation, we use structured prompting to extract named fields:

```
Prompt: "Translate to Korean.\nName: 東京みなと祭\nLocation: 東京都中央区\nDescription: 東京港の開港を祝う..."
System: "Output EXACTLY: Name: [Korean]\nLocation: [Korean]\nDescription: [Korean]"
```

As streaming chunks arrive, we parse `Name:`, `Location:`, and `Description:` prefixes to update individual DOM elements in real-time — the festival card's title, location, and description morph from Japanese to the target language as the user watches.

### Translation Cache

Translations are cached in a memory map keyed by `{language}_{festivalName}`. When a user switches between languages, previously translated cards render instantly from cache without re-querying Gemma 4.

---

## Offline-First Design

Omamori's core promise is **zero-internet dependency** after initial setup:

| Layer | Storage | Size |
|---|---|---|
| App shell (HTML/CSS/JS) | Browser cache | ~60 KB |
| Festival database | IndexedDB | 13.4 MB |
| Shelter database | IndexedDB | 23.6 MB |
| Medical facility database | IndexedDB | 38.6 MB |
| Gemma 4 model | Ollama local | ~1.5 GB |
| Quick Phrases (8 languages) | Embedded JS | ~4 KB |
| Emergency info | Embedded HTML | ~2 KB |

First launch downloads and caches all 332,442 records into IndexedDB. Subsequent launches load from local storage in under 2 seconds. The Gemma 4 model runs through Ollama on `localhost:11434` — completely disconnected from the internet.

---

## Impact & Real-World Application

**Target users**: International tourists in Japan (34M/year), foreign residents (3.2M), exchange students, and business travelers.

**Crisis scenario**: A magnitude 6.0 earthquake strikes central Tokyo at 2:00 AM. A Chinese tourist, alone in their hotel, feels violent shaking. They open Omamori → Emergency tab → tap "Find Shelters" → GPS locates 20 nearby shelters with distances → facility names appear in Chinese → they tap "Navigate" for walking directions. The entire flow works without internet.

**Cultural scenario**: A Thai family visiting Kyoto wants to experience local culture beyond the major temples. They open Omamori → Discover tab → filter by Kyoto + current month → festival cards appear in Thai with descriptions, dates, nearest stations, and maps. They discover a small neighborhood shrine festival happening that evening, just 850 meters away.

**Daily scenario**: A French tourist at a restaurant needs to communicate dietary restrictions. They open the AI Assistant → Quick Phrases → Medical category → "I'm allergic to ___" appears in French with the Japanese translation and pronunciation → they show the phone to the waiter.

---

## Conclusion

Omamori demonstrates that Gemma 4, even at its most compact 2B variant, can power a genuinely useful, production-quality multilingual application when deployed through Ollama's local inference. By combining streaming translation, structured output parsing, memory caching, and a 332K-record offline database, we've built a tool that could meaningfully improve the safety and cultural experience of millions of tourists visiting Japan — all without requiring a single byte of internet connectivity after setup.

The name says it all: **Omamori — your AI guardian in Japan.** ⛩️
