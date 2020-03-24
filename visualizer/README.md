# Visualizer Tools

Here are some tools built with [d3.js](https://d3js.org/) meant to help with visualizing the different components of cryptographic keys, elliptic curves, and digital signatures.

Everything is built so that all magic happens client-side. Still, I don't recommend using anything here to generate or otherwise manage signatures, private keys, or anything even mildly important in any way. These are learning tools and nothing more. Consider this a disclaimer and a warning.

A copy of these tools can be accessed at [hanneman.org/siglab](https://hanneman.org/siglab/).

## History

A few years ago, Andrea Corbellini wrote [this friendly introduction](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/) to explain the math of elliptic curve operations. I always appreciated this resource, though I felt some low-hanging-fruit improvements could be made on the front-end. Eventually I decided to take it apart and put it back together with d3 handling the data-binding and charting side of things.

If you're here while reading about Bitcoin or secp256k1 specifically, you might also be interested in checking out [Pieter Wuille's StackExchange breakdown](https://bitcoin.stackexchange.com/a/21911).

At some point, I decided to bundle this together with another d3-based front-end for key and signature visualization that I had dreamt up. The result (to quote [Matt York](https://github.com/stackdump)) is a sort of "artisanal signature suite" that, if nothing else, helps me to get a grasp on this stuff.