// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import fs = require('fs');
declare global {
  interface Window {
    fs: typeof fs;
  }
}

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`
   */

  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: any) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  }, 

  hanldeGetStatus: async ()=>{
    const res = await ipcRenderer.invoke('get-status-card');
    return res;
  },

  handleGetCurrentBlock: async (data: object)=>{ 
    const currentBlock = await ipcRenderer.invoke('get-current-block', data);
    return currentBlock
  },

  handleSaveDataERC: async (data: object)=>{
    const {id_card, address, address_contract, type} : any = data;  
    await ipcRenderer.invoke('handle-save-erc', data); 
    const rData = await ipcRenderer.invoke("read-data", {id_card, address, address_contract, type});
    return rData[0];
  }, 

  handleUpdateDataERC721: async (data: object)=>{
    const {id_card, address, address_contract}: any = data;
    await ipcRenderer.invoke("handle-update-erc721", data);
    const rData = await ipcRenderer.invoke("read-data", {id_card, address, address_contract, type: "erc721"}); 
    return rData[0];
  },

  handleUpdateDataERC1155: async (data: object)=>{
    const {id_card, address, address_contract}: any = data;
    await ipcRenderer.invoke("handle-update-erc1155", data);
    const rData = await ipcRenderer.invoke("read-data", {id_card, address, address_contract, type: "erc1155"});
    return rData[0];
  },

  handleLogin: async (pin: string)=>{ 
    const res = await ipcRenderer.invoke("insert-pin", {pin}); 
    return res;
  },

  handleChangePin: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("change-pin", data);
    return res;
  },

  handleGenerateSetPin: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("generate-set-pin", data);
    return res;
  },

  handleGetAccount: async ()=>{
    const res = await ipcRenderer.invoke("get-account");
    console.log(res);
    return res;
  },
  
  handleImportAccount: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("import-account", data);
    return res;
  },

  handleDeleteAccount: async (data: object)=>{  
    const res = await ipcRenderer.invoke("delete-account", data);
    return res;
  },

  handleImportNameAccount: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("import-name-account", data);
    return res;
  },

  handleImportMnemonicWord : async (data: object) =>{ 
    const res = await ipcRenderer.invoke("import-mnemonic-word", data);
    return res;
  },

  handleGenerateHDWallet : async () =>{
    const res = await ipcRenderer.invoke("generate-HDWallet");
    return res;
  },

  handleForgotPassword : async (data: object) =>{ 
     const res = await ipcRenderer.invoke("forgot-password", data);
     return res;
  },

  handleGetNetwork: async ()=>{
    const res = await ipcRenderer.invoke("get-network");
    return res;
  },

  handleImportNetwork: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("import-network", data);
    return res;
  },

  handleDeleteNetwork: async (data: object)=>{
    const {index} : any = data;
    const res = await ipcRenderer.invoke("delete-network", {index});
    return res;
  },

  hanldeGetNetworkAdd: async ()=>{
    const res = await ipcRenderer.invoke("get-network-config-add"); 
    return res;
  },

  handleGetToken: async ()=>{
    const res = await ipcRenderer.invoke("get-token");
    return res;
  },

  handleImportToken: async (data: object)=>{  
    const res = await ipcRenderer.invoke("import-token", data);
    return res;
  },

  handleDeleteToken: async (data: object)=>{ 
    const res = await ipcRenderer.invoke("delete-token", data);
    return res;
  },

  handleTxParam: async (data: object) => {
    const {tx} : any = data; 
    const res = await ipcRenderer.invoke("tx-param", {tx});
    return res;
  },

  handleSignTransaction: async (data: object) => {
    const {msgHash, pin, index} : any = data; 
    const res = await ipcRenderer.invoke("sign-transaction", {msgHash, pin, index}); 
    return res;
  },

  handleSignMessage: async (data: object) => { 
    const res = await ipcRenderer.invoke("sign-message", data);
    return res;
  },

  handleSaveReceive: async (data: object) => {
    const res = await ipcRenderer.invoke("save-receive", data);
    return res;
  },

  handleGetSaveReceive: async () => {
    const res = await ipcRenderer.invoke("get-save-receive");
    return res;
  },

  handleSaveHistoryTransaction: async (data: object) => {
    await ipcRenderer.invoke("save-history-transaction", data);
  },

  handleGetHistoryTransaction: async (data: object) => {
    const res = await ipcRenderer.invoke("get-history-transaction", data);
    return res;
  },

  handleOpenNewWindow: async (data: object) => {
    await ipcRenderer.invoke("open-new-window", data);
    return
  } 
}

contextBridge.exposeInMainWorld('Main', api)