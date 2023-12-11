---
sidebar_label: 'UserOp Methods'
sidebar_position: 3
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Account/methods/userOpMethods.md
---
# UserOp Methods

## buildUserOp()

This method returns a promise that resolves into a partially built userOp. Once this userOp is built it can be sent to Bundler or you can make a request to paymaster first to add additional sponsorship or token paymaster information to the userOp. 

### Creating a UserOp

Generally to use the buildUserOp method you need the following: 

- Address of smart contract you are interacting with
- Instance of contract to create a raw signed transaction

The example below connects to a blogging contract and calls an add comment method on the contract. You can connect to any contract in this matter to build your userOp.

```js

  const contractAddress = "contract address"
  const provider = new ethers.providers.JsonRpcProvider("rpc url");

  const blogContract = new ethers.Contract(
    contractAddress,
    abi, // contract abi
    provider
  );

  const createComment = await blogContract.populateTransaction.addComment("comment")


  const tx1 = {
    to: contractAddress,
    data: createComment.data
  }

  const userOp = await smartAccount.buildUserOp([tx1])


```

:::note

Note that the buildUserOp function takes an array of transactions, you can pass multiple transactions here to bundle into one userOp. 

:::


### Build UserOp Options

This method also takes a second optional object. Let's take a look at a few of the options we have for customizing how we build the userOp: 

```ts

type BuildUserOpOptions = {
    overrides?: Overrides;
    skipBundlerGasEstimation?: boolean;
    params?: ModuleInfo;
    nonceOptions?: NonceOptions;
    forceEncodeForBatch?: boolean;
};

```

### Overrides


You can choose to override any of the values of the userOp when it is being constructed. See the Overrides typing below: 


```ts

type BigNumberish = BigNumber | Bytes | bigint | string | number;

type Overrides = {
    callGasLimit?: BigNumberish;
    verificationGasLimit?: BigNumberish;
    preVerificationGas?: BigNumberish;
    maxFeePerGas?: BigNumberish;
    maxPriorityFeePerGas?: BigNumberish;
    paymasterData?: string;
    signature?: string;
};

```
You can pass your overrides as an object like below:

```ts

const userOp = await smartAccount.buildUserOp([tx1], { overrides: { paymasterData: "0x" }})

```

### skipBundlerGasEstimation

You can choose to skip some Gas Estimations on the bundler which can help with reducing latency on requests

```ts

const userOp = await smartAccount.buildUserOp([tx1], { skipBundlerGasEstimation: true })

```

### nonceOptions

At times you may find yourself executing many transactions in parallel. In this case you may want to take on handling nonce management yourself to avoid invalid nonce errors. 

```ts

type NonceOptions = {
    nonceKey?: number;
    nonceOverride?: number;
};

```

You can start the nonce at some arbitrary number and increment it as you proceed to make transactions. The `nonceKey` will create a batch or space in which the nonce can safely increment without colliding with other transactions. The `nonceOverride` will directly override the nonce and should only be if you know the order in which you are sending the `userOps`. 

```ts

let i = 0;

const userOp = await smartAccount.buildUserOp([tx1], { nonceOptions: { nonceKey: i++ }})

```
Please refer to the following [script](https://github.com/bcnmy/sdk-examples/blob/master/backend-node/scripts/gasless/parallelUserOpsMintNFT.ts#L95) for detailed implementation.

### Module params

If you are using a validation module you can pass information about it in this object:

```ts

type ModuleInfo = {
    sessionID?: string;
    sessionSigner?: Signer;
    sessionValidationModule?: string;
    additionalSessionData?: string;
    batchSessionParams?: SessionParams[];
}

```

Here is an example where we send a userOp with additional parameters regarding a session key signer. You can learn more about session keys on this [tutorial](/category/session-keys-tutorial).

```ts

let userOp = await smartAccount?.buildUserOp([tx1], {
  skipBundlerGasEstimation: false,
  params: {
    sessionSigner: sessionSigner,
    sessionValidationModule: moduleAddr,
  },
})

```

## sendUserOp()

After building a userop and choosing to edit any values it's time to send the userOp to a bundler 

This method returns a promise that resolves to a userOp response object. 

```ts

const userOpResponse = await smartAccount.sendUserOp(userOp);


```

The userOpResponse object looks like this: 

```ts

type UserOpResponse = {
    userOpHash: string;
    wait(_confirmations?: number): Promise<UserOpReceipt>;
    waitForTxHash(): Promise<UserOpStatus>;
}

```
You can get the userOpHash here again if needed but the main thing that is useful is the `wait` method which will return an actual receipt of the trasaction. The wait method will take an optional number which is the number of blockcahin confirmations you want to wait until showing the reciept. 

```ts

const { receipt } = await userOpResponse.wait(1);

```

You can see the typing of the UserOpReceipt below: 

```ts

type UserOpReceipt = {
    userOpHash: string;
    entryPoint: string;
    sender: string;
    nonce: number;
    paymaster: string;
    actualGasCost: BigNumber;
    actualGasUsed: BigNumber;
    success: boolean;
    reason: string;
    logs: Array<ethers.providers.Log>;
    receipt: ethers.providers.TransactionReceipt;
}

```
You can use `waitForTxHash` to get the transactionHash and status, without waiting for the transaction to be mined.


```ts

const transactionDetails: UserOpStatus = await userOpResponse.waitForTxHash();
console.log('transaction hash', transactionDetails.transactionHash)


```

The userOpResponse has one method that you will use 

### Using modules with sendUserOp()

Similar to building a `userOp` we need to ensure that any modules used for additional validation or execution logic are specified in the `sendUserOp` method. Currently, this only applies for session key module requirements.

These params will be the same ModuleInfo params as outlined in the `buildUserOp` flow. 

``` ts

type ModuleInfo = {
    sessionID?: string;
    sessionSigner?: Signer;
    sessionValidationModule?: string;
    additionalSessionData?: string;
    batchSessionParams?: SessionParams[];
}

```

Similarly we send it as structured below: 

```ts

const userOpResponse = await moduleSmartAccount?.sendUserOp(userOp, {
  sessionSigner: sessionSigner,
  sessionValidationModule: moduleAddr,
});

```
