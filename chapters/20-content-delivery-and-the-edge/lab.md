# Edge cache lab

The edge has one cache and sees a fixed request sequence. Each letter represents an object with the same bytes on every request. The icon i takes 1 MB, and each of the video segments a, b and c takes 8 MB. Requests run in order, one per step. Both policies fetch the complete body on every miss and discard the least recently used copy when they must make room. They differ in the earliest request on which an object can enter the cache. The second policy counts prior requests even if a copy has since expired.

1. Try `i a i b i c i` with 8 MB, and keep the freshness window longer than the trace. Follow each cache's copy of i. Compare both the saved requests and the saved bytes.
2. Now try `a a a a a` with the same settings. The first two requests no longer represent separate objects. What extra transfer does it cost to wait for a second request before storing?
3. Try `a i i a`, with 9 MB and a freshness window of three steps. Both objects fit. Predict the result of the last request, then change freshness to four steps. Describe what has expired and why the answer changes. Reusing a cached object affects eviction order. It leaves the fill time as it was.
4. If you use an LLM to propose an admission policy, pick a metric first. Consider recent request count, object size and the upstream cost of refetching. Make at least one workload where your policy helps and one where it hurts. Keep all other settings fixed when comparing the traces.

The model omits upstream latency, queued fetches, request coalescing, and conditional revalidation. Expiration means the next request for that copy must refetch the body unless another copy was filled in the meantime.
