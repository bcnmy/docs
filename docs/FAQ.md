---
sidebar_label: "FAQ"
sidebar_position: 13
---

## Smart accounts and SDK

**Will I get the same smart account address on all chains?**

yes, you will get the same address on all chains as long as the owner address is the same.
    
**How can I create another smart account using same EOA on the same chain?**
    
you can pass the `index` in the config while creating the account as mentioned in the createSmartAccountClient [method](https://docs.biconomy.io/Account/methods#createsmartaccountclient). First smart account gets created with index 0 by default. 
    
**Where can I find more examples for SDK integration?**
    
https://github.com/bcnmy/sdk-examples
    
**How to increase the timeout in the waitForTransactionHash function**
    
Initialise the bundler with updated configuration, to increase the timeout (milliseconds).

```jsx
import { createSmartAccountClient, createBundler } from "@biconomy/account";

const biconomySmartAccount = await createSmartAccountClient({
    signer,
    bundler: await createBundler({
    bundlerUrl: "bundler url",
    userOpReceiptMaxDurationIntervals: { 80001: 60000 },
    }),
});
```
    
**Which social login methods are supported?**
    
Explore services such as Web3Auth, Particle Network, Magic.link, or Lit Protocol to link a user's social identity with a cryptographic key. This key can then serve as the owner of the Smart Account. Be sure to check out various [signers](https://docs.biconomy.io/Account/signers/) integrations for this purpose.
    
**How do I enable session keys for users?**
    
Utilise the session key validation [module](https://docs.biconomy.io/Modules/sessionvalidationmodule) 
    

## Bundler & Paymaster

**Is the bundler url same for all chains?**
    
yes, bundler url is same for all testnets. For mainnet you can reach out to us.
    
**How to sign userOp manually?**
    
To sign the userOp, first calculate the userOpHash and then sign it using the same signer, account was created. you can find more details [here](https://hackmd.io/@xWzOEjWIRIKP22EKSdIgEg/Hk5SGcK-o).
    
**Can I just use Biconomy’s bundler and other smart account implementation?**
    
Yes, Biconomy's bundler seamlessly integrates with other smart account providers. As long as the user operation remains valid and complies with ERC 4337 specifications, integration is possible.

**Which ERC20 tokens are supported by the biconomy paymaster? How to add support for a custom ERC20 token?**
    
you can check out the list of supported networks under [paymaster](/Paymaster/supportedNetworks) and [bundler](/Bundler/supportedNetworks) section. you can reach out to us here for custom token requirement.
    
**How can I use any custom paymaster?**
    
It totally depends on how the `paymasterAndData` is parsed in the paymaster. Only restriction is that it should first encode the paymaster address after that encoding can be anything till the time decoding is consistent. Bundler does not care about the paymasterAndData.
    

**Can I fund the gasTank programmatically?**
    
You can programmatically deposit funds using the paymasterContract `depositFor` function by passing the `amount` and `paymasterId` which is the EOA address. For instance, you can invoke the following [function](https://polygonscan.com/address/0x00000f79b7faf42eebadba19acc07cd08af44789#writeContract#F3) on the Polygon chain.
    
**Are there APIs to create our own dashboard?**
    
yes, you can utilise the dashboard APIs to create a paymaster, change policies and even get the transactions data.