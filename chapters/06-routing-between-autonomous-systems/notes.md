# Chapter 6 source notes

The line ranges refer to [the course transcript](../../assets/f26-subtitles.txt). Lecture 7 begins at line 10516 and Lecture 8 at 12017. The narrative follows the design conversation in Lecture 7, then brings in the operational details and economic model from Lecture 8.

| Source lines | Material and editorial treatment |
| --- | --- |
| 10548–10618, 10794–10987 | Shift from shared objectives to independent policies. Student proposals include a packet-level list of forbidden networks and a payment credential. The orange-price analogy asks what a buyer can decide from a five-dollar price without seeing the store's cost breakdown. The chapter paraphrases the lecture's offer of reachability in the first person. |
| 11003–11133, 11240–11249 | Common core proposal, single-link failure, who owns core routers, Austin-to-Houston detour and IXP building. The chapter distinguishes a shared exchange fabric from an agreement to use it and uses the RFC definition of an AS. |
| 11253–11350, 11353–11405 | Backup transit may cost money even when idle. The AS-level reachability message, TCP, and connections at multiple attachment points. The shared decreasing-distance argument from the previous class gives way to local ranking and an AS-path loop check. |
| 11409–11472, 11535–11682 | The promise InstaPoll and the regional-provider drawing. U replaces AS1, A/B are AS2/AS3, and P/Q/R are the relevant customers. The chapter follows R's route through B, shows what A can advertise to P and Q, and keeps A's peer-learned route from U. It follows one prefix so every update can be traced. |
| 11684–11823 | How much detail does the AS sequence give us? What would the IGP contribute to the forwarding decision? The lecture's two lookups are applied to the example handoff. |
| 11825–11966 | Student asks how to tell whether a packet crossed an unwanted AS. Traceroute via increasing TTL, the first hop **10.150.0.1**, silence at hop 2, and incomplete AS attribution. The chapter's trace is an illustration of the P–A–B–R route with documentation addresses, modeled on the demonstration. The class simulator can observe actual hops. |
| 12026–12082, 12087–12136, 12215–12265, 12308–12338 | Lecture 8 recap, withdrawal, Seattle/Austin locations, differing handoff addresses, and the hot- versus cold-potato trade-off. The chapter uses the same geography with generic operators. |
| 12350–12496, 12520–12577 | Clarifies that a recipient checks for its own AS number and that adding copies of one's own number can influence remote path ranking. Lecture's configurable exception for intentional leave-and-reenter traffic and splitting by prefix are available for later exercises. |
| 13120–13209, 13274–13294 | The customer/provider and peer export model, followed by the customer–peer–provider ranking example. The chapter presents these conventions as a simplified agreement model. Its stability consequences belong with the next chapter. |

## Assessment sources

| Original | Use |
| --- | --- |
| [Quiz 1, 2024](../../assets/cs356-quiz1-2024.pdf#page=4) | Background relationship rules on PDF pp. 4–5. Rendered and checked the six diagrams on p. 5 against their textual descriptions on pp. 6–7. Q11 on p. 7 asks why an AS typically withholds a provider route from a peer. The chapter adapts the inverse situation, a peer route withheld from a provider, to expose the same transit incentive. Q12 on p. 8 asks who fills an internal router's entries for external addresses and motivates the two-stage forwarding example. Q5–Q10 concern convergence and are available to Chapter 7. |
| [Quiz 1, 2025](../../assets/quiz1-2025.pdf#page=6) | Q11 asks about dropping all of B's traffic for X, dropping some of B's traffic, or dropping C's traffic after advertising X to B. The chapter states that C is a separate neighbor with no offer from A, then explicitly tests the difference between traffic C hands to A and traffic C delivers through B. Lecture 7's discussion names A and B but the displayed question is absent from the subtitles. |
| [Final, 2024](../../assets/cs356-final-2024.pdf#page=7) | Q13 asks whether BGP guarantees path symmetry after convergence when each link's latency is symmetric. The M–B–T–R and R–A–M paths are a chapter construction. With 5 ms per link, delays are 15 ms out and 10 ms back. Half the 25 ms round-trip time overestimates the return delay by 2.5 ms. Both paths can persist under fixed preferences. |

## Implementation checks and follow-on

- RFC 4271 §§3–5 and 9 were checked for TCP transport, updates and withdrawals, AS path handling, local preference, MED, and next-hop resolution. RFC 6793 provides four-octet AS numbers. RFC 1812 §5.3.1 describes TTL expiry and ICMP. The illustrative public IPv4 addresses use RFC 5737 documentation ranges.
- In the regional example, A prefers its peer B for R and can revert to U when the peering route disappears. In the multihoming example, M is a customer of A and B, T is a customer of B, and R is a customer of A and T. Traffic arrows in the multihoming drawing show the direction of packets sent by M.
- The Netflix/Comcast negotiation aside, the accidental propagation of a YouTube route, and the route-stability material remain available as source material for later chapters. The transcript references are 10648–10701 and 10989–10999 for the first, 11475–11489 for the second, and 12581 onward for stability.
