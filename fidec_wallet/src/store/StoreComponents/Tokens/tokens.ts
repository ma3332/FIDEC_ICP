import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  type: string;
  addressesERC20: [{
    addressToken:string,
    type: string,
    symbolToken: string,
    chainID: string,
    indexToken: number
  }];
  addressERC20: {
    addressToken:string,
    type: string,
    symbolToken: string,
    chainID: string,
    indexToken: number
  };
  addressesERC721and1155: [{
    addressToken:string,
    type: string,
    symbolToken: string,
    chainID: string,
    indexToken: number
  }];
  addressERC721or1155: {
    addressToken:string,
    type: string,
    symbolToken: string,
    chainID: string,
    indexToken: number
  };
  balance: string;
  infoNFT721: object;
  infoNFT1155: object;
  showInfoNFT: boolean;
  checkTokenDetail: boolean;
  typeImport: string;
  checkGetAddressERC: boolean;
};

const initialState: InitialState = {
  type: null,
  addressesERC20: [{
    addressToken: null,
    type: null,
    symbolToken: null,
    chainID: null,
    indexToken: null
  }],
  addressERC20: {
    addressToken: null,
    type: null,
    symbolToken: null,
    chainID: null,
    indexToken: null
  },
  addressesERC721and1155: [{
    addressToken: null,
    type: null,
    symbolToken: null,
    chainID: null,
    indexToken: null
  }],
  addressERC721or1155: {
    addressToken: null,
    type: null,
    symbolToken: null,
    chainID: null,
    indexToken: null
  },
  balance: "0",
  infoNFT721: {},
  infoNFT1155: {},
  showInfoNFT: false,
  checkTokenDetail: false,
  typeImport: "",
  checkGetAddressERC: false,
};

const TokensSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setAddressesERC20: (state, action) => {
      state.addressesERC20 = action.payload;
    },
    setAddressesERC721and1155: (state, action) => {
      state.addressesERC721and1155 = action.payload;
    },
    setAddressERC721or1155: (state, action) => {
      state.addressERC721or1155 = action.payload;
    },
    setInfoNFT721: (state, action) => {
      state.infoNFT721 = action.payload;
    },
    setInfoNFT1155: (state, action) => {
      state.infoNFT1155 = action.payload;
    },
    setShowInfoNFT: (state, action) => {
      state.showInfoNFT = action.payload;
    },
    setAddressERC20: (state, action) => {
      state.addressERC20 = action.payload;
    },
    setCheckTokenDetail: (state, action) => {
      state.checkTokenDetail = action.payload;
    },
    setTypeImport: (state, action) => {
      state.typeImport = action.payload;
    },
    setCheckGetAddressERC: (state, action) => {
        state.checkGetAddressERC = action.payload;
    }
  },
});

export const {
  setAddressesERC20,
  setAddressesERC721and1155,
  setAddressERC721or1155,
  setInfoNFT721,
  setInfoNFT1155,
  setAddressERC20,
  setShowInfoNFT,
  setCheckTokenDetail,
  setTypeImport,
  setCheckGetAddressERC
} = TokensSlice.actions;

export default TokensSlice.reducer;
