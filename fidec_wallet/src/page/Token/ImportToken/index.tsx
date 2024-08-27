import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { Form, Button, Input } from "antd";
import BackToHomeText from "../../../components/Footers/Back";
import Navbar from "../../../components/Navbar";
import { checkAddressToken, openNotification } from "../../../utils/helperUtil";
import { setCheckGetAddressERC } from "../../../store/StoreComponents/Tokens/tokens";
import "./styles.scss";

const ImportToken = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notificationToken, setNotificationToken] = useState("");
  const [addressToken, setAddressToken] = useState("");
  const [typeToken, setTypeToken] = useState<number>();
  const [disabled, setDisabled] = useState(true);

  const tokensState = useSelector((state: RootState) => state.tokens);
  const networksState = useSelector((state: RootState) => state.networks);
  const { addressesERC20, addressesERC721and1155, typeImport }: any =
    tokensState;
  const { network } = networksState;
  const { url, chainID }: any = network;

  const importToken = async () => {
    if (addressToken && typeToken) {
      try {
        const {result, message} = await window.Main.handleImportToken({
          addressToken,
          typeToken,
          symbolToken: form.getFieldValue("symbolToken"),
          chainID, 
          index:
            Object.values(addressesERC20).length +
            addressesERC721and1155.length,
        }); 
        if(result) {
          if(typeImport === "Token"){
            navigate("/")
          }else navigate("/nft")
        } 
        dispatch(setCheckGetAddressERC(result));
        openNotification(message, result ? "success" : "warning");
      } catch (error) {
        openNotification(error.message, "error");
      }
    } else {
      openNotification("Please try again.", "warning");
    }
    form.resetFields();
  };

  const checkValueImportAddressToken = (message: string) => {
    setDisabled(true);
    form.resetFields(["symbolToken"]);
    form.resetFields(["decimalToken"]);
    setNotificationToken(message);
  };

  return (
    <div className="import--token--page">
      <HeaderMain />
      <div className="content">
        <h2 className="text--title">Import {typeImport}</h2>
        <p className="text--desc">
          Anyone can create a token <br />
          Please make sure you trust it
        </p>
        <div className="import--form--content">
          <Form form={form} onFinish={importToken}>
            <div>
              <p className="text--label">Token Contract Address</p>
              <Form.Item name="addressToken">
                <Input
                  placeholder="Enter Token Contract Address"
                  onChange={async (e) => {  
                    // const x = ![...addressesERC20, ...addressesERC721and1155].length ? true : 
                    //           ![...addressesERC20, ...addressesERC721and1155].find((item: any) => 
                    //           item.addressToken.toUpperCase()===e.target.value.toUpperCase())    
                    // if(x){
                      try {
                        const { type, code, symbol, decimals }: any = 
                          await checkAddressToken(e.target.value, url);
                        if (!type) {
                          checkValueImportAddressToken(
                            "Invalid address token or incorrect network."
                          );
                        } else if (type !== typeImport) {
                          checkValueImportAddressToken(
                            "This token is an NFT. You can add on the page NFTs."
                          );
                        } else {
                          setNotificationToken("");
                          setAddressToken(e.target.value);
                          setTypeToken(code);
                          form.setFieldsValue({
                            symbolToken: symbol,
                            decimalToken: decimals,
                          });
                          setDisabled(false);
                        }
                      } catch (e) {
                        checkValueImportAddressToken(
                          "Invalid address token or incorrect network."
                        );
                      }
                    // }else {
                    //   checkValueImportAddressToken(
                    //     "Token has already been added."
                    //   );
                    // }
                  }}
                />
              </Form.Item>
              <p className="text--response">{notificationToken}</p>
            </div>
            {typeImport === "Token" && (
              <>
                <div>
                  <p className="text--label">Token Symbol</p>
                  <Form.Item name="symbolToken">
                    <Input placeholder="Emter Token Symbol" />
                  </Form.Item>
                </div>
                <div>
                  <p className="text--label">Token Decimal</p>
                  <Form.Item name="decimalToken">
                    <Input placeholder="Enter Token Decimal" />
                  </Form.Item>
                </div>
              </>
            )}

            <Form.Item className="form--item">
              <Button
                htmlType="submit"
                type="primary"
                className="btn--primary"
                disabled={disabled}
              >
                Import
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default ImportToken;
