"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHBalanceDataMock = exports.walletsMock = void 0;
const mockETHResponse = {
    blockNumber: "17296361",
    timeStamp: "1684533743",
    hash: "0xd9eeed4dc46e6756c7af8e696c8361c5d8912425bc2744b1996766a45fe4ca61",
    nonce: "0",
    blockHash: "0x07d52b7228f5d5ca28ffdc83b40b4452bdebe19ade28f100fd209d6029c88b08",
    transactionIndex: "47",
    from: "0xa538071dd679c3457109f70743c394f3819cb73a",
    to: "0x68f5c5f565b77d7e0a26e4fcca3965c3cf85eab4",
    value: "1000000000000",
    gas: "21000",
    gasPrice: "34362842721",
    isError: "0",
    txreceipt_status: "1",
    input: "0x",
    contractAddress: "",
    cumulativeGasUsed: "4439455",
    gasUsed: "21000",
    confirmations: "136394",
    methodId: "0x",
    functionName: "",
};
const mockBTCResponse = {
    txid: "b40d02af61ab19b0a0ac479cfb4ad25f1d64bcb8d4299d70119058605af11005",
    version: 2,
    locktime: 0,
    vin: [
        {
            txid: "6bb0e07246fd4700e1adb18ad7e6017f4aed173439266c6ca4438f138c0e9967",
            vout: 1,
            prevout: {
                scriptpubkey: "76a9147a26297168712de2a131db56f99346db9b4d831588ac",
                scriptpubkey_asm: "OP_DUP OP_HASH160 OP_PUSHBYTES_20 7a26297168712de2a131db56f99346db9b4d8315 OP_EQUALVERIFY OP_CHECKSIG",
                scriptpubkey_type: "p2pkh",
                scriptpubkey_address: "1C8s9wPNaXwYAAP5gfgP7nkQwTzJfxEQAy",
                value: 4350,
            },
            scriptsig: "4830450221009a88dfd0f94f49d29226c3516f0bf34ac5da4373bd0a51734965057d51373dc802204313c770f21e0bf3310152275382366dfcea75bcbb1fdaa4fe3cf8b7bc9012ef012103e567d0aff2716b1c4c678e7017088217727d4bde6e7eeaa04da3da423a4b41f8",
            scriptsig_asm: "OP_PUSHBYTES_72 30450221009a88dfd0f94f49d29226c3516f0bf34ac5da4373bd0a51734965057d51373dc802204313c770f21e0bf3310152275382366dfcea75bcbb1fdaa4fe3cf8b7bc9012ef01 OP_PUSHBYTES_33 03e567d0aff2716b1c4c678e7017088217727d4bde6e7eeaa04da3da423a4b41f8",
            is_coinbase: false,
            sequence: 4294967295,
        },
    ],
    vout: [
        {
            scriptpubkey: "76a914091890b943c553bed9389a7efd6fc45e0a960a7888ac",
            scriptpubkey_asm: "OP_DUP OP_HASH160 OP_PUSHBYTES_20 091890b943c553bed9389a7efd6fc45e0a960a78 OP_EQUALVERIFY OP_CHECKSIG",
            scriptpubkey_type: "p2pkh",
            scriptpubkey_address: "1q6WZD4kxpCXfQhxEaPqtRTyRAfXKZDhA",
            value: 10000,
        },
        {
            scriptpubkey: "76a9149f34435954d59c46024dc8ad27ea70e10b8d29bc88ac",
            scriptpubkey_asm: "OP_DUP OP_HASH160 OP_PUSHBYTES_20 9f34435954d59c46024dc8ad27ea70e10b8d29bc OP_EQUALVERIFY OP_CHECKSIG",
            scriptpubkey_type: "p2pkh",
            scriptpubkey_address: "1FWo3ocPfXeJFtZwdSxX4SowLBh6JTAh67",
            value: 17850,
        },
    ],
    size: 226,
    weight: 904,
    fee: 5700,
    status: {
        confirmed: true,
        block_height: 791408,
        block_hash: "0000000000000000000329ab83e7f51cf0a6a932701e0b83f50e03f84c546159",
        block_time: 1685060466,
    },
};
exports.walletsMock = [
    {
        type: "BTC",
        address: "1FWo3ocPfXeJFtZwdSxX4SowLBh6JTAh67",
        result: [mockBTCResponse],
    },
    {
        address: "0x68F5c5f565B77d7E0A26e4FcCA3965C3CF85eab4",
        type: "ETH",
        result: {
            status: "1",
            message: "OK",
            result: [mockETHResponse],
        },
    },
];
exports.ETHBalanceDataMock = [
    {
        address: "0xa538071DD679c3457109F70743c394f3819cB73A",
        blockData: { amount: 99632649603540, blockNumber: "17296361" },
    },
];
