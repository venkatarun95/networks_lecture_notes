# Transport lab

The [transport lab](transport-lab.html) sends five segments, one per tick at ticks 0–4. Allow three ticks each way. The receiver buffers later data but can release only the contiguous prefix. Its ACK is the **number of contiguous segments** it has, so ACK 1 means that it still needs segment 2. At each tick the sender can transmit its next original segment, then process due events including arriving ACKs, then check its timer. New cumulative progress re-arms the fixed timer if data is outstanding. Retries always take the normal route. With an early loss, only the original segment 2 is dropped. With a tail loss, only the original segment 5 is dropped. With a detour, original segment 2 takes eleven ticks instead of three.

1. With the early loss, threshold 3 and timer 12, predict the three duplicate ACK times and the delivery tick. Check that the first ACK 1 arrives at tick 6, that the three duplicates arrive at ticks 8, 9, and 10, and that the repair is delivered at tick 13.
2. Switch to the detour and keep the sender fixed. Was the retransmission necessary? Compare the arrival of the original with the arrival of the repair. Change the threshold and compare delivery time and extra sends.
3. Switch to the tail loss and disable the timer. Identify the last advancing ACK and explain why the duplicate-ACK rule has no further input. Restore the timer and verify that the sender recovers.
4. Sweep the duplicate threshold and timer settings for the three workloads. Which pairs minimize completion time? Which minimize extra transmissions? Write down a workload where a pair that was best on one measure gets worse on the other.

The model gives the receiver ample buffer, uses a fixed send schedule for the originals, and holds both directions' ordinary delays constant. It omits congestion control and varies only the loss-recovery rules.
