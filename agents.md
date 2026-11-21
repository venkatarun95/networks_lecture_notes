# Agent Instructions: Networking Book Project

## Goal

Develop a design-first computer networking textbook: teach readers to invent systems, discover trade-offs, break designs, and understand why existing protocols work.

## Sources

Three planning documents:

1. **Lecture summaries:** Topic index.
2. **Chapter plan:** Proposed structure, lecture mappings, diagrams, questions.
3. **Distinctive features plan:** Pedagogy, interactive labs, visualizations, capstone.

Primary sources in assets/ directory:

- `f26-subtitles.txt` — \~41,000 lines, lectures 1–25 (11 and 20 absent).
- Eight quiz/exam PDFs from 2024–2026.

Planning documents are guides; original transcripts and quizzes are authoritative.

Chapter plans are in plan.md, a plan for distinctive elements in the quiz are in distinctive-elements.md and a more detailed lecture-wise summary is in summary.md

## Context management — IMPORTANT

**Never load the entire transcript into context.**

First, index lecture boundaries:

```
grep -nE '^Lecture[[:space:]]+[0-9]+[[:space:]]*$' f26-subtitles.txt
```

Then fetch individual lectures using their line ranges:

```
sed -n 'START,ENDp' f26-subtitles.txt
```

Split long lectures into smaller chunks. Search for specific topics using `grep -ni`, then read surrounding context.

For each lecture, maintain compact notes on topics, algorithms, trade-offs, examples, in-class questions, InstaPolls, and source line numbers.

**For chapter work:** Read the relevant planning entry → identify lectures → retrieve those lectures individually → inspect relevant quiz questions → draft.

Never rely on summaries when precise source details matter. Don't load unrelated lectures or all quiz PDFs simultaneously.

## Book philosophy

- Start with design problems, not protocol definitions.
- Let readers propose solutions before introducing existing protocols.
- Emphasize assumptions, counterexamples, trade-offs, and alternative designs.
- Preserve interesting lecture examples, digressions, and questions.
- Distinguish source material from newly proposed content.

## Questions and exercises

Extract InstaPolls, student questions, and quiz problems, recording their original sources.

Include:

- **Design this:** Invent a solution under specified constraints.
- **Break this:** Find counterexamples or adversarial workloads.
- **What if?:** Change an assumption.
- **Predict–simulate–explain:** Predict what an implementation does, run it, explain discrepancies.
- **Network detective:** Diagnose behavior using logs and measurements.

## Interactive design laboratories

Some chapters should pose open-ended design problems where readers **vibe-code solutions using LLMs**, test them, and iterate.

Support semi-automated trade-off discovery through parameter sweeps, workload generation, adversarial tests, counterexample search, baseline comparisons, and Pareto frontiers.

Consider interactive visualizations for routing, BGP, congestion control, wireless interference, switch scheduling, cryptography, and network failures. Prefer visualizing actual simulation traces.

## Capstone

Use the **existing final multi-team autonomous-system competition**, not a replacement. Real competing teams are essential. Competition infrastructure can be distributed to instructors. Earlier individual laboratories prepare readers for it.

## Workflow

For each chapter:

1. Consult the chapter plan and relevant lecture summaries.
2. Retrieve original lecture sections individually.
3. Extract technical content, examples, and questions.
4. Inspect relevant quiz PDFs, including diagrams.
5. Develop the narrative, exercises, diagrams, and interactive labs.
6. Draft and verify against source material.

Keep persistent, concise chapter notes with source locations and unresolved questions.

**Core principle:** The book should teach engineering judgment, not just networking facts.

Compress this into a tiny checklistTurn this into a one-paragraph prompt