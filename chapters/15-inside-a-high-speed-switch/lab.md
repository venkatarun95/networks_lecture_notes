# Crossbar lab

The three inputs have fixed-size packets waiting in memory before the first slot. Each output can accept one packet per slot and is ready every slot. No packets arrive during the run. There is no output backlog in this model.

1. Set input 1 to `AB`, input 2 to `A`, and leave input 3 empty. Write the requests visible in the first slot under FIFO and under virtual output queues. Both schedulers pick a feasible matching using just the current requests. Predict the first-slot grants for both disciplines and both schedulers.
2. Add input 3 with `BC`. Under virtual output queues, find a three-edge matching before viewing the trace. When greedy chooses input 1 to A, which input is left without a grant even though three are possible? Which changes to its first grant could free the extra transfer?
3. Look for a case where greedy finishes all packets in the same number of slots as maximum-size scheduling, even though it makes fewer transfers in one slot. Then look for a case where the schedules differ in both first-slot transfers and completion time. The total number sent will be the same because both runs drain the original snapshot.
4. If you ask an LLM to try another scheduler, first describe how it should break ties and what queue or packet state it can see. Ask it to find an initial snapshot where your policy loses to a baseline in your chosen metric. Evaluate the policy on that snapshot and explain which grant caused the difference.

Greedy checks inputs in numerical order and tries their eligible outputs in alphabetical order. The maximum-size policy enumerates all feasible matchings for this tiny model and takes the first largest one it finds, checking outputs in the same order. Enumeration makes the teaching rule explicit. A real switch has to find acceptable grants in hardware at packet or cell cadence.
