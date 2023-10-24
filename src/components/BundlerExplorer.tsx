import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import CodeBlock from '@theme/CodeBlock'
import "../css/explorer.css"

const initialState = {
  "sender": "0x4f7cb0db90926d15b0666ecf52f9b80b09585981",
  "nonce": "0x0b",
  "initCode": "0x",
  "callData": "0x9e5d4c490000000000000000000000000a7755bdfb86109d9d403005741b415765eaf1bc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002440d097c30000000000000000000000004f7cb0db90926d15b0666ecf52f9b80b0958598100000000000000000000000000000000000000000000000000000000",
  "signature": "0x73c3ac716c487ca34bb858247b5ccf1dc354fbaabdd089af3b2ac8e78ba85a4959a2d76250325bd67c11771c31fccda87c33ceec17cc0de912690521bb95ffcb1b",
  "maxFeePerGas": "0x05f5e132",
  "maxPriorityFeePerGas": "0x05f5e132",
  "verificationGasLimit": "77162",
  "callGasLimit": "78403",
  "preVerificationGas": "67656",
  "paymasterAndData": "0x"
}

type FormValues = {
  bundlerUrl: string;
  userOp?: string;
  userOphash?: string;
  method: string;
};

export default function Explorer() {

  const [ data, setData ] = useState(null)
  const [ sample, setSample ] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
} = useForm<FormValues>();


  const currentMethod = watch("method")
  const validateBundlerURL = (value) => {
    const chainIdPattern = /https:\/\/bundler\.biconomy\.io\/api\/v2\/(\d+)\/.+/;
    const result = value.match(chainIdPattern);
    
    if (result && result[1]) {
      const chainId = parseInt(result[1], 10);
  
      // Define the allowed chain IDs
      const allowedChainIds = [5, 80001, 97, 1442, 421613, 420, 43113, 84531, 59140, 5001, 5611];
      
      // Check if the extracted chain ID is within the allowed values
      const allowed = allowedChainIds.includes(chainId);
      if (allowed) return true;
      if (!allowed) return "Only testnet chains are allowed in explorer";
    }
  
    // If no match was found, return false
    return "Bundler URL incorrect";
  }

  const validateJson = (value) => {
    try {
      JSON.parse(value)
      return true
    } catch (error) {
      return "Invalid JSON object please check the entered UserOp"
    }
  }
  
  const test = "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Form Data Submitted:', data);
    if (data.method === "eth_estimateUserOperationGas") {
      const userOp = JSON.parse(data.userOp)
      const raw = {
        "method": "eth_estimateUserOperationGas",
        "params": [
            {
                ...userOp
            },
            "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
        ],
        "id": 1697033406,
        "jsonrpc": "2.0"
    }
    const formattedRequest = JSON.stringify(raw, null, 2)
      setSample(formattedRequest)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formattedRequest,
      };
        fetch(data.bundlerUrl, requestOptions)
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => setData(error));
    } else if (data.method === "eth_sendUserOperation"){
      const userOp = JSON.parse(data.userOp)
      const raw = {
        "method": "eth_sendUserOperation",
        "params": [
            {
                ...userOp
            },
            "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
            {
                "simulation_type": "validation"
            }
        ],
        "id": 1697033407,
        "jsonrpc": "2.0"
    }
    const formattedRequest = JSON.stringify(raw, null, 2)
      setSample(formattedRequest)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formattedRequest,
      };
        fetch(data.bundlerUrl, requestOptions)
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => setData(error));
    } else if (data.method === "eth_getUserOperationReceipt") {
      const raw = {
        "method": "eth_getUserOperationReceipt",
        "params": [data.userOphash],
        "id": 1693369916,
        "jsonrpc": "2.0",
    }
    const formattedRequest = JSON.stringify(raw, null, 2)
      setSample(formattedRequest)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formattedRequest,
      };
        fetch(data.bundlerUrl, requestOptions)
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => setData(error));

    }
};


useEffect(() => {
  const raw = JSON.stringify({
    "method": "eth_estimateUserOperationGas",
    "params": [
        {
            "sender": "0x0000000000000000000000000000000000000000",
            "nonce": "0x0",
            "initCode": "0x",
            "callData": "0x",
            "signature": "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
            "paymasterAndData": "0x"
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
    ],
    "id": 1697033406,
    "jsonrpc": "2.0"
}, null, 2);
  setSample(raw)
},[])

  return (
      <div>
        <div className='requestContainer'>
        <div className="formContainer">
        <h2>Edit Request</h2>
            {
              currentMethod === "eth_getUserOperationReceipt" ? (
                <form onSubmit={handleSubmit(onSubmit)}>
            <label className="inputLabel">Method</label>
                <select {...register('method', { required: true })} className="inputField">
                    <option value="eth_estimateUserOperationGas">eth_estimateUserOperationGas</option>
                    <option value="eth_sendUserOperation">eth_sendUserOperation</option>
                    <option value="eth_getUserOperationReceipt">eth_getUserOperationReceipt</option>
                </select>
            <label className="inputLabel">Bundler URL</label>
                <input
                    {...register('bundlerUrl', {
                        required: 'Bundler URL is required',
                        validate: (value) => validateBundlerURL(value)
                    })}
                    type="text"
                    placeholder="Bundler URL"
                    className="inputField"
                />
                {errors.bundlerUrl && <p className='errorMsg'>{errors.bundlerUrl.message}</p>}
                <label className="inputLabel">UserOphash</label>
                <input
                    {...register('userOphash', {
                        required: 'UserOphash is required'
                    })}
                    type="text"
                    placeholder="UserOphash Hash"
                    className="inputField"
                />
                {errors.userOp && <p className='errorMsg'>{errors.userOp.message}</p>}

                <button type="submit" className="submitButton">
                    Submit
                </button>
            </form>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
            <label className="inputLabel">Method</label>
                <select {...register('method', { required: true })} className="inputField">
                    <option value="eth_estimateUserOperationGas">eth_estimateUserOperationGas</option>
                    <option value="eth_sendUserOperation">eth_sendUserOperation</option>
                    <option value="eth_getUserOperationReceipt">eth_getUserOperationReceipt</option>
                </select>
            <label className="inputLabel">Bundler URL</label>
                <input
                    {...register('bundlerUrl', {
                        required: 'Bundler URL is required',
                        validate: (value) => validateBundlerURL(value)
                    })}
                    type="text"
                    placeholder="Bundler URL"
                    className="inputField"
                />
                {errors.bundlerUrl && <p className='errorMsg'>{errors.bundlerUrl.message}</p>}
                <label className="inputLabel">UserOp</label>
                
                <textarea
                    {...register('userOp', { 
                      required: 'UserOp object is required',
                      validate: (value) => validateJson(value)
                    })}
                    placeholder="UserOp Object"
                    className="inputField"
                    rows={5}
                />
                {errors.userOp && <p className='errorMsg'>{errors.userOp.message}</p>}

                <button type="submit" className="submitButton">
                    Submit
                </button>
            </form>
              )
            }
        </div>
        {sample && (
          <div>
          <h2>Sample Request</h2>
          <CodeBlock
          language='json'
          showLineNumbers
          className='bundlerRequestBlock'
        >
          {sample}
        </CodeBlock>
        </div>
        )}
        </div>
        {data && (
          <div>
          <h2>Sample Response</h2>
          <CodeBlock
          language='json'
          showLineNumbers
        >
          {`${JSON.stringify(data, null, 2)}`}
        </CodeBlock>
        </div>
        )}
      </div>
  );
}