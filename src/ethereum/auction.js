import web3 from "./web3";
import Auction from "../../build/contracts/Auction.json";

// * Get time to start in hours from currentBlock ((<startBlock>-<currentBlock>)*15)/60/60
// * Get time to end in hours from startBlock ((<endBlock>-<startBlock>)*15)/60/60

const auction = (address) => {
  return new web3.eth.Contract(Auction.abi, address);
};

export default auction;
