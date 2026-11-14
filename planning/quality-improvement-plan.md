# Quality Improvement Implementation Plan

**Date:** 2026-10-02
**Scope:** Lucid learning path system — prompts, section quizzes, AI explanations

---

## RESEARCH FINDINGS

### Demo Course Structure (src/lib/demo-course.ts)
- **4 sections, 12 subsections total**: S1(4 subs), S2(4 subs), S3(4 subs), S4(2 subs)
- Section arc: `How the Web Works` → `JavaScript You Need for React` → `React Fundamentals` → `Putting It Together`
- Last section ALWAYS has only 2 subsections ("Synthesis + Wrap-up")
- LAST subsection named "Course Wrap-up" — synthesizes ALL sections, no new content
- Section numbering: 1-based (`order: 1`, `order: 2`, etc.)
- Comment rule: "MAIN sections carry 4 or 5 sub-sections; only the CLOSING section may drop to 2. Never 3."

### Current Prompt Gaps (src/lib/ai-prompt.ts)

**getLearningPathPrompt() lines 1031-1077:**
- ❌ No instruction about closing/synthesis section
- ❌ No enforcement of structural pattern (4+4+4+2)
- ❌ No guidance on section title naming conventions
- ✅ Max 5 sections, max 4 subs per section — stated
- ⚠️ Sections start at `order: 0` — should be `order: 1`

**getSubSectionContentPrompt() lines 1079-1124:**
- ❌ Says "exactly 5 questions" but demo has only 1-2 per sub-section
- ❌ References "demo-course.ts" quality benchmark but doesn't explain WHAT makes it quality
- ❌ No Bloom's Taxonomy distribution rules
- ❌ No instructions for handling the LAST subsection of the course differently
- ⚠️ Uses `${undefined as any}` — type parameter gets stripped

### AI Explanation Quality Gap
- **Current behavior:** After wrong answer, `SubSectionReader.tsx` line ~348-352 typewrites the pre-written `q.explanation` from the question object — NO real AI involvement
- **What exists:** `/api/ai/guided/route.ts` with `getAdaptiveGuidedPrompt()` — a full Socratic tutor system with adaptive depth, performance history tracking, analogy-first pedagogy
- **What's missing:** Connection between wrong answers and the guided learning system

### Existing QuizModes
- **QuizMode.tsx:** General document-level quiz (configures type, length, timing, generates via `/api/ai/quiz`)
- **FlashcardMode.tsx:** Card flipping study tool
- **QuickStudyMode.tsx:** Quick overview/study
- **NONE of these handle section-level assessment**

---

## IMPLEMENTATION ITEMS

### ITEM 1: Fix Learning Path Prompt Structure
**File:** `lucid/src/lib/ai-prompt.ts` (lines ~1053-1076)
**Priority:** CRITICAL — breaks all generated paths

Changes needed in `getLearningPathPrompt()`:
```
STRUCTURAL CONSTRAINTS (REVISED):
- Create EXACTLY 4 sections for most documents (max 5 if the material demands it)
- Sections 1-3 are MAIN sections: each MUST contain 4 subsections (never 3, never more than 5)
- Section 4 is the CLOSING/SYNTHESIS section: contains EXACTLY 2 subsections
- The last subsection of the closing section MUST be titled "Course Wrap-up" or similar

SECTION NARRATIVE RULES:
- Section 1: Foundational/introduction concepts (title should include words like "Introduction", "Basics", "Fundamentals", or "How X Works")
- Section 2-3: Building/skill concepts (titles should describe specific skill areas)
- Section 4: Synthesis/application (title must be like "Putting It Together", "Bringing It All Together", "Application", "Review and Integration")

ORDER: Start at 1, increment by 1

QUALITY CHECK before outputting: Does the closing section synthesize ALL previous sections? Does it have exactly 2 subsections with the second being a wrap-up?
```

Also fix: `section order must start at 1` not 0.

### ITEM 2: Fix Subsection Content Prompt
**File:** `lucid/src/lib/ai-prompt.ts` (lines ~1079-1124)
**Priority:** HIGH — affects quality of all generated content

Changes:
1. Change "exactly 5 questions" to "5-8 high-quality questions" matching demo-standard quality
2. Add explicit quality criteria derived from demo-course.ts analysis:
   - Questions must test APPLICATION or ANALYSIS, not just recall
   - At least 1 question per subsection must reference a code example, table, or analogy from the content
   - Wrong options (distractors) must be PLAUSIBLE — common misconceptions or near-correct statements
   - Explanations must explicitly dismiss EACH wrong option
3. Add special handling for the last subsection: when the section title indicates synthesis/wrap-up, generate broader integration questions rather than narrow concept questions
4. Fix the broken function signature — remove `${undefined as any}` interpolation

### ITEM 3: Wire Wrong Answer → Real AI Tutor
**Files:** `lucid/src/components/chat/SubSectionReader.tsx` (~lines 325-360), NEW API route
**Priority:** HIGH — user experience killer

Problem: When user fails a question, the AI panel shows `q.explanation` (pre-written text) with typewriter effect. This is NOT tutoring — it's reading.

Solution: Replace canned explanation with live Socratic tutoring:

```
Flow after wrong answer:
1. User selects wrong option → open AI panel
2. AI calls /api/ai/explain (NEW route OR reuse /guided)
3. Payload: partContent = current subsection markdown, depth = "detailed" (user failed!), performanceHistory = ["fail"]
4. Prompt: AdaptiveGuidedPrompt with detail-depth instructions (analogy-first, step-by-step, encouraging)
5. Stream response into AI panel as bubbles
6. After explanation completes, show "Got it — try again?" button → restart quiz
```

Implementation options:
- **Option A (leaner):** Reuse `/api/ai/guided` — it already handles this perfectly. Just pass `partIndex: 0, totalParts: 1` since we're explaining one subsection. Performance history tracks fail state.
- **Option B (cleaner separation):** New `/api/ai/explain` route specifically for wrong-answer remediation with a simpler prompt tailored to "explain this specific question's concept."

Recommendation: Option A — reuse guided route. Zero new backend code needed. Just wire the frontend call.

### ITEM 4: Section-Level Quiz Coins
**Files:** `lucid/src/lib/learning-path.ts`, `lucid/src/lib/ai-prompt.ts`, `lucid/src/components/learn/LearningPathMap.tsx`, `lucid/src/components/chat/StudySession.tsx`
**Priority:** MEDIUM — important learning architecture feature

Concept: After completing all subsections in a section, the user encounters a SECTION QUIZ node — a distinct coin (orange/red instead of blue) that leads to a section-level assessment.

Architecture decision:
- **Add section_quiz subsection type**: Each MAIN section (not closing) gets an extra virtual subsection `{ id: "s1-quiz", title: "Section Check", status: "available", kind: "quiz" }`. This keeps the data model simple.
- LearningPathMap renders quiz nodes with a different coin color and label "Quiz"
- Clicking a quiz node sets `activeSubSection` but triggers QuizMode (not SubSectionReader) — QuizMode generates questions from the section's combined subsection content

Data flow:
```
Complete all s1-1, s1-2, s1-3, s1-4 → they become {status: "completed"}
s1-quiz becomes {status: "available", kind: "quiz"}
User clicks s1-quiz → activeSubSection set → StudySession detects kind===quiz → renders <QuizMode />
QuizMode calls /api/ai/quiz with combined content from all 4 subsections
Questions cover ALL concepts from the section
Results appear → on completion, mark s1-quiz as "completed", unlock next section
```

Changes needed:
1. **learning-path.ts**: Extend SubSection with `kind?: "content" | "quiz"`
2. **learning-path.ts**: `getNodeState()` — quiz nodes with status "available" render as available (clickable)
3. **ai-prompt.ts**: In `getLearningPathPrompt()`, add output for quiz subsections: `{ "type":"subsection","sectionId":"...","subOrder":4,"id":"kebab-quiz","title":"Section Check","blurb":"Test your understanding of this section.","keyTerms":[],"kind":"quiz" }`
4. **LearningPathMap.tsx**: COIN_TONES entry for "quiz" type — orange/deep amber coin, icon = Target or TargetIcon
5. **StudySession.tsx**: When activeSubSection?.kind === "quiz", render QuizMode with section-specific context (combine all subsection contents for quiz generation)
6. **reader-context.tsx**: Pass `kind` through when creating learning path from API

### ITEM 5: One-Time Agent Launches
Two agents will execute parallel research tasks and produce findings. Once completed, their reports feed into the plan above.

**Agent 1 — Demo Course Question Audit:**
- Analyze EVERY question in DEMO_SUBSECTION_CONTENT
- Count actual questions per subsection (many have 1-2, not the promised 5)
- Rate pedagogical quality (Bloom's Taxonomy distribution)
- Identify patterns in good vs mediocre questions

**Agent 2 — AI Remediation Flow Analysis:**
- Trace exact code path from wrong answer → AI panel display
- Evaluate whether current typewriter+canned approach meets user standards
- Assess reusability of existing guided-learning infrastructure for remediation

---

## DEPENDENCY MAP

```
Item 1 (Learning Path Prompt) ──→ Item 4 (Section Quiz Coins) ──→ Items 5-6 (Testing)
Item 2 (Content Prompt) ─────────────────────────────────────────→ Testing
Item 3 (AI Explain Wiring) ──────────────────────────────────────→ Testing
Item 4 (Quiz Coins) ←── Item 1 (needs quiz subsection format)
Item 5 (reader-context changes) ←── Items 1, 2, 4
Item 6 (StudySession wiring) ←── Items 3, 4
```

Items 1 and 2 are independent and can run first.
Item 3 is independent of 1/2.
Items 4-6 depend on 1 and/or 2.

---

## TESTING STRATEGY

After implementation:
1. Upload a sample note → verify learning path follows 4-section structure with correct closing section
2. Enter detailed mode → verify subsection content quality matches demo standard
3. Fail a question → verify AI provides real explanation (not canned text)
4. Complete all subs in a section → verify section quiz coin appears
5. Take section quiz → verify questions span entire section scope
6. Verify persistence across refresh

---

*Plan ready for agent assignment and execution.*
