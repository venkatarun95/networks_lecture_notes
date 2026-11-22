# Signal sampling lab

Open the [signal lab](signal-lab.html). In the clock experiment, the transmitted bits are six ones followed by `010101`. They arrive as ideal rectangular pulses. The receiver first samples at time 0.5 in sender slots, then uses the selected interval. At each sample it reads whichever transmitter slot contains that time. The alternating tail makes missed timing boundaries visible.

1. At an interval of 1.12, predict what the sixth measurement reads. Compute its time, then check the table. Sweep the clock interval down toward 1.00. Can a receiver cross a boundary without measuring a wrong value if the adjacent slots carry the same bit?
2. On paper, replace the long run with Manchester-encoded bits. Mark the mid-bit edges and describe how a receiver that already knows the approximate bit period can update its clock from those edges.
3. In the voltage experiment, the transmitted levels are spaced equally across 0–2 V, timing is perfect, and the receiver chooses the nearest level. Each of eight deterministic disturbances is scaled to the selected voltage bound. Calculate half of the spacing for 2, 4, 8, and 16 levels. Find a bound for which the trace produces no errors but a legal disturbance could still cause one. At a midpoint, a tie can already cause an error for one of the adjacent levels.

The noise number is a bound on an additive voltage error, in volts. You would need a statistical model to turn this into a probability of error or a channel-capacity calculation.
