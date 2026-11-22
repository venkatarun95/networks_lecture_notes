# Chapter 5 source notes

Line numbers refer to [the subtitle transcript](../../assets/f26-subtitles.txt).

| Source | Location | Material used |
| --- | --- | --- |
| Lecture 5 | 7856–7905, 8009–8033 | Loop-free Ethernet flooding, adapting the tree, student question about detecting duplicate packets while keeping physical cycles. Lines 8088 onward include a duplicated fragment of Lecture 6. |
| Lecture 6 | 8757–8795, 8924–9061 | Shared tree, static first-arrival tree proposed by a student, arrival-order concerns, self-repair and a single administrative domain. |
| Lecture 6 | 9063–9288 | Graph abstraction, hop count, additive delay, bottleneck bandwidth, competing A–B and C–F demands. The traffic sketch is described verbally and some labels are garbled. The chapter builds a compatible small graph with explicit weights and capacities. |
| Lecture 6 | 9290–9411 | Static provisioning versus self-repair, fast and slow paths, “Can you figure out the algorithm?” InstaPoll. |
| Lecture 6 | 9416–9518 | A's neighbors B, C, E, F, distance to G via F and to D via C, C learns E from A, administrative scope and prefix aggregation. |
| Lecture 6 | 9550–9775 | Good and bad news, F–G detour, A–E partition, C–A–E counting, finite infinity, split horizon, poison reverse. InstaPoll mentioned at 9713–9715, exact posted wording absent. |
| Lecture 6 | 9793–10033, 10077–10252 | Flooding neighborhoods, X/A/B/C/D duplicate example, per-origin versions and loss/restart questions, HELLO detection, Dijkstra, feedback when weights follow traffic. |
| Lecture 25 | 39660–39689, 39805–39885, 39900–39986 | Evening failure reports, shared-queue HELLO hypothesis, moving the threshold from three to six, observing traffic during supposed failure, dropped versus delayed HELLOs. In-class debugging scenario. |
| [Quiz 1, 2025](../../assets/quiz1-2025.pdf#page=4) | Q5–Q8, PDF pp. 4–5 | Four link metrics and the “for all possible topologies” convergence question. The chapter adds a traffic-driven counterexample with an explicit sampling rule. |
| [Quiz 1, 2026](../../assets/quiz1-2026.pdf#page=2) | Q1–Q2, PDF pp. 1–5 | Grid, S0–S2 failure at 3,000 ms with no failure notification, next-hop table and first visible update. The export shows S0/S1/S3/S7 and 150.812576 ms for the graded reference. Those are observations about that program. The chapter’s runnable baseline uses independent, specified timings. |
| [Quiz 2, 2026](../../assets/quiz2-2026.pdf#page=10) | “How fast does your network react?”, PDF pp. 10–12 | S2–S3 highway and S2–S6–S7–S3 side road, both 4 Mbit/s, burst phase between 6 s and 7 s, flat/sawtooth/never response plots. Exercise adapts timer-phase idea to failure detection. |

The weighted triangle, exact local update schedules, feedback example, and offline implementation are original teaching material. Verify the precise Lecture 6 slide graph if the original slides become available. Quiz topology was transcribed from its rendered diagram.
