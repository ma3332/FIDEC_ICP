import Web3 from "web3";
import { EIP155_CHAINS, TEIP155Chain } from "../data/EIP155Data";
import { utils } from "ethers";
import { notification } from "antd";
import abiERC20 from "../data/abiJsonToken/abiERC20.json";
import abiERC721 from "../data/abiJsonToken/abiERC721.json";

const abi20: any = abiERC20.abi;
const abi721: any = abiERC721.abi;

const checkByteCodeERC = (encode: any, byteCode: any) => {
  const encode_string = encode.toString();
  const byteCode_sting = byteCode.toString();
  if (byteCode_sting.search(encode_string.slice(2)) !== -1) return true;
  else return false;
};

function getABI() {
  return [
    {
      constant: true,
      inputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];
}

function getContract(smartContractAddress: string, url: string) {
  const web3 = new Web3(url);
  const abi_ = getABI();
  return new web3.eth.Contract(abi_ as any, smartContractAddress);
}

async function getERCtype(contract: any, addr: string, url: string) {
  const web3 = new Web3(url);
  const is721 = await contract.methods.supportsInterface("0x80ac58cd").call();
  if (is721) {
    const contract = new web3.eth.Contract(abi721, addr);
    const symbol = await contract.methods.symbol().call();
    return {
      type: "NFTs",
      code: 721,
      symbol: symbol,
      decimals: "",
    };
  }
  const is1155 = await contract.methods.supportsInterface("0xd9b67a26").call();
  if (is1155) {
    return {
      type: "NFTs",
      code: 1155,
      symbol: "",
      decimals: "",
    };
  }
  return undefined;
}

export const checkAddressToken = async (addr: string, url: string) => {
  const web3 = new Web3(url);

  const byteCode = await web3.eth.getCode(addr.toString()); 
  if (byteCode.length > 5) {
    const name_encode = web3.eth.abi.encodeFunctionSignature("name()");
    const symbol_encode = web3.eth.abi.encodeFunctionSignature("symbol()");
    const decimals_encode = web3.eth.abi.encodeFunctionSignature("decimals()");
    const totalSupply_encode =
      web3.eth.abi.encodeFunctionSignature("totalSupply()");
    const balanceOf_encode =
      web3.eth.abi.encodeFunctionSignature("balanceOf(address)");
    const transfer_encode = web3.eth.abi.encodeFunctionSignature(
      "transfer(address,uint256)"
    );
    const transferFrom_encode = web3.eth.abi.encodeFunctionSignature(
      "transferFrom(address,address,uint256)"
    );
    const approve_encode = web3.eth.abi.encodeFunctionSignature(
      "approve(address,uint256)"
    );
    const allowance_encode = web3.eth.abi.encodeFunctionSignature(
      "allowance(address,address)"
    );

    if (
      checkByteCodeERC(name_encode, byteCode) &&
      checkByteCodeERC(symbol_encode, byteCode) &&
      checkByteCodeERC(decimals_encode, byteCode) &&
      checkByteCodeERC(totalSupply_encode, byteCode) &&
      checkByteCodeERC(balanceOf_encode, byteCode) &&
      checkByteCodeERC(transfer_encode, byteCode) &&
      checkByteCodeERC(transferFrom_encode, byteCode) &&
      checkByteCodeERC(approve_encode, byteCode) &&
      checkByteCodeERC(allowance_encode, byteCode)
    ) {
      // setTypeToken("ERC20")
      const contract = new web3.eth.Contract(abi20, addr);
      const symbol = await contract.methods.symbol().call();
      const decimals = await contract.methods.decimals().call();
      return {
        type: "Token",
        code: 20,
        symbol,
        decimals,
      };
    } else {
      const contract = getContract(addr, url);
      const info = await getERCtype(contract, addr, url);
 
      if (info.type === undefined) return false;
      else {
        return info;
      }
    }
  } else return false;
};

/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value: string, length: number) {
  if (value?.length <= length) {
    return value;
  }

  const separator = "...";
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

/**
 * Formats chainId to its name
 */
export function formatChainName(chainId: string) {
  return EIP155_CHAINS[chainId as TEIP155Chain]?.name ?? chainId;
}

/**
 * Check if chain is part of EIP155 standard
 */
export function isEIP155Chain(chain: string) {
  return chain.includes("eip155");
}

/**
 * Converts hex to utf8 string if it is valid bytes
 */
export function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value);
  }

  return value;
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
export function getSignParamsMessage(params: string[]) {
  const message = params.filter((p) => !utils.isAddress(p))[0]; 
  return convertHexToUtf8(message);
}


export function getSignParamsAddress(params: string[]) {
  const address = params.filter((p) => utils.isAddress(p))[0]; 
  return address;
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params: string[]) {
  const data = params.filter((p) => !utils.isAddress(p))[0];

  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return data;
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses: string[], params: any) {
  const paramsString = JSON.stringify(params);
  let address = "";

  addresses.forEach((addr) => {
    if (paramsString.includes(addr)) {
      address = addr;
    }
  });

  return address;
}

//notification

export function openNotification(message: string, state: string) {
  let bgr: string;
  if (state === "success") {
    bgr = "#4caf50";
  } else if (state === "warning") {
    bgr = "#ffd700";
  } else if (state === "error") {
    bgr = "#ff5733";
  }else {
    bgr = "#fff";
  }
  notification.info({
    description: message,
    message: "Notification",
    duration: 3,
    style: {
      padding: 10,
      width: 220,
      backgroundColor: bgr,
      color: state === "warning" ? "black" : "white",
    },
    onClick: () => {
      console.log("Notification Clicked!");
    }, 
  });
}
