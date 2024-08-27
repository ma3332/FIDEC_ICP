"use strict";

import publicKeyToAddress from "ethereum-public-key-to-address";
import utils from "./utils";
import SmartCard from "./smartcard";
import * as bip39 from "bip39";
// import { toBech32 } from "@cosmjs/encoding";
// import { rawSecp256k1PubkeyToRawAddress } from "@cosmjs/amino";
// import crypto from "crypto";
// import { Secp256k1 } from "@cosmjs/crypto";

const GENERATE_SEED = "00";
const IMPORT_SEED = "01";

const RESET_WALLET = "02";
const RESET_WITH_AUTH = "23";

const GET_ACCOUNT = "03";
const SELECT_ACCOUNT = "04";
const RLP_ENCODE = "05";
const IMPORT_HASH = "10";
const TRANSACTION = "06";

const VERIFY_PIN = "07";
const CHANGE_PIN = "08";

const GET_INFOMATION = "0E";
const GET_STATUS = "0F";
const GENUINE_CHECK = "11";

const IMPORT_TOKEN = "12";
const GET_TOKEN = "13";
const DELETE_TOKEN = "14";

const IMPORT_ACCOUNT = "16";
const DELETE_ACCOUNT = "18";
const IMPORT_NAME_ACCOUNT = "19";
const GET_NAME_ACCOUNT = "1A";

const GET_NETWORK = "20";
const IMPORT_NETWORK = "21";
const DELETE_NETWORK = "22";
const TRANSACTION_SINGLE = "24";

const WalletNonActived = "0001";
const WalletActived = "0002";

/**
 * Get satuts Wallet
 * @returns {Hex String} - Status of Wallet (Example - "9000")
 */
async function GetStatus() {
  const result = await SmartCard.SecureMessage(GET_STATUS);
  if (result.sw == WalletNonActived) console.log("Wallet Non Active");
  else if (result.sw == WalletActived) console.log("Wallet Actived");
  else console.log("Wallet Non Install");

  return result.sw;
}

/**
 * Get Infomation Wallet
 * @returns {Object} Infomation Wallet - {"id": "",
 *                                        "date": "",
 *                                        "version": "",
 *                                        "type":"" }
 */

async function GetInfomation(publickey) {
  const result = await SmartCard.SecureMessage(GET_INFOMATION);
  console.log(result);
  const data = result.data.slice(0, 20);
  const signature = result.data.slice(20);
  console.log({ r: signature.slice(2, 66), s: signature.slice(66, 130) });
  return {
    id: utils.HexString_To_Int(data.slice(0, 8)),
    day: utils.HexString_To_Int(data.slice(8, 10)),
    month: utils.HexString_To_Int(data.slice(10, 12)),
    year: utils.HexString_To_Int(data.slice(12, 16)),
    version: utils.HexString_To_Int(data.slice(16, 18)) / 10,
    type: utils.HexString_To_Int(data.slice(18, 20)),
    verify: utils.VerifyECDSA(data, publickey, signature),
  };
}

/**
 * Import Seed Root to Wallet
 * @param {Hex String} mnemonic - seed root of HDWallet
 */
async function ImportMnemonicWord(mnemonic) {
  const seed: any = bip39.mnemonicToSeedSync(mnemonic.trim()).toString("hex");
  const result = await SmartCard.SecureMessage(IMPORT_SEED, seed);

  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Generate Entropy for HD Wallet
 * @returns {Hex String} - Result perform function
 */
async function GenerateHDWallet() {
  const result_1 = await SmartCard.SecureMessage(GENERATE_SEED);

  if (result_1.sw != "9000") {
    console.log("Cannot Generate Seed Root!");
    return;
  }

  const entropyBytes = Buffer.from(result_1.data, "hex"); // Chuỗi entropy hex với độ dài 16 bytes
  const mnemonic = bip39.entropyToMnemonic(entropyBytes);

  console.log("mnemonic", mnemonic);
  // console.log("mnemonic", mnemonic.toString())

  // if(await ImportMnemonicWord(mnemonic) == true)
  return mnemonic;
  // else
  //     return
}

/**
 * Get Account in Wallet
 * @param {Unsigned Int} index - Account Number in Wallet
 * @returns {Object} - {pub: PublicKeyValue, addr: AddressValue, index: indexAccount}
 */
async function GetAccount(index: number) {
  const index_hex = utils.Int_To_HexString(index);
  const result_1 = await SmartCard.SecureMessage(GET_ACCOUNT, null, index_hex);
  const result_2 = await SmartCard.SecureMessage(
    GET_NAME_ACCOUNT,
    null,
    index_hex
  );
  let address = "";
  // let address_xion = "";
  // let pubkey_xion: any;
  if (result_1.sw == "9000" && result_2.sw == "9000") {
    console.log(result_1);
    try {
      address = publicKeyToAddress(result_1.data);
      // const publicKeyBuffer = Buffer.from(result_1.data, "hex");
      // const sha256 = crypto
      //   .createHash("sha256")
      //   .update(publicKeyBuffer)
      //   .digest();
      // const ripemd160 = crypto.createHash("ripemd160").update(sha256).digest();
      // const payload = new Uint8Array(ripemd160);
      // console.log(payload);
      // pubkey_xion = Secp256k1.compressPubkey(publicKeyBuffer);
      // address_xion = toBech32(
      //   "xion",
      //   rawSecp256k1PubkeyToRawAddress(pubkey_xion)
      // );
      // console.log(address_xion);
      // console.log(pubkey_xion);
    } catch {
      console.log("Get Acount Error: Cannot Convert Address from Public Key!");
      return;
    }
    console.log({ index, address });
    return {
      publickey: result_1.data,
      address: address,
      // address_xion: address_xion,
      // pubkey_xion,
      name: utils.HexString_To_String(result_2.data),
      index: utils.HexString_To_Int(index_hex),
    };
  } else return;
}

/**
 *
 * @param {String} mnemonic
 * @returns true or false
 */
async function ResetWallet(mnemonic) {
  const seed: any = bip39.mnemonicToSeedSync(mnemonic.trim());
  const result = await SmartCard.SecureMessage(RESET_WALLET, seed);
  if (result.sw == "9000") return true;
  else return false;
}

async function ResetWalletWithAuth(pin = "11111111") {
  const pin_hex: any = utils.String_To_HexString(pin);
  const result = await SmartCard.SecureMessage(RESET_WITH_AUTH, pin_hex);

  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Import Account into Wallet
 * @param {Hex String} privatekey: Private Key of Account
 * @param {Integer} index: Account Index
 * @returns true or false
 */
async function ImportAccount(privatekey, name, index) {
  index = utils.Int_To_HexString(index);
  name = utils.String_To_HexString(name);
  const result_1 = await SmartCard.SecureMessage(
    IMPORT_ACCOUNT,
    privatekey,
    index
  );
  const result_2 = await SmartCard.SecureMessage(
    IMPORT_NAME_ACCOUNT,
    name,
    index
  );
  if (result_1.sw == "9000" && result_2.sw == "9000") return true;
  else return false;
}

/**
 * Import Name Account
 * @param {String} name
 * @param {Integer} index
 * @returns
 */

async function ImportNameAccount(name, index) {
  index = utils.Int_To_HexString(index);
  name = utils.String_To_HexString(name);

  const result = await SmartCard.SecureMessage(
    IMPORT_NAME_ACCOUNT,
    name,
    index
  );
  if (result == "9000") return true;
  else return false;
}

/**
 * Delete Account in Wallet
 * @param {Integer} index: Account Index
 * @returns true of false
 */
async function DeleteAccount(index) {
  index = utils.Int_To_HexString(index);
  const result = await SmartCard.SecureMessage(DELETE_ACCOUNT, null, index);
  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Verify PIN code Wallet
 * @param {String} pin
 * @returns {Boolean} - Status excutive APDU command
 */
async function VerifyPin(pin) {
  pin = utils.String_To_HexString(pin);
  const result = await SmartCard.SecureMessage(VERIFY_PIN, pin);
  console.log(result.data);
  if (result.sw == "9000")
    return { verify: true, times: utils.HexString_To_Int(result.data) };
  else return { verify: false, times: utils.HexString_To_Int(result.data) };
}

/**
 * Change Pin code
 * @param {String} oldPin
 * @param {String} newPin
 * @returns {Boolean} - Status excutive APDU command
 */
async function ChangePin(oldPin, newPin) {
  oldPin = utils.String_To_HexString(oldPin);
  newPin = utils.String_To_HexString(newPin);

  oldPin = (
    utils.Int_To_HexString(oldPin.length / 2).padStart(2, "0") + oldPin
  ).padEnd(50, "0");
  newPin = (
    utils.Int_To_HexString(newPin.length / 2).padStart(2, "0") + newPin
  ).padEnd(50, "0");

  console.log(oldPin + newPin);

  const result = await SmartCard.SecureMessage(CHANGE_PIN, oldPin + newPin);
  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Import token into Wallet
 * @param {Integer} type - type token - "0002"
 * @param {Hex String} address - address token - "C41A22c34cB15353Dc0f4b2ED0aeA4AcFD166D55"
 */
async function ImportToken(token: any, index) {
  token.type = utils.Uint16_To_HexString(token.type);
  token.symbol = (
    utils.Int_To_HexString(token.symbol.length) +
    utils.String_To_HexString(token.symbol)
  ).padEnd(20, "0");
  token.chainID = utils.Uint64_To_HexString(token.chainID);
  const result = await SmartCard.SecureMessage(
    IMPORT_TOKEN,
    token.type + token.address + token.symbol + token.chainID,
    utils.Int_To_HexString(index)
  );
  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Get token from Wallet
 * @returns {Object} - {"type": "", "address": "", "index": , symbol:}
 */
async function GetToken(index = 0) {
  const result = await SmartCard.SecureMessage(
    GET_TOKEN,
    null,
    utils.Int_To_HexString(index)
  );
  if (result.sw == "9000") {
    const token = result.data;
    if (token != "".padEnd(64, "0"))
      return {
        addressToken: "0x" + token.slice(4, 44),
        type: "ERC" + utils.HexString_To_Int(token.slice(0, 4)).toString(),
        symbolToken: utils.HexString_To_String(
          token.slice(46, 46 + utils.HexString_To_Int(token.slice(44, 46)) * 2)
        ),
        chainID: utils.HexString_To_Int(token.slice(64, 80)).toString(),
        indexToken: index,
      };
    else return;
  } else return;
}

/**
 * Delete Token in Wallet
 * @param {Hex String} tokenAddress - token address in Wallet - "01"
 */
async function DeleteToken(index) {
  index = utils.Int_To_HexString(index);
  const result = await SmartCard.SecureMessage(DELETE_TOKEN, null, index);
  if (result.sw == "9000") return true;
  else return false;
}

/**
 * RLP Decode
 * @param {Hex String} rlp_encode
 * @returns {Hex String} - "eEF02F7364F0A33e08078864A2B6C42998847dfd"
 */
async function RLP_Decode(rlp_encode) {
  console.log(rlp_encode);
  console.log(rlp_encode.length);
  // const result = await SmartCard.SecureMessage(RLP_ENCODE, rlp_encode.slice(2));
  const result = await SmartCard.SecureMessage(RLP_ENCODE, rlp_encode);

  if (result.sw == "9000") return result.data;
  else return;
}

/**
 *
 * @param {String} pin - pin code of Wallet
 * @returns {Object} - {r:"", s:""}
 */
async function Transaction(hash, pin, index) {
  const index_hex = utils.Int_To_HexString(index);
  console.log("index_hex", index_hex);
  await SmartCard.SecureMessage(SELECT_ACCOUNT, null, index_hex);
  console.log(1);

  await SmartCard.SecureMessage(IMPORT_HASH, hash);
  console.log(1);

  const pin_hex: any = utils.String_To_HexString(pin);
  const result = await SmartCard.SecureMessage(TRANSACTION, pin_hex);
  console.log(1);

  if (result.sw == "9000") {
    return {
      r: result.data.slice(0, 64),
      s: result.data.slice(64, 128),
    };
  } else return;
}

async function TransactionSingle(hash, pin, index) {
  index = utils.Int_To_HexString(index);
  await SmartCard.SecureMessage(SELECT_ACCOUNT, null, index);

  await SmartCard.SecureMessage(IMPORT_HASH, hash);

  pin = utils.String_To_HexString(pin);
  const result = await SmartCard.SecureMessage(TRANSACTION_SINGLE, pin);
  if (result.sw == "9000") {
    return {
      r: result.data.slice(0, 64),
      s: result.data.slice(64, 128),
    };
  } else return;
}

/**
 * Genuine Checking
 * @param {Hex String} publickey
 * @returns {Boolean} - True or False
 */
async function GenuineChecking(publickey) {
  const dataInt = Math.floor(Math.random() * 1000000000000000);
  let dataHex: any = dataInt.toString(16);
  dataHex = dataHex.padStart(16, "0");

  const result = await SmartCard.SecureMessage(GENUINE_CHECK, dataHex);
  return utils.VerifyECDSA(dataHex, publickey, {
    r: result.data.slice(0, 64),
    s: result.data.slice(64, 128),
  });
}

/**
 * Import Network
 * @param {Object} network : {  chainID: ,
 *                              url:,
 *                              symbol:,
 *                              name:}
 */
async function ImportNetwork(
  network = { chainID: null, symbol: "", name: "" },
  index = 0
) {
  console.log(network.name);

  const data: any =
    utils.Uint64_To_HexString(network.chainID) +
    utils.Int_To_HexString(network.symbol.length) +
    utils.String_To_HexString(network.symbol).padEnd(20, "0") +
    utils.Int_To_HexString(network.name.length) +
    utils.String_To_HexString(network.name).padEnd(40, "0");

  const index_hex = utils.Int_To_HexString(index);

  const result = await SmartCard.SecureMessage(IMPORT_NETWORK, data, index_hex);

  if (result.sw == "9000") return true;
  else return false;
}

/**
 * Get Network
 * @param {Integer} index
 * @returns
 */
async function GetNetwork(index = 0) {
  const index_hex = utils.Int_To_HexString(index);
  const result = await SmartCard.SecureMessage(GET_NETWORK, null, index_hex);

  if (result.sw == "9000") {
    if (result.data == "".padEnd(256, "0")) return;

    return {
      chainID: utils.HexString_To_Int(result.data.slice(0, 16)),
      symbol: utils.HexString_To_String(
        result.data.slice(
          18,
          18 + utils.HexString_To_Int(result.data.slice(16, 18)) * 2
        )
      ),
      name: utils.HexString_To_String(
        result.data.slice(
          40,
          40 + utils.HexString_To_Int(result.data.slice(38, 40)) * 2
        )
      ),
      index: index,
    };
  } else return;
}

/**
 * Delete Network
 * @param {Integer} index
 * @returns
 */
async function DeleteNetwork(index = 0) {
  const index_hex = utils.Int_To_HexString(index);

  const result = await SmartCard.SecureMessage(DELETE_NETWORK, null, index_hex);

  if (result.sw == "9000") return true;
  else return false;
}

export default {
  GetStatus,
  GetInfomation,
  GetAccount,
  GetToken,
  GenuineChecking,
  GenerateHDWallet,
  GetNetwork,
  ImportToken,
  ImportMnemonicWord,
  ImportAccount,
  ImportNameAccount,
  ImportNetwork,
  DeleteToken,
  DeleteAccount,
  DeleteNetwork,
  VerifyPin,
  ChangePin,
  RLP_Decode,
  Transaction,
  ResetWallet,
  ResetWalletWithAuth,
  TransactionSingle,
};
