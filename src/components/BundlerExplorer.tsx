//todo: clean this component up

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CodeBlock from "@theme/CodeBlock";
import "../css/explorer.css";
import sampleRequests from "../sampleRequests";

type FormValues = {
  bundlerUrl: string;
  userOp?: string;
  userOphash?: string;
  method: string;
};

export default function Explorer() {
  const [data, setData] = useState(null);
  const [sample, setSample] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const currentMethod = watch("method");
  const validateBundlerURL = (value) => {
    const chainIdPattern =
      /https:\/\/bundler\.biconomy\.io\/api\/v2\/(\d+)\/.+/;
    const result = value.match(chainIdPattern);

    if (result && result[1]) {
      const chainId = parseInt(result[1], 10);

      // Define the allowed chain IDs
      const allowedChainIds = [
        5, 80001, 97, 1442, 421613, 420, 43113, 84531, 59140, 5001, 5611,
      ];

      // Check if the extracted chain ID is within the allowed values
      const allowed = allowedChainIds.includes(chainId);
      if (allowed) return true;
      if (!allowed) return "Only testnet chains are allowed in explorer";
    }

    // If no match was found, return false
    return "Bundler URL incorrect";
  };

  const validateJson = (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return "Invalid JSON object please check the entered UserOp";
    }
  };

  const opsHashMethods = [
    "eth_getUserOperationReceipt",
    "eth_getUserOperationByHash",
    "biconomy_getUserOperationStatus",
  ];
  const noEditMethods = [
    "eth_chainId",
    "eth_supportedEntryPoints",
    "biconomy_getGasFeeValues",
  ];
  const fullFormMethods = [
    "eth_estimateUserOperationGas",
    "eth_sendUserOperation",
  ];

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (fullFormMethods.includes(data.method)) {
      const userOp = JSON.parse(data.userOp);
      const raw = {
        method: `${data.method}`,
        params: [
          {
            ...userOp,
          },
          "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
        ],
        id: 1697033406,
        jsonrpc: "2.0",
      };
      const formattedRequest = JSON.stringify(raw, null, 2);
      setSample(formattedRequest);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formattedRequest,
      };
      fetch(data.bundlerUrl, requestOptions)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => setData(error));
    } else if (opsHashMethods.includes(data.method)) {
      const raw = {
        method: `${data.method}`,
        params: [data.userOphash],
        id: 1693369916,
        jsonrpc: "2.0",
      };
      const formattedRequest = JSON.stringify(raw, null, 2);
      setSample(formattedRequest);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formattedRequest,
      };
      fetch(data.bundlerUrl, requestOptions)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => setData(error));
    } else if (noEditMethods.includes(data.method)) {
      const raw = {
        method: `${data.method}`,
        params: [],
        id: 1693369916,
        jsonrpc: "2.0",
      };
      const formattedRequest = JSON.stringify(raw, null, 2);
      setSample(formattedRequest);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formattedRequest,
      };
      fetch(data.bundlerUrl, requestOptions)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => setData(error));
    }
  };

  useEffect(() => {
    const raw = JSON.stringify(
      sampleRequests.eth_estimateUserOperationGas,
      null,
      2,
    );
    setSample(raw);
  }, []);

  useEffect(() => {
    console.log(currentMethod);
    const raw = JSON.stringify(sampleRequests[currentMethod], null, 2);
    setSample(raw);
  }, [currentMethod]);

  console.log(currentMethod);
  if (!currentMethod) {
    return (
      <div>
        <div className="requestContainer">
          <div className="formContainer">
            <h2>Edit Request</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="inputLabel">Method</label>
              <select
                {...register("method", { required: true })}
                className="inputField"
              >
                <option value="eth_estimateUserOperationGas">
                  eth_estimateUserOperationGas
                </option>
                <option value="eth_sendUserOperation">
                  eth_sendUserOperation
                </option>
                <option value="eth_getUserOperationReceipt">
                  eth_getUserOperationReceipt
                </option>
                <option value="eth_getUserOperationByHash">
                  eth_getUserOperationByHash
                </option>
                <option value="eth_chainId">eth_chainId</option>
                <option value="eth_supportedEntryPoints">
                  eth_supportedEntryPoints
                </option>
                <option value="biconomy_getGasFeeValues">
                  biconomy_getGasFeeValues
                </option>
                <option value="biconomy_getUserOperationStatus">
                  biconomy_getUserOperationStatus
                </option>
              </select>
              <label className="inputLabel">Bundler URL</label>
              <input
                {...register("bundlerUrl", {
                  required: "Bundler URL is required",
                  validate: (value) => validateBundlerURL(value),
                })}
                type="text"
                placeholder="Bundler URL"
                className="inputField"
              />
              {errors.bundlerUrl && (
                <p className="errorMsg">{errors.bundlerUrl.message}</p>
              )}
              <label className="inputLabel">UserOp</label>

              <textarea
                {...register("userOp", {
                  required: "UserOp object is required",
                  validate: (value) => validateJson(value),
                })}
                placeholder="UserOp Object"
                className="inputField"
                rows={5}
              />
              {errors.userOp && (
                <p className="errorMsg">{errors.userOp.message}</p>
              )}

              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          </div>
          {sample && (
            <div>
              <h2>Sample Request</h2>
              <CodeBlock
                language="json"
                showLineNumbers
                className="bundlerRequestBlock"
              >
                {sample}
              </CodeBlock>
            </div>
          )}
        </div>
        {data && (
          <div>
            <h2>Sample Response</h2>
            <CodeBlock language="json" showLineNumbers>
              {`${JSON.stringify(data, null, 2)}`}
            </CodeBlock>
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className="requestContainer">
        <div className="formContainer">
          <h2>Edit Request</h2>
          {opsHashMethods.includes(currentMethod) && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="inputLabel">Method</label>
              <select
                {...register("method", { required: true })}
                className="inputField"
              >
                <option value="eth_estimateUserOperationGas">
                  eth_estimateUserOperationGas
                </option>
                <option value="eth_sendUserOperation">
                  eth_sendUserOperation
                </option>
                <option value="eth_getUserOperationReceipt">
                  eth_getUserOperationReceipt
                </option>
                <option value="eth_getUserOperationByHash">
                  eth_getUserOperationByHash
                </option>
                <option value="eth_chainId">eth_chainId</option>
                <option value="eth_supportedEntryPoints">
                  eth_supportedEntryPoints
                </option>
                <option value="biconomy_getGasFeeValues">
                  biconomy_getGasFeeValues
                </option>
                <option value="biconomy_getUserOperationStatus">
                  biconomy_getUserOperationStatus
                </option>
              </select>
              <label className="inputLabel">Bundler URL</label>
              <input
                {...register("bundlerUrl", {
                  required: "Bundler URL is required",
                  validate: (value) => validateBundlerURL(value),
                })}
                type="text"
                placeholder="Bundler URL"
                className="inputField"
              />
              {errors.bundlerUrl && (
                <p className="errorMsg">{errors.bundlerUrl.message}</p>
              )}
              <label className="inputLabel">UserOphash</label>
              <input
                {...register("userOphash", {
                  required: "UserOphash is required",
                })}
                type="text"
                placeholder="UserOphash Hash"
                className="inputField"
              />
              {errors.userOp && (
                <p className="errorMsg">{errors.userOp.message}</p>
              )}

              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          )}
          {fullFormMethods.includes(currentMethod) && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="inputLabel">Method</label>
              <select
                {...register("method", { required: true })}
                className="inputField"
              >
                <option value="eth_estimateUserOperationGas">
                  eth_estimateUserOperationGas
                </option>
                <option value="eth_sendUserOperation">
                  eth_sendUserOperation
                </option>
                <option value="eth_getUserOperationReceipt">
                  eth_getUserOperationReceipt
                </option>
                <option value="eth_getUserOperationByHash">
                  eth_getUserOperationByHash
                </option>
                <option value="eth_chainId">eth_chainId</option>
                <option value="eth_supportedEntryPoints">
                  eth_supportedEntryPoints
                </option>
                <option value="biconomy_getGasFeeValues">
                  biconomy_getGasFeeValues
                </option>
                <option value="biconomy_getUserOperationStatus">
                  biconomy_getUserOperationStatus
                </option>
              </select>
              <label className="inputLabel">Bundler URL</label>
              <input
                {...register("bundlerUrl", {
                  required: "Bundler URL is required",
                  validate: (value) => validateBundlerURL(value),
                })}
                type="text"
                placeholder="Bundler URL"
                className="inputField"
              />
              {errors.bundlerUrl && (
                <p className="errorMsg">{errors.bundlerUrl.message}</p>
              )}
              <label className="inputLabel">UserOp</label>

              <textarea
                {...register("userOp", {
                  required: "UserOp object is required",
                  validate: (value) => validateJson(value),
                })}
                placeholder="UserOp Object"
                className="inputField"
                rows={5}
              />
              {errors.userOp && (
                <p className="errorMsg">{errors.userOp.message}</p>
              )}

              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          )}
          {noEditMethods.includes(currentMethod) && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="inputLabel">Method</label>
              <select
                {...register("method", { required: true })}
                className="inputField"
              >
                <option value="eth_estimateUserOperationGas">
                  eth_estimateUserOperationGas
                </option>
                <option value="eth_sendUserOperation">
                  eth_sendUserOperation
                </option>
                <option value="eth_getUserOperationReceipt">
                  eth_getUserOperationReceipt
                </option>
                <option value="eth_getUserOperationByHash">
                  eth_getUserOperationByHash
                </option>
                <option value="eth_chainId">eth_chainId</option>
                <option value="eth_supportedEntryPoints">
                  eth_supportedEntryPoints
                </option>
                <option value="biconomy_getGasFeeValues">
                  biconomy_getGasFeeValues
                </option>
                <option value="biconomy_getUserOperationStatus">
                  biconomy_getUserOperationStatus
                </option>
              </select>
              <label className="inputLabel">Bundler URL</label>
              <input
                {...register("bundlerUrl", {
                  required: "Bundler URL is required",
                  validate: (value) => validateBundlerURL(value),
                })}
                type="text"
                placeholder="Bundler URL"
                className="inputField"
              />
              {errors.bundlerUrl && (
                <p className="errorMsg">{errors.bundlerUrl.message}</p>
              )}
              {errors.userOp && (
                <p className="errorMsg">{errors.userOp.message}</p>
              )}

              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          )}
        </div>
        {sample && (
          <div>
            <h2>Sample Request</h2>
            <CodeBlock
              language="json"
              showLineNumbers
              className="bundlerRequestBlock"
            >
              {sample}
            </CodeBlock>
          </div>
        )}
      </div>
      {data && (
        <div>
          <h2>Sample Response</h2>
          <CodeBlock language="json" showLineNumbers>
            {`${JSON.stringify(data, null, 2)}`}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
