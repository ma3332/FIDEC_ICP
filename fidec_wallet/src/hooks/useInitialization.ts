import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { createSignClient } from "../utils/WalletConnectUtil";
import { AppDispatch } from "../store/store";
import {
  getAccounts,
  setPath,
  setCheckGetAccount,
} from "../store/StoreComponents/Accounts/accounts";
import {
  setNetworks,
  setNetworksAdd,
  setCheckGetNetwork,
} from "../store/StoreComponents/Networks/networks";
import {
  setAddressesERC20,
  setAddressesERC721and1155,
  setAddressERC721or1155,
  setCheckGetAddressERC,
} from "../store/StoreComponents/Tokens/tokens";
import type { RootState } from "../store/store";
import { setLoading } from "../store/Support/Loading/LoadingSlice";

export default function useInitialization() {
  const [initialized, setInitialized] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const accountsState = useSelector((state: RootState) => state.accounts);
  const networksState = useSelector((state: RootState) => state.networks);
  const tokensState = useSelector((state: RootState) => state.tokens);
  const { checkLogin, checkGetAccount } = accountsState;
  const { checkGetAddressERC } = tokensState;
  const { checkGetNetwork } = networksState;

  const getAccountsApp = async () => {
    await window.Main.handleGetAccount().then((res) => {
      dispatch(getAccounts(res.listAddress));
      dispatch(setPath("/token/send-token-transaction"));
      dispatch(setCheckGetAccount(false));
    });
  };

  const getAddressesToken = async () => {
    await window.Main.handleGetToken().then((res) => {
      if (res.listTokenERC20.length > 0) {
        dispatch(setAddressesERC20(res.listTokenERC20));
        dispatch(setCheckGetAddressERC(false));
      } else {
        dispatch(setAddressesERC20({}));
        dispatch(setCheckGetAddressERC(false));
      }
      if (res.listTokenERC721ERC1155.length > 0) {
        dispatch(setAddressesERC721and1155(res.listTokenERC721ERC1155));
        dispatch(
          setAddressERC721or1155({
            addressToken: res.listTokenERC721ERC1155[0].addressToken,
            type: res.listTokenERC721ERC1155[0].type,
            symbol: res.listTokenERC721ERC1155[0].symbol,
            index: res.listTokenERC721ERC1155[0].index,
          })
        );
        dispatch(setCheckGetAddressERC(false));
      } else {
        dispatch(setAddressesERC721and1155([]));
        dispatch(setAddressERC721or1155({}));
        dispatch(setCheckGetAddressERC(false));
      }
    });
  };

  const getNetwork = async () => {
    await window.Main.handleGetNetwork().then((res) => { 
      dispatch(setNetworks(res.listNetwork));
      dispatch(setCheckGetNetwork(false));
    });
    await window.Main.hanldeGetNetworkAdd().then((res) => {
      dispatch(setNetworksAdd(res.listNetworkAdd));
    }); 
  };

  const onInitialize = useCallback(async () => {
    try {
      await getNetwork();
      await getAccountsApp();
      await getAddressesToken();
      await createSignClient();
      setInitialized(true);
      dispatch(setLoading(false));
    } catch (err: unknown) {
      console.log(err);
    }
  }, []);

  useEffect(() => { 
    if (!initialized && checkLogin) {
      onInitialize();
    }
  }, [initialized, checkLogin, onInitialize]);

  useEffect(() => {
    if (checkGetAddressERC) {
      getAddressesToken();
    }
  }, [checkGetAddressERC]);

  useEffect(() => {
    if (checkGetAccount) {
      getAccountsApp();
    }
  }, [checkGetAccount]);

  useEffect(() => {
    if (checkGetNetwork) {
      getNetwork();
    }
  }, [checkGetNetwork]);

  useEffect(() => {
    if (!checkLogin) {
      setInitialized(false);
    }
  }, [checkLogin]);

  return initialized;
}
