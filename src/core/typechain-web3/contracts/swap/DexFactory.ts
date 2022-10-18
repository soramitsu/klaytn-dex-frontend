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

export type FeeToChanged = ContractEventLog<{
  newFeeTo: string;
  0: string;
}>;
export type FeeToSetterChanged = ContractEventLog<{
  newFeeToSetter: string;
  0: string;
}>;
export type PairCreated = ContractEventLog<{
  token0: string;
  token1: string;
  pair: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;

export interface DexFactory extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): DexFactory;
  clone(): DexFactory;
  methods: {
    INIT(): NonPayableTransactionObject<string>;

    allPairs(arg0: number | string | BN): NonPayableTransactionObject<string>;

    allPairsLength(): NonPayableTransactionObject<string>;

    createPair(
      tokenA: string,
      tokenB: string
    ): NonPayableTransactionObject<string>;

    feeTo(): NonPayableTransactionObject<string>;

    feeToSetter(): NonPayableTransactionObject<string>;

    getPair(arg0: string, arg1: string): NonPayableTransactionObject<string>;

    setFeeTo(_feeTo: string): NonPayableTransactionObject<void>;

    setFeeToSetter(_feeToSetter: string): NonPayableTransactionObject<void>;
  };
  events: {
    FeeToChanged(cb?: Callback<FeeToChanged>): EventEmitter;
    FeeToChanged(
      options?: EventOptions,
      cb?: Callback<FeeToChanged>
    ): EventEmitter;

    FeeToSetterChanged(cb?: Callback<FeeToSetterChanged>): EventEmitter;
    FeeToSetterChanged(
      options?: EventOptions,
      cb?: Callback<FeeToSetterChanged>
    ): EventEmitter;

    PairCreated(cb?: Callback<PairCreated>): EventEmitter;
    PairCreated(
      options?: EventOptions,
      cb?: Callback<PairCreated>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "FeeToChanged", cb: Callback<FeeToChanged>): void;
  once(
    event: "FeeToChanged",
    options: EventOptions,
    cb: Callback<FeeToChanged>
  ): void;

  once(event: "FeeToSetterChanged", cb: Callback<FeeToSetterChanged>): void;
  once(
    event: "FeeToSetterChanged",
    options: EventOptions,
    cb: Callback<FeeToSetterChanged>
  ): void;

  once(event: "PairCreated", cb: Callback<PairCreated>): void;
  once(
    event: "PairCreated",
    options: EventOptions,
    cb: Callback<PairCreated>
  ): void;
}