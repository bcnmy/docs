---
sidebar_label: "Paymaster sponsored"
---

# Paymaster sponsored
This tutorial represents the API integration flow where paymaster is used to sponsor the transactions.

## Pre-requisites:

- Biconomy bundler url (refer to the [docs](/dashboard#bundler-keys) to get the same)
- Partial user operation, where
    - sender is the smart account Address
    - nonce can be calculated using the smart account contract methods
    - initCode will be 0x, if the account is already deployed or can be fetched using contract methods
    - paymasterAndData will be 0x initially.
    - callData is the abi encoded form of transaction
    - It also requires putting a semi-valid/ dummy signature (e.g. a signature in the right length).

```ts
let partialUserOp = {
        sender: '0x4dF23B78543F5c2F9CBCDF09956288B3e97bb9a4',
        nonce: '0x08',
        initCode: "0x",
        paymasterAndData: "0x",
        callData: "0x0000189a000000000000000000000000322af0da66d00be980c7aa006377fcaaeee3bdfd000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
        signature: "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
    }
```

## 1. Calculate Gas estimations: 
Based on the response, update the userOp gas values. Pass the dummy values to gas limits, which will be updated based on the paymaster call.

```ts
async function getGasEstimations (userOp: any) {
    console.log((await signer.getAddress()))
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const data =
    {
      "method": "biconomy_getGasFeeValues",
      "params": [
        {
          "sender":userOp.sender,
          "nonce": Number(userOp.nonce).toString() ,
          "initCode":"0x" ,
          "callData":userOp.callData ,
          "signature":userOp.signature ,
          "paymasterAndData":userOp.paymasterAndData
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
      ],
      "id": 169703346,
      "jsonrpc": "2.0"
    }
    
    try{
        const response = await axios.post(url, data);
        console.log('Response:', response.data);
        userOp.callGasLimit =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.verificationGasLimit =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.preVerificationGas =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.maxPriorityFeePerGas = response.data.result.maxPriorityFeePerGas
        userOp.maxFeePerGas = response.data.result.maxFeePerGas
        console.log(userOp)
        return userOp;
    }
    catch (error) {
      console.log(error);
        return error
    }
    
}
```
If you are facing any error in this step, make sure your smart account wallet has sufficient funds and the nonce is correct.

## 2. Get paymaster data:

```ts
async function getPaymasterData (userOp: any) {
    
    const url="https://paymaster.biconomy.io/api/v1/80001/HvwSf9p7Q.a898f606-37ed-48d7-b79a-cbe9b228ce43"
    
    const requestData = {
        jsonrpc: '2.0',
        method: 'pm_sponsorUserOperation',
        id: 1,
        params: [
          {
            sender: userOp.sender,
            nonce: userOp.nonce,
            initCode: userOp.initCode,
            callData: userOp.callData,
            signature: userOp.signature,
            preVerificationGas: Number(userOp.preVerificationGas).toString(),
            verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
            callGasLimit: Number(userOp.callGasLimit).toString(),
            maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
            maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
            paymasterAndData: "0x"
          },
          {
            mode: 'SPONSORED',
            sponsorshipInfo: {
              webhookData: {},
              smartAccountInfo: {
                name: 'BICONOMY',
                version: '2.0.0',
              },
            },
            expiryDuration: 300,
            calculateGasLimits: true,
          },
        ],
    };
    try{
        const response = await axios.post(url, requestData);
        console.log('Response:', response.data);

        userOp.paymasterAndData = response.data.result.paymasterAndData
        userOp.preVerificationGas = response.data.result.preVerificationGas
        userOp.verificationGasLimit = response.data.result.verificationGasLimit
        userOp.callGasLimit = response.data.result.callGasLimit
        return userOp;

    } catch (error) {
      console.error(error);
        return error;
    }
    
}
```

## 3. Sign userOperation
To sign the userOp, calculate the userOpHash and then sign it using the same signer, account was created. you can find more details here. Follow this tutorial to learn about signing the userOp.

```ts

async function signUserOp (userOp: any) {
    const userOpHash = getUserOpHash(userOp);
    console.log("userOpHash", userOpHash)

    const moduleSig = await signer.signMessage(ethers.utils.arrayify(userOpHash));
    const signatureWithModuleAddress = ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [moduleSig, "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e"],
      );
    userOp.signature = signatureWithModuleAddress
    return userOp;
}

```

## 4. Send UserOperation: 
eth_sendUserOperation sends a user operation to the given network.

```ts
async function sendUserOp(userOp: any) {
    
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const requestData = {
        jsonrpc: '2.0',
        method: 'eth_sendUserOperation',
        id: getTimestampInSeconds(),
        params: [
          {
            sender: userOp.sender,
            nonce: userOp.nonce,
            initCode: userOp.initCode,
            callData: userOp.callData,
            signature: userOp.signature,
            preVerificationGas: Number(userOp.preVerificationGas).toString(),
            verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
            callGasLimit: Number(userOp.callGasLimit).toString(),
            maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
            maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
            paymasterAndData: userOp.signature
          },
          "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
        ],
    };
    
    try{
    axios.post(url, requestData)
      .then((response: AxiosResponse) => {
        console.log('Send userOp Response:', response.data);
       
        return userOp;
      })
      .catch((error: AxiosError) => {
        // Handle error
        if (error.response) {
          console.error('Response Error:', error.response.data);
        } else if (error.request) {
          console.error('Request Error:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      });
        
    } catch (error) {
      console.log(error);
        return error
    }
    
}
```

If you are facing errors while integration, do checkout the [common errors](/troubleshooting/commonerrors.md).
<details>
<summary>View Complete Code</summary>

```ts
import { ethers, utils } from "ethers";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai" );
let signer = new ethers.Wallet("private key", provider);



async function getGasEstimations (userOp: any) {
    console.log((await signer.getAddress()))
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const data =
    {
      "method": "biconomy_getGasFeeValues",
      "params": [
        {
          "sender":userOp.sender,
          "nonce": Number(userOp.nonce).toString() ,
          "initCode":"0x" ,
          "callData":userOp.callData ,
          "signature":userOp.signature ,
          "paymasterAndData":userOp.paymasterAndData
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
      ],
      "id": 169703346,
      "jsonrpc": "2.0"
    }
    
    try{
        const response = await axios.post(url, data);
        console.log('Response:', response.data);
        userOp.callGasLimit =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.verificationGasLimit =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.preVerificationGas =  response.data.result.maxPriorityFeePerGas // mock values
        userOp.maxPriorityFeePerGas = response.data.result.maxPriorityFeePerGas
        userOp.maxFeePerGas = response.data.result.maxFeePerGas
        console.log(userOp)
        return userOp;
    }
    catch (error) {
      console.log(error);
        return error
    }
    
}

async function getPaymasterData (userOp: any) {
    
    const url="https://paymaster.biconomy.io/api/v1/80001/HvwSf9p7Q.a898f606-37ed-48d7-b79a-cbe9b228ce43"
    
    const requestData = {
        jsonrpc: '2.0',
        method: 'pm_sponsorUserOperation',
        id: 1,
        params: [
          {
            sender: userOp.sender,
            nonce: userOp.nonce,
            initCode: userOp.initCode,
            callData: userOp.callData,
            signature: userOp.signature,
            preVerificationGas: Number(userOp.preVerificationGas).toString(),
            verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
            callGasLimit: Number(userOp.callGasLimit).toString(),
            maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
            maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
            paymasterAndData: "0x"
          },
          {
            mode: 'SPONSORED',
            sponsorshipInfo: {
              webhookData: {},
              smartAccountInfo: {
                name: 'BICONOMY',
                version: '2.0.0',
              },
            },
            expiryDuration: 300,
            calculateGasLimits: true,
          },
        ],
    };
    try{
        const response = await axios.post(url, requestData);
        console.log('Response:', response.data);

        userOp.paymasterAndData = response.data.result.paymasterAndData
        userOp.preVerificationGas = response.data.result.preVerificationGas
        userOp.verificationGasLimit = response.data.result.verificationGasLimit
        userOp.callGasLimit = response.data.result.callGasLimit
        return userOp;

    } catch (error) {
      console.error(error);
        return error;
    }
    
}
function getUserOpHash(useOpMinusSignature: any) {
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

async function signUserOp (userOp: any) {
    const userOpHash = getUserOpHash(userOp);
    console.log("userOpHash", userOpHash)

    const moduleSig = await signer.signMessage(ethers.utils.arrayify(userOpHash));
    const signatureWithModuleAddress = ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [moduleSig, "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e"],
      );
    userOp.signature = signatureWithModuleAddress
    return userOp;
}

async function sendUserOp(userOp: any) {
    console.log(userOp)
    const url="https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
    
    const requestData = {
        jsonrpc: '2.0',
        method: 'eth_sendUserOperation',
        id: 555,
        params: [
          {
            sender: userOp.sender,
            nonce: userOp.nonce,
            initCode: userOp.initCode,
            callData: userOp.callData,
            signature: userOp.signature,
            preVerificationGas: Number(userOp.preVerificationGas).toString(),
            verificationGasLimit: Number(userOp.verificationGasLimit).toString(),
            callGasLimit: Number(userOp.callGasLimit).toString(),
            maxFeePerGas: Number(userOp.maxFeePerGas).toString(),
            maxPriorityFeePerGas: Number(userOp.maxPriorityFeePerGas).toString(),
            paymasterAndData: userOp.signature 
          },
          "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
        ],
    };
    
    try{
    axios.post(url, requestData)
      .then((response: AxiosResponse) => {
        console.log('Send userOp Response:', response.data);
       
        return userOp;
      })
      .catch((error: AxiosError) => {
        // Handle error
        if (error.response) {
          console.error('Response Error:', error.response.data);
        } else if (error.request) {
          console.error('Request Error:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      });
        
    } catch (error) {
      console.log(error);
        return error
    }
    
}
async function executePartialUserOp() {
    
 try {
    let partialUserOp = {
        sender: '0x4dF23B78543F5c2F9CBCDF09956288B3e97bb9a4',
        nonce: '0x1D',
        initCode: "0x",
        paymasterAndData: "0x",
        callData: "0x0000189a000000000000000000000000322af0da66d00be980c7aa006377fcaaeee3bdfd000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
        signature: "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
    }

    // Step 1 Gas estimation
    let userOp = await getGasEstimations(partialUserOp)

    // Step 2 Get paymaster data
    userOp = await getPaymasterData(userOp)

    // Step 3 sign user op
    userOp = await signUserOp(userOp)

    // Step 4: send user operation
    await sendUserOp(userOp);
    
  }
  catch (error) {
        console.log(error)
   }
}

executePartialUserOp();
```
</details>