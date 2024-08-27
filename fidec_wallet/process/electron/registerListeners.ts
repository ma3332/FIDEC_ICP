import { message } from 'antd';
import { app, BrowserWindow, ipcMain, shell  } from 'electron';
import fs from 'fs';
import path from 'path';  
import keccak256 from 'keccak256';
import * as RLP from '@ethereumjs/rlp';
import * as bip39 from 'bip39';
import wallet from '../card/wallet'; 
import format from '../../src/utils/format'; 
import { ALL_CHAINS } from "../../src/data/networkConfig/chainsUtil";  
// eslint-disable-next-line @typescript-eslint/no-var-requires
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

async function registerListeners () { 

    const filePathERC721  = path.join(__dirname, "../renderer/data/token/tokenERC721.json");
    const filePathERC1155  = path.join(__dirname, "../renderer/data/token/tokenERC1155.json");
    const filePathRecipientsAddress = path.join(__dirname, "../renderer/data/recipientsAddress/address.json");
    const filePathHistoryTransaction = path.join(__dirname, "../renderer/data/historyTransaction/history.json");   
    const indexAcount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const indexNetwork = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const indexToken = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let listAddress : object[] = [];
    let listNetwork : object[]= [];
   
    const TRANSACTION_TYPE_2 = 2;
    const TRANSACTION_TYPE_2_BUFFER = Buffer.from(
        TRANSACTION_TYPE_2.toString(16).padStart(2, "0"),
        "hex",
    );
    /**
     * This comes from bridge integration, check bridge.ts
     */
    ipcMain.on('message', async (_, message) => {
      const result = await wallet.GetInfomation("04aae7c320b4c0e94150e7c968d3b36e054839ef5fb030ac42584927bbf1e877aea712bc9f66be60db36359d03c2f174eff7593efa00ccff7e058ae17b277345f2");
      console.log(result)
    })
  
    ipcMain.handle('get-status-card',async () => {
        try {
          const status = await wallet.GetStatus()
          if(status === "0001") { 
              return {status, message: "Card Non Active"}
            }else if(status === "0002"){
              return {status, message: "Card Actived"}
          }
        } catch (error) {
          console.log(error)
          return {message: error.message}
        }
    })
  
    ipcMain.handle('handle-save-erc', async (_, data: object) => { 
      const { id_card, address, address_contract, dataNeedSave, type }: any = data; 
  
      type Token = { 
        checkSaveIdCard: boolean,
        checkSaveAddress: boolean,
        checkSaveAddressContract: boolean
      } 
  
      let path: string;
      if(type === "erc721")  path = filePathERC721;
      else path = filePathERC1155;
  
      const dt: any = fs.readFileSync(path) ;  // buffer
      const dataFile = JSON.parse(dt);
      
  
      const token: Partial<Token> = {}; 
  
     
  
      if(dataFile.length > 0 ) {
        //
        dataFile.forEach((item: any, index1: number)=>{
          //
          if(item.id_card === id_card){ 
            token.checkSaveIdCard = true;
            item.data.forEach((item: any, index2: number)=>{
              if(item.address === address){ 
                token.checkSaveAddress =true;
                item.infoNFT.map((item: any, index3: number)=>{
                  if(item.address_contract=== address_contract){
                    token.checkSaveAddressContract = true;
                    dataFile[index1].data[index2].infoNFT[index3] = dataNeedSave.data[0].infoNFT[0];
                    const sData  = JSON.stringify(dataFile);
                    fs.writeFileSync(path, sData);
                  }
                })
              }
            })
             
          }
        }) 
        if(!token.checkSaveIdCard) { 
          dataFile.push(dataNeedSave)
          const sData  = JSON.stringify(dataFile);
          fs.writeFileSync(path, sData);
        }else if(!token.checkSaveAddress){
        ///
          dataFile.forEach((item: any, index: number) => { 
            if(item.id_card === id_card){ 
              dataFile[index].data.push(dataNeedSave.data[0]);
              const sData  = JSON.stringify(dataFile);
              fs.writeFileSync(path, sData);
            }
          })
        }else if(!token.checkSaveAddressContract){
          //
          dataFile.forEach((item: any, index1: number)=>{
            if(item.id_card === id_card){
              dataFile[index1].data.forEach((item: any, index2: number)=>{
                if(item.address === address){
                  dataFile[index1].data[index2].infoNFT.push(dataNeedSave.data[0].infoNFT[0]);
                }
              })
            }
          })
          const sData  = JSON.stringify(dataFile);
          fs.writeFileSync(path, sData);
        }
  
      }else if (dataFile.length == 0){
        dataFile.push(dataNeedSave)
        const sData  = JSON.stringify(dataFile);
        fs.writeFileSync(path, sData); 
      }
    })
   
  
    ipcMain.handle("handle-update-erc721", async (_, arg) => {
      const {id_card, address, address_contract, currentBlock, type, token_receive, token_send} = arg; 
   
      let id_info_token: any; 
  
      const dt: any = fs.readFileSync(filePathERC721) ;  // buffer
      const dataFile = JSON.parse(dt); 
  
       dataFile.forEach((item: any) => {
        if(item.id_card === id_card){
          item.data.forEach((item: any) => {
            if(item.address === address){
              item.infoNFT.forEach((item: any) => {
                if(item.address_contract === address_contract){
                  id_info_token = item.tokenInfo;
                  id_info_token.push(...token_receive);
                  token_send.forEach((id_token_send: any) =>{ 
                      id_info_token = id_info_token.filter((item: any) => item !== id_token_send); 
                  })
                }
              })
            }
          })
        }
       })  
  
       dataFile.forEach((item: any, index1:number)=>{
        if(item.id_card ===  id_card){
          item.data.forEach((item:any, index2:number)=>{
            if(item.address === address){
              item.infoNFT.forEach((item:any, index3:number)=>{
                if(item.address_contract === address_contract){ 
                    dataFile[index1].data[index2].infoNFT[index3].currentBlock = currentBlock;
                    dataFile[index1].data[index2].infoNFT[index3].balance = id_info_token.length;
                    dataFile[index1].data[index2].infoNFT[index3].tokenInfo = id_info_token; 
                }
              })
            }
          })
        }
       }) 
        const sData  = JSON.stringify(dataFile);
        fs.writeFileSync(filePathERC721, sData);
    });
  
    ipcMain.handle("handle-update-erc1155", (_, args) => {
      const {id_card, address, address_contract, token_receive, token_send, currentBlock} = args;
      const dt: any = fs.readFileSync(filePathERC1155) ;  // buffer
      const dataFile = JSON.parse(dt);
      let id_info_token: any; 
      dataFile.forEach((item: any) => {
        if(item.id_card === id_card){
          item.data.forEach((item: any) => {
            if(item.address === address){
              item.infoNFT.forEach((item: any) => {
                if(item.address_contract === address_contract){
                  id_info_token = item.tokenInfo;
                  token_receive.forEach((item, index1)=>{
                    id_info_token.forEach(({tokenId, amt_of_tokenId}, index2)=>{ 
                      if(item.tokenId === tokenId){
                        id_info_token[index2].amt_of_tokenId = (Number(amt_of_tokenId) + Number(item.amt_of_tokenId)).toString();
                        token_send.splice(index1);
                      }
                    }) 
                  })
                  id_info_token.push(...token_send);
                  token_send.forEach((item)=>{
                    id_info_token.forEach(({tokenId, amt_of_tokenId}, index2)=>{
                      if(item.tokenId === tokenId){
                        id_info_token[index2] = (Number(amt_of_tokenId) - item.amt_of_tokenId).toString();
                      }
                    })
                  })
                }
              })
            }
          })
        }
      }) 
  
      dataFile.forEach((item: any, index1:number)=>{
        if(item.id_card ===  id_card){
          item.data.forEach((item:any, index2:number)=>{
            if(item.address === address){
              item.infoNFT.forEach((item:any, index3:number)=>{
                if(item.address_contract === address_contract){ 
                    dataFile[index1].data[index2].infoNFT[index3].currentBlock = currentBlock;
                    dataFile[index1].data[index2].infoNFT[index3].sum_amt_tokenId = id_info_token.length;
                    dataFile[index1].data[index2].infoNFT[index3].tokenInfo = id_info_token; 
                }
              })
            }
          })
        }
       }) 
  
      const sData  = JSON.stringify(dataFile);
      fs.writeFileSync(filePathERC721, sData);
    })
  
    ipcMain.handle("read-data", async (_, args) => {
      const {id_card, address, address_contract, type} = args;
  
      let filepath: string;
      if(type === "erc721"){ 
        filepath = filePathERC721
      }else { 
        filepath = filePathERC1155
      }
      
      const dt: any = fs.readFileSync(filepath) ;  // buffer
      const dataFile = JSON.parse(dt);
      const res: any = [];
  
       dataFile.forEach((item: any ) => {
        if(item.id_card === id_card) {
          item.data.forEach((item: any ) =>{
            if(item.address === address){
              item.infoNFT.forEach((item: any, index: number)=>{
                if(item.address_contract === address_contract) { 
                  res.push(item);
                }
              })
            }
          })
        }
      })  
      return res;
    })
   
  
    ipcMain.handle("get-current-block", (event, arg)=>{  
      const {id_card, address, address_contract, type} : any = arg
      let filePath: string;
      if(type === "erc721"){
        filePath = filePathERC721;
      }else {
        filePath = filePathERC1155;
      }
      const res = fs.existsSync(filePath); 
      if (res) {
        
        const dt: any = fs.readFileSync(filePath); 
        const data = [...JSON.parse(dt)]; 
        let currentBlock = 0; 
        data.forEach((item: any)=>{  
        if(item.id_card === id_card){ 
          const dataOfIdCard = item.data;   
            dataOfIdCard.forEach((item: any)=>{ 
              if(item.address === address){  
                const infoContract = item.infoNFT;   
                infoContract.forEach((item: any)=>{  
                    if(item.address_contract === address_contract){
                      currentBlock = item.currentBlock;
                    }
                  }) 
              }
            })
          } 
        })  
        return currentBlock;
      }
    }) 
  
    ipcMain.handle("insert-pin", async (event, args)=>{  
      try {
        const pin = args.pin;
        const {verify, times} = await wallet.VerifyPin(pin);  
        return {result: verify, times: times, message: verify ? "Login successfully." : "Login failed, please try again."};
      } catch (error) {
        console.log(error);
        return {message: error.message}
      }
    })
  
    ipcMain.handle("change-pin", async (event, args)=>{
      try {
        const oldPin = args.oldPin; 
        const newPin = args.newPin; 
        const result = await wallet.ChangePin(oldPin, newPin); // true or false 
        return {result: result, message: result ? "Change pin successfully" : "Change pin failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })

    ipcMain.handle("generate-set-pin", async (event, args)=>{
      try {
        const oldPin = args.oldPin; 
        const newPin = args.newPin; 
        await wallet.VerifyPin(oldPin)
        const result = await wallet.ChangePin(oldPin, newPin); // true or false 
        return {result: result, message: result ? "Set pin successfully" : "Set pin failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
   
    ipcMain.handle("get-network",async () => { 
      const listInfoNetwork: any = [];
      try { 
        //get info network on card
        for(let i = 0; i <indexNetwork.length; i++) {
          await wallet.GetNetwork(indexNetwork[i]).then((result) => { 
              if(result?.chainID){ 
                  listNetwork.push({ 
                      chainID: result?.chainID 
                  });
              }
          }) 
        } 
        // compare between card + file network config
        listNetwork.map(({chainID}: any)=> { 
           Object.values(ALL_CHAINS).map(item=> {
            if(chainID==item.chainID) listInfoNetwork.push(item);
          })
        })   
        return {listNetwork: listInfoNetwork};
      } catch (error) {
        console.log("error", error);
      } finally {
        listNetwork = [];
      }
    })
  
    ipcMain.handle("import-network",async (event, args ) => {
      try {
        const {name, chainID, symbol, index } = args;
        const result = await wallet.ImportNetwork({chainID, symbol, name}, index); // true or false
        return {result: result, message: result ? "Import network successfully." : "Import network failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("delete-network",async (event, args ) => {
      try {
        const index = args.index;
        const result = await wallet.DeleteNetwork(index);
        return {result: result, message: result ? "Delete network successfully." : "Delete network failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("get-network-config-add",async ()=>{
      let listNetworkAdd: any = ALL_CHAINS;
       try { 
        //get info network on card
        for(let i = 0; i <indexNetwork.length; i++) {
          await wallet.GetNetwork(indexNetwork[i]).then((result) => { 
              if(result?.chainID){ 
                listNetworkAdd = Object.values(listNetworkAdd).filter((item: any) => item.chainID !== result?.chainID);
              }
          }) 
        }
        console.log(listNetworkAdd)
        return {result: true, message: "Get network config successfully.", listNetworkAdd};
      } catch (error) {
        return {result: false, message: error.message, listNetworkAdd: []};
      } finally {
        listNetwork = [];
        listNetworkAdd = [];
      }
    })
  
    ipcMain.handle("get-account",async (event, args ) => {
      try{
        for(let i = 0; i < indexAcount.length; i++){
            await wallet.GetAccount(indexAcount[i]).then((result) => {
                if(result?.address !== undefined && result?.publickey !== undefined){
                    listAddress.push({
                        address: result.address,
                        name: result.name ? result.name : `Account ${i+1}`,
                        indexAccount: result.index,
                    });
                }
            })
        } 
        return {listAddress: listAddress}
    }catch(err) {
        console.error(err);
        return {listAddress: [] }
    }finally{
        listAddress = [];
    }
    })
  
    ipcMain.handle("import-account",async (event, args ) => { 
      try {
        const {privateKey, name, index } = args;
        const result = await wallet.ImportAccount(privateKey, name, index);
        return {result: result, message: result ? "Import account successfully" : "Import account failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("delete-account",async (event, args ) => { 
      try {
        const index = args.index;
        const result = await wallet.DeleteAccount(index);
        return {result: result, message: result ? "Delete account successfully." : "Import account failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("import-name-account", async (event, args) =>{
      try {
        const {name, index} = args;
        const result = await wallet.ImportNameAccount(name, index);
        return {result: result, message: result ? "Import name account successfully." : "Import name account failed, please try again."};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("import-mnemonic-word", async (event, args)=>{
      try {
        const mnemonic = args.mnemonic;
        const isValidateMnemonic = bip39.validateMnemonic(mnemonic);
        if(isValidateMnemonic) {
          const statusCard = await wallet.GetStatus();
          if(statusCard === "0001"){
            const result = await wallet.ImportMnemonicWord(mnemonic);
            return {result: result, message: "Import mnemonic word successfully."}
          }else return {result: false, message: "Card activated"}
        }else {
          return {result: false, message: "Invalid mnemonic word, please try again."}
        }
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("generate-HDWallet", async () => {
      try {
        const status = await wallet.GetStatus(); 
        if(status === "0001") {
          const mnemonic = await wallet.GenerateHDWallet(); 
          return {result: true, mnemonic: mnemonic, message: ""}
        }else if(status === "0002"){
          return {result: false, mnemonic: [], message: "Card Actived"}
        }
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("forgot-password",async (event, args)=>{
      const mnemonic = args.mnemonic; 
      const oldPin = "11111111";
      const newPin = args.newPin;
      const isValidateMnemonic = bip39.validateMnemonic(mnemonic);
      if(isValidateMnemonic){
        const result_reset = await wallet.ResetWallet(mnemonic);
        if(result_reset){
          const result_import = await wallet.ImportMnemonicWord(mnemonic);
          if(result_import){
            const result_login = await wallet.VerifyPin(oldPin);
            if(result_login){
              const result_change_pin = await wallet.ChangePin(oldPin, newPin);
              if(result_change_pin){
                return {result: result_change_pin, message: "Successful."}
              }else return {result: result_change_pin, message: "Failed, please again."}
            }else return {result: result_login, message: "Failed, please again."}
          }else return {result: result_import, message: "Failed, please again."}
        }else return {result: result_reset, message: "Failed, please again."}
      }else return {result: isValidateMnemonic, message: "Failed, please again."}  
    })
  
    ipcMain.handle("import-token", async (event, args)=>{ 
      try {
        const {addressToken, typeToken, chainID, symbolToken, index} = args; 
        const address = addressToken.slice(2);
        const result = await wallet.ImportToken({type: typeToken, address: address, chainID, symbol: symbolToken}, index);
        const  message = result ? "Import token successfully" : "Import token failed, please try again."
        return {result: result,message}
      } catch (error) {
        return {result: false, message: error.message}
      }
    })
    
    ipcMain.handle("get-token", async (event, args) => {
      try {
        const listTokenERC20: object[] = [];
        const listTokenERC721ERC1155: object[] = [];
        for (let i = 0; i <indexToken.length; i++){
            const result: any = await wallet.GetToken(i);
            if(result.chainID !== '0' && result.type === "ERC20"){
              listTokenERC20.push(result);
            }else if(result.chainID !== '0') listTokenERC721ERC1155.push(result);
        } 
        return {result: true, message: "Get token successfully.", listTokenERC20, listTokenERC721ERC1155}
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("delete-token", async (event, args)=>{
      try {
        const index = args.index;
        const result = await wallet.DeleteToken(index);
        return {result: result, message: result ? "Delete token successfully" : "Delete token failed, please try again."}
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("tx-param", async (event, args)=>{
      try {
        const txParam = args.tx; 
        const tx : object = {
          chainID: format.formatFieldTx(txParam.chainID),
          nonce: format.formatFieldTx(txParam.nonce),
          maxPriorityFeePerGas: format.formatFieldTx(txParam.maxPriorityFeePerGas),
          maxFeePerGas: format.formatFieldTx(txParam.maxFeePerGas),
          gasLimit: format.formatFieldTx(txParam.gasLimit),
          to: format.formatFieldTx(txParam.to),
          value: format.formatFieldTx(txParam.value), 
          data: format.formatFieldTx(txParam.data), 
          accessList: [],
        } 
        
        const messageToBeSigned_decode = Buffer.concat([
          TRANSACTION_TYPE_2_BUFFER,
          Buffer.from(
            RLP.encode(Object.values(tx).slice(0, 7))
          )
        ]); 
    
        const messageToBeSigned_sign: Buffer = Buffer.concat([
          TRANSACTION_TYPE_2_BUFFER,
          Buffer.from(
              RLP.encode(Object.values(tx).slice(0, 9))
          )
        ]) 
    
        const decode_to = await wallet.RLP_Decode(messageToBeSigned_decode.toString("hex")); 
        
        const msgHash =  keccak256(messageToBeSigned_sign).toString("hex"); 
    
        return {result: true, message: "", decode_to, msgHash};
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("sign-transaction", async (event, args) => {
      try {
        const {msgHash, pin, index} = args;
        const msgHashBuffer = Buffer.from(msgHash, "hex");   
        const result = await wallet.Transaction(msgHash, pin, index)  
        const account = await wallet.GetAccount(index);  
    
        const publicKey = account?.publickey; 
        const key = ec.keyFromPublic(publicKey, "hex");  
        const recoveryParam = ec.getKeyRecoveryParam(msgHashBuffer, result, key.getPublic()); 
    
        const vs = format.checkS(recoveryParam, `0x${result?.s}`);
        const v = format.formatFieldTx(vs.v);
        const s = format.formatFieldTx(vs.s);
        const r = format.formatFieldTx(`0x${result?.r}`); 
    
        const sign = s.slice(2) + r.slice(2) + v.slice(2);
        return {result: false, sign, v, r, s}; 
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      } 
    })
  
    ipcMain.handle("sign-message", async (event, args) => {
      try {
        const {message, pin, index} = args;
        const msgHash : any = keccak256(message).toString("hex");
        const msgHashBuffer = Buffer.from(msgHash, "hex");
        console.log({message, pin, index})
        return await wallet.TransactionSingle(msgHash, pin, index).then(async (result : any) => {
          const account = await wallet.GetAccount(index);
          const publicKey = account?.publickey;
          const key = ec.keyFromPublic(publicKey, "hex");
          const recoveryParam = ec.getKeyRecoveryParam(msgHashBuffer, result, key.getPublic()); 
          const vs = format.checkS(recoveryParam, `0x${result?.s}`);
          const v =format.formatFieldTx(vs.v);
          const s = format.formatFieldTx(vs.s);
          const r = format.formatFieldTx(`0x${result?.r}`);  
          const signature = r.slice(2) + s.slice(2) + v.slice(2); 
          return {result: true, message: "", signature} 
        }).catch(error=>({error}));
      } catch (error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
   
  
    ipcMain.handle("save-receive", (event, args) =>{
      try{ 
        const dt: any = fs.readFileSync(filePathRecipientsAddress) ;  
        const dataFile = JSON.parse(dt);
        const {address, name} = args;
        dataFile.push({name, address});
        const sData  = JSON.stringify(dataFile);
        fs.writeFileSync(filePathRecipientsAddress, sData);
        return {result: true, message: "Save receive successfully."};
      }catch(error) {
        console.log(error);
        return {result: false, message: error.message}
      }
    })
  
    ipcMain.handle("get-save-receive", () =>{
      const dt: any = fs.readFileSync(filePathRecipientsAddress) ;  
      const dataFile = JSON.parse(dt);
      return dataFile;
    })
  
    ipcMain.handle("save-history-transaction", (event, args) =>{
      const {id_card, txHash} = args;
      const dt: any = fs.readFileSync(filePathHistoryTransaction) ;  
      const dataFile = JSON.parse(dt);
      dataFile.push({id_card, txHash});
      const sData  = JSON.stringify(dataFile);
      fs.writeFileSync(filePathHistoryTransaction, sData);
    })
  
    ipcMain.handle("get-history-transaction", (event, args) => {
      const {id_card} = args;
      const listTxHash: any = [];
      const dt: any = fs.readFileSync(filePathHistoryTransaction) ;  
      const dataFile = JSON.parse(dt);
      dataFile.forEach((item) => {
        if(item.id_card == id_card) {
          listTxHash.push(item.txHash)
        }
      })
      return {listTxHash}
    })
  
    ipcMain.handle("open-new-window", (event, args) => {
      const {txHash} = args;
      shell.openExternal(`https://goerli.etherscan.io/tx/${txHash}`);
    })
  
}


export default registerListeners;