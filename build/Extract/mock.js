"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockBTCResponse = exports.walletsMock = void 0;
exports.walletsMock = [
    {
        name: "mockHold",
        WalletType: "BTC",
        address: "1FWo3ocPfXeJFtZwdSxX4SowLBh6JTAh67",
        privateKey: "123",
        balance: 1,
        coinPrice: 100000,
        totalBalance: 100,
        unconfirmedBalance: 0,
    },
];
exports.mockBTCResponse = [
    {
        txid: "b40d02af61ab19b0a0ac479cfb4ad25f1d64bcb8d4299d70119058605af11005",
        version: 2,
        locktime: 0,
        vin: [
            {
                txid: "6bb0e07246fd4700e1adb18ad7e6017f4aed173439266c6ca4438f138c0e9967",
                vout: 1,
                prevout: [Object],
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
    },
];
