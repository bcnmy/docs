---
sidebar_label: "FAQ"
sidebar_position: 13
---

## Smart accounts and SDK

**Will I get the same smart account address on all chains?**

Yes, you will get the same address on all chains as long as the owner's address is the same.
    
**How can I create another smart account using the same EOA on the same chain?**
    
you can pass the `index` in the config while creating the account as mentioned in the createSmartAccountClient [method](https://docs.biconomy.io/Account/methods#createsmartaccountclient). First smart account gets created with index 0 by default. 
    
**Where can I find more examples of SDK integrations?**
    
https://github.com/bcnmy/sdk-examples
    
**How can I increase the timeout in the waitForTransactionHash function?**
    
Initialize the bundler with updated configuration, to increase the timeout (milliseconds).

```jsx
import { createSmartAccountClient, createBundler } from "@biconomy/account";

const biconomySmartAccount = await createSmartAccountClient({
    signer,
    bundler: await createBundler({
    bundlerUrl: "bundler url",
    userOpReceiptMaxDurationIntervals: { 80002: 60000 },
    }),
});
```
    
**Which social login methods are supported?**
    
Explore services such as Web3Auth, Particle Network, Magic.link, or Lit Protocol to link a user's social identity with a cryptographic key. This key can then serve as the owner of the Smart Account. Be sure to check out various [signers](https://docs.biconomy.io/Account/signers/) integrations for this purpose.
    
**How do I enable session keys for users?**
    
Utilize the session key validation [module](https://docs.biconomy.io/Modules/sessionvalidationmodule).

**How to enable debug mode in SDK to log more?**

Set following env flag to true before running the app. `export BICONOMY_SDK_DEBUG=true`

**What are 2D Nonces?**

In account abstraction, user operations use two-dimensional (2D) nonces. This is different from EOAs (Externally Owned Accounts), which currently use one-dimensional nonces. For EOAs, every transaction increases the nonce by 1, following a sequential order.

A User Operation is similar in that it can generate sequential nonces (when nonceKey is 0), but it also has the ability to use 2D nonces (when nonceKey > 0), allowing for parallel user operations.

Here's what happens under the hood of the getNonce() method:
```jsx
return nonceSequenceNumber[sender][key] | (uint256(key) << 64)
```

The current key sequence is combined with a left-shifted value of the same key. The end result is a single number representing all possible 2D nonces.

**What are Parallel User Ops?**

Parallel user ops are user operations that are not dependent on each other and can be executed simultaneously, without waiting for any previous user operation to be executed on-chain.

Let's take an example of a user executing some actions on a Dapp. The Dapp wants to batch transactions together to provide a better user experience (UX).

```jsx
Bob swaps 1 ETH for 4000 USDC
Bob swaps 4000 USDC for 7000 BICO
Bob buys 1 NFT for 100 USDC
```

Transactions 1 and 2 will be batched into one user operation and will be executed in order, while transaction 3 will be added in another user operation.

The second user operation can be sent after the first one is done, using a sequential nonce, this means it will wait for the first user operation to be settled on-chain. However, we can do better. By using 2D nonces, we can send both user ops at the same time. While Bob is swapping ETH for USDC and USDC for BICO, he can also buy that cool NFT simultaneously. 

Here is a tutorial on how to send parallel user ops with the Biconomy SDK: https://docs.biconomy.io/tutorials/parallelUserOps
## Bundler & Paymaster

**Is the bundler URL the same for all chains?**
    
Yes, for testnets same [bundler URL](/dashboard#bundler-url) can be used, just change the chainId. For mainnet you can reach out to [us](https://t.me/rhicsanchez).
    
**How can I sign the userOp manually?**
    
To sign the userOp manually, first calculate the userOpHash and then sign it using the same signer, the account is created with. you can find more details [here](https://hackmd.io/@xWzOEjWIRIKP22EKSdIgEg/Hk5SGcK-o).
    
**Can I just use Biconomy’s bundler with another smart account implementation?**
    
Yes, Biconomy's bundler seamlessly integrates with other smart account providers. As long as the user operation remains valid and complies with ERC 4337 specifications, the integration is possible.

**Which ERC20 tokens are supported by the biconomy paymaster? How can I add support for a custom ERC20 token?**
    
You can check out the list of supported networks [here](/supportedNetworks). You can reach out to us here for custom token requirements.
    
**Can I use other paymaster with Biconomy SDK?**
    
Yes, you can. It completely depends on how the `paymasterAndData` is parsed in the paymaster. The only restriction is that it should first encode the paymaster address after that encoding can be anything till the time decoding is consistent. Bundler does not care about the paymasterAndData.
    
**Can I fund the gasTank programmatically?**
    
You can programmatically deposit funds using the paymasterContract `depositFor` function by passing the `amount` and `paymasterId` which is the EOA address. For instance, you can invoke the following [function](https://polygonscan.com/address/0x00000f79b7faf42eebadba19acc07cd08af44789#writeContract#F3) on the Polygon chain. Check out [this](https://gist.github.com/arcticfloyd1984/819b24d3d19adf039c7eefe6ae98836c) script for the same.
    
**Are there APIs to create my own dashboard?**
    
Yes, you can utilize the [dashboard APIs](/dashboard/apis) to create a paymaster, change policies, and even get the transaction's data.