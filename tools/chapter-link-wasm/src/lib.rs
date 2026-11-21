use competitive_net_sim::{LinkConfig, Packet, PacketId, egress::EgressPort};
use std::cell::RefCell;
use std::time::Duration;

const PACKET_BYTES: u64 = 1_000;
const SENDER_A_PACKETS: usize = 4;
const MAX_SENDER_B_PACKETS: u32 = 8;
const BUFFER_BYTES: u64 = 7 * PACKET_BYTES;
const DECLINED_DEADLINE: u32 = 0;
const BUFFER_FULL: u32 = 1;

thread_local! {
    static RESULTS: RefCell<[u32; SENDER_A_PACKETS + MAX_SENDER_B_PACKETS as usize]> =
        const { RefCell::new([0; SENDER_A_PACKETS + MAX_SENDER_B_PACKETS as usize]) };
}

/// Offer both bursts at time zero, with A's packets first in the FIFO tie.
/// Returns a pointer to one u32 per offered packet, in offer order.
/// A value of 0 is a deadline refusal, 1 is a full buffer, and any larger
/// value is the arrival timestamp in milliseconds. Read before the next call.
#[unsafe(no_mangle)]
pub extern "C" fn run_shared_link(
    promise_deadline: u32,
    sender_b_packets: u32,
    deadline_ms: u32,
) -> *const u32 {
    let packet_count = SENDER_A_PACKETS + sender_b_packets.min(MAX_SENDER_B_PACKETS) as usize;
    let config = LinkConfig {
        latency: Duration::from_millis(2),
        bandwidth_bps: 8_000_000,
        queue_capacity_bytes: BUFFER_BYTES,
    };
    let deadline = Duration::from_millis(deadline_ms.into());
    let mut egress = EgressPort::single_fifo(config.queue_capacity_bytes);
    let mut reserved_until = Duration::ZERO;

    RESULTS.with_borrow_mut(|results| {
        for (index, result) in results[..packet_count].iter_mut().enumerate() {
            let (finish, arrival) = config.transmit_times(reserved_until, PACKET_BYTES);
            if promise_deadline != 0 && arrival > deadline {
                *result = DECLINED_DEADLINE;
                continue;
            }

            let packet = Packet::new(PacketId::new(index as u64), Duration::ZERO, PACKET_BYTES);
            *result = match egress.admit(0, packet, egress.bytes_queued(), BUFFER_BYTES) {
                Ok(()) => {
                    reserved_until = finish;
                    0 // Marked with its actual arrival when dequeued below.
                }
                Err(_) => BUFFER_FULL,
            };
        }

        let mut wire_free = Duration::ZERO;
        while let Some(packet) = egress.pick_next() {
            let (finish, arrival) = config.transmit_times(wire_free, packet.size_bytes);
            results[packet.id.raw() as usize] = arrival.as_millis() as u32;
            wire_free = finish;
        }
        results.as_ptr()
    })
}
