---
sidebar_label: "Smart Account Modules - Batched Session Router"
---

# Smart Account Modules - Batched Session Router

Disclaimer: pre-requisites. The Batch Session Router module is a part of the Biconomy Modular Session Keys framework. So to get the full understanding of this doc it is recommended that you first study this doc. At least everything before the ‘Making a new Session Validation Module’ section.

## What it enables

Those who are familiar with the [Biconomy Modular Session Keys framework](https://www.biconomy.io/post/modular-session-keys) know that it provides great flexibility and allows for quick building of the Session Validation Modules for every new use case without touching the core Session Keys logic.
Batched Session Router adds *composability*, allowing batching of several session key signed operations which should be validated by different Session Validation modules into one User Operation and execute them atomically.

## UX Impact

This module allows batching several operations (actions) into one atomically executed User Operation, thus ensuring better UX for many DeFi use cases.

Let’s take a very simple example. Some dApp wants to allow users to perform a simple flow of actions:

- Approve token A to a DEX
- Swap token A for token B
- Stake token B on some Protocol

It also doesn’t want to make this on behalf of the users when the rate of the swap is optimal.

In this case, they will use Session Keys to sign those operations.
Since those actions are very common there already are the building blocks for this = appropriate Session Validation Modules (SVMs): ERC20ApprovalSVM, DEXSwapSVM, ProtocolERC20StakeSVM.

Each of those SVMs is only able to validate userOps which specifically performs a given action: swap, approve, or stake. So none of them is able to validate the userOp which leverages `executeBatch()` method to perform those 3 actions together. 

Of course, we can always build 3 separate userOps for those 3 actions, however, they won’t be included in the same bundle as per ERC-4337 specification, so they end up on 3 different bundles, and that’s not what the user wants in DeFi.

It’s also possible to build a custom Session Validation Module that works with this specific flow and validates such atomic userOps which leverages `executeBatch()`. However, if in the future there’s a need to add one more step to this flow, this will require a new Session Validation Module to be built. 
Such an SVM would also double-use some of the code already implemented in the basic SVMs and that is not a good practice. Also, this would require permissions to be separately set up for every new SVM.

Session Router addresses those issues by parsing `executeBatch()` calldata and routing validation flow to the specific SVMs based on the actions into the batch.

Now, dApps can construct flows based on the actions validated by basic SVMs and share common permissions across flows.

## How it works

Batched Session Router leverages `SmartAccount.executeBatch()` method to execute atomic operations.

It is a Validation module, that validates the `userOps` with the `callData` field containing a call to `SmartAccount.executeBatch()`.

Every operation in the batch is expected to be an action managed by a specific Session Validation Module. 

Of course, this action should be permitted for a given session key by enabling the appropriate session key + parameters in the Session Key Manager module.

![sessionrouter](./images/Session%20Router.png)

So, the Batched Session Router 
1. Verifies every action this userOp claims to perform is enabled for a given Smart Account.
2. Checks which Session Key was used to sign the userOp.

3. Checks this is the actual signer who is allowed to perform the actions.
4. Parses the `executeBatch()` calldata to get the per-action calldatas and passes them to the appropriate Session Validation Module. SVMs perform permissions checks to ensure that actions that are about to be performed with this calldata comply with the permissions.

It also intersects validity timeframes for all the enabled sessions. if at least one session is expired or not due, the whole atomic operation fails to be validated.

## Security assumptions

The Batched Session Router is stateless and does not perform (and require) any additional checks so no additional security assumptions on this side.

## Conclusion

Batched Session Router allows validating userOps that leverage `SmartAccount.executeBatch()` method to execute several actions atomically, signed by a single Session Key. 

Batched Session Router is an important addition to the Biconomy Session Keys framework which further improves UX and DevX and allows for great composability in addition to flexibility it already has.