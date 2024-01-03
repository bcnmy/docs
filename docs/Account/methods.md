---
title: Methods
---

The SDK provides the following methods for a smart account.

## BiconomySmartAccountV2
### Create

The `create()` method is used to create an instance of the Biconomy Smart Account V2. This method takes a configuration object and returns the smart account instance.

The addresses of ERC-4337 smart accounts follow a deterministic pattern. This enables you to get the address off-chain before the account is actually deployed.

**Usage**

```jsx

const ownerShipModule = await ECDSAOwnershipValidationModule.create({
  signer: wallet,
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
})

const smartAccount = await BiconomySmartAccountV2.create({
  chainId: ChainId.POLYGON_MUMBAI, // Specify the desired chain (e.g., Polygon Mumbai)
  bundler: bundler, // Instance of the bundler (required)
  paymaster: paymaster, // Instance of the paymaster (required)
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Entry point address for the specified chain (required)
  defaultValidationModule: ownerShipModule, // Choose either ECDSA or Multi-chain as the default validation module (required)
  activeValidationModule: ownerShipModule, // Choose either ECDSA or Multi-chain as the active validation module to start 
});

```

**Parameters**

*required params are explicitly mentioned*

- config (`object`, required): A `BiconomySmartAccountV2Config` object containing configuration options for creating the smart account.
  - chainId (`ChainId` enum, required): The identifier for the blockchain network. (e.g., ChainId.POLYGON_MUMBAI).
  - bundler (`IBundler`): An instance of the bundler.
  - paymaster (`IPaymaster`): An instance of the paymaster.
  - entryPointAddress (`string`, required): The entry point address for the specified chain.
  - defaultValidationModule (`BaseValidationModule`, required): The default validation module to start with ( either ECDSA or Multi-chain ).
  - activeValidationModule (`BaseValidationModule`): The active validation module to start with ( either ECDSA or Multi-chain ).
  - rpcUrl (`string`): RPC URL of the chain
  - index (`number`): index to create multiple smart accounts for an EOA

**Returns**

- `smartAccount` (`object`): An instance of the Biconomy Smart Account V2.

:::info
Building on Chiliz Mainnet or the Spicy Testnet? Note that the entry point address on this is different as it was deployed by us on the Biconomy team. The address of the entry point is : [0x00000061FEfce24A79343c27127435286BB7A4E1](https://scan.chiliz.com/address/0x00000061FEfce24A79343c27127435286BB7A4E1/contracts#address-tabs)
:::

## Smart Account Get Methods

### getAccountAddress( )

This method is used to retrieve the account address associated with the `smartAccount` instance.

**Usage**

```jsx
const address = await smartAccount.getAccountAddress();
```

**Returns**

- address (`Promise<string>`): A Promise resolving to the account address associated with the smartAccount instance.

### getNonce( )

This method is used to retrieve the nonce associated with the `smartAccount` instance.

**Usage**

```jsx

const nonce = await smartAccount.getNonce();
console.log(nonce.toNumber());
```
**Parameters**
- nonceKey(`number`): one can also pass the optional parameter nonceKey in the case of two-dimensional nonces

**Returns**

- address (`Promise<BigNumber>`): A Promise resolving to BigNumber indicating the nonce of the smart account.

### index

This is used to retrieve the index of the current active smart account.

**Usage**
```jsx
const index = smartAccount.index;
```

**Returns**
- index (`number`): A number indicating the index of current active smart account.

## UserOp Methods

### buildUserOp( )
This method is used for configuring and setting up all properties of the `userOp` object.  It involves preparing and populating the userOp with necessary information and parameters required for execution by bundler.

**Usage**

For example, in the context of creating a userOp for an `addComment` transaction, an instance of the contract is created, then a basic transaction object is created that holds the necessary address and data from the transaction. Finally, a userOp is created using the Smart Account's `buildUserOp` method⁠.

```jsx
const contractAddress = "contract address";
const provider = new ethers.providers.JsonRpcProvider("rpc url");

const blogContract = new ethers.Contract(
  contractAddress,
  abi, // contract abi
  provider,
);

const createComment =
  await blogContract.populateTransaction.addComment("comment");

const tx1 = {
  to: contractAddress,
  data: createComment.data,
};

const userOp = await smartAccount.buildUserOp([tx1]);
```

**Parameters**
- transactions (`Transaction[]`, required): The required argument  is an array of transactions. You can pass multiple transactions into a userOp if you would like to batch them together into one transaction.
- buildUseropDto (`BuildUserOpOptions`): One can also pass these options to customize how a userOp is built.

  ```ts
  type BuildUserOpOptions = {
    overrides?: Overrides;
    skipBundlerGasEstimation?: boolean;
    params?: ModuleInfo;
    nonceOptions?: NonceOptions; 
    forceEncodeForBatch?: boolean;
    paymasterServiceData?: SponsorUserOperationDto;
  }
  ```
  Let's look at each of these params:
  1. overrides (`Overrides`): one can override any of the values of the userOp when it is being constructed.

      ```ts
      type BigNumberish = BigNumber | Bytes | bigint | string | number;

      type Overrides = {
        callGasLimit?: BigNumberish;
        verificationGasLimit?: BigNumberish;
        preVerificationGas?: BigNumberish;
        maxFeePerGas?: BigNumberish;
        maxPriorityFeePerGas?: BigNumberish;
        paymasterData?: string;
        signature?: string; // todo - add the definition
      }
      ```

  2. skipBundlerGasEstimation (`boolean`): This boolean param can be set to false to skip some Gas Estimations on the bundler which can help with reducing latency on requests.

  3. params (`ModuleInfo`): One can use this param to pass session validation module parameters. Refer to the tutorial to learn more about the session keys.

      ```ts
      type ModuleInfo = {
        sessionID?: string;
        sessionSigner?: Signer;
        sessionValidationModule?: string;
        additionalSessionData?: string;
        batchSessionParams?: SessionParams[];
      }
      ```
  4. nonceOptions(`NonceOptions`) : this can be used to execute multiple transactions in parallel. One can implement their own logic for nonce management.

      ```ts
      type NonceOptions = {
        nonceKey?: number;
        nonceOverride?: number;
      };
      // nonceOptions usage
      let i = 0;
      const userOp = await smartAccount.buildUserOp([tx1], {
        nonceOptions: { nonceKey: i++ },
      });
      ```
      Nonce can be initialised at any arbitrary number and incremented as one builds transactions. The nonceKey will create a batch or space in which the nonce can safely increment without colliding with other transactions. The nonceOverride will directly override the nonce and should only be if you know the order in which you are sending the userOps.

    
    
  5. forceEncodeForBatch (`boolean`): 

  6. paymasterServiceData (`SponsorUserOperationDto`): The `paymasterServiceData` includes details about the kind of sponsorship and payment token. It contains information about the paymaster service, which is used to calculate the `paymasterAndData` field in the user operation.

      ```ts
      type SponsorUserOperationDto = {
        mode: PaymasterMode;
        calculateGasLimits?: boolean; // Add info
        expiryDuration?: number;
        webhookData?: {
            [key: string]: any;
        };
        smartAccountInfo?: SmartAccountData;
        feeTokenAddress?: string;
      }
      ```
      It also contains optional fields such as `webhookData` and `smartAccountInfo`.
  

**Returns**
- partialUserOp (`Promise<Partial<UserOperation>>`): A Promise resolving to `partialUserOp` which can be further sent for execution⁠.

### senduserOp( )

This method is used to submit a User Operation object to the User Operation pool of the client. It signs the UserOperation using an externally owned account (EOA) key and submits it to the bundler for on-chain processing. 

**Usage**

```ts
const userOpResponse = await smartAccount.sendUserOp(userOp);

type UserOpResponse = {
  userOpHash: string;
  wait(_confirmations?: number): Promise<UserOpReceipt>;
  waitForTxHash(): Promise<UserOpStatus>;
};

const { receipt } = await userOpResponse.wait(1);

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
};
```

**Parameters**
- userOp (`Partial<UserOperation>`, required): The `userOp` object includes essential fields like `sender`, `nonce`, `callData`, `gas` related properties, and `signature`.

- params (`SendUserOpParams`): The `SendUserOpParams` object can contain fields such as `sessionID`, `sessionSigner`, `sessionValidationModule`, `additionalSessionData`, `batchSessionParams`, and `simulationType`. These parameters are used to customize the behavior of the `sendUserOp` method and are optional. 
  ```ts
  const userOpResponse = await moduleSmartAccount?.sendUserOp(userOp, {
    sessionSigner: sessionSigner,
    sessionValidationModule: moduleAddr,
  });
  ```
  Similar to building a `userOp` we need to ensure that any modules used for additional validation or execution logic are specified in the `sendUserOp` method. Currently, this only applies for session key module requirements.

:::note
Please note that `simulationType` allows for more debugging insights about `callData` on why an internal transaction fails. It is set to "validation" by default, but can be changed to "validation_and_execution" for more detailed tracing.
:::

**Returns**
- userOpsResponse (`UserOpResponse`): The method returns an object of type `UserOpResponse` which has a `userOpHash` and two methods: `wait()` and `waitForTxHash()`.
The `wait()` method resolves when the user operation is dispatched by the bundler on-chain and gets mined. The `waitForTxHash()` method returns a `UserOpStatus` object which includes the transaction hash and the receipt once added on-chain.
