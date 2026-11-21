# Chapter 1 source notes and simulator plan

## Primary sources

Transcript references point to [the numbered plain-text transcript](../../assets/f26-subtitles.txt). Lecture boundaries are 1–2110, 2111–4014, and 4015–4501. Chapter prose adapts ideas and classroom examples. The figures, numeric workloads, and diagnostic trace are original teaching material.

| Source | Location | Chapter use |
| --- | --- | --- |
| Lecture 1 | Lines 47–100, 126–195, 841–880 | Opening sequence. The Internet is a machine assembled from independently run networks, illustrated by a campus handoff. The course then asks how the system works, why it was designed that way, and how to reason about competing designs. The chapter adapts that sequence and uses the plan's two-link example to make the design reasoning concrete. Figure 1.1 is an original illustration of the campus example. |
| Lecture 1 | Lines 1472–1541, 1559–1577, 1940–1978 | Scalable connectivity, the direct-link thought experiment, and developer and user goals. The pairwise link counts are original. |
| Lecture 1 | Lines 980–1017 | Dependent web resources and the visible page as a user-facing metric. |
| Lecture 1 | Lines 1027–1146 | In-class question about video byte share, goodput, quality changes, and a student's question about rebuffering. The chapter uses a byte calculation in place of the lecture's time-sensitive traffic-share estimate. |
| Lecture 1 | Lines 518–548, 1148–1180, 1209–1257, 1277–1317 | Gaming, trading, call turn-taking, headset deadline misses, and the need for frequent communication during parallel work. The 30 frames/s and 1% miss calculation adapts the AR discussion. |
| Lecture 1 | Lines 1320–1359, 1472–1499, 2042–2088 | Operator cost and manageability, endpoint priorities, propagation floors, and geographically distributed server placement. |
| Lecture 2 | Lines 2224–2335, 2791–2858, 3225–3250 | Addressed packets, an in-class question about best effort, capacity and coordination trade-offs, recovery above the network, and a common service for diverse devices. |
| Lecture 2 | Lines 2181–2211 | Original student observation about backward seeks and invitation to investigate with an LLM. |
| Lecture 3 | Lines 4017–4108, 4110–4215, 4223–4264, 4288–4345, 4410–4469 | Discussion of quality, separate tracks, memory, browser and application control, a student's pause-and-seek observation, and ways to test an explanation. The sample observations and paired-run procedure in the chapter are invented. |
| [Quiz 3 (2025), Q1](../../assets/quiz3-2025.pdf#page=1) | PDF page 1, visually inspected | The original assumes direct satellite access and asks which of five workloads benefit when lower-latency, lower-capacity satellite links make central deployment viable. The adaptation treats the latency advantage as a stipulated end-to-end measurement and asks which measurement could reverse a decision. Q1 is text and checkboxes. |
| [Final Exam (2024), Q1](../../assets/cs356-final-2024.pdf#page=1) | PDF page 1, visually inspected | Adapts all four deployment scenarios and the equal-total-capacity premise. Adds a reversal of one assumption. Q1 is text. |

Lecture 1 lines 217–231 describe the InstaPoll format. The chapter's in-class questions come from the identifiable discussions above. Verify the original poll handouts before labeling any question a formal InstaPoll.

The two-link example and numbers come from the Chapter 1 planning entry. The serialization model, crossover calculation, “Break this” variant, percentile example, all four figure treatments, exact playback schedule, and overload exercise were developed for this chapter. The quiz adaptations provide open-ended reasoning prompts. The source PDFs supply no official keys on the Q1 pages.

## Worked checks for editors

- In the two-link exercise, 100 back-to-back 1 kB messages take 500.8 ms on A and 90 ms on B to deliver. Assuming negligible reply size and processing, 100 complete request–reply rounds take about 100.0008 s on A and 2.080 s on B. If stopping at the arrival of the final request, omit the final reply's propagation time.
- For the satellite exercise, small deadline-sensitive messages are strong candidates if end-to-end tail delay is genuinely lower. A large file depends heavily on usable throughput. On-demand video can tolerate a lower rate if it stays above the encoding rate with enough reserve for delivery gaps. Remote rendering must fit both the response delay and transmitted frame size into the deadline. The answer can change with actual rates, loads, and the route being compared.
- For the equal-capacity deployment exercise, concentrating tightly coupled training workers avoids wide-area synchronization. Local renderers shorten the input-to-display loop if they can serve the rendering and media rates. A popular broadcast can amortize replication across nearby users. Widely scattered requests for a rarely watched video give each edge replica little opportunity for reuse. Possible reversals include local groups of long-delayed viewers, a faster backbone path to a concentrated renderer, or a workload that exchanges little data across training sites.

## Shared-simulator activity

This is the implementation plan for the computer-based extension of the hand-simulatable chapter activity. Use the book's shared event scheduler for rate changes, threshold crossings, outages, and state transitions. Represent the schedule as **receiver-side useful media delivery**, already downstream of propagation and any modeled losses. That input isolates the player policy. A later transport activity can feed the same player from a packet-delivery trace.

**Inputs.** Supply a piecewise-constant table of arrival rates in Mbit/s, the chosen encoding rate, available encoding choices, startup and restart thresholds in seconds of playable video, and the stop time. For the baseline use 4 Mbit/s encoding, 2 s for both thresholds, and stop at 18 s. The arrival schedule is 8 Mbit/s over [0, 2), zero over [2, 8), 8 over [8, 14), and 4 over [14, 18).

**Model.** Begin empty in startup. Between events, accumulate arrivals divided by the encoding rate. Subtract one video second per wall second only while playing. Schedule exact threshold crossings or buffer exhaustion before stepping past them. When the buffer empties while delivery is below playback demand, stall until the restart threshold is met. If exhaustion and recovery occur together and the new rate can sustain playback, continue without a stall. At simultaneous events, integrate up to the timestamp using the previous state and arrival rate, apply the new arrival rate, and report the post-event state. The baseline has no buffer cap, no seeks, no quality switches inside a run, and no end-of-video event before stop time.

| Wall time (s) | Buffer (video s) | Playhead (video s) | Player state after event |
| ---: | ---: | ---: | --- |
| 0 | 0 | 0 | Startup |
| 1 | 2 | 0 | Playing |
| 2 | 3 | 1 | Playing |
| 5 | 0 | 4 | Stalled |
| 8 | 0 | 4 | Stalled |
| 9 | 2 | 4 | Playing |
| 14 | 7 | 9 | Playing |
| 18 | 7 | 13 | End of observation while playing |

**Reader decisions.** Ask for the predicted state at each event, then overlay the prediction with an actual run showing aligned lanes for arrival rate, buffer depth, playhead, and player state. Provide the chapter's two comparisons as presets. With two four-second thresholds, the reference times are startup at 2 s, stall at 6 s, and resume at 10 s. At 2 Mbit/s with two-second thresholds, play starts at 0.5 s, the buffer at 8 s is 0.5 video seconds, and no stall occurs. Readers can implement a session policy that chooses an encoding and thresholds using whatever past delivery the scenario exposes. The simulator should hide future delivery from that policy. Show startup time, stall count and total duration, and encoding rate in the run summary.

**Workloads and feedback.** First sweep outage start times from 2 through 8 s and lengths from 1 through 6 s in one-second increments, keeping the observation window and nominal delivery capacity fixed. For this sweep, use 8 Mbit/s from 0 to 14 s except during the outage and 4 Mbit/s from 14 to 18 s. Next give readers a steady trace at 4 Mbit/s and a trace with two outages separated by a short recovery. Ask their policy to meet an explicit startup and stall budget and report the first trace that breaks either requirement. Plot options on startup delay and total stall time with bitrate as a third encoded variable. Compare dominance across all three objectives (minimize time and maximize bitrate), grouped by workload. Require an explanation for one unexpected transition in terms of arrivals and consumption. The core chapter already includes a manual trace and needs no simulator to teach the model.

## Open source questions

- The backward-seek discussion contains student observations and competing hypotheses. It does not establish why a specific commercial player reloaded, whether its policy generalizes, or which component controlled retention. The chapter avoids version-dependent browser implementation claims.
- Lecture 3 begins mid-discussion at line 4017. Retrieve the original slides, recording, or prompt transcript if a future edition needs to attribute the original LLM's claims precisely.
- The plans describe a common simulator. Bind the activity to the actual scheduler and visualization APIs when they are available. The existing multi-team autonomous-system competition remains the capstone.
