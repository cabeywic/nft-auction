import web3 from './web3';
import NFT from '../../build/contracts/NFT.json';

const ERC721Address = process.env.NEXT_PUBLIC_NFT_ADDRESS;
const instance = new web3.eth.Contract(NFT.abi, ERC721Address);

export default instance;