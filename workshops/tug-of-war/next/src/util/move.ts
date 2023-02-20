import { TransactionInstruction, SystemProgram, PublicKey, Connection, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import * as borsh from "borsh";
import { Buffer } from "buffer";
import { TUG_OF_WAR_PROGRAM_ID } from "./const";
var sha256 = require('sha256')

export class GameDataAccount {

    playerPosition: number;

    constructor(props: {
        playerPosition: number
    }) {
        this.playerPosition = props.playerPosition;
    }

    toBuffer() { return Buffer.from(borsh.serialize(GameDataAccountSchema, this)) }

    static fromBuffer(buffer: Buffer) {
        return borsh.deserialize(GameDataAccountSchema, GameDataAccount, buffer);
    };
};

const GameDataAccountSchema = new Map([
    [GameDataAccount, {
        kind: 'struct',
        fields: [
            ['descriminator', 'u64'],
            ['playerPosition', 'u16'],
        ],
    }]
]);

export const getGameDataAccountPublicKey = () => PublicKey.findProgramAddressSync(
    [
        Buffer.from("tug_of_war")
    ],
    TUG_OF_WAR_PROGRAM_ID,
)[0];

export const createPullRightInstruction = async (
    payer: PublicKey,
) => {
    const anchorFunctionDescriminator = sha256("global:pull_right")

    return new TransactionInstruction({
        keys: [
            { pubkey: getGameDataAccountPublicKey(), isSigner: false, isWritable: true },
            { pubkey: payer, isSigner: true, isWritable: true },
        ],
        programId: TUG_OF_WAR_PROGRAM_ID,
        data: Buffer.from(anchorFunctionDescriminator.toString().substring(0, 16), "hex")
    })
};

export const createInitializeInstruction = async (
    payer: PublicKey,
) => {

    const anchorFunctionDescriminator = sha256("global:initialize")

    return new TransactionInstruction({
        keys: [
            { pubkey: getGameDataAccountPublicKey(), isSigner: false, isWritable: true },
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId: TUG_OF_WAR_PROGRAM_ID,
        data: Buffer.from(anchorFunctionDescriminator.toString().substring(0, 16), "hex")

    })
};

export const createRestartInstruction = async (
    payer: PublicKey,
) => {
    const anchorFunctionDescriminator = sha256("global:restart_game")

    return new TransactionInstruction({
        keys: [
            { pubkey: getGameDataAccountPublicKey(), isSigner: false, isWritable: true },
            { pubkey: payer, isSigner: true, isWritable: true },
        ],
        programId: TUG_OF_WAR_PROGRAM_ID,
        data: Buffer.from(anchorFunctionDescriminator.toString().substring(0, 16), "hex")
    })
};

export const createPullLeftInstruction = async (
    payer: PublicKey,
) => {

    const anchorFunctionDescriminator = sha256("global:pull_left")

    return new TransactionInstruction({
        keys: [
            { pubkey: getGameDataAccountPublicKey(), isSigner: false, isWritable: true },
            { pubkey: payer, isSigner: true, isWritable: true },
        ],
        programId: TUG_OF_WAR_PROGRAM_ID,
        data: Buffer.from(anchorFunctionDescriminator.toString().substring(0, 16), "hex")
    })
};

// Display the current position of the tug
export const displayPlayerPosition = async (
    connection: Connection,
    orderPublicKey: PublicKey,
) => {
    const accountInfo = await connection.getAccountInfo(orderPublicKey);

    if (!accountInfo) throw ('Account info not found.')
    if (!accountInfo.data) throw ('Account data not found.')

    return GameDataAccount.fromBuffer(accountInfo.data);
}