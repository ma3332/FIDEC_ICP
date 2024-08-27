import useInitialization from "../src/hooks/useInitialization";
import useWalletConnectEventsManager from "./hooks/useWalletConnectEventsManager";
import { HashRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import Login from "./page/Login";
import ForgetPassword from "./page/ForgetPassword";
import NewWallet from "./page/NewWallet";
import MnemonicWords from "./page/NewWallet/Mnemonic";
import MnemonicConfirm from "./page/NewWallet/Mnemonic/MnemonicConfirm";
import GenerateNewWalletConfirm from "./page/NewWallet/Mnemonic/MnemonicGenerateConfirm";
import PasswordSetup from "./page/Password/PasswordSetup";
import PasswordDone from "./page/Password/PasswordDone";
import NFTPage from "./page/NFT";
import ImportAccount from "./page/Accounts/ImportAccount";
import DeleteAccount from "./page/Accounts/DeleteAccount";
import AccountDetail from "./page/Accounts/AccountDetail";
import BuyToken from "./page/Token/BuyToken";
// import ImportNetwork from "./page/Network/ImportNetwork";
import ImportToken from "./page/Token/ImportToken";  
import DappConnect from "./page/Dapp/DappConnect";
// import DappTransaction from "./page/Dapp/DappTransaction";
import TransactionPinCode from "./page/PinCode/Transaction";
import SetNewPin from "./page/PinCode/SetNewPin";
import SetNewPinGenerate from "./page/PinCode/SetNewPin/SetNewPinGenerate";
import History from "./page/History";
import Settings from "./page/Settings";
import NeedWalletConnect from "./page/Wallet/NeedWalletConnect";
import NeedWalletConnectLoading from "./page/Wallet/WalletLoading";
import NotFound from "./components/NotFound";
import ERC20 from "./page/Token/ERC20";
import BuyErc721_1150 from "./page/Token/BuyErc721-1155";
// import NFTDetail from "./page/NFT/NFTDetail";
import NftTokenIdDetail from "./page/NFT/TokenIdDetail";
import Send from "./page/Token/Send";
import SaveRecipientsPage from "./page/Token/Recipients/SaveRecipients";
import EditRecipientsPage from "./page/Token/Recipients/EditRecipients";
import SigningMessage from "./page/SignningMessage";
// import GasSetting from "./page/GasSetting";
// import WalletIndexPage from "./page/Wallet/WalletIndex";
import ImportNetworkSelect from "./page/Network/ImportNetworkSelect";
import ImportNetworkDefault from "./page/Network/ImportNetworkDefault";

const Routes = () => {
  const initialized = useInitialization();
  useWalletConnectEventsManager(initialized);

  return (
    <div>
      <HashRouter>
        {!initialized ? (
          <ReactRoutes>
            <Route path="/" element={<Login />} />
            <Route path="/new-wallet" element={<NewWallet />} />
            <Route
              path="/new-wallet/mnemonic-words"
              element={<MnemonicWords />}
            />
            <Route
              path="/new-wallet/mnemonic-confirm"
              element={<MnemonicConfirm />}
            />
            <Route
              path="/new-wallet/mnemonic-generate-confirm"
              element={<GenerateNewWalletConfirm />}
            />
            <Route
              path="/network/import-network-default"
              element={<ImportNetworkDefault />}
            />
            <Route
              path="/set-new-pin-generate"
              element={<SetNewPinGenerate />}
            />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </ReactRoutes>
        ) : (
          <ReactRoutes>
            <Route path="/" element={<ERC20 />} />
            <Route
              path="/wallet/need-wallet-connect"
              element={<NeedWalletConnect />}
            />
            <Route
              path="/wallet/need-wallet-connect-loading"
              element={<NeedWalletConnectLoading />}
            />
            <Route path="/password/setup" element={<PasswordSetup />} />
            <Route path="/password/done" element={<PasswordDone />} />
            <Route path="/nft" element={<NFTPage />} />
            {/* <Route path="/nft/nft-detail" element={<NFTDetail />} /> */}
            <Route
              path="/nft/nft-token-id-detail"
              element={<NftTokenIdDetail />}
            />
            <Route path="/account/import-account" element={<ImportAccount />} />
            <Route path="/account/delete-account" element={<DeleteAccount />} />
            <Route path="/account/detail-account" element={<AccountDetail />} />
            <Route path="/token/buy-token" element={<BuyToken />} />
            <Route
              path="/token/buy-token/erc721-1150"
              element={<BuyErc721_1150 />}
            />
            <Route path="/token/import-token" element={<ImportToken />} />
            <Route path="/token/send-token" element={<Send type_send="Token" />} />
            <Route path="/token/send-nft" element={<Send type_send="NFT" />} />
            <Route
              path="/token/send-token-transaction"
              element={<Send type_send="ETH" />}
            />
            <Route
              path="/network/import-network"
              element={<ImportNetworkSelect />}
            />
            <Route path="/dapp/connect-dapp" element={<DappConnect />} />
            {/* <Route
              path="/dapp/transaction-dapp"
              element={<DappTransaction />}
            /> */}

            {/* ------ pin ---------  */}
            <Route
              path="/pin/transaction-pin"
              element={<TransactionPinCode />}
            />
            <Route path="/pin/set-new-pin" element={<SetNewPin />} />
            <Route path="/pin/sign-message" element={<SigningMessage />} />
            {/* ------ pin ---------  */}

            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/save-recipients-page"
              element={<SaveRecipientsPage />}
            />
            <Route
              path="/edit-recipients-page"
              element={<EditRecipientsPage />}
            />
            <Route path="*" index element={<NotFound />} />
          </ReactRoutes>
        )}
      </HashRouter>
    </div>
  );
};

export default Routes;
