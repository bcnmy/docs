---
sidebar_label: "Session Validation Module"
sidebar_position: 2
---

# Session Validation Module

Diving into the **Session Validation Module**, we explore its significance and interaction with the **Session Key Manager Module** via SDK.

:::note
Understanding the **Session Validation Modules** is crucial for leveraging **session keys** effectively in blockchain applications, particularly for tasks like managing ERC20 token transfers.
:::

## The Purpose of Session Validation Modules

At the core, a Session Validation Module is a smart contract designed to authenticate whether a user's operation complies with the permissions set within a session key. It functions to validate user operations based on pre-defined session key permissions.

:::info
**Key Functionality**: We'll dissect a deployed contract that validates permissions for ERC20 token transfers, enabling dApps to execute transactions without user signatures every time.
Check the contract [here](https://mumbai.polygonscan.com/address/0x000000D50C68705bd6897B2d17c7de32FB519fDA#code).
:::

## Breaking Down the Contract

The smart contract we focus on is structured to validate user operations (userOps) for ERC20 transfers using session key signatures. It's tailored for standard ERC20 tokens and can interact with any contract implementing the method `(address, uint256)` interface.

:::warning
**Technical Deep Dive**: The following contract breakdown is technical in nature, aimed at developers with a solid understanding of smart contract functionalities.
:::

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./ISessionValidationModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ERC20 Session Validation Module for Biconomy Smart Accounts.
 * @dev Validates userOps for ERC20 transfers and approvals using a session key signature.
 */
contract ERC20SessionValidationModule is ISessionValidationModule {

    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
    ) external virtual override returns (address) {

        // Decode the session key data
        (address sessionKey, address token, address recipient, uint256 maxAmount) =
            abi.decode(_sessionKeyData, (address, address, address, uint256));

        // Validate the contract and call value
        require(destinationContract == token, "Invalid Token");
        require(callValue == 0, "Non Zero Value");

        // Check recipient and amount
        (address recipientCalled, uint256 amount) =
            abi.decode(_funcCallData[4:], (address, uint256));
        require(recipient == recipientCalled, "Wrong Recipient");
        require(amount <= maxAmount, "Max Amount Exceeded");
        return sessionKey;
    }

    /**
     * @dev Validates if the UserOperation matches the SessionKey permissions.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external pure override returns (bool) {

        // Ensure correct operation and signature
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
            bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "Invalid Selector"
        );

        // Decode session key data
        (address sessionKey, address token, address recipient, uint256 maxAmount) =
            abi.decode(_sessionKeyData, (address, address, address, uint256));

        // Validate token and call value
        (address tokenAddr, uint256 callValue, ) =
            abi.decode(_op.callData[4:], (address, uint256, bytes));
        require(tokenAddr == token, "Wrong Token");
        require(callValue == 0, "Non Zero Value");

        // Validate recipient and amount
        bytes calldata data;
        uint256 offset = uint256(bytes32(_op.callData[4 + 64:4 + 96]));
        uint256 length = uint256(bytes32(_op.callData[4 + offset:4 + offset + 32]));
        data = _op.callData[4 + offset + 32:4 + offset + 32 + length];
        require(address(bytes20(data[16:36])) == recipient, "Wrong Recipient");
        require(uint256(bytes32(data[36:68])) <= maxAmount, "Max Amount Exceeded");

        // Verify signature
        return ECDSA.recover(ECDSA.toEthSignedMessageHash(_userOpHash), _sessionKeySignature) == sessionKey;
    }
}
```

The contract, extending the `ISessionValidationModule` interface, contains essential functions like `validateSessionUserOp` and `validateSessionParams`, each serving distinct roles in operation validation.

## Solidity Contract Breakdown

Here's the Solidity contract in question:

### Function Analysis: `validateSessionUserOp`

:::note
This function is essential for **validating user operations** against **session key permissions** and ensuring they are correctly signed.
:::

```solidity
/**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * Please mind the decimals of your exact token when setting maxAmount
     * @param _op User Operation to be validated.
     * @param _userOpHash Hash of the User Operation to be validated.
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param _sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external pure override returns (bool) {
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "ERC20SV Invalid Selector"
        );

        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        {
            // we expect _op.callData to be `SmartAccount.execute(to, value, calldata)` calldata
            (address tokenAddr, uint256 callValue, ) = abi.decode(
                _op.callData[4:], // skip selector
                (address, uint256, bytes)
            );
            if (tokenAddr != token) {
                revert("ERC20SV Wrong Token");
            }
            if (callValue != 0) {
                revert("ERC20SV Non Zero Value");
            }
        }
        // working with userOp.callData
        // check if the call is to the allowed recepient and amount is not more than allowed
        bytes calldata data;
        {
            uint256 offset = uint256(bytes32(_op.callData[4 + 64:4 + 96]));
            uint256 length = uint256(
                bytes32(_op.callData[4 + offset:4 + offset + 32])
            );
            //we expect data to be the `IERC20.transfer(address, uint256)` calldata
            data = _op.callData[4 + offset + 32:4 + offset + 32 + length];
        }
        if (address(bytes20(data[16:36])) != recipient) {
            revert("ERC20SV Wrong Recipient");
        }
        if (uint256(bytes32(data[36:68])) > maxAmount) {
            revert("ERC20SV Max Amount Exceeded");
        }
        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
```

**Execution Steps:**

1. **Match Function Selectors:** Verifies the user operation aligns with specific function selectors.
2. **Decode Session Key Data:** Extracts essential details like session key, token, recipient, and maximum transaction amount.
3. **Verify Operation Details:** Checks the operation's token address and call value, and confirms recipient and amount limits.
4. **Signature Validation:** Utilizes ECDSA to confirm the operation's signature matches the session key.

## Function Analysis: `validateSessionParams`

:::note
This function plays a vital role in **batch session validation**, ensuring each operation aligns with the set session key permissions. It's key for processing multiple operations efficiently.
:::

```solidity
/**
     * @dev validates that the call (destinationContract, callValue, funcCallData)
     * complies with the Session Key permissions represented by sessionKeyData
     * @param destinationContract address of the contract to be called
     * @param callValue value to be sent with the call
     * @param _funcCallData the data for the call. is parsed inside the SVM
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     */
    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
        bytes calldata /*_callSpecificData*/
    ) external virtual override returns (address) {
        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        require(destinationContract == token, "ERC20SV Invalid Token");
        require(callValue == 0, "ERC20SV Non Zero Value");

        (address recipientCalled, uint256 amount) = abi.decode(
            _funcCallData[4:],
            (address, uint256)
        );

        require(recipient == recipientCalled, "ERC20SV Wrong Recipient");
        require(amount <= maxAmount, "ERC20SV Max Amount Exceeded");
        return sessionKey;
    }
```

**Operational Flow:**

1. **Decode Session Key Data:** Extracts session key, token address, recipient address, and maximum token amount.
2. **Validation Checks:** Ensures the destination contract and call value are as required.
3. **Recipient and Amount Verification:** Compares recipient and transaction amount against session key data.
4. **Return Session Key:** If all checks pass, returns the session key address.

Both `validateSessionUserOp` and `validateSessionParams` are integral to our dApp's security framework, ensuring strict adherence to permissions and enhancing transaction integrity.

## Next Steps

With a foundational understanding of the Session Validation Module, we're set to move forward. Up next, we'll embark on initializing the frontend and integrating the Biconomy SDK, crucial steps in bringing our dApp to life.

:::tip
**Explore the Interface**: Familiarize yourself with the `ISessionValidationModule` interface [here](https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-account/modules/SessionValidationModules/ISessionValidationModule.sol) for a comprehensive understanding.
:::

---
