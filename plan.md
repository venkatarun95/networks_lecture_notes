# **Book Plan: Computer Networks Through Design and Reasoning**

## **Editorial direction**

I would organize this as a **problem-driven textbook about designing computer networks**, rather than a conventional textbook that catalogs protocols layer by layer.

The strongest aspect of the lectures and quizzes is the emphasis on reasoning: identifying assumptions, designing alternatives, predicting failures, and understanding why a particular design works under some circumstances but not others.

The book should preserve that philosophy.

A possible working title:

**Computer Networks: Principles, Trade-offs, and Design**

Subtitle: *Understanding the Internet by Learning to Design It*

The intended audience would be advanced undergraduates, graduate students, and software engineers who want to understand networking as a systems discipline. The book should be self-contained, with enough technical detail to derive the important algorithms and reason about their behavior.

### **Proposed structure**

PROPOSED TABLE OF CONTENTS

**Part I — Building a Network**

1\. What Should a Network Do?

2\. The Architecture of the Internet

3\. Naming, Addressing, and Finding Things

4\. Switching and Forwarding

5\. Learning the Network: Distributed Routing

**Part II — Routing Across a Global Network**

6\. Routing Between Autonomous Systems

7\. When Routing Policies Interact

8\. Traffic Engineering: Making the Most of a Network

**Part III — Moving Data Reliably and Efficiently**

9\. Errors, Losses, and Reliability

10\. Transport Protocols and End-to-End Communication

11\. Congestion Control

12\. Queues, Scheduling, and Fairness

**Part IV — The Physical Network**

13\. From Bits to Physical Signals

14\. Sharing a Wireless Medium

15\. Inside a High-Speed Switch

**Part V — Security and Trust**

16\. Encryption and Secrecy

17\. Authentication, Identity, and Trust

**Part VI — Networks in Practice**

18\. What Happens When You Open a Website?

19\. Data Centers and Cloud Networks

20\. Content Delivery and the Edge

21\. When Networks Fail

This gives **21 chapters across six parts**. Chapters need not correspond one-to-one with lectures: some lectures cover several independent concepts, while others develop an idea over multiple meetings.

I would use three recurring kinds of questions throughout the book: short conceptual questions embedded in the exposition, longer design problems at the end of each chapter, and open-ended challenges where multiple answers may be defensible.

The 2026 quizzes introduce a particularly useful fourth category: **predict the behavior of a program or system that you designed yourself**. That is worth preserving as a distinctive feature of the book.

## **Detailed chapter plans**

Each chapter below identifies the relevant lectures, its conceptual arc, the figures worth drawing, and candidate questions. Quiz references use the filenames you uploaded. The questions are paraphrased for planning purposes rather than reproduced verbatim.

# **Part I — Building a Network**

## **Chapter 1. What Should a Network Do?**

SOURCE: LECTURES 1, 2, 3

**Narrative:** Begin with the observation that the Internet supports radically different applications using essentially the same infrastructure. What must a network provide, and what should it deliberately leave to applications?

**Sections**

- The Internet as a machine built by many independent organizations.
- Applications and their requirements: web, streaming, conferencing, gaming, AR/VR, distributed computation.
- Throughput, latency, jitter, tail latency, reliability, and cost.
- Why optimizing one metric does not necessarily optimize user experience.
- The different goals of users, application developers, and network operators.
- Why networks are a systems-design problem rather than merely an algorithmic problem.

**Diagrams needed**

1. The Internet as interconnected independently operated networks.
2. A comparison of application traffic patterns: web bursts, continuous video, interactive messages, distributed computation.
3. Latency vs. throughput requirements for different applications.
4. A video buffer showing startup delay, playback, and rebuffering.

**Questions to discuss**

- Why does video account for such a large fraction of Internet traffic even though people do not spend most of their time watching video?
- Would a 1 Gbit/s link with 500 ms latency be better than a 10 Mbit/s link with 10 ms latency? For which applications?
- Why can a streaming service tolerate a relatively large delay but not frequent interruptions?
- Suppose a new satellite network offers much lower latency but substantially less bandwidth than fiber. Which applications should migrate?

**Existing question sources:** Quiz 3 2025, Q1 (LEO satellite versus edge deployment); Final 2024, Q1 (edge versus centralized computing).

## **Chapter 2. The Architecture of the Internet**

SOURCE: LECTURES 1, 2, 4

**Narrative:** Instead of beginning with the OSI model, start with a challenge: build an Internet using carrier pigeons. Discover the need for layering and minimal interfaces through the exercise.

**Sections**

- Direct links, shared links, and switched networks.
- Circuit switching and packet switching.
- The best-effort datagram abstraction.
- What IP promises—and what it does not.
- Why layers exist.
- Encapsulation and protocol headers.
- The end-to-end principle.
- The cost of providing guarantees inside the network.
- Protocol independence and the ability to introduce new technologies.

**Diagrams needed**

1. Fully connected network versus a switched network.
2. Circuit-switched and packet-switched traffic timelines.
3. Protocol stack and encapsulation/decapsulation.
4. Carrier-pigeon network with two villages, flight paths, and daily pigeon replenishment.
5. Comparison of normal packet links and high-delay, intermittently available links.

**Questions to discuss**

- What assumptions does IP make about the underlying network?
- Could carrier pigeons carry IP packets?
- How would you maximize throughput and minimize latency with a limited number of pigeons?
- Would TCP and ordinary applications work efficiently over this network?
- What functionality belongs in the network, and what belongs at the endpoints?

**Existing question sources:** Quiz 1 2025, *Wingternet*, Q1–Q4 (pp. 1–4). This is an excellent extended opening case study and could anchor the entire chapter.&#x20;

quiz1-2025.pdf



## **Chapter 3. Naming, Addressing, and Finding Things**

SOURCE: LECTURES 1, 4, 22

**Narrative:** A computer joins a network and wants to communicate with another machine. What information does it need, and how does it discover that information?

**Sections**

- Names versus addresses.
- Flat addresses and hierarchical addresses.
- MAC addresses and IP addresses.
- IPv4 addressing and subnets.
- Address assignment and network configuration.
- DNS and the distributed naming hierarchy.
- Routing tables and longest-prefix matching.
- Aggregation of IP prefixes.
- Ports and the identification of application endpoints.

**Diagrams needed**

1. A computer joining a network, obtaining configuration, and resolving a domain.
2. MAC addresses versus IP addresses across multiple hops.
3. Hierarchical DNS resolution.
4. Binary prefix trie illustrating longest-prefix matching.
5. Prefix aggregation, showing several forwarding entries compressed into fewer entries.

**Questions to discuss**

- Why not simply use MAC addresses throughout the Internet?
- Why do we need DNS if computers already have IP addresses?
- Can a machine communicate before it has a DNS server?
- Given a routing table, where will a packet be forwarded?
- How can a routing table be compressed without changing its behavior?
- How should addresses be allocated to a village connected through an unusual physical network?

**Existing question sources:** Quiz 1 2025, Q4 and Q9–Q10; Quiz 1 2024, Q1–Q4 (TCP addresses and ports).

## **Chapter 4. Switching and Forwarding**

SOURCE: LECTURES 1, 4, 5, 17

**Narrative:** Connecting switches into a network is easy. Making packets go to the right place without circulating forever is harder.

**Sections**

- What a switch does.
- Forwarding versus routing.
- Flooding and learning.
- Ethernet bridging.
- Why forwarding loops occur.
- Spanning trees and the root election process.
- Distributed spanning-tree construction.
- Reacting to topology changes.
- Why spanning trees sacrifice some capacity.
- Alternatives to restricting forwarding to a tree.

**Diagrams needed**

1. Switch forwarding-table lookup.
2. Learning bridge: how source-address observations populate forwarding entries.
3. Packet looping around a triangle.
4. Step-by-step spanning-tree construction.
5. A physical topology with several redundant links and the active spanning tree.
6. Link failure and spanning-tree reconfiguration.

**Questions to discuss**

- Why can't we simply flood every packet?
- Why does a spanning tree solve the looping problem?
- If the network has a cycle, can we use all its links without creating loops?
- What happens if two switches temporarily disagree about the spanning tree?
- What happens if the root fails?
- Can a distributed protocol converge without synchronized clocks?

**Existing question sources:** Final 2024, Q12 (spanning tree); Quiz 1 2025, Q21 (comparing distributed routing algorithms).

## **Chapter 5. Learning the Network: Distributed Routing**

SOURCE: LECTURES 5, 6; ALSO 25

**Narrative:** A network should discover its own topology, choose good paths, and recover when links fail—without requiring a human to reconfigure every switch.

**Sections**

- Graph representation of a network.
- Shortest-path routing and link metrics.
- Distance-vector routing.
- Bellman-Ford updates.
- Count-to-infinity and routing loops.
- Link-state routing.
- Topology advertisements and flooding.
- Dijkstra's algorithm.
- Convergence, stale information, and asynchronous updates.
- Failure detection and recovery.
- Trade-offs between routing overhead, convergence speed, and path quality.

**Diagrams needed**

1. Weighted network graph with shortest-path tree.
2. Distance-vector updates over several rounds.
3. Count-to-infinity after a link failure.
4. Link-state advertisement propagation.
5. Comparison of distance-vector and link-state information held by routers.
6. Routing-table changes before and after a failure.
7. Failure detection timeline: heartbeat, timeout, advertisement, recomputation.

**Questions to discuss**

- Why does distance-vector routing suffer from count-to-infinity?
- Does link-state routing always converge, regardless of how link weights are defined?
- Can a routing protocol be both fast to converge and inexpensive in control traffic?
- How should a router distinguish a failed link from a temporarily delayed packet?
- After a link failure, which switches change their next hops?
- Can you predict the exact behavior of your own routing implementation?

**Existing question sources:** Quiz 1 2025, *Convergence* Q5–Q8; Quiz 1 2026, Q1–Q2 (routing-program behavior after a link failure); Quiz 2 2026, Q6 (response time of a student-designed network).

The 2026 questions suggest an especially strong interactive exercise: give readers a small network simulator, let them implement a routing algorithm, then ask them to predict how it reacts to failures.

# **Part II — Routing Across a Global Network**

## **Chapter 6. Routing Between Autonomous Systems**

SOURCE: LECTURES 7, 8

**Narrative:** Inside an organization, routing is largely an optimization problem. Across organizations, routing becomes a problem of incentives, business relationships, and independent decisions.

**Sections**

- Autonomous systems and administrative boundaries.
- Why shortest-path routing is insufficient between ASes.
- BGP route advertisements.
- AS paths and loop prevention.
- Customer-provider relationships.
- Peering relationships.
- Route export policies.
- Route selection and local preference.
- Multihoming.
- How interdomain routing differs from intradomain routing.

**Diagrams needed**

1. A graph of ASes with customer-provider and peer relationships.
2. BGP advertisement propagation.
3. Export policies: which routes are advertised to which neighbors.
4. Multiple paths with different economic costs.
5. Multihomed enterprise network.
6. A traceroute through several autonomous systems.

**Questions to discuss**

- Why would an AS deliberately choose a longer path?
- Why does an ISP advertise some routes to one neighbor but not another?
- What happens if an AS advertises a route that it cannot actually deliver?
- Can an AS influence the route taken by packets sent to it?
- What happens if every AS independently optimizes its own interests?

**Existing question sources:** Quiz 1 2024, BGP convergence questions; Quiz 1 2025, Q11; Final 2024, Q13.

## **Chapter 7. When Routing Policies Interact**

SOURCE: LECTURES 7, 8; ALSO 25

**Narrative:** Each autonomous system can make a perfectly reasonable local decision, yet the collection of decisions can fail to settle into a stable global configuration.

**Sections**

- BGP as a distributed decision process.
- Path preferences and policy dependencies.
- Stable routing assignments.
- Route flapping and persistent oscillations.
- Constructing oscillating examples.
- Dependency graphs.
- Sufficient conditions for stability.
- Economic constraints and their role in convergence.
- BGP misconfiguration and route hijacking.
- Why global coordination is difficult.

**Diagrams needed**

1. Three-AS cyclic preference example.
2. Sequence of route selections showing oscillation.
3. Policy dependency graph.
4. Stable versus unstable preference configurations.
5. A route leak or incorrect advertisement propagating across ASes.

**Questions to discuss**

- Can every AS make individually valid decisions while the network never converges?
- Construct path preferences that cause indefinite route flapping.
- Can changing just one preference eliminate the oscillation?
- Is an acyclic policy-dependency graph necessary for stability, or only sufficient?
- Can a protocol guarantee convergence without restricting what participants are allowed to prefer?

**Existing question sources:** Final 2024, Q5–Q6, which explicitly ask for examples of policies that cause route flapping and policies that guarantee stability. These would make an excellent pair of chapter-ending problems.

## **Chapter 8. Traffic Engineering: Making the Most of a Network**

SOURCE: LECTURES 9, 10; ALSO 23

**Narrative:** Once connectivity exists, the next question is how to use available capacity effectively.

**Sections**

- Traffic demand and traffic matrices.
- Bottleneck links.
- Load balancing.
- Equal-cost multipath routing (ECMP).
- Per-flow versus per-packet routing.
- Packet reordering.
- Multicommodity flow.
- Linear-programming formulations.
- Flow conservation and capacity constraints.
- Minimizing maximum link utilization.
- Optimizing against stale traffic measurements.
- Spare capacity, headroom, and resilience.

**Diagrams needed**

1. A network with traffic concentrated on one link despite spare capacity elsewhere.
2. Per-flow and per-packet multipath forwarding.
3. Traffic matrix and network topology.
4. Flow conservation at an intermediate switch.
5. Feasible capacity region for two competing flows.
6. Network utilization before and after traffic engineering.
7. Measurement/optimization/deployment loop showing the cost of stale information.

**Questions to discuss**

- Why can random load balancing perform poorly?
- When should packets from the same flow remain on the same path?
- Can a routing strategy with more available paths reduce application throughput?
- Formulate an LP that minimizes maximum link utilization.
- What if traffic changes faster than the optimization can finish?
- Is it ever rational to leave a link deliberately underutilized?

**Existing question sources:** Final 2024, Q7 (packet reordering under ECMP); Quiz 2 2026, Q6 (dynamic traffic rerouting); related traffic-engineering questions from the lectures.

# **Part III — Moving Data Reliably and Efficiently**

## **Chapter 9. Errors, Losses, and Reliability**

SOURCE: LECTURES 10, 12, 13

**Narrative:** Data can be corrupted, dropped, duplicated, delayed, or reordered. How can a system provide useful communication despite an unreliable underlying network?

**Sections**

- Corruption versus loss.
- Detecting corruption using redundancy.
- Codewords and Hamming distance.
- Parity and error-detecting codes.
- Error-correcting codes.
- Retransmission and acknowledgments.
- Sequence numbers.
- Detecting missing packets.
- Forward error correction versus retransmission.
- Deadlines and when retransmission is too slow.
- Reliability as an end-to-end property.

**Diagrams needed**

1. Codewords in Hamming space.
2. A parity-check example.
3. Packet loss and retransmission timeline.
4. Sequence-number gaps revealing a missing packet.
5. Forward error correction: original packets plus repair packet.
6. A graph comparing repair delay, redundancy overhead, and retransmission delay.

**Questions to discuss**

- How much redundancy is needed to detect or correct a given number of errors?
- Why can a receiver detect loss without knowing precisely when a packet was sent?
- When is retransmission preferable to error-correcting codes?
- What if an application needs a lost packet within 25 ms but RTT is 100 ms?
- Can adding redundancy improve useful application throughput even though it consumes bandwidth?

**Existing question sources:** Quiz 1 2025, *Faulty channel* Q12–Q17; Quiz 1 2026, Q5–Q6 (recovering a missing packet before its deadline); Quiz 2 2024, reliable-delivery section.

## **Chapter 10. Transport Protocols and End-to-End Communication**

SOURCE: LECTURES 2, 12, 14, 22

**Narrative:** Applications generally want to exchange messages or streams of bytes, not manage individual network packets.

**Sections**

- Transport-layer abstractions.
- UDP datagrams.
- TCP byte streams.
- Connections and sockets.
- TCP's three-way handshake.
- Sequence numbers and cumulative acknowledgments.
- Selective acknowledgments.
- Retransmission mechanisms.
- Timeouts and duplicate ACKs.
- Receiver-side flow control.
- Packet reordering and head-of-line blocking.
- QUIC and alternative transport abstractions.

**Diagrams needed**

1. TCP three-way handshake with addresses and ports.
2. Byte-stream segmentation into packets.
3. Cumulative ACK behavior after packet loss.
4. Selective acknowledgments.
5. Sender and receiver sliding windows.
6. Packet reordering and head-of-line blocking.
7. TCP and QUIC transport abstractions.

**Questions to discuss**

- How does a server distinguish two TCP connections from the same client?
- Why does TCP use both retransmission timeouts and duplicate ACKs?
- What breaks if only one of these mechanisms is available?
- Why do cumulative ACKs help when acknowledgments themselves are lost?
- Does reliable delivery necessarily imply ordered delivery?
- Which transport abstraction should a video call, file download, or chat application use?

**Existing question sources:** Quiz 1 2024, Q1–Q4; Quiz 2 2024, reliable-delivery section; Quiz 2 2025, Q6–Q11 (choosing transport abstractions); Final 2024, Q14–Q15.

## **Chapter 11. Congestion Control**

SOURCE: LECTURES 13, 14; ALSO 17

**Narrative:** Even if every sender behaves correctly, the aggregate traffic can exceed network capacity. How should independent senders discover and share that capacity?

**Sections**

- Why congestion occurs.
- Flow control versus congestion control.
- Bottleneck bandwidth and RTT.
- Bandwidth-delay product.
- Congestion windows.
- Queuing delay and packet loss.
- ACK-clocking.
- Additive Increase, Multiplicative Decrease (AIMD).
- Why AIMD tends toward a fair allocation.
- Multiplicative Increase, Additive Decrease (MIAD).
- Loss-based versus model-based congestion control.
- BBR.
- Specialized congestion control for known workloads.
- Performance, fairness, and stability.

**Diagrams needed**

1. Bottleneck link and queue.
2. Bandwidth-delay product represented as packets in flight.
3. Congestion-window sawtooth over time.
4. AIMD convergence in a two-flow rate-allocation plane.
5. AIMD versus MIAD trajectories.
6. Throughput versus queuing delay.
7. Congestion-control behavior in a data-center fabric.

**Questions to discuss**

- Why not increase the congestion window multiplicatively and decrease it additively?
- Does MIAD improve throughput? What happens to packet loss and fairness?
- Why is filling every queue not necessarily desirable?
- How does RTT affect the throughput of window-based protocols?
- Can a specialized congestion-control algorithm outperform a general-purpose one?
- If the network topology and workload are known in advance, what guarantees can we exploit?

**Existing question sources:** Quiz 2 2025, Q4 (MIAD versus AIMD); Quiz 2 2024, congestion-control section; Quiz 2 2026, Q4 (specialized congestion control for an AI-training network).

## **Chapter 12. Queues, Scheduling, and Fairness**

SOURCE: LECTURES 13, 14, 17, 21

**Narrative:** Once packets reach a bottleneck, somebody must decide who gets served first and who must wait.

**Sections**

- Why packet queues form.
- FIFO scheduling.
- Queue size and latency.
- Buffer overflow and packet drops.
- Bufferbloat.
- Active queue management.
- Per-flow scheduling.
- Fair queuing.
- Equal-throughput versus equal-airtime fairness.
- Traffic shaping and policing.
- Where fairness should be enforced.
- Interactions between scheduling and congestion control.

**Diagrams needed**

1. Packet arrivals and departures from a FIFO queue.
2. Queue occupancy over time during a burst.
3. Latency versus buffer size.
4. FIFO versus fair-queuing timelines.
5. Two wireless users with different link speeds.
6. Fair queues at input, virtual-output, and output stages of a switch.

**Questions to discuss**

- How much latency does a full 40 KB buffer add to a 2 Mbit/s link?
- Is equal throughput always fair?
- Should a slow Wi-Fi client receive more airtime to achieve equal throughput?
- If a client improves its link speed, who benefits?
- Does enforcing fairness only at switch outputs guarantee fairness among end-to-end flows?
- How should a switch prioritize latency-sensitive and throughput-sensitive applications?

**Existing question sources:** Quiz 2 2026, Q1 (queue depth and delay), Q2 (equal airtime), and Q5 (where to place fair queues). These are unusually well suited to a coherent sequence of worked examples.

# **Part IV — The Physical Network**

## **Chapter 13. From Bits to Physical Signals**

SOURCE: LECTURES 15, 16

**Narrative:** So far, packets have traveled over abstract links. Now examine what those links physically do, and what limits their capacity.

**Sections**

- Representing bits using physical signals.
- Signal transitions and clock recovery.
- Baud rate versus bit rate.
- Fourier decomposition and frequency-domain reasoning.
- Signal bandwidth.
- Noise and signal-to-noise ratio.
- Channel capacity.
- Electrical transmission.
- Optical fiber and propagation speed.
- Radio propagation.
- Frequency allocation and spectrum scarcity.
- Satellite communication.
- Latency versus bandwidth in terrestrial and satellite networks.

**Diagrams needed**

1. Digital bit sequence and corresponding electrical waveform.
2. Clock drift and bit-sampling errors.
3. Signal spectrum and occupied frequency band.
4. Channel capacity as a function of SNR.
5. Attenuation with distance.
6. Fiber versus free-space propagation paths.
7. Geostationary and low-Earth-orbit satellite networks.

**Questions to discuss**

- Does doubling the carrier frequency double the data rate?
- Which is more valuable: a 200 MHz spectrum allocation or a 300 MHz allocation at a higher carrier frequency, assuming identical propagation characteristics?
- Why can satellites sometimes provide lower latency than fiber?
- Why is satellite bandwidth generally more constrained?
- Can two nearby wireless networks reuse the same frequencies?
- How does increasing signal strength change channel capacity?

**Existing question sources:** Final 2024, Q2 (spectrum rights); Quiz 2 2024, physical-layer scenarios; Quiz 3 2025, Q1 (LEO satellites).

## **Chapter 14. Sharing a Wireless Medium**

SOURCE: LECTURES 15, 16, 21

**Narrative:** Wireless communication is not simply Ethernet without cables. The medium is shared, interference is spatial, and coordination is difficult.

**Sections**

- Shared spectrum and interference.
- Spatial reuse.
- Frequency-division and time-division multiplexing.
- Carrier sensing.
- Collisions and random access.
- CSMA and random backoff.
- Hidden terminals and exposed terminals.
- Centralized versus distributed scheduling.
- The cost of coordination.
- Predictable versus unpredictable traffic.
- Directional antennas and multiple antennas.
- Wireless fairness.
- Cellular and Wi-Fi design trade-offs.

**Diagrams needed**

1. Interference regions around wireless transmitters.
2. Hidden-terminal topology.
3. Exposed-terminal topology.
4. Time-division and frequency-division schedules.
5. Random backoff after collisions.
6. Centralized scheduler with multiple clients.
7. Spatial reuse across two separated transmitter-receiver pairs.
8. Equal airtime versus equal throughput.

**Questions to discuss**

- Why can't wireless devices simply transmit whenever they have data?
- When is a centralized MAC scheduler better than distributed contention?
- What information must a centralized scheduler know?
- What happens if the workload changes after the schedule is computed?
- When can two transmitter-receiver pairs safely use the same frequencies simultaneously?
- Why might equal airtime maximize aggregate throughput while producing unequal user throughput?

**Existing question sources:** Quiz 2 2025, Q1 (centralized MAC scheduler); Quiz 2 2024, physical-layer interference scenarios; Quiz 2 2026, Q2 (Wi-Fi airtime fairness).

## **Chapter 15. Inside a High-Speed Switch**

SOURCE: LECTURE 17; ALSO 9, 21, 23

**Narrative:** A switch looks simple from the outside: packets enter one port and leave another. Internally, forwarding at hundreds of gigabits per second creates difficult scheduling and memory problems.

**Sections**

- General-purpose CPUs versus specialized forwarding hardware.
- Packet parsing and forwarding-table lookup.
- Input ports and output ports.
- Switching fabrics and crossbars.
- Input queuing.
- Output queuing.
- Head-of-line blocking.
- Virtual output queues.
- Crossbar scheduling and matchings.
- Memory bandwidth and packet buffering.
- Programmable switches.
- The relationship between hardware architecture and network-level performance.

**Diagrams needed**

1. Complete switch pipeline from ingress to egress.
2. Crossbar connecting input and output ports.
3. Input-queued switch with head-of-line blocking.
4. Virtual output queues.
5. Competing crossbar matchings.
6. Fairness mechanisms at different queue locations.
7. Hardware processing time versus software processing time.

**Questions to discuss**

- Why can't a high-speed switch simply forward every packet through a general-purpose CPU?
- Why does input queuing create head-of-line blocking?
- How do virtual output queues improve utilization?
- Can a locally fair crossbar produce globally unfair flow allocations?
- Where should fair queues be placed?
- Is a more sophisticated forwarding algorithm worth its additional computation time?

**Existing question sources:** Quiz 2 2025, switching questions Q12–Q15; Quiz 2 2026, Q5 (fairness at different switch queue locations).

# **Part V — Security and Trust**

## **Chapter 16. Encryption and Secrecy**

SOURCE: LECTURES 18, 19

**Narrative:** Networks allow packets to pass through machines owned by strangers. How can two endpoints communicate privately over infrastructure they do not trust?

**Sections**

- Threat models: eavesdropping, modification, and traffic analysis.
- What encryption protects.
- One-time pads.
- Perfect secrecy.
- Why one-time pads are difficult to use in practice.
- Symmetric-key cryptography.
- AES and block encryption.
- Why encryption must be reversible.
- Computational security.
- Key distribution.
- Public-key cryptography.
- RSA and modular arithmetic.
- Establishing shared secrets.

**Diagrams needed**

1. Alice and Bob communicating through an untrusted intermediary.
2. One-time-pad XOR encryption.
3. Valid and invalid reversible transformations.
4. AES block-encryption structure at a conceptual level.
5. Symmetric-key encryption versus public-key encryption.
6. RSA key generation and encryption/decryption operations.
7. Public-key exchange followed by symmetric encryption.

**Questions to discuss**

- Why is a one-time pad perfectly secret?
- Why can't the same one-time-pad key safely be reused?
- Why must each transformation in a block cipher be reversible?
- What happens if we add an AND operation to AES?
- Why is public-key cryptography useful even when symmetric encryption is faster?
- Does encrypting a message prevent an attacker from replacing it?

**Existing question sources:** Quiz 2 2025, Q2–Q3 (modifying AES with arithmetic and bitwise operations); Quiz 2 2026, Q3 (secure encryption and authentication).

## **Chapter 17. Authentication, Identity, and Trust**

SOURCE: LECTURES 19, 21, 24

**Narrative:** Encryption solves only part of the problem. A stranger can give you a public key and claim to be your bank. How do you know whom you are talking to?

**Sections**

- Secrecy versus authentication.
- Man-in-the-middle attacks.
- Digital signatures.
- Challenge-response authentication.
- What proving possession of a private key establishes.
- What it does not establish.
- Certificate authorities.
- Certificate chains and trust anchors.
- Domain ownership validation.
- Cryptographic hash functions.
- Integrity and authenticity.
- Content integrity for externally loaded resources.
- Practical limitations of trust infrastructures.

**Diagrams needed**

1. Man-in-the-middle key-substitution attack.
2. Challenge-response authentication.
3. Certificate chain from server to root CA.
4. Public-key possession versus identity verification.
5. Hash-based content-integrity check.
6. Browser loading a script from a CDN and verifying its integrity.

**Questions to discuss**

- A stranger claims to be Alice and proves possession of the private key corresponding to a public key they supplied. Have they proved they are Alice?
- Can two strangers establish an authenticated, encrypted connection without previously trusting any keys?
- What changes if a man-in-the-middle attack is impossible?
- How does a browser determine whether to trust a website's certificate?
- Why is a hash useful when loading JavaScript from a CDN?
- Does a cryptographic hash by itself authenticate the source of a message?

**Existing question sources:** Final 2024, Q3–Q4 (CDN integrity and secure authenticated connections); Quiz 2 2026, Q3 (public-key identity and secure encryption).

# **Part VI — Networks in Practice**

## **Chapter 18. What Happens When You Open a Website?**

SOURCE: LECTURES 1, 4, 12, 19, 22

**Narrative:** This should be a synthesis chapter. Follow one webpage request from a user's action to the completed browser rendering, revisiting the concepts developed earlier.

**Sections**

- Joining a Wi-Fi network.
- Obtaining an IP address and other configuration.
- Resolving a domain name.
- Determining the next hop.
- Forwarding through the network.
- Establishing a transport connection.
- Establishing a secure connection.
- Sending an HTTP request.
- Receiving HTML.
- Loading dependent resources.
- Executing JavaScript.
- Browser isolation and sandboxing.
- Measuring page-load performance.
- Caching and repeated requests.

**Diagrams needed**

1. End-to-end sequence diagram of a webpage load.
2. Packet header transformations across the stack.
3. DNS, transport, security, and HTTP exchanges on one timeline.
4. HTML dependency graph.
5. Browser resource waterfall.
6. Browser sandbox and isolation boundaries.

**Questions to discuss**

- What must happen before the browser can send its first HTTP request?
- How many network round trips are required before useful content arrives?
- Why does a webpage often require multiple requests?
- Why might a page load slowly even when the user's connection has high bandwidth?
- What would happen if the DNS server were unavailable?
- Why can websites run untrusted JavaScript without obtaining unrestricted access to the user's machine?

**Existing question sources:** Quiz 1 2024, TCP handshake questions; Final 2024, Q3 (script integrity); Quiz 3 2025, social-media resource-loading questions.

This is also a good place for a practical exercise using packet captures and browser developer tools.

## **Chapter 19. Data Centers and Cloud Networks**

SOURCE: LECTURES 17, 23; ALSO 9, 11–14

**Narrative:** A data-center network is a different environment from the global Internet: its topology, workload, hardware, and administration can often be controlled by one organization.

**Sections**

- Why data centers exist.
- Centralized versus geographically distributed computing.
- Cloud computing and resource sharing.
- Data-center network topologies.
- Clos networks.
- High-bandwidth communication between machines.
- ECMP and multipath routing.
- Data-center traffic patterns.
- Congestion control for tightly coupled computation.
- GPU clusters and AI training.
- Multi-tenant isolation.
- Security boundaries and firewalls.
- Operational cost and manageability.

**Diagrams needed**

1. Data-center rack, top-of-rack switch, and aggregation network.
2. Clos/fat-tree topology.
3. Multiple equal-cost paths between servers.
4. Distributed AI training communication pattern.
5. Traffic bursts from synchronized workers.
6. Tenant isolation using virtual networks.
7. Centralized versus distributed compute deployment.

**Questions to discuss**

- Why is a Clos topology attractive in a data center?
- Why does packet reordering matter for ECMP?
- How should congestion control change if the entire topology and workload are known?
- Why might AI training benefit from centralization while interactive applications benefit from edge deployment?
- What is the cost of moving computation farther from users?
- How should a provider isolate traffic belonging to different customers?

**Existing question sources:** Final 2024, Q1 and Q7; Quiz 2 2026, Q4 (AI-training congestion control).

## **Chapter 20. Content Delivery and the Edge**

SOURCE: LECTURES 1, 23, 24

**Narrative:** Sometimes the best way to improve network performance is not to improve the network at all, but to move the content or computation closer to the user.

**Sections**

- Why geographic distance matters.
- Content delivery networks.
- Caching at the edge.
- Popular versus unpopular content.
- Cache placement and replication.
- Cache eviction.
- DNS-based request routing.
- Application-level redirection.
- Anycast and network-level routing choices.
- Edge computing.
- Cost of replication versus cost of communication.
- Content-addressed storage.
- Named Data Networking.
- Distributed hash tables.
- Alternative Internet architectures.

**Diagrams needed**

1. Centralized content delivery versus CDN deployment.
2. CDN cache hierarchy.
3. Geographic server selection.
4. DNS-based redirection.
5. Content popularity distribution and caching decisions.
6. Content-addressed retrieval.
7. Distributed hash table ring.
8. Host-addressed versus content-addressed communication.

**Questions to discuss**

- Why should popular videos be cached near users?
- Why might caching a rarely watched video globally be wasteful?
- Should a remotely rendered game use edge computing?
- If satellites offer low latency, does that eliminate the need for CDNs?
- Why is content-addressed networking attractive?
- Could the Internet be redesigned so that packets identify the desired content rather than the destination machine?

**Existing question sources:** Final 2024, Q1 (edge versus centralized deployments); Quiz 3 2025, Q1 and the social-media CDN/resource-placement questions.

## **Chapter 21. When Networks Fail**

SOURCE: LECTURES 1, 5–8, 23, 25

**Narrative:** The final chapter returns to the central theme: complex systems behave in ways that are difficult to predict from their individual components.

**Sections**

- Why complex networks fail.
- Physical failures versus configuration failures.
- Partial failures.
- Routing black holes and loops.
- BGP misconfigurations and route hijacks.
- DDoS attacks.
- Rate limiting and traffic filtering.
- Diagnosing performance anomalies.
- Logs, metrics, and packet traces.
- Correlation versus causation.
- Hypothesis-driven debugging.
- Retries and feedback loops.
- Metastable failures.
- Why rollback can be difficult.
- Recovery mechanisms.
- Designing networks for operability and resilience.

**Diagrams needed**

1. Routing black hole caused by inconsistent forwarding decisions.
2. A failure propagating through dependent services.
3. Normal load versus DDoS traffic.
4. Feedback loop: overload, timeouts, retries, greater overload.
5. Metastable failure showing a system remaining overloaded after the original trigger disappears.
6. Failure-detection and recovery timeline.
7. Debugging decision tree comparing competing hypotheses.

**Questions to discuss**

- Can a network fail even when every physical link is working?
- Why might a configuration error be harder to recover from than a broken cable?
- How can retries make a temporary overload permanent?
- Why might rolling back a software change fail to restore service?
- How can you determine whether a performance problem comes from routing, congestion, application behavior, or hardware?
- What experiments would distinguish a routing failure from a congestion-control failure?
- How should an operator decide whether to intervene in a system that may eventually recover on its own?

**Existing question sources:** Quiz 1 2026, Q1–Q2 (failure recovery); Quiz 2 2026, Q6 (reaction time); Final 2024, BGP questions.

This should conclude with a larger design exercise in which the reader must diagnose a failure using partial observations, rather than being told which protocol is broken.

# **How I would use the questions**

The quizzes are valuable because they are largely **design and reasoning exercises**, rather than standard textbook recall questions. I would preserve that character.

## **Four kinds of questions**

| Type                 | Placement                | Purpose                                                       |
| -------------------- | ------------------------ | ------------------------------------------------------------- |
| Think about it       | Within the text          | Introduce a design problem before revealing the solution      |
| Check your reasoning | After a major concept    | Test understanding of assumptions and consequences            |
| Design challenge     | End of chapter           | Require readers to propose or modify a system                 |
| Systems laboratory   | End of selected chapters | Experiment with implementations and explain observed behavior |

For example, the *Wingternet* problem could start Chapter 2 before the reader has learned the IP abstraction. The text would then progressively introduce the principles necessary to solve it. At the end, the original question could be revisited in full.

The MIAD problem in Quiz 2 2025 is another strong example: rather than immediately presenting AIMD and explaining its benefits, ask why multiplicative increase and additive decrease might be a bad idea. The reader can discover some of the motivation for AIMD.

## **Particularly strong existing problems**

These are the problems I would prioritize for substantial worked examples, illustrations, and discussion.

| Problem                                               | Source             | Proposed chapter |
| ----------------------------------------------------- | ------------------ | ---------------- |
| Wingternet: IP over carrier pigeons                   | Quiz 1 2025, Q1–Q4 | 2                |
| Predict routing changes after a link failure          | Quiz 1 2026, Q1–Q2 | 5                |
| Drone network with interactive and bulk traffic       | Quiz 1 2026, Q3–Q4 | 1 or 2           |
| Routing convergence under unusual link metrics        | Quiz 1 2025, Q5–Q8 | 5                |
| Constructing BGP routing oscillations                 | Final 2024, Q5–Q6  | 7                |
| Packet reordering under ECMP                          | Final 2024, Q7     | 8 or 19          |
| Recovering packets before a deadline                  | Quiz 1 2026, Q5–Q6 | 9                |
| MIAD versus AIMD                                      | Quiz 2 2025, Q4    | 11               |
| Congestion control specialized for AI training        | Quiz 2 2026, Q4    | 11               |
| Queue depth versus application latency                | Quiz 2 2026, Q1    | 12               |
| Equal throughput versus equal airtime                 | Quiz 2 2026, Q2    | 12 or 14         |
| Centralized versus distributed MAC                    | Quiz 2 2025, Q1    | 14               |
| Where should fair queues be placed?                   | Quiz 2 2026, Q5    | 15               |
| Modifying AES with irreversible operations            | Quiz 2 2025, Q2–Q3 | 16               |
| Authentication of a stranger's public key             | Quiz 2 2026, Q3    | 17               |
| Secure communication with different trust assumptions | Final 2024, Q4     | 17               |
| CDN versus centralized deployment                     | Final 2024, Q1     | 20               |
| LEO satellites versus edge computing                  | Quiz 3 2025, Q1    | 20               |
| Network reaction to a changing workload               | Quiz 2 2026, Q6    | 8 or 21          |

The 2026 quizzes are especially useful for showing that the answer to a systems question sometimes depends on the reader's own implementation. For a book, these could become exercises with supplied reference implementations or a small simulator.

# **Diagram strategy**

I would favor explanatory diagrams over decorative illustrations. Many networking concepts are fundamentally about time, topology, or resource allocation.

**Topology diagrams**

For routing, spanning trees, BGP, multipath forwarding, and failures. Reuse the same small network across multiple figures so readers can compare behaviors.

**Timelines and sequence diagrams**

For TCP, retransmissions, wireless access, routing convergence, and failures. Show exactly when messages are sent, received, or lost.

**Graphs and quantitative models**

For congestion control, queuing delay, channel capacity, fairness, and optimization. Use figures to make the mathematical behavior intuitive.

**Architectural cutaways**

For encapsulation, switch internals, browsers, data centers, and cryptographic protocols. Illustrate which component is responsible for each operation.

I would also use a consistent visual convention throughout: distinguish data packets from control messages, label delays explicitly, and retain the same node names when a topology appears in several successive figures.

# **Editorial decisions before drafting**

There are several choices worth making early.

**First, preserve the design-first teaching style.** A chapter should ideally begin with a problem whose solution motivates the protocol. The textbook should not merely state that TCP uses AIMD, for example; it should help the reader discover why a reasonable designer might arrive at AIMD.

**Second, distinguish universal principles from historically contingent protocols.** Concepts such as layering, feedback control, distributed convergence, and resource allocation are more durable than any particular implementation of BGP, TCP, or Wi-Fi. The protocols should be studied as concrete design choices, not as inevitable laws.

**Third, make assumptions explicit.** This is perhaps the most consistent theme across the quizzes. Each worked problem should specify what the system knows, what it controls, what can fail, and what objective it is optimizing.

**Fourth, preserve the unusual examples.** Carrier pigeons, drones, high-frequency trading, AI training, and competing autonomous systems are not distractions. They help expose assumptions that are otherwise hidden in conventional networking examples.

**Fifth, provide worked solutions separately.** I would put short answers to conceptual questions at the end of each chapter and detailed solutions to longer design challenges in a separate instructor companion or solutions appendix. This would allow the same book to serve both independent readers and courses.

## **Recommended drafting order**

I would not necessarily write the chapters in table-of-contents order. A good starting sequence is Chapters **2, 5, 7, 11, and 14**: layering, distributed routing, BGP stability, congestion control, and wireless access.

Those chapters contain some of the clearest design problems and would establish the book's style before the remaining material is written.

One important limitation of this plan: I have mapped the uploaded quizzes to chapters, but I have not yet made a complete, individually indexed inventory of every spontaneous in-class question and InstaPoll in the 41,106-line transcript. The chapter questions above combine identifiable quiz problems with proposed discussion questions. A more exhaustive extraction should preserve the original wording, lecture location, and surrounding explanation before final manuscript drafting.

**Overall recommendation:** Keep the 21-chapter structure as the working outline, but treat it as a book about *reasoning about networked systems*, using the Internet as the central example. That gives the material a distinctive identity beyond a standard computer networking textbook.
