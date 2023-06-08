//blockchainService.js 역할 : 블록체인과의 상호작용을 담당
//1. 동영상의 해시값을 블록체인에 저장하거나 조회하는 기능
//2. 블록체인과의 연결을 설정하고 트랜잭션을 생성하고 전송하는 등의 작업 수행

const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contractAbi = require('/Users/parkchaewon/lecture_eth/lottery-smart-contract/build/contracts/videoInfo.json').abi;

// 가나슈 네트워크 정보
const networkId = 1337;
const rpcServer = 'http://127.0.0.1:7545';

// 가나슈 개인 키 및 계정 정보
const mnemonic = '0x1053783cc3819d87e3d026298efd024b01407fd29eb0ad0a4d86792088331e8e';
const provider = new HDWalletProvider(mnemonic, rpcServer);
const web3 = new Web3(provider);
//이거 지갑에 100ETH 씩 있는데 소수점단위로 줄어드는 거 같고 이거..다 쓰면 지갑 다른 지갑으로 바뀌게 해줘야함..!


// 스마트 컨트랙트 정보
const contractAddress = '0xcc27037943C6BD197b872493C6D39c4D8706F97c';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// 동영상 해시값을 블록체인에 저장하는 함수
async function storeVideoHash(videoID,videoHash) {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  const result = await contract.methods.uploadVideo(videoHash, videoID).send({ from: sender });
  console.log('Transaction hash:', result.transactionHash);
}

// 동영상의 해시값을 블록체인에서 조회하여 반환하는 함수
async function getVideoHash(videoId) {
  const result = await contract.methods.videos(videoId).call();
  return result.hash;
}

module.exports = {
  storeVideoHash,
  getVideoHash
};
