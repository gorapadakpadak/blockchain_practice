//blockchainService.js 역할 : 블록체인과의 상호작용을 담당
//1. 동영상의 해시값을 블록체인에 저장하거나 조회하는 기능
//2. 블록체인과의 연결을 설정하고 트랜잭션을 생성하고 전송하는 등의 작업 수행

const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
//const contractAbi = require('lecture_eth/lottery-smart-contract/build/contracts/videoInfo.json').abi;

// 가나슈 네트워크 정보
const networkId = 1337;
const rpcServer = 'http://127.0.0.1:8545';

// 스마트 컨트랙트 정보
//const contractAddress = '0xcc27037943C6BD197b872493C6D39c4D8706F97c';
//const contract = new web3.eth.Contract(contractAbi, contractAddress);
const contractData=require('lecture_eth/lottery-smart-contract/build/contracts/videoInfo.json');


// 가나슈 개인 키 및 계정 정보
//const mnemonic = '0x1053783cc3819d87e3d026298efd024b01407fd29eb0ad0a4d86792088331e8e';
const mnemonic='0xf0bc0e68575a5c58f9771de7ad820cd4a9005693a5062f3f5203f0fda1294f39'
const provider = new HDWalletProvider(mnemonic, rpcServer);
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(contractData.abi, contractData.networks[networkId].address);
//이거 지갑에 100ETH 씩 있는데 소수점단위로 줄어드는 거 같고 이거..다 쓰면 지갑 다른 지갑으로 바뀌게 해줘야함..!


const deployContract = async () => {
  const accounts = await web3.eth.getAccounts();
  //const networkId = await web3.eth.net.getId();
  //onst deployedNetwork = contractData.networks[networkId];
  //const myContract = new web3.eth.Contract(contractData.abi);

  const result = await myContract
    .deploy({ data: contractData.bytecode })
    .send({ from: accounts[0] });

  console.log('Contract deployed:', result.options.address);
};
// const getContractData = async () => {
//   if (!contractInstance) {
//     throw new Error('Contract not deployed');
//   }

//   const contractOwner = await contractInstance.methods.getOwner().call();
//   const contractBalance = await web3.eth.getBalance(contractInstance.options.address);

//   console.log('Contract Owner:', contractOwner);
//   console.log('Contract Balance:', contractBalance);
// };


// 동영상 해시값을 블록체인에 저장하는 함수
async function storeVideoHash(videoID,videoHash) {
  //const sender = '0xf0bc0e68575a5c58f9771de7ad820cd4a9005693a5062f3f5203f0fda1294f39';
  
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
  deployContract,
  getContractData,
  storeVideoHash,
  getVideoHash
};



//토큰 지급됨 (사고 당사자 to 영상제공자 토큰 이동)

//-> by 스마트 컨트랙트로 구현
//요청할때 스마트 컨트랙트에 보상금 + 영상 제공 동의서도 주고 , 주변 차량의 영상이 업로드되면 바로 보상금 지급
