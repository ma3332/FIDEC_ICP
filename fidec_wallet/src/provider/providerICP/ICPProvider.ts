// src/ICPProvider.ts
import { ethers } from "ethers";

class ICPProvider extends ethers.providers.BaseProvider {
  private actor: any;

  constructor(actor: any) {
    super(1); // ChainId cho Ethereum mainnet, có thể thay đổi cho mạng khác
    this.actor = actor;
  }

  // Phương thức gửi giao dịch (sendTransaction)
  async sendTransaction(
    signedTransaction: string
  ): Promise<ethers.providers.TransactionResponse> {
    const result = await this.actor.send_transaction({
      signed_tx: signedTransaction,
    });
    return this._formatTransactionResponse(result);
  }

  // Phương thức ký một thông điệp (signMessage)
  async signMessage(privateKey: string, message: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessage(message);
  }

  // Phương thức lấy thông tin giao dịch (getTransaction)
  async getTransaction(
    transactionHash: string
  ): Promise<ethers.providers.TransactionResponse> {
    const result = await this.actor.get_transaction({
      tx_hash: transactionHash,
    });
    return this._formatTransactionResponse(result);
  }

  // Phương thức lấy biên nhận giao dịch (getTransactionReceipt)
  async getTransactionReceipt(
    transactionHash: string
  ): Promise<ethers.providers.TransactionReceipt> {
    const result = await this.actor.get_transaction_receipt({
      tx_hash: transactionHash,
    });
    return this._formatTransactionReceipt(result);
  }

  // Phương thức lấy số dư (getBalance)
  async getBalance(address: string): Promise<ethers.BigNumber> {
    const result = await this.actor.get_balance({ address });
    return ethers.BigNumber.from(result.balance);
  }

  // Phương thức ước tính gas (estimateGas)
  async estimateGas(
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.BigNumber> {
    const result = await this.actor.estimate_gas({ tx: transaction });
    return ethers.BigNumber.from(result.gas);
  }

  // Phương thức lấy giá gas hiện tại (getGasPrice)
  async getGasPrice(): Promise<ethers.BigNumber> {
    const result = await this.actor.get_gas_price();
    return ethers.BigNumber.from(result.gas_price);
  }

  // Định dạng phản hồi giao dịch (private method)
  private _formatTransactionResponse(
    response: any
  ): ethers.providers.TransactionResponse {
    return {
      hash: response.tx_hash,
      blockHash: response.block_hash,
      blockNumber: response.block_number,
      from: response.from,
      to: response.to,
      value: ethers.BigNumber.from(response.value),
      gasPrice: ethers.BigNumber.from(response.gas_price),
      gasLimit: ethers.BigNumber.from(response.gas_limit),
      nonce: response.nonce,
      data: response.data,
      chainId: response.chain_id,
      confirmations: response.confirmations,
    };
  }

  // Định dạng biên nhận giao dịch (private method)
  private _formatTransactionReceipt(
    response: any
  ): ethers.providers.TransactionReceipt {
    return {
      transactionHash: response.tx_hash,
      transactionIndex: response.transaction_index,
      blockHash: response.block_hash,
      blockNumber: response.block_number,
      from: response.from,
      to: response.to,
      cumulativeGasUsed: ethers.BigNumber.from(response.cumulative_gas_used),
      gasUsed: ethers.BigNumber.from(response.gas_used),
      contractAddress: response.contract_address || null,
      logs: response.logs,
      logsBloom: response.logs_bloom,
      status: response.status,
    };
  }
}

export default ICPProvider;
