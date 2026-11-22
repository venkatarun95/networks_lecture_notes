# Chapter 5 plan

**Opening problem.** Chapter 4’s shared Ethernet tree avoids flooding loops, but blocks a link even for a destination that could use it safely. Ask which links a destination’s traffic should follow and who will revise the answer when a link fails.

1. Follow Lecture 6 from the shared tree to a weighted graph. Ask what addition means for hops, delay, and bandwidth, then use the A–B and C–F traffic example to motivate paths that depend on demand.
2. Have readers invent the neighbor-vector update before giving it a name. Use the A/C/E/F/D/G fragment to show how next hops emerge from distances. Keep the fast-path table separate from the routing state.
3. Contrast the F–G failure, which leaves a usable detour, with the A–E failure, which exposes a stale estimate. Trace the C–A–E line and test finite infinity and split horizon.
4. Ask what a router could advertise as an alternative to its conclusions. Build link state from local observations, per-origin sequence numbers, and flooding. Then use the map to derive the forwarding entries. Return to the question of changing metrics using the 2025 convergence exercise.
5. Separate physical failure, inference, first forwarding change, traffic recovery, and convergence with the 2026 quiz grid. Use the Lecture 25 report of evening link failures and the Quiz 2 response-time plots to motivate experiments with timer phase and confidence.

The offline lab uses the Quiz 1 grid and a documented link-state baseline. Readers predict, inspect, and change the model before moving to the full course simulator.
