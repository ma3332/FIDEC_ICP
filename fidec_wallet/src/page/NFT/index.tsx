import HeaderMain from "../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../components/Navbar";
import TokenPageERC721ERC1155 from "../../components/TokenPage/TokenPageERC721ERC1155";

const NFT = () => {
  return (
    <div>
      <HeaderMain />
      <TokenPageERC721ERC1155 />
      <Navbar />
    </div>
  );
};

export default NFT;
