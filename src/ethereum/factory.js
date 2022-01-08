import web3 from './web3';
import AuctionFactory from '../../build/contracts/AuctionFactory.json';

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
const instance = new web3.eth.Contract(AuctionFactory.abi, factoryAddress);

export default instance;