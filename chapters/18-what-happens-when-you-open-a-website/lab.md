# Trace a page load

Open the [page-load lab](load-lab.html). In the cold case sketch the paths leading to the styled list. Calculate the arrival times of the CSS and the departures response. Compare them with the trace. Then choose the warm case and predict what happens under these changes.

1. Close the existing connection but retain the DNS result. Which wait returns? What waits remain omitted?
2. Remove the DNS result but keep the open connection. Explain why the request can still proceed. Now close that connection as well.
3. Keep the connection and DNS result warm but make the assets stale, modeling that by removing them from the cache. Which network requests return? Which of them can influence the ready time under the lab's durations?
4. Start from the cold case. Suppose the page can learn the API URL from the HTML before the script arrives. Sketch an alternative design in which the request starts at HTML completion. Include the script's eventual rendering work, and determine the next bottleneck.

The model uses one origin and one established connection for parallel resources. It assumes fixed response durations, no proxies visible to the browser, and negligible layout time. The direct download and cache choices omit revalidation. A disconnected link invalidates connection reuse in the model. A DNS entry can remain usable after joining again. The diagram uses a shared time scale within each run.

## Compare with an observed waterfall

Use a page you control or have permission to measure. Open your browser's Network panel before navigating. Record the HTML entry, a directly referenced asset, and a request initiated by a script, if any. Use the Initiator and Timing views to identify what started each request and where time was spent. Repeat with the browser's HTTP cache disabled and then with its cache enabled. For each run record the protocol, transferred sizes, and any labeled DNS, connection, or TLS time. An HTTP cache control in DevTools need not clear the host's DNS cache or close sockets.

If you have a packet capture from the same client and an authorized capture point, look for the transport setup and compare timestamps. TLS normally prevents a passive capture from showing HTTP bodies. The browser waterfall can label application requests and cache hits that the packet trace cannot directly identify. Check both clocks before attempting to line up the views. Identify one dependency the timings support and one explanation they leave open. [Chrome DevTools Network reference.](https://developer.chrome.com/docs/devtools/network/reference)
