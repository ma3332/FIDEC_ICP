import { createSlice } from "@reduxjs/toolkit";


type InitialState = { 
  mnemonic: string[];
  eip155Addresses:  [{
    address: string,
    indexAccount: number,
    name: string
  }];
  eip155Address: {
    address: string,
    indexAccount: number,
    name: string
  }; 
  balance: string;
  checkGetBalance: boolean;
  path: string;
  checkLogin: boolean;
  checkGetAccount: boolean;
  disableHeader: object;
};
 

const initialState: InitialState = { 
  mnemonic: [],
  eip155Addresses: [{
    address: null,
    indexAccount: null,
    name: null
  }],
  eip155Address: {
    address: null,
    indexAccount: null,
    name: null
  }, 
  balance: null,
  checkGetBalance: false,
  path: "",
  checkLogin: false,
  checkGetAccount: false,
  disableHeader: {}
};
 

const AccountsSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
      setMnemonic: (state, action) => {
        state.mnemonic = action.payload;
      },
      getAccounts: (state, action)=>{ 
        const account_select = localStorage.getItem("account_select");
        state.eip155Addresses = action.payload ; 
        if(account_select < action.payload.length && account_select) {
          state.eip155Address = action.payload[account_select]
        }else {
          state.eip155Address = action.payload[0]
          localStorage.setItem("account_select", "0");
        }
      },
      setSelectAccount: (state, action)=>{
          state.eip155Address = state.eip155Addresses[action.payload]; 
      },
      setBalance: (state, action)=>{
        state.balance = action.payload;
      },
      setPath: (state, action)=>{
        state.path = action.payload;
      },
      setCheckLogin: (state, action)=>{
        state.checkLogin = action.payload;
      },
      setCheckGetAccount: (state, action)=>{
        state.checkGetAccount = action.payload;
      },
      setDisableHeader: (state, action)=>{
        state.disableHeader = action.payload;
      },
      setCheckGetBalance: (state, action)=>{
        state.checkGetBalance = action.payload;
      }
  }, 
});


export const { 
  setMnemonic, 
  getAccounts, 
  setSelectAccount, 
  setBalance, 
  setPath, 
  setCheckLogin, 
  setCheckGetAccount, 
  setDisableHeader,
  setCheckGetBalance
} = AccountsSlice.actions;

export default AccountsSlice.reducer;
