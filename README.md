# StudyBuddy 🎓

**StudyBuddy** is a high-fidelity, production-ready mobile study application built with **React Native (Expo)** and backed by a **FastAPI + LangChain + Groq + Supabase** AI and database engine. It integrates gamified learning (XP rewards, study streaks, achievements) with advanced RAG contextual coaching (Sensei AI) and spaced-repetition Leitner study decks.

---

## 📱 Core App Features

### 1. Authentication & Onboarding
- **Secure Guards**: Native password inputs, verification overlays, and profile avatar selection screens.
- **Store Adapter**: Auth session persistence securely mapped to Expo `SecureStore` (native Keychain/Keystore) and web `localStorage`.

### 2. Home Dashboard
- **Streak Tracker**: Weekly visual flame streaks tracking active study days.
- **Daily Focus Clock**: Circular progress targets representing studied minutes.
- **Sensei AI Coaching Card**: Recommendation card generating dynamic study tips.

### 3. Study Planner & Focus Mode
- **Weekly Calendar Strip**: Selectable horizontal strip filtering daily timetables.
- **AI Suggested Study Blocks**: Recommendations from Sensei AI. Accepting blocks automatically inserts them into the schedule.
- **Immersive Focus Screen**: Deep-focus Pomodoro timer featuring play/pause controls and a glowing background breathing guide animated via Reanimated. Completing sessions awards the student **+20 XP**.

### 4. Spaced-Repetition Flashcards
- **Leitner Boxes Review**: Review cards with progressive repetition intervals (Again, Hard, Good, Easy difficulty keys).
- **3D Card Flip**: Flips cards 180 degrees using Reanimated 3D transforms (`rotateY`) to reveal answers and AI study clues.
- **Deck Creation Wizard**: Forms to select parent decks and input questions, answers, and hints.

### 5. Document Library
- **TEXT/PDF Ingestion Preview**: Detail cards displaying document title, categories, page counts, and indexing statuses.
- **Cloud Storage Limits Tracker**: Visual progression indicators highlighting storage limit guidelines.

### 6. Rich Notes Workspace
- **Styling Toolbar**: Text styling selector overlays.
- **Voice Note Recorder**: Dynamic waveform visualizer indicating audio inputs.
- **Sparkles drawer**: Floating quick AI sidebar drawer containing prompts like "Explain Simpler", "Give Example", "Summarize".

### 7. Sensei AI Assistant
- Chat screen equipped with Suggested prompts carousels and bouncing typing indicators.
- Context-aware responses pulled from uploaded study documents.

### 8. Analytics & Achievements
- **Knowledge Heatmap**: GitHub-style green contribution grid representing study consistency.
- **Subject Mastery Radar Chart**: Custom SVG vector graphics mapping subject mastery without external library bloat.
- **Achievements Badges**: Unlockable reward badges (e.g. "Night Owl", "Focus King").

---

## 🛠️ Tech Stack & Architecture

### Frontend (Mobile App)
- **Framework**: React Native with **Expo SDK 56**.
- **Navigation**: File-based **Expo Router (v3)** routing stacks and modals.
- **State Management**: **Zustand** stores for auth profiles and study progress.
- **Styling**: **NativeWind (Tailwind CSS v4)** for modular design tokens.
- **Animations**: **React Native Reanimated (v4)** for 3D card flips, breathing rings, and waveform indicators.
- **Icons**: **Lucide React Native**.

### Backend (AI Engine)
- **Framework**: **FastAPI** with `uvicorn` server execution.
- **Orchestration**: **LangChain** prompting chains and Pydantic schemas.
- **Vector Database**: **Supabase (pgvector)** table chunk search matchers.
- **Embeddings**: HuggingFace local models (`all-MiniLM-L6-v2`).
- **LLM Engine**: **Groq Cloud API** (ChatGroq running `llama-3.1-70b-versatile`).

---

## 🚀 Setup & Execution Guide

### 1. Run React Native Frontend
1. Install node dependencies:
   ```bash
   npm install
   ```
2. Verify environment keys in the root `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Start the dev server:
   ```bash
   npx expo start
   ```
4. Run on your device: Scan the QR code using your phone's camera (iOS) or the **Expo Go** application (Android).

### 2. Run FastAPI AI Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   * **Windows**: `python -m venv venv && .\venv\Scripts\activate`
   * **macOS/Linux**: `python3 -m venv venv && source venv/bin/activate`
3. Install packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Verify environment credentials in `backend/.env`:
   ```env
   GROQ_API_KEY=gsk_your_groq_key
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   ```
5. Launch the backend:
   ```bash
   python -m app.main
   ```
6. Access interactive API Swagger documentation at `http://localhost:8000/docs`.

---

## 🔍 Code Validation & Quality Checks
To verify typescript build compile health:
```bash
npx tsc --noEmit
```
**Status**: Builds cleanly with **zero warnings or errors**.
