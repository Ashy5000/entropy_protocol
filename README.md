# entropy_protocol

_Randomness redefined._

The Entropy Protocol is a decentralized onchain solution for generating decentralized randomness. Rather than relying on a single trusted oracle or node, the protocol uses a permissionless network of _entropy providers_ whose entropy is _mixed_ via hash functions. By utilizing Sign Protocol's schema hooks, we were able to add a new cryptographic commitment mechanism that ensures any group of providers cannot control the randomness produced in the protocol.

To provide randomness to the protocol and earn rewards, we crafted a frontend interface for supplying entropy. It uses Web3Auth for a seamless user experience.
