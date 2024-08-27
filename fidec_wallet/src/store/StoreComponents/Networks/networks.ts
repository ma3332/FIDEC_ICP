import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  loading: boolean; 
  network: {
    name?: string,
    url?: string,
    ws?: string,
    chainID?: number,
    symbol?: string, 
  };
  networks: [{
    name?: string,
    url?: string,
    ws?: string,
    chainID?: number,
    symbol?: string, 
  }];
  networksAdd: [{
    name?: string,
    url?: string,
    ws?: string,
    chainID?: number,
    symbol?: string,
  }];
  checkGetNetwork: boolean;
};
 
const initialState: InitialState = {
  loading: false,
  network: {
    name: null,
    url: null,
    ws: null,
    chainID: null,
    symbol: null, 
  },
  networks: [{
    name: null,
    url: null,
    ws: null,
    chainID: null,
    symbol: null, 
  }],
  networksAdd: [{
    name: null,
    url: null,
    ws: null,
    chainID: null,
    symbol: null, 
  }],
  checkGetNetwork: false
};

const NetworksSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      const network_select = Number(localStorage.getItem('network_select'));
      state.networks = action.payload;
      if(network_select < action.payload.length && network_select) { 
        state.network = state.networks[network_select] 
      }else{
        state.network = state.networks[0] 
        localStorage.setItem('network_select', "0")
      }
    },
    setNetworksAdd: (state, action) => {
      state.networksAdd = action.payload;
    },
    selectNetwork: (state, action) => {
      state.network = state.networks[action.payload];
    },
    setCheckGetNetwork: (state, action) => {
      state.checkGetNetwork = action.payload;
    }
  },
});

export const { 
  setNetworks, 
  setNetworksAdd,
  selectNetwork, 
  setCheckGetNetwork 
} = NetworksSlice.actions;


export default NetworksSlice.reducer;
