# **Computer Networks — Lecture-by-Lecture Summary (Fall 2026)**

This summary follows the lecture transcripts in your uploaded file. Each lecture is organized into bullet points covering the main concepts, algorithms, design trade-offs, and examples discussed.

The transcript contains **23 labeled lectures (Lectures 1–25, with Lectures 11 and 20 missing)**. I'll preserve the original numbering rather than renumbering them.

## **Lecture 1 — Introduction to Computer Networks**

- **Course philosophy:** Understand not just how networks work, but why they are designed the way they are, what assumptions their designs make, and how to reason about alternative designs.
- **The Internet as a system:** A massive, evolving network of networks operated by thousands of independent organizations.
- **Application requirements:**
  - Web browsing: Low page-load latency.
  - Video streaming: High throughput, minimal rebuffering, and stable video quality.
  - Video conferencing: Low latency, roughly within 300 ms for natural conversation.
  - AR/VR: Very low latency (around 50 ms) and extremely low tail latency.
  - Distributed computing and AI training: High-bandwidth, low-latency communication between processors.
- **Stakeholder priorities:** Network operators care about cost and manageability; application developers want simple abstractions; users want reliable connectivity.
- **Scalable connectivity:** Why directly connecting every computer to every other computer is impractical.
- **Switching:** Switches forward data between connected devices, making large networks possible.
- **Circuit switching vs. packet switching:** Reserved connections versus independently forwarded packets; why the Internet predominantly uses packet switching.
- **Course assignments:** Network simulation, routing, performance optimization, traffic analysis, and competitive autonomous-system design.
- **Assessment philosophy:** Quizzes emphasize reasoning, assumptions, adversarial scenarios, and design trade-offs rather than factual memorization.

## **Lecture 2 — Network Architecture and Layering**

- **Best-effort delivery:** The Internet attempts to deliver packets but does not guarantee successful delivery.
- **Why best effort?** Providing universal delivery guarantees would require additional coordination, resource reservation, and complexity.
- **Switches and buffering:** How switches forward packets, why contention occurs, and the need for queues or flow control.
- **Layered architecture:** Dividing networking functionality into independent layers.
- **Network layer:** Provides communication between machines through packet forwarding.
- **Transport layer:** Provides communication between processes, with different service abstractions.
- **TCP vs. UDP:** Reliable, ordered byte streams versus best-effort datagrams.
- **Application layer:** Defines how applications interpret the exchanged bytes.
- **End-to-end principle:** Why functionality such as reliability and encryption can often be implemented at endpoints rather than inside the network.
- **Encapsulation:** Layers add and remove protocol headers.
- **Modularity and evolution:** Benefits of changing individual layers independently, and the difficulty of upgrading protocols that require global agreement.
- **Sockets and ports:** How applications establish connections and exchange data.
- **Design exercise:** Using carrier pigeons as an alternative communication network to explore reliability and routing assumptions.

## **Lecture 3 — Evaluating System Designs and LLM Explanations**

- **Case study:** Why video platforms may discard previously downloaded video segments, forcing users to download them again when seeking backward.
- **Caching and buffering:** Distinguishing forward playback buffers from previously watched video.
- **RAM vs. disk:** Storage capacity, performance, and whether keeping recently watched segments is practical.
- **Browser vs. application responsibility:** Determining whether cache retention is controlled by browser internals or website JavaScript.
- **Eviction policies:** How memory pressure and implementation-specific behavior can influence caching.
- **Experiment design:** Using observable playback behavior to test hypotheses about cache retention.
- **Critically evaluating LLMs:** Identifying unsupported claims, challenging assumptions, and requesting evidence rather than accepting plausible explanations.
- **General lesson:** Use background knowledge and experiments to distinguish actual engineering constraints from speculative explanations.

## **Lecture 4 — Naming, Addressing, and Network Discovery**

- **Review of encapsulation:** Ethernet, IP, and transport headers are added by sending hosts and processed by the appropriate layers.
- **Ports and process identification:** How transport protocols deliver data to the correct application.
- **Naming vs. addressing:** Human-readable names, network addresses, and their different purposes.
- **Scalable name allocation:** Avoiding naming collisions and distributing responsibility for assigning names.
- **Ethernet/MAC addresses:** Flat addresses used for local communication.
- **IP addresses:** Addresses used to reach machines across interconnected networks.
- **Address discovery:** How a newly connected machine discovers or obtains the information needed to communicate.
- **DNS:** Mapping domain names to IP addresses through a distributed naming system.
- **Shared media:** Communication over a common medium and the need to coordinate transmissions.
- **Decentralization:** Why networks should continue functioning when individual components or management services fail.

## **Lecture 5 — Ethernet Bridging and Spanning Trees**

- **Ethernet forwarding:** How bridges and switches connect multiple local network segments.
- **Broadcasting and flooding:** Sending packets across multiple links when the destination or topology is not yet known.
- **Routing loops:** Why cycles in a network can cause packets to circulate indefinitely.
- **Spanning trees:** Selecting a connected, loop-free subset of links.
- **Distributed spanning-tree construction:** How switches coordinate to select a root and determine which links should be active.
- **Root selection:** Using switch identifiers to select a common root.
- **Logical time and sequence numbers:** Why distributed protocols can often use logical counters rather than synchronized physical clocks.
- **Topology changes:** How adding or removing switches can change the selected spanning tree.
- **Convergence:** How a distributed network eventually reaches a consistent configuration.
- **Trade-offs:** Spanning trees simplify forwarding and prevent loops but leave some physical links unused.

## **Lecture 6 — Shortest-Path Routing Algorithms**

- **Routing as a graph problem:** Modeling switches as vertices and links as weighted edges.
- **Shortest paths:** Choosing routes according to metrics such as hop count, delay, or cost.
- **Routing metrics:** Limitations of representing complex network objectives as sums of link weights.
- **Distance-vector routing:** Each router advertises its estimated distance to destinations to its neighbors.
- **Bellman-Ford-style updates:** Routers iteratively improve route estimates using neighbors' information.
- **Distributed convergence:** How information propagates through a network without a central controller.
- **Link failures:** Updating routes when previously available paths disappear.
- **Count-to-infinity problem:** How routers can repeatedly reinforce outdated routes after a failure.
- **Link-state routing:** Distributing topology information so routers can compute paths using a common graph.
- **Message ordering and flooding:** How asynchronous message arrival affects distributed algorithms.
- **Trade-offs:** Communication overhead, convergence time, stale information, and routing correctness.

## **Lecture 7 — Interdomain Routing and BGP**

- **Autonomous systems (ASes):** Networks independently operated by different organizations.
- **Intradomain vs. interdomain routing:** Routing inside one network versus routing across independently managed networks.
- **Border Gateway Protocol (BGP):** The protocol used to advertise routes between autonomous systems.
- **Routing policy:** Why the best route is not necessarily the shortest or fastest route.
- **Economic relationships:** How payment, business agreements, and traffic policies influence routing decisions.
- **Route advertisements:** How ASes communicate which destinations they can reach.
- **Path-vector routing:** Advertising the sequence of autonomous systems on a route.
- **Loop prevention:** Using AS paths to detect routes that would return through the same AS.
- **BGP failures:** How incorrect route announcements can cause large-scale outages.
- **Diagnostics:** Using tools such as `traceroute` to examine the path taken through a network.
- **Design trade-off:** Allowing independent organizations to control their routing policies while maintaining global connectivity.

## **Lecture 8 — BGP Policy, Stability, and Routing Oscillations**

- **BGP route selection:** Choosing between routes offered by different neighboring autonomous systems.
- **Multihoming:** Connecting an organization to multiple upstream networks for redundancy or performance.
- **Policy flexibility:** How ASes express preferences that do not correspond to shortest paths.
- **Routing convergence:** Whether repeated route updates eventually produce a stable routing configuration.
- **Routing oscillations:** Situations where independent route preferences cause routes to change indefinitely.
- **Policy dependency graphs:** Representing dependencies between routing preferences.
- **Acyclicity and stability:** Why certain acyclic policy structures guarantee the absence of oscillations.
- **Sufficient vs. necessary conditions:** A condition can guarantee stability without being required for every stable network.
- **DNS and reachability:** How name resolution interacts with the ability to reach a destination.
- **Sudden demand spikes:** Examples of popular sites becoming overloaded after major events.
- **General lesson:** Local decisions can interact to produce unexpected global behavior.

## **Lecture 9 — Traffic Engineering and Network Optimization**

- **Traffic engineering:** Deciding how to distribute traffic across available network links.
- **Load balancing:** Spreading traffic across servers or paths to avoid concentrated load.
- **Birthday paradox:** Why random allocation can produce collisions even when many alternatives are available.
- **Multipath routing:** Splitting traffic between different paths to increase utilization.
- **Per-packet vs. per-flow routing:** Trade-offs between fine-grained load balancing and keeping packets of a flow on the same path.
- **Packet reordering:** How different path delays can interfere with transport protocols.
- **Traffic matrices:** Representing how much traffic each source wants to send to each destination.
- **Centralized optimization:** Using network-wide measurements to choose routes.
- **Measurement staleness:** A more sophisticated optimization may be less useful if the traffic has changed by the time it finishes.
- **Linear programming:** Formulating traffic allocation using flow variables, conservation constraints, and link capacities.
- **Link utilization:** Why operating links near full capacity can create large delays.
- **Headroom and failure tolerance:** Reserving spare capacity for traffic bursts and link failures.

## **Lecture 10 — Linear Programming and Error-Correcting Codes**

- **Multicommodity flow optimization:** Modeling multiple source-destination demands sharing the same network.
- **Flow conservation:** Ensuring that traffic entering and leaving intermediate nodes is balanced.
- **Capacity constraints:** Ensuring the sum of traffic on a link does not exceed its capacity.
- **Optimization objectives:** Using linear programming to select efficient traffic allocations.
- **Algorithmic complexity:** Polynomial-time solvability of linear programs versus the practical behavior of common solvers.
- **Introduction to error detection:** Recognizing corrupted information by restricting which bit strings are valid.
- **Codewords and codebooks:** Representing messages using selected bit patterns.
- **Hamming distance:** Counting the bit positions in which two codewords differ.
- **Error detection vs. correction:** How minimum codeword distance determines the errors that can be detected or corrected.
- **Redundancy:** Trading transmission efficiency for greater resilience to corruption.
- **Parity bits:** Using XOR to detect certain bit errors.
- **Coding efficiency:** How the number and length of valid codewords affect the amount of information transmitted.

## **Lecture 11 — Not Present**

No Lecture 11 section appears in the uploaded transcript.

## **Lecture 12 — Reliable Transport, TCP, and Flow Control**

- **Transport abstractions:** Differences between message-oriented communication and reliable byte streams.
- **TCP sequence numbers:** Identifying byte positions in a transmitted stream.
- **Acknowledgments:** How receivers communicate which data has arrived.
- **Cumulative ACKs:** Acknowledging all bytes up to a particular sequence number.
- **Lost acknowledgments:** Why cumulative acknowledgments are useful when ACK packets themselves disappear.
- **Retransmissions:** Recovering data that was lost during transmission.
- **Duplicate ACKs:** Using repeated acknowledgment numbers as evidence of missing data.
- **Selective acknowledgments:** Reporting additional successfully received byte ranges.
- **Flow control:** Preventing a fast sender from overwhelming a slow receiver.
- **Receive windows:** Advertising available buffer capacity.
- **Polling vs. interrupts:** Alternative ways to notify software that data has arrived.
- **Round-trip time:** How delays and asymmetric network paths affect transport behavior.

## **Lecture 13 — Congestion Control Fundamentals**

- **Congestion vs. flow control:** Congestion control protects the network, while flow control protects the receiver.
- **Network bottlenecks:** Links whose available capacity limits the transmission rate.
- **Multiple bottlenecks:** How traffic entering at different points can create congestion at several links.
- **Queues:** Packets accumulate when arrival rates exceed service rates.
- **Congestion window (**`cwnd`**):** Limiting the amount of unacknowledged data in flight.
- **Bandwidth-delay product:** Relating link capacity and round-trip time to the amount of data needed in flight.
- **Window size and queue occupancy:** How increasing the congestion window beyond the bandwidth-delay product creates queues.
- **Packet loss as feedback:** Using dropped packets as an indication of congestion.
- **Sawtooth behavior:** Repeatedly increasing the sending rate until loss occurs, then reducing it.
- **Throughput-latency trade-off:** Large queues can sustain throughput but increase delay.
- **Steady-state vs. transient behavior:** Why analyzing stable operation is easier than modeling every moment of a changing network.

## **Lecture 14 — TCP Congestion Control and Modern Alternatives**

- **ACK-clocked transmission:** Using arriving acknowledgments to regulate outgoing packets.
- **Congestion-window dynamics:** How the sending window affects throughput, RTT, and queue size.
- **Additive Increase, Multiplicative Decrease (AIMD):** Increasing the congestion window gradually and cutting it after congestion.
- **TCP congestion avoidance:** Why AIMD produces recurring cycles of growth and reduction.
- **Queue buildup:** How aggressive transmission increases latency before packet loss.
- **Limitations of loss-based congestion control:** Loss does not always accurately represent available capacity.
- **BBR:** A congestion-control approach developed by Google that estimates bottleneck bandwidth and round-trip time.
- **Comparing algorithms:** Different approaches to efficiency, responsiveness, fairness, and delay.
- **Packet reordering and buffering:** How out-of-order data affects transport-layer delivery.
- **Head-of-line blocking:** Later data may be delayed because earlier bytes have not arrived.
- **Receiver-side flow control:** Keeping unacknowledged data within advertised buffer limits.
- **Hop-by-hop flow control:** Extending similar principles to communication between neighboring network devices.

## **Lecture 15 — Physical Layer, Signals, and Transmission Media**

- **Physical-layer communication:** Converting digital information into signals that travel through physical media.
- **Clock synchronization:** How senders and receivers agree on the timing of transmitted bits.
- **Clock drift:** Why independent clocks can cause receivers to interpret bit boundaries incorrectly.
- **Line encoding:** Representing digital bits using transitions in physical signals.
- **Baud rate vs. bit rate:** The relationship between signaling speed and information transmitted.
- **Electrical signal integrity:** How physical properties of wires and circuits limit transmission rates.
- **Optical fiber:** Using light to transmit data over long distances with low attenuation.
- **Frequency-domain representation:** Understanding signals using Fourier analysis.
- **Bandwidth and modulation:** How changing a carrier signal spreads information across frequencies.
- **Wireless spectrum:** How frequency allocation and regulation affect wireless technologies.
- **5G:** The roles of spectrum allocation, engineering improvements, and practical deployment constraints.
- **Millimeter-wave communication:** Why high-frequency wireless communication has important range and propagation limitations.
- **Satellite networking:** Comparing geostationary satellites with low-Earth-orbit satellites.
- **Physical trade-offs:** Bandwidth, propagation delay, transmission power, attenuation, and infrastructure cost.

## **Lecture 16 — Wireless Networks and Medium Access Control**

- **Wireless communication:** Sharing a physical transmission medium between multiple devices.
- **Channel capacity:** How bandwidth, noise, and signal quality constrain achievable data rates.
- **Signal strength:** Improving communication by increasing transmission power or reducing distance.
- **Directional antennas:** Concentrating transmitted energy toward particular receivers.
- **Multiple antennas:** Using spatial properties of radio signals to improve communication.
- **Optical vs. wireless links:** Why optical fiber remains essential for high-capacity Internet infrastructure.
- **Medium access control (MAC):** Deciding which device may transmit over a shared channel.
- **Centralized scheduling:** Having a controller allocate transmission opportunities.
- **Distributed access:** Allowing devices to coordinate without a central scheduler.
- **Collisions:** What happens when multiple devices transmit simultaneously.
- **Random backoff:** Reducing repeated collisions by waiting randomized intervals.
- **Carrier sensing:** Checking whether a channel is busy before transmitting.
- **Collision detection limitations:** Why detecting collisions is difficult when a radio is transmitting.
- **Design trade-offs:** Coordination overhead, fairness, utilization, and robustness.

## **Lecture 17 — Queuing, Scheduling, and Switch Architecture**

- **Buffer sizing:** Determining how much packet storage a switch needs.
- **Traffic bursts:** Why queues are useful even when average arrival rates are below link capacity.
- **Congestion control interactions:** How buffer size influences the behavior of AIMD and other algorithms.
- **Fairness:** Sharing limited network resources among competing flows.
- **Fair queuing:** Scheduling packets to give flows controlled shares of link capacity.
- **Rate limiting:** Restricting individual flows to prevent them from overwhelming the network.
- **Traffic shaping and policing:** Controlling the rate at which traffic enters the network.
- **Hardware acceleration:** Why specialized networking hardware can outperform general-purpose CPUs.
- **Switch internals:** How packets move from input ports to output ports.
- **Input and output queues:** Different places where packets can wait inside a switch.
- **Switch scheduling:** Choosing which input ports can send to which outputs.
- **Memory bandwidth:** How packet storage and movement can become performance bottlenecks.
- **Programmable switches:** Allowing some packet-processing behavior to be implemented in software-defined rules or programs.
- **Hardware/software trade-offs:** Flexibility versus throughput, latency, and implementation cost.

## **Lecture 18 — Network Security and Symmetric Cryptography**

- **Security and privacy:** Protecting network communication against observation and manipulation.
- **Traffic analysis:** How information about communication can leak even when message contents are hidden.
- **Correlation attacks:** Inferring communication relationships by comparing traffic entering and leaving different points.
- **Encryption:** Transforming readable messages into ciphertext.
- **One-time pad:** Encrypting a message by XORing it with a uniformly random secret key.
- **Perfect secrecy:** Why a properly used one-time pad reveals no information about the plaintext.
- **Key distribution:** The difficulty of securely sharing secret keys before communication.
- **Compromised keys:** What happens when an attacker obtains the encryption key.
- **Secret sharing:** Splitting information across multiple independently delivered pieces.
- **Symmetric encryption:** Using a shared secret for encryption and decryption.
- **AES:** A practical standardized symmetric encryption algorithm.
- **Reversible transformations:** Why encryption operations must permit decryption.
- **Computational security:** The distinction between theoretically perfect secrecy and security based on computational difficulty.
- **Discrete logarithms:** Introducing mathematical problems that are easy in one direction but difficult to reverse.

## **Lecture 19 — Public-Key Cryptography, RSA, and Authentication**

- **Modular arithmetic:** Performing calculations modulo an integer.
- **Public-key cryptography:** Using mathematically related public and private keys.
- **Key generation:** Creating a key pair using randomness and mathematical structure.
- **Asymmetric encryption:** Encrypting with a public key so that only the holder of the private key can decrypt.
- **Key establishment:** Using public-key encryption to establish a shared secret for subsequent communication.
- **Man-in-the-middle attacks:** Why encryption alone does not establish the identity of the communicating party.
- **Authentication:** Proving that a public key belongs to the intended organization or person.
- **Digital signatures:** Using private keys to produce evidence that can be verified with public keys.
- **Certificates:** Binding identities to public keys using trusted signatures.
- **RSA:** A public-key cryptosystem based on modular exponentiation.
- **Euler's totient function:** Mathematical properties used to construct and explain RSA.
- **Security assumptions:** The difference between performing the intended cryptographic operation and solving the underlying hard mathematical problem.

## **Lecture 20 — Not Present**

No Lecture 20 section appears in the uploaded transcript.

## **Lecture 21 — Network Fairness and Cryptographic Trust**

- **Fairness in shared networks:** How different resource-allocation rules produce different outcomes.
- **Throughput fairness:** Giving competing users equal transmission rates.
- **Airtime fairness:** Giving wireless users equal amounts of transmission time.
- **Wireless rate differences:** Why slow and fast wireless clients can have different outcomes under equal-airtime and equal-throughput policies.
- **Defining fairness:** Why fairness is a design objective rather than a single universal rule.
- **Resource-allocation exercises:** Reasoning about feasible capacity and fairness constraints.
- **Cryptographic computation costs:** Practical performance differences between public-key and symmetric-key operations.
- **RSA key generation:** Why generating cryptographic keys involves computational work.
- **Certificate authorities (CAs):** Trusted entities that attest to the relationship between identities and public keys.
- **Certificate validation:** How a service can demonstrate control over an address or name.
- **Trust limitations:** Why control over an address at one point in time may not imply permanent ownership.
- **Cryptographic hashes:** Computing a compact fingerprint of data.
- **Integrity verification:** Comparing hashes to check whether files or messages have changed.
- **Practical example:** Using hashes to verify that two copies of a file have identical contents.

## **Lecture 22 — Putting the Protocol Stack Together: Web Browsing**

- **Connecting to a network:** What happens when a machine joins a new Wi-Fi network.
- **Initial network configuration:** How a machine obtains the addresses and information needed to communicate.
- **Ethernet and IP:** How local communication and network-wide addressing interact.
- **Transport headers:** Examining the information contained in TCP packets.
- **TCP options:** How additional transport features can be represented in headers.
- **Packet inspection:** Looking at real network traffic to understand protocol behavior.
- **Web requests:** How a browser communicates with a server to retrieve a webpage.
- **HTTP:** Requesting web resources from a server.
- **Webpage dependencies:** How an initial HTML document references additional resources.
- **Multiple resource requests:** Fetching images, scripts, and other objects needed to render a page.
- **HTML structure:** How the browser represents and interprets a document.
- **JavaScript execution:** Running website code inside the browser.
- **Browser security:** Why untrusted webpage code must execute in a restricted environment.
- **End-to-end example:** Following the interaction between network configuration, transport, application protocols, and browser rendering.

## **Lecture 23 — Data Centers and Cloud Networking**

- **Data centers:** Large-scale computing facilities with substantial power, cooling, and networking infrastructure.
- **Geographic placement:** Why providers build data centers near customers, power supplies, and other infrastructure.
- **Latency and location:** Using network measurements to reason about where services are actually hosted.
- **Centralized computing:** Why certain workloads benefit from being run in large computing facilities.
- **Cloud computing:** Renting computing infrastructure instead of owning and operating it.
- **Public vs. private clouds:** Trade-offs in infrastructure ownership, control, cost, and operational complexity.
- **Elasticity:** Scaling computing resources up and down as demand changes.
- **Economies of scale:** Sharing infrastructure and operational expertise across many customers.
- **Distributed vs. centralized computation:** When computation can be performed independently and when it requires coordination.
- **AI training:** Why large-scale neural network training benefits from tightly interconnected computing resources.
- **Data-center congestion control:** Coordinating end hosts and switches to achieve high performance.
- **Network isolation:** Preventing traffic from one customer or workload from interfering with another.
- **Firewalls:** Enforcing network-level security rules.
- **Defense in depth:** Using multiple security mechanisms even inside supposedly trusted networks.
- **Predictable performance:** Why customers may value consistent service more than maximum average throughput.

## **Lecture 24 — Content Delivery Networks and Named Data Networking**

- **Assignment competition:** Discussion of economic strategies, network performance, and agreements between autonomous systems.
- **Content Delivery Networks (CDNs):** Placing copies of content near the users who request it.
- **Why CDNs help:** Reducing latency and avoiding unnecessary transmission across long network paths.
- **Network cost reduction:** Serving content locally decreases the total amount of network capacity consumed.
- **Caching:** Storing frequently requested content at geographically distributed locations.
- **CDN limitations:** Understanding when caching is useful and when it is not.
- **Edge computing:** Performing computation near users instead of only caching static content.
- **Content integrity:** Using cryptographic hashes to verify externally loaded resources.
- **Resource security:** Ensuring that scripts and other downloaded objects have not been unexpectedly modified.
- **Geographic request routing:** Directing users toward nearby or suitable servers.
- **DNS-based redirection:** Returning different server addresses or resource names depending on the requesting user.
- **Application-level redirection:** Generating webpages that reference different servers for different users.
- **BGP vs. DNS:** Different mechanisms for influencing which servers receive traffic.
- **Named Data Networking (NDN):** An alternative architecture in which users request content by name rather than identifying a particular host.
- **Content-addressed data:** Using hashes to identify specific content.
- **Distributed content discovery:** Finding which machine stores a requested object.
- **Distributed hash tables (DHTs):** Assigning responsibility for stored objects across participating nodes.
- **Architectural trade-offs:** Whether content-centric networking requires changing routers or can be built over existing Internet protocols.

## **Lecture 25 — Network Failures, Debugging, and Systems Reasoning**

- **Course and assignment discussion:** Reflecting on the competitive network-design assignment and the role of LLMs.
- **Systems epistemology:** How engineers determine what is true when observing a complicated system.
- **Hypothesis formation:** Developing plausible explanations for unexpected network behavior.
- **Falsifiable experiments:** Designing tests that distinguish competing hypotheses.
- **Network traffic patterns:** Understanding how traffic demand changes throughout the day.
- **Performance anomalies:** Investigating unexpected changes in throughput, latency, or packet loss.
- **Link failures:** How routing and failure-detection mechanisms respond to unreliable links.
- **Failure-detection thresholds:** How changing the number of missed messages required to declare a link down affects behavior.
- **Distributed Denial of Service (DDoS):** Overwhelming a victim using traffic from many distributed machines.
- **DDoS mitigation:** Filtering, rate limiting, and challenging suspicious clients.
- **Cloudflare-style protection:** Distinguishing legitimate traffic from potentially malicious automated requests.
- **Operational debugging:** Using logs, metrics, and experiments to investigate large-scale failures.
- **False positives in logs:** Why error messages do not necessarily identify the underlying cause.
- **Rollback strategies:** Why reverting a distributed system to an earlier version can be difficult.
- **Metastable failures:** Systems that remain in a degraded state even after the original triggering problem has disappeared.
- **Retry amplification:** How repeated retries can sustain or worsen overload.
- **Recovery strategies:** Backoff, admission control, reducing load, and breaking positive feedback loops.
- **BGP route poisoning:** How malicious or incorrect route information can interfere with reachability.
- **Route validation:** Why networks should verify that advertised destinations are legitimately reachable through the advertising AS.
- **General lesson:** Diagnosing complex failures requires combining measurements, causal reasoning, and carefully designed interventions.

## **Course-wide topic map**

This is a useful way to organize the material when reviewing for quizzes.

| Topic                                                   | Lectures  |
| ------------------------------------------------------- | --------- |
| Network architecture, abstractions, and layering        | 1–4       |
| Ethernet, bridging, and spanning trees                  | 4–5       |
| Routing algorithms and convergence                      | 6         |
| BGP, autonomous systems, and routing policy             | 7–8       |
| Traffic engineering and optimization                    | 9–10      |
| Error detection and correction                          | 10        |
| Reliable transport and TCP                              | 12        |
| Congestion control                                      | 13–14     |
| Physical-layer communication                            | 15        |
| Wireless networking and MAC protocols                   | 16        |
| Queues, scheduling, and switch architecture             | 17        |
| Encryption, public-key cryptography, and authentication | 18–19, 21 |
| Fairness and resource allocation                        | 21        |
| Web protocols and browser networking                    | 22        |
| Data centers and cloud networking                       | 23        |
| CDNs and content-centric networking                     | 24        |
| Failure analysis, DDoS, and operational debugging       | 25        |

**A recurring theme throughout the course:** The important question is not simply how a protocol works, but what assumptions it relies on, what happens when those assumptions fail, and what alternative design would perform better under different constraints.
