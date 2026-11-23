# One-time pad lab

The [pad lab](pad-lab.html) enumerates the eight possible three-bit messages. For each one it finds the unique pad that would produce the ciphertext you selected. The third column is the probability of seeing that ciphertext *if* the candidate were the message.

1. Select ciphertext `110` and predict the matching pads for candidates `101` and `001`. Verify the results with XOR. If you originally thought `101` was twice as likely as `001`, what are the odds after observing `110` with a uniform pad?
2. Make the first pad bit zero with probability three quarters. The other two pad bits remain independent and uniform. For the same two candidates, compute the likelihood ratio and multiply it by your original odds. Why does it make a difference even though every candidate still has a compatible pad?
3. Change only the first bit of the ciphertext. Which candidates now have the larger likelihood? Explain why the data for this exercise concern the ciphertext *conditioned on* each candidate and why the sender's message distribution is needed to compute posterior probabilities.

With a uniform pad the likelihoods in a column stay equal. In the biased example for ciphertext `110`, candidate `101` needs pad `011` with likelihood 3/16. Candidate `001` needs `111` with likelihood 1/16. The likelihood ratio 3 multiplies the original odds of 2, yielding posterior odds of 6 to 1.
