/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Approval = ContractEventLog<{
  _owner: string;
  _spender: string;
  _value: string;
  0: string;
  1: string;
  2: string;
}>;
export type Deposit = ContractEventLog<{
  _owner: string;
  _value: string;
  0: string;
  1: string;
}>;
export type Transfer = ContractEventLog<{
  _from: string;
  _to: string;
  _value: string;
  0: string;
  1: string;
  2: string;
}>;
export type Withdrawal = ContractEventLog<{
  _owner: string;
  _value: string;
  0: string;
  1: string;
}>;

export interface WETH9 extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): WETH9;
  clone(): WETH9;
  methods: {
    allowance(arg0: string, arg1: string): NonPayableTransactionObject<string>;

    approve(
      guy: string,
      wad: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    balanceOf(arg0: string): NonPayableTransactionObject<string>;

    decimals(): NonPayableTransactionObject<string>;

    deposit(): PayableTransactionObject<void>;

    name(): NonPayableTransactionObject<string>;

    symbol(): NonPayableTransactionObject<string>;

    totalSupply(): NonPayableTransactionObject<string>;

    transfer(
      dst: string,
      wad: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    transferFrom(
      src: string,
      dst: string,
      wad: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    withdraw(wad: number | string | BN): NonPayableTransactionObject<void>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    Deposit(cb?: Callback<Deposit>): EventEmitter;
    Deposit(options?: EventOptions, cb?: Callback<Deposit>): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    Withdrawal(cb?: Callback<Withdrawal>): EventEmitter;
    Withdrawal(options?: EventOptions, cb?: Callback<Withdrawal>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "Deposit", cb: Callback<Deposit>): void;
  once(event: "Deposit", options: EventOptions, cb: Callback<Deposit>): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;

  once(event: "Withdrawal", cb: Callback<Withdrawal>): void;
  once(
    event: "Withdrawal",
    options: EventOptions,
    cb: Callback<Withdrawal>
  ): void;
}