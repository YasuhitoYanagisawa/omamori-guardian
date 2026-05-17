# ⛩️ Omamori — AI Travel Guardian for Japan

**Gemma 4 Good Hackathon 2026 Submission**
*Track: Global Resilience + Ollama Integration*

> **Omamori (お守り)** — a Japanese protective charm. This PWA serves as a digital guardian for international tourists visiting Japan, providing real-time AI-powered translation, festival discovery, and emergency assistance — all designed to work offline.

---

## 🎯 Problem Statement

**34 million** international tourists visited Japan in 2024, yet critical barriers remain:

- **Language barrier**: Japan's signage, menus, and emergency announcements are predominantly in Japanese
- **Disaster preparedness**: Japan experiences ~1,500 earthquakes/year. Foreign tourists have no quick way to find nearby shelters or hospitals
- **Cultural access**: 29,000+ local festivals happen annually, but information exists only in Japanese

**Omamori bridges this gap** — a single PWA that works in 8 languages, functions offline, and uses Gemma 4 for intelligent, contextual assistance.

---

## ✨ Key Features

### 🏮 Festival Discovery (29,165 events)
- Browse Japan's complete festival database with smart search & filters
- **Gemma 4 auto-translation**: Festival names, locations, and descriptions are translated in real-time via streaming to the user's selected language
- AI-powered nearby festival recommendations based on GPS location
- Cached translations for instant repeat access

### 🤖 AI Assistant (Gemma 4 Powered)
- **Streaming chat**: Real-time character-by-character responses for natural conversation
- **Multilingual**: Responds in user's selected language (English, Chinese, Korean, Spanish, French, Thai, Vietnamese, Japanese)
- **Voice I/O**: Speech recognition input + text-to-speech output via Web Speech API
- **27 Quick Phrases** in 8 languages with Japanese original + romaji pronunciation
- Contextual festival information and cultural guidance

### 🚨 Emergency Hub (Works 100% Offline)
- **One-tap emergency calls**: Police (110), Fire/Ambulance (119), Coast Guard (118)
- **Nearby facilities map**: Find shelters (121,965) and hospitals (181,312) by GPS
- **Facility names translated** via Gemma 4 streaming
- Earthquake survival guide & medical show cards
- **Disaster Message Dial (171)**, AMDA Multilingual Medical, Visitor Hotline 24h

---

## 🧠 Gemma 4 Integration (Technical Depth)

### Model: `gemma4:e2b` via Ollama (local inference)

| Feature | Gemma 4 Usage | Technique |
|---|---|---|
| **Festival Translation** | Translates name + location + description for each card | Streaming API (`stream: true`) with structured output parsing |
| **AI Chat** | Free-form conversational guide in 8 languages | Streaming with real-time DOM updates |
| **Facility Translation** | Translates hospital/shelter names from Japanese | Sequential streaming with `Name:` / `Address:` format |
| **Festival Recommendations** | Generates natural-language recommendations from GPS-nearby data | Context-aware prompting with location + season |

### Hybrid Translation Strategy
```
┌─────────────────────────────────────────────┐
│  User selects language (e.g., Korean 🇰🇷)   │
├─────────────────────────────────────────────┤
│  UI Elements (tabs, buttons, labels)        │
│  → Static i18n (instant, 8 languages)       │
├─────────────────────────────────────────────┤
│  Festival Cards (name, desc, location)      │
│  → Gemma 4 streaming translation            │
│  → Translated text REPLACES Japanese        │
│  → Original shown as small 🇯🇵 reference    │
│  → Cached in memory for instant re-display  │
├─────────────────────────────────────────────┤
│  Quick Phrases (27 phrases)                 │
│  → Pre-translated static data (8 languages) │
│  → User's language as PRIMARY display       │
│  → Japanese + Romaji as reference           │
├─────────────────────────────────────────────┤
│  AI Chat & Facility Names                   │
│  → Gemma 4 real-time streaming              │
└─────────────────────────────────────────────┘
```

### Key Technical Decisions
1. **Streaming over batch**: Each card translates independently with real-time text rendering, giving immediate visual feedback
2. **Replace-not-subtitle**: Translated text becomes the PRIMARY display; Japanese original is shown as a small italic reference — so a Korean tourist sees Korean content first
3. **Memory caching**: Translations persist per session; switching back to a previously translated language is instant
4. **Sequential processing**: Cards translate one-by-one to avoid Ollama queue congestion

---

## 📊 Data Assets (332,442 records)

| Dataset | Records | Source | Key Fields |
|---|---|---|---|
| **Festivals** | 29,165 | National festival databases + Gemini AI enrichment | name, desc, schedule, lat/lng, station, tags |
| **Shelters** | 121,965 | Japan government open data | name, address, type, capacity, disaster types |
| **Hospitals** | 181,312 | MHLW open data | name, address, beds, departments, emergency |

All data is cached in **IndexedDB** on first load (~37MB) for complete offline access.

---

## 🔌 Offline-First Architecture

| Feature | Offline? | Method |
|---|---|---|
| Emergency phone numbers | ✅ | Embedded in HTML |
| Shelter/Hospital search | ✅ | IndexedDB + GPS |
| Festival browse & search | ✅ | IndexedDB |
| Quick Phrases (8 languages) | ✅ | Static data + Web Speech API |
| Earthquake/Medical guides | ✅ | Embedded content |
| AI Chat & Translation | ❌ | Requires Ollama (local Gemma 4) |

---

## 🚀 Quick Start

### Prerequisites
- [Ollama](https://ollama.ai) installed with Gemma 4:
  ```bash
  ollama pull gemma4:e2b
  ollama serve
  ```

### Run
```bash
cd omamori_v2
npx http-server -p 4444 --cors -c-1
```
Open `http://localhost:4444` in Chrome.

### Demo Flow
1. **Select language** (top-right dropdown) — UI instantly switches
2. **Discover tab**: Festival cards auto-translate via Gemma 4 streaming
3. **AI Assistant tab**: Chat in any language, use voice input 🎤
4. **Emergency tab**: Find nearby shelters/hospitals, one-tap emergency calls

---

## 🌍 Supported Languages

| Code | Language | UI | Phrases | AI Chat |
|---|---|---|---|---|
| 🇬🇧 EN | English | ✅ | ✅ | ✅ |
| 🇯🇵 JA | Japanese | ✅ | ✅ | ✅ |
| 🇨🇳 ZH | Chinese | ✅ | ✅ | ✅ |
| 🇰🇷 KO | Korean | ✅ | ✅ | ✅ |
| 🇪🇸 ES | Spanish | ✅ | ✅ | ✅ |
| 🇫🇷 FR | French | ✅ | ✅ | ✅ |
| 🇹🇭 TH | Thai | ✅ | ✅ | ✅ |
| 🇻🇳 VI | Vietnamese | ✅ | ✅ | ✅ |

---

## 🏗️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (zero framework dependencies)
- **AI**: Gemma 4 e2b via Ollama (local inference, streaming)
- **Maps**: Leaflet.js + OpenStreetMap
- **Storage**: IndexedDB (offline data)
- **Voice**: Web Speech API (recognition + synthesis)
- **Data Pipeline**: Python + Gemini 2.5 Flash (enrichment)

---

## 📁 Project Structure

```
omamori_v2/
├── index.html          # Main PWA shell
├── style.css           # Design system (dark theme, glassmorphism)
├── app.js              # Core logic (Gemma 4 streaming, translation, chat)
├── i18n.js             # 8-language UI translations
├── manifest.json       # PWA manifest
├── data/
│   ├── festivals.json  # 29,165 festival records (13.4 MB)
│   ├── shelters.json   # 121,965 shelter records (23.6 MB)
│   └── medical.json    # 181,312 medical facility records (38.6 MB)
└── README.md           # This file
```

---

## 👤 Author

**Yasuhito Yanagisawa**
- GitHub: [YasuhitoYanagisawa](https://github.com/YasuhitoYanagisawa)

---

## 📜 License

MIT License — This project was built for the Gemma 4 Good Hackathon 2026.
