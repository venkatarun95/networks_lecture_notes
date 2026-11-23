# Diagnose a service that stayed slow

Open the [incident lab](incident-lab.html). Read the initial report. Write two explanations and one prediction for each. Reveal a measurement only after you can say how its possible results would differ between your stories. Explain which evidence tells you about the original route event and which evidence tells you about the later slow API.

The final panel runs the teaching model. It starts with 70 new requests per interval and uses the capacities shown in its trace. An unserved new request causes two redundant attempts in the next interval. The model offers at most 90 retries until you apply the selected budget at interval 6. Retries get served before fresh requests and consume capacity even though their old deadlines passed. Capacity recovers in interval 4 independently of the budget. Compare a budget of 90, 60, 45, and 30 with the same initial conditions.

1. At a budget of 60, why is the intervention insufficient to restore all 70 responses even though it helps some? Work through enough intervals to see what happens next.
2. At a budget of 45, find the first interval in which the response count begins to improve. Is recovery immediate? Find the first interval in which every fresh request meets its deadline.
3. Suppose some retries instead complete work clients still need. Name a measurement that would let the operator estimate how many useful responses were foregone when limiting retry work. What would you preserve when adding that feature to the model?

For your incident report, list the available observations, the earliest evidence of the trigger, the reason it persisted after restoration, and an observation that would force you to revise your story. State which changes you would keep for normal operation and which you would remove after recovery. For a follow-on classroom experiment, test your own detector and queue policy in the existing NetworkArena simulator, where the control and forwarding events must be inferred from measurements.
