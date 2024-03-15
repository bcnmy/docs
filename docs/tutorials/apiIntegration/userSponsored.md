---
sidebar_label: "User sponsored"
sidebar_position: 1
---

# User sponsored
This tutorial represents the API integration flow where smart contract wallet has the native tokens to sponsor the transaction.

## Pre-requisites: 

- Biconomy bundler url (refer to the [docs](/dashboard#bundler-keys) to get the same)
- Partial user operation, where
    - sender is the smart account Address
    - nonce can be calculated using the smart account contract methods.
    - initCode will be 0x, if the account is already deployed or can be fetched using contract methods.
    - paymasterAndData will be 0x, given the smart account has native tokens to pay for the gasFees.
    - callData is the abi encoded form of transaction.
    - It also requires putting a semi-valid/ dummy signature (e.g. a signature in the right length).

```ts
type UserOperation = {
  sender: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
}

let partialUserOp: Partial<UserOperation> = {
  sender: '0x4dF23B78543F5c2F9CBCDF09956288B3e97bb9a4',
  nonce: '0x08',
  initCode: "0x",
  paymasterAndData: "0x",
  callData: "0x0000189a000000000000000000000000322af0da66d00be980c7aa006377fcaaeee3bdfd000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
  signature: "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
}
```

## 1. Calculate Gas estimations: 
Based on the response, update the userOp gas limits and values.

```ts
async function getGasEstimations (partialUserOp: Partial<UserOperation>) : Promise<UserOperation> {
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const data =
    {
      "method": "eth_estimateUserOperationGas",
      "params": [
        {
          "sender": partialUserOp.sender,
          "nonce":Number(partialUserOp.nonce).toString() ,
          "initCode":"0x" ,
          "callData":partialUserOp.callData ,
          "signature":partialUserOp.signature ,
          "paymasterAndData":partialUserOp.paymasterAndData
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
      ],
      "id": Date.now(),
      "jsonrpc": "2.0"
    }
    
    const response = await axios.post(url, data);
    console.log('Response:', response.data);
    const { callGasLimit, verificationGasLimit, preVerificationGas, maxPriorityFeePerGas, maxFeePerGas} = response.data.result
    return { ...partialUserOp, callGasLimit, verificationGasLimit, preVerificationGas, maxPriorityFeePerGas, maxFeePerGas } as UserOperation;
}
```
If you are facing any AA** error, please refer to [common errors](/troubleshooting/commonerrors.md). Also, make sure your smart account wallet has sufficient funds to sponsor the transaction even to estimate gas.

## 2. Sign userOperation
To sign the userOp, calculate the userOpHash and then sign it using the same signer, account was created. Follow [this](/tutorials/apiIntegration/signUserOperation.md) tutorial to learn about signing the userOp. Below is an example with [ECDSA module](/Modules/ecdsa).

```ts
async function signUserOp (userOp: UserOperation) {
    const userOpHash = getUserOpHash(userOp); // It's defined in the full code in the end.
    console.log("userOpHash", userOpHash)

    const moduleSig = await signer.signMessage(ethers.utils.arrayify(userOpHash));
    const signatureWithModuleAddress = ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [moduleSig, "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e"],
      );
    return { ...userOp, signature: signatureWithModuleAddress };
    
}
```

## 3. Send UserOperation: 
eth_sendUserOperation sends a user operation to the given network.

```ts
async function sendUserOp(userOp: UserOperation) {
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const requestData = {
        jsonrpc: '2.0',
        method: 'eth_sendUserOperation',
        id: Date.now(),
        params: [
            {
                ...userOp,
                preVerificationGas: Number(userOp.preVerificationGas).toString(),
                verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
                callGasLimit: Number(userOp.callGasLimit).toString(),
                maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
                maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
                paymasterAndData: "0x"
            },
            "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
        ],
    };
    const response = await axios.post(url, requestData);
    return response.data.result;
}
```
## 4. Fetch user operation receipt
This API returns null until the transaction is mined, you will either need to poll or set a timeout. For reference checkout the sdk [code](https://github.com/bcnmy/biconomy-client-sdk/blob/main/packages/bundler/src/Bundler.ts#L159). You can also get transaction hash from the response

```ts
async function getUserOpReceipt(userOpHash: string) {
  const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
  const requestData = {
    jsonrpc: '2.0',
    method: 'eth_getUserOperationReceipt',
    id: 4545,
    params: [userOpHash],
  };

  const { data } = await axios.post(url, requestData);
  return data.result;
}
```

If you are facing errors while integration, do checkout the [common errors](/troubleshooting/commonerrors.md).
<details>
<summary>View Complete Code</summary>

```ts
import { ethers } from "ethers";
import axios from 'axios';
import { BigNumberish, BytesLike } from "ethers";

let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai" );
let signer = new ethers.Wallet("private key", provider);

type UserOperation = {
  sender: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
}

async function getGasEstimations (partialUserOp: Partial<UserOperation>) : Promise<UserOperation> {
    console.log((await signer.getAddress()))
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const data =
    {
      "method": "eth_estimateUserOperationGas",
      "params": [
        {
          "sender": partialUserOp.sender,
          "nonce":Number(partialUserOp.nonce).toString() ,
          "initCode":"0x" ,
          "callData":partialUserOp.callData ,
          "signature":partialUserOp.signature ,
          "paymasterAndData":partialUserOp.paymasterAndData
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
      ],
      "id": Date.now(),
      "jsonrpc": "2.0"
    }
    
    const response = await axios.post(url, data);
    console.log('Response:', response.data);
    const { callGasLimit, verificationGasLimit, preVerificationGas, maxPriorityFeePerGas, maxFeePerGas} = response.data.result
    return { ...partialUserOp, callGasLimit, verificationGasLimit, preVerificationGas, maxPriorityFeePerGas, maxFeePerGas } as UserOperation;

}
function getUserOpHash(useOpMinusSignature: UserOperation): string {
    console.log("useOpMinusSignature", useOpMinusSignature)
    const packedData = ethers.utils.defaultAbiCoder.encode(
        [
          "address","uint256","bytes32","bytes32","uint256","uint256","uint256","uint256","uint256","bytes32",
        ],
        [
          useOpMinusSignature.sender,
          useOpMinusSignature.nonce,
          ethers.utils.keccak256(useOpMinusSignature.initCode),
          ethers.utils.keccak256(useOpMinusSignature.callData),
          useOpMinusSignature.callGasLimit,
          useOpMinusSignature.verificationGasLimit,
          useOpMinusSignature.preVerificationGas,
          useOpMinusSignature.maxFeePerGas,
          useOpMinusSignature.maxPriorityFeePerGas,
          ethers.utils.keccak256(useOpMinusSignature.paymasterAndData),
        ]
      );
      
      const enc = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "uint256"],
        [ethers.utils.keccak256(packedData), "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789", 80001]
      );
      
      const userOpHash = ethers.utils.keccak256(enc);
      return userOpHash;
}

async function signUserOp (userOp: UserOperation): Promise<UserOperation> {
    const userOpHash = getUserOpHash(userOp);
    console.log("userOpHash", userOpHash)

    const moduleSig = await signer.signMessage(ethers.utils.arrayify(userOpHash));
    const signatureWithModuleAddress = ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [moduleSig, "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e"],
      );
    return { ...userOp, signature: signatureWithModuleAddress };
}

async function sendUserOp(userOp: UserOperation) {
  const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
  const requestData = {
    jsonrpc: '2.0',
    method: 'eth_sendUserOperation',
    id: Date.now(),
    params: [
        {
            ...userOp,
            preVerificationGas: Number(userOp.preVerificationGas).toString(),
            verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
            callGasLimit: Number(userOp.callGasLimit).toString(),
            maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
            maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
            paymasterAndData: "0x"
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
    ],
};
const response = await axios.post(url, requestData);
return response.data.result;
}

async function getUserOpReceipt(userOpHash: string) {
  const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
  const requestData = {
    jsonrpc: '2.0',
    method: 'eth_getUserOperationReceipt',
    id: 4545,
    params: [userOpHash],
  };

  const { data } = await axios.post(url, requestData);
  return data.result;
}

async function executePartialUserOp() {
 try {
  let partialUserOp : Partial<UserOperation> = {
        sender: '0x4dF23B78543F5c2F9CBCDF09956288B3e97bb9a4',
        nonce: '36',
        initCode: "0x",
        paymasterAndData: "0x",
        callData: "0x0000189a000000000000000000000000322af0da66d00be980c7aa006377fcaaeee3bdfd000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
        signature: "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
    }

    // Step 1 Gas estimation
    let userOp = await getGasEstimations(partialUserOp)

    // Step 2 sign user op
    userOp = await signUserOp(userOp)

    // // Step 3: send user operation
    const userOpHash = await sendUserOp(userOp);
    console.log("userOpHash", userOpHash)
    // // Step 4: Get UserOpReceipt
    const reciept = await getUserOpReceipt(userOpHash);
    
  }
  catch (error) {
        console.log(error)
   }
}

executePartialUserOp();
```
</details>