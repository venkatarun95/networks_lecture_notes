
# Notes: Making the Networking Book Distinctive

## 1. Design-first approach
- Book should teach **how to design systems**, using computer networks as the example.
- Start with a design problem, let readers reason about possible solutions, then introduce existing protocols.
- Emphasize assumptions, trade-offs, counterexamples, and why particular designs succeed or fail.
- Preserve unusual examples and interesting in-class discussions.

## 2. Interactive design problems with vibe-coding
- Some chapters have open-ended problems: **"Here is a design setting. Figure out a good solution."**
- Readers can use LLMs to implement their ideas as they develop them.
- Goal is not writing code from scratch, but understanding and improving the design.
- Provide a simulator and API for implementing solutions. All code-driven parts of the book build on this simulator
- Readers iterate: design → implement → experiment → analyze → redesign.

## 3. Semi-automated trade-off discovery
- Need tools that help readers discover weaknesses and trade-offs without manually designing every experiment.
- Possible mechanisms:
  - Parameter sweeps over workloads and network configurations.
  - Automated adversarial workload generation.
  - Counterexample search for correctness and performance claims.
  - Baseline comparisons and ablation experiments.
  - Pareto frontiers for throughput, latency, fairness, cost, etc.
  - Sensitivity and robustness analysis.
- Automatically identify interesting scenarios and ask readers to explain them.
- Important distinction: finding no counterexample is not the same as proving correctness.
- Include experiments that show candidate designs and their tradeoffs, so people can understand them without having to vibe-code everything themselves. The exercises should be around improving the obvious solutions.

## 4. Interactive visualizations
- **Routing:** Animate packet forwarding, routing updates, failures, loops, and convergence.
- **Congestion control:** Visualize congestion windows, queues, loss, throughput, and competing flows.
- **Wireless:** Move transmitters and receivers; visualize interference, scheduling, and spatial reuse.
- **BGP:** Edit routing policies and watch route propagation, convergence, or oscillation.
- **Switch architecture:** Visualize crossbars, packet queues, head-of-line blocking, and scheduling.
- **Cryptography:** Interactive demonstrations of encryption, hashes, authentication, and attacks.
- Ideally, visualizations connect to the reader's own implementation, not just predefined algorithms.

## 5. Predict–simulate–explain
- Before running an experiment, readers predict what their implementation will do.
- Simulator produces actual behavior and execution traces.
- Readers explain discrepancies between prediction and observation.
- Can ask questions specific to the reader's submitted code.
- Particularly useful in an AI-assisted programming environment.

## 6. Recurring reasoning exercises
- Adapt InstaPolls, in-class questions, and quiz problems.
- Recurring formats:
  - **Design this:** Propose a system under specified constraints.
  - **Break this:** Find a workload or failure that defeats a design.
  - **What if?** Change one assumption and reconsider the architecture.
  - **Network detective:** Diagnose a problem using incomplete observations.
  - **Defend your design:** Explain trade-offs against alternatives.
- Questions should teach new concepts, not merely test recall.

## 7. Competitive capstone
- Use the existing final assignments: teams operate competing autonomous systems.
- Preserve multiple rounds, customer preferences, economic incentives, equipment budgets, measurements, and adaptation.
- Competition requires multiple real teams; fixed bots are not an adequate replacement.
- Release simulator and tournament infrastructure to instructors.
- Add instructor-facing visualizations of market shares, performance, customer movement, and strategies across rounds.
- Earlier individual design laboratories prepare readers for this competition.

## 8. AI-native education
- Explicitly allow LLM-assisted implementation.
- Focus assessment on understanding behavior, identifying assumptions, designing experiments, and making strategic choices.
- Have readers critique LLM-generated designs and test their claims.
- Separate implementation correctness from quality of engineering judgment.

## 9. Software architecture and scope
- Three components:
  1. **Book:** Self-contained explanations, reasoning exercises, and static diagrams.
  2. **Interactive laboratories:** Individual experimentation, visualization, and automated feedback.
  3. **Instructor capstone:** Multi-team competitive simulation.
- Ideally reuse the same simulation engine and metrics infrastructure.
- Start with three prototypes: routing, congestion control, and wireless MAC.
- Keep the printed book useful without requiring software.

## Overall vision

**A textbook where readers learn networking by inventing designs, breaking them, measuring the consequences, and improving them.**

The distinguishing feature is not simply interactivity or coding. It is making the engineering design process itself visible, explorable, and experimentally testable.