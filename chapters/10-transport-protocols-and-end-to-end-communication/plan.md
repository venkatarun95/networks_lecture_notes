# Chapter 10 plan

Open with two clients on one host. Derive endpoint demultiplexing, then make the reader choose a message or stream contract. Use the handshake to establish each direction's sequence number. Send five contiguous byte ranges and follow the same gap through cumulative ACKs, selective ACKs, evidence for retransmission, and head-of-line blocking. Use a slow reader to introduce flow control separately from network congestion. Close with independent QUIC streams and a loss-versus-reordering experiment.
