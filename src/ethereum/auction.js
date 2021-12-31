import web3 from "./web3";
import Auction from "../../build/contracts/Auction.json";

const auction = (address) => {
  return new web3.eth.Contract(Auction.abi, address);
};

export default auction;
