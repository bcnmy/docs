---
sidebar_position: 4
---

# Proxy

Smart Account Itself
(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/Proxy.sol)

It is a basic proxy that delegates all calls to a fixed implementation address.

The implementation address is stored in the slot defined by the Proxy's address and is set at the Proxy deployment.

It can be changed by calling `setImplementation` method.
