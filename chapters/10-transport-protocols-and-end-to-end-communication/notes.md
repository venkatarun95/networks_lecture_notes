# Chapter 10 source notes

- Lecture 2, lines 3285–3334. Listening, accepted connections, ordered byte sequences, and the application interface.
- Lecture 12, lines 17504–17643. From host-to-host to process-to-process, UDP ports and transport choices. Lines 17707–17848 cover byte sequence numbers, cumulative progress, delayed ACKs, and a student observation about the cost of reporting gaps. Lines 18126–18178 and 18318–18504 cover socket buffering, slow readers, and the propagation of backpressure. Lines 18858–18908 and 19018–19089 contrast timeouts and duplicate ACKs, including the student question about which situations reorder packets. Lines 19197–19227 revisit limited SACK reporting. TCP option space can fit four SACK blocks when timestamps are absent, so the chapter avoids calling three a universal limit.
- Lecture 14, lines 22494–22661. Real-time frames, concatenated web objects, dependency across a TCP stream, separate QUIC streams, deployment over UDP.
- Lecture 22, lines 34210–34312. Interpreting transport headers and relative TCP sequence numbers on a packet trace. Standard verified against RFC 9293, especially SYN, SYN+ACK, ACK, initial sequence spaces, and receive-window behavior.
- Quiz 1 2024, Q1–Q2, PDF pp. 1–2. Reply address and port exercise adapted using documentation addresses and another simultaneous connection. Original IP/transport field placement is corrected.
- Quiz 2 2024, Q13, PDF p. 11. ACK reasoning prompt. The image confirms the original's reversed endpoints in the first selective range, so the adaptation uses a freshly specified trace.
- Final 2024, Q14–Q15, PDF p. 8. The two recovery mechanisms separately. Adapted into a minimal-witness task and comparison tied to the main trace.
- New material. Two-program opening, framing exercise, explicit window arithmetic, figures, design prompt and deterministic lab. Persisted lab uses a fixed timer to compare sender rules; it has no congestion control or receive-flow window.
