import { Actor, HttpAgent } from "@dfinity/agent";
import {
  idlFactory as evmRpcIdlFactory,
  canisterId as evmRpcCanisterId,
} from "D:/web3x/evm-rpc-canister";

const host =
  process.env.DFX_NETWORK === "local"
    ? "http://127.0.0.1:4943"
    : "https://ic0.app";

// Khởi tạo HttpAgent
const agent = new HttpAgent({
  host,
});

// Tải khóa gốc cho môi trường phát triển (chỉ cần trong môi trường phát triển)
if (process.env.NODE_ENV !== "production") {
  agent.fetchRootKey();
}

// Khởi tạo Actor cho evm-rpc-canister
const evmRpcActor = Actor.createActor(evmRpcIdlFactory, {
  agent,
  canisterId: evmRpcCanisterId,
});

export { evmRpcActor };
