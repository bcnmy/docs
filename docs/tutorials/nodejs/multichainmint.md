---
sidebar_label: 'Multi Chain NFT Mint'
sidebar_position: 6
---

# Mint your NFT on Multiple chains with one signature

In this guide, we will edit the functionality in the gasless transaction section to switch from minting an NFT on one chain to two chains with one signature. 

We will mint the NFT on both Polygon and Base testnetworks. If you are using the bundler and Paymaster URLs in this tutorial you will not need to do anything on the Dashboard. If you are following along with your own contract make sure to register your new contracts on Base as well as Polygon. In our case our contract is the same address on both networks (0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e). 

<details>
  <summary> Click to view code from previous section </summary>

```typescript

import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { Wallet, providers, ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto, 
} from '@biconomy/paymaster'

config()



const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',    
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a' 
})

const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

const module = await ECDSAOwnershipValidationModule.create({
  signer: wallet,
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
})

let smartAccount: BiconomySmartAccountV2
let address: string

async function createAccount() {
  console.log("creating address")
  let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    paymaster: paymaster, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module
})
  address = await biconomySmartAccount.getAccountAddress()
  smartAccount = biconomySmartAccount;
  return biconomySmartAccount;
}

async function mintNFT() {
  await createAccount()
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);
  
  const data = nftInterface.encodeFunctionData("safeMint", [address]);

  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  const transaction = {
    to: nftAddress,
    data: data,
  };

  console.log("creating nft mint userop")
  let partialUserOp = await smartAccount.buildUserOp([transaction]);

  const biconomyPaymaster =
  smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  let paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
  };
  console.log("getting paymaster and data")
  try {
  const paymasterAndDataResponse =
    await biconomyPaymaster.getPaymasterAndData(
      partialUserOp,
      paymasterServiceData
    );
    partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
  } catch (e) {
  console.log("error received ", e);
  }
  console.log("sending userop")
  try {
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();
    console.log(
        `transactionDetails: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`
      )
    console.log(
      `view minted nfts for smart account: https://testnets.opensea.io/${address}`
    )
    } catch (e) {
      console.log("error received ", e);
    }
  };

  mintNFT();

```



</details>

## Switch to MultiChain Validator

Let's update the import for the modules and switch over to the Multichain Validator: 

```typescript

import { MultiChainValidationModule, DEFAULT_MULTICHAIN_MODULE } from "@biconomy-devx/modules";

```

Now change out the bundle:

```typescript

const multiChainModule = await MultiChainValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE
  })

```

Remember to update your Smart Account Config as well: 

```typescript

const biconomySmartAccountConfig1 = {
    signer: signer,
    chainId: ChainId.POLYGON_MUMBAI,
    paymaster: paymaster, 
    bundler: bundler, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  };

```

## Set up Base 

So far we only made changes on the MultiChain Module to work with Polygon. Now lets add support for Base with additional Paymaster, Bundler, and Smart Account Instance: 

```typescript
   const baseBundler = new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: config.chainId,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const basePaymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/84531/m814QNmpW.fce62d8f-41a1-42d8-9f0d-2c65c10abe9a' 
})

```
Now add the following in your connect function in order to initialize an instance of your Smart Account on Base:

```typescript

  // create biconomy smart account instance
  let baseAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.BASE_GOERLI_TESTNET,
    paymaster: basePaymaster, 
    bundler: baseBundler, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  });

```

Now let's add the second NFT mint transaction: 

```typescript
  const baseAddress = await baseAccount.getAccountAddress();


  const data2 = nftInterface.encodeFunctionData("safeMint", [baseAddress]);

  const transaction2 = {
    to: nftAddress,
    data: data2,
  };

  let partialUserOp2 = await biconomySmartAccount2.buildUserOp([transaction2]);

  const returnedOps = await multiChainModule.signUserOps([{userOp: partialUserOp, chainId: 80001}, {userOp: partialUserOp2, chainId: 84531}]);
```
Finally lets update the the try catch block to execute our mint on both networks: 

```typescript

  try{
  const userOpResponse1 = await biconomySmartAccount.sendSignedUserOp(returnedOps[0] as any);
  const transactionDetails1 = await userOpResponse1.wait();
  console.log(`transactionDetails: ${JSON.stringify(transactionDetails1, null, "\t")}`);
 } catch (e) {
    console.log("error received ", e);
  }


  try{
  const userOpResponse2 = await baseAccount.sendSignedUserOp(returnedOps[1] as any);
  const transactionDetails2 = await userOpResponse2.wait();
  console.log(`transactionDetails: ${JSON.stringify(transactionDetails2, null, "\t")}`);
  } catch (e) {
    console.log("error received ", e);
  }

```