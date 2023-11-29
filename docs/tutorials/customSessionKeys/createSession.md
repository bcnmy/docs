---
sidebar_label: 'Session Module'
sidebar_position: 4
---
# Session Module

In this guide, we will walk through creating a basic Node.js script using
TypeScript that allows user to create a session.

:::info This tutorial has a previous other steps in the previous sections:
[Environment Setup](environmentsetup) and
[Initializing Account](initializeaccount)
 :::

This tutorial will be done on the Polygon Mumbai Network. We will be using session Module for this.

First we will import sessionKeyManagerModule and DEFAULT_SESSION_KEY_MANAGER_MODULE from Biconomy Modules package.

First of all we will initialise the sessionFileStorage using our custom File storage

```typescript
    const sessionFileStorage: SessionFileStorage = new SessionFileStorage(address)
```


We will now use the Session Key Manager Module to create a session module using the module address and smart account address and the custom session storage. This is an important relationship to establish - the module provided by the SDK gives you an easy way to interact with modules you write on a smart contract with whatever arbitrary validation logic you need.


```typescript
    const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
        sessionStorageClient: sessionFileStorage
    });

```

In this section we will cover a deployed contract that validates specific permissions to execute ERC20 token transfers. Using this ERC20 Validation module you will be able to create a dApp that allows user to send a limited amount of funds to a specific address without needing to sign a transaction every single time. In the following example user can only transfer 50 tokens at once.

```typescript
    const sessionKeyData = defaultAbiCoder.encode(
        ["address", "address", "address", "uint256"],
        [
          sessionKeyEOA,
          "0xdA5289fCAAF71d52a80A254da614a192b693e977", // erc20 token address
          "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
          ethers.utils.parseUnits("50".toString(), 6).toHexString(), // 50 usdc amount
        ]
    );

```

Now we create the session data itself. We specify how long this should be valid until or how long it is valid after. This should be a unix timestamp to represent the time. Passing 0 on both makes this session never expire, do not do this in production. Next we pass the module address, session key address, and pass the session key data we just created.


```typescript

    const sessionTxData = await sessionModule.createSessionData([
        {
          validUntil: 0,
          validAfter: 0,
          sessionValidationModule: erc20ModuleAddr,
          sessionPublicKey: sessionKeyEOA,
          sessionKeyData: sessionKeyData,
        },
    ]);
```
We're going to be tracking if the session key module is already enabled.
This will check if a session module is enabled - it will return if we do not have an address, smart Account, or provider and will then enable the module for our smartAccount if needed.

```typescript
    const isEnabled = await smartAccount.isModuleEnabled(DEFAULT_SESSION_KEY_MANAGER_MODULE)
    if (!isEnabled)
    {
        const enableModuleTrx = await smartAccount.getEnableModuleData(
            DEFAULT_SESSION_KEY_MANAGER_MODULE
        );
        transactionArray.push( enableModuleTrx );
    }
		
```

Finally if we need to enable session key module we create a transactione here as well using the getEnableModuleData and pass the session key manager module address and push this to the array. Additionally we push the session transaction to the array as well, we will be batching these transactions together.

Next we will build a userOp and use the smart account to send it to Bundler.

```typescript

    let partialUserOp = await smartAccount.buildUserOp( transactionArray, {
        paymasterServiceData: {
            mode: PaymasterMode.SPONSORED,
        }
    } );
    console.log( partialUserOp )
    const userOpResponse = await smartAccount.sendUserOp(
        partialUserOp
    );
    console.log( `userOp Hash: ${ userOpResponse.userOpHash }` );
    const transactionDetails = await userOpResponse.wait();
    console.log( "txHash", transactionDetails.receipt.transactionHash );
```
Now with this implemented let's take a look at executing the ERC20 token transfer with a session in the next section.


Checkout below for entire code snippet
<details>
<summary> Expand for Code </summary>

```typescript

import { defaultAbiCoder } from "ethers/lib/utils";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE, SessionKeyManagerModule, DEFAULT_SESSION_KEY_MANAGER_MODULE } from "@biconomy/modules";
import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import
	{
		IPaymaster,
		BiconomyPaymaster,
		PaymasterMode,
	} from '@biconomy/paymaster'
import { SessionFileStorage } from "./customSession";

let smartAccount: BiconomySmartAccountV2
let address: string

config();

const bundler: IBundler = new Bundler( {
	bundlerUrl:
		"https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
	chainId: ChainId.POLYGON_MUMBAI,
	entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
} );

console.log( { ep: DEFAULT_ENTRYPOINT_ADDRESS } );

const paymaster: IPaymaster = new BiconomyPaymaster( {
	paymasterUrl:
		"https://paymaster.biconomy.io/api/v1/80001/HvwSf9p7Q.a898f606-37ed-48d7-b79a-cbe9b228ce43",
} );

const provider = new providers.JsonRpcProvider(
	"https://rpc.ankr.com/polygon_mumbai"
);
const wallet = new Wallet( process.env.PRIVATE_KEY || "", provider );

async function createAccount ()
{
	const module = await ECDSAOwnershipValidationModule.create( {
		signer: wallet,
		moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
	} )
	let biconomySmartAccount = await BiconomySmartAccountV2.create( {
		chainId: ChainId.POLYGON_MUMBAI,
		bundler: bundler,
		paymaster: paymaster,
		entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
		defaultValidationModule: module,
		activeValidationModule: module
	} )
	address = await biconomySmartAccount.getAccountAddress()
	console.log( address )
	smartAccount = biconomySmartAccount;

	return biconomySmartAccount;
}


const createSession = async () =>
{
	await createAccount();
	try
	{
		const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA"
		// -----> setMerkle tree tx flow
		// create dapp side session key
		const sessionSigner = ethers.Wallet.createRandom();
		const sessionKeyEOA = await sessionSigner.getAddress();
		console.log( "sessionKeyEOA", sessionKeyEOA );
		const sessionFileStorage: SessionFileStorage = new SessionFileStorage( address )

		// generate sessionModule
		console.log( "Adding session signer", sessionSigner.publicKey, sessionSigner );

		await sessionFileStorage.addSigner( sessionSigner )
		const sessionModule = await SessionKeyManagerModule.create( {
			moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
			smartAccountAddress: address,
			sessionStorageClient: sessionFileStorage
		} );

		// cretae session key data
		const sessionKeyData = defaultAbiCoder.encode(
			[ "address", "address", "address", "uint256" ],
			[
				sessionKeyEOA,
				"0xdA5289fCAAF71d52a80A254da614a192b693e977", // erc20 token address
				"0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
				ethers.utils.parseUnits( "50".toString(), 6 ).toHexString(), // 50 usdc amount
			]
		);
		const sessionTxData = await sessionModule.createSessionData( [
			{
				validUntil: 0,
				validAfter: 0,
				sessionValidationModule: erc20ModuleAddr,
				sessionPublicKey: sessionKeyEOA,
				sessionKeyData: sessionKeyData,
			},
		] );

		// tx to set session key
		const setSessiontrx = {
			to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
			data: sessionTxData.data,
		};

		const transactionArray = [];

		
		const isEnabled = await smartAccount.isModuleEnabled( DEFAULT_SESSION_KEY_MANAGER_MODULE )
		if ( !isEnabled )
		{
			const enableModuleTrx = await smartAccount.getEnableModuleData(
				DEFAULT_SESSION_KEY_MANAGER_MODULE
			);
			transactionArray.push( enableModuleTrx );
		}
		
		transactionArray.push( setSessiontrx )
		let partialUserOp = await smartAccount.buildUserOp( transactionArray, {
			paymasterServiceData: {
				mode: PaymasterMode.SPONSORED,
			}
		} );
		console.log( partialUserOp )
		const userOpResponse = await smartAccount.sendUserOp(
			partialUserOp
		);
		console.log( `userOp Hash: ${ userOpResponse.userOpHash }` );
		const transactionDetails = await userOpResponse.wait();
		console.log( "txHash", transactionDetails.receipt.transactionHash );

	} catch ( err: any ) {
		console.error( err )
	}

}

createSession();


```
</details>