---
sidebar_position: 1
---

# Error Codes

> Error code responses from Smart Contracts (business logic revert), Backend node and Relayer.

## General init related

- `BSA000`: `Could not finish initialisation`

## General gas/ execution related

- `BSA010`: `Not enough gas to execute Safe transaction`
- `BSA011`: `Could not pay gas costs with ether`
- `BSA012`: `Could not pay gas costs with token`
- `BSA013`: `Transaction failed when gasPrice and targetTxGas was 0`

## General signature validation related

- `BSA021`: `Invalid contract signature location: inside static part`
- `BSA022`: `Invalid contract signature location: length not present`
- `BSA023`: `Invalid contract signature location: data not complete`
- `BSA024`: `Invalid contract signature provided`

## General auth related

- `BSA031`: `Method can only be called from this contract`

## Module management related

- `BSA100`: `Modules have already been initialised`
- `BSA101`: `Invalid module address provided`
- `BSA102`: `Module has already been added`
- `BSA103`: `Invalid prevModule, module pair provided`
- `BSA104`: `Method can only be called from an enabled module`
