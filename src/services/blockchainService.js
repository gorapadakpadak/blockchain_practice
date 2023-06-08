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
async function storeVideoHash(videoHash) {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  const result = await contract.methods.uploadVideo(videoHash, 'seoul_milk_coffee').send({ from: sender });
  console.log('Transaction hash:', result.transactionHash);
}

// 동영상의 해시값을 블록체인에서 조회하여 반환하는 함수
async function getVideoHash(videoId) {
  const result = await contract.methods.videos(videoId).call();
  return result.hash;
}

//const generateHash = require('/Users/parkchaewon/backend/src/utils/generateHash');
const generateHash = require('src/utils/generateHash.js');
// 테스트 함수
async function testBlockchainService() {
  try {
    // 동영상 해시값을 블록체인에 저장하는 테스트
    //const videoHash = await generateHash(videoFile.path);


    //이때 이 비디오 경로를 클라우드에서 받아와야함 -> how? db에 있는 url로 조회
    const videoFilePath = '/Users/parkchaewon/Downloads/yolodataset_3.mp4';
    //const videoFilePath = '/Users/parkchaewon/Downloads/yolodataset_3.mp4';
    const videoHash = await generateHash(videoFilePath);

    console.log('Storing video hash in blockchain...');
    await storeVideoHash(videoHash);
    console.log('Video hash stored in blockchain successfully.');

    // 동영상의 해시값을 블록체인에서 조회하는 테스트
    //const videoId = 비디오의 아이디 받아오기;
    const videoId = 2; // 조회할 동영상의 ID
    console.log('Getting video hash from blockchain...');
    const storedHash = await getVideoHash(videoId);
    console.log('Retrieved video hash from blockchain:', storedHash);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 테스트 실행
testBlockchainService();
module.exports = {
  storeVideoHash,
  getVideoHash
};
