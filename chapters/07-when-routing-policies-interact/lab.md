# Routing-policy lab

Open the [routing-policy simulator](route-lab.html) in a browser. You can run it offline.

1. **Predict.** Start with all three direct routes and all three ASes ranking their detours first. Write down the next three selected-route tuples for activation order AS1, AS3, AS2. For each activation, write down the preferred neighbor’s advertisement before the AS recomputes. Look for a step when the selected routes repeat. What else needs to repeat to guarantee the rest of the trace repeats?
2. **Simulate.** Run that order, then swap the order of AS2 and AS3. Compare the number of activations and the number of actual route changes between the first occurrence of a state and its return. Diagnose any step that differs from your prediction by checking which full path the neighbor advertised.
3. **Design.** Choose as few ASes as possible to rank their direct route first while still letting the other ASes keep their preferred detours whenever available. Predict the stable routes for your choice. Sweep all rankings and orders and use the table to check whether your change works for every tested order. Identify which ASes get their first choice in the final assignment.
4. **Explain.** The sweep starts from the all-direct state. The fixed-point check considers all eight possible assignments. Explain what each test tells you about existence, convergence, and the effect of update order.

## Extend the model

Adapt the [JavaScript model](route-lab.js) to a ring of \(n\) routing ASes, each with a direct link to AS0 and a single permitted detour through its clockwise neighbor. If you use a coding assistant, give it the exact path-availability rule and ask it to show the routes and next activation whenever it reports a repeat. Compare rings of three through seven ASes. Sweep the number and position of direct-first rankings and record the number of fixed points, the fraction of sampled orders that settle, and the route changes along those executions. Keep initial routes and schedules reproducible so that two repairs can be compared on the same workloads.

Can a ring have a fixed point and still repeat from a different initial assignment under a repeating order that activates every AS? Check multiple initial states and exhibit a complete trace for any counterexample. Distinguish the conditions you have exhaustively checked from those you sampled.

The three-AS preferences come from Lecture 8 of the [course transcript](../../assets/f26-subtitles.txt), lines 12761–12839. The scheduler, sweep, and ring extension are lab additions. Each activation reads the neighbor’s current selection directly, while the other ASes retain their previous selections until activated.
