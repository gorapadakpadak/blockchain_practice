//videoController.js 역할 : 클라이언트의 요청을 처리하는 라우트 핸들러 및 비즈니스 로직을 담당
//1. 클라이언트로부터 동영상을 받아와 해시값을 생성
//2. 생성된 해시값과 블록체인에서 조회한 해당 동영상의 해시값을 비교하여 무결성을 검증
//3. 필요한 경우 'blockchainServer.js'와 'cloudService.js'를 호출하여 블록체인과 클라우드와의 상호작용을 수행합니다.

const { generateHash } = require('../utils/generateHash');
const blockchainService = require('../services/blockchainService');
const cloudService = require('../services/cloudService');
const {v4:uuidv4}=require('uuid');
const bucketName = 'YOUR_BUCKET_NAME';

// 동영상 업로드 API 핸들러
async function uploadVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 파일 받기
    const videoFile = req.file;

    // 동영상 파일로부터 해시값 생성
    const videoHash = generateHash(videoFile.path);
    // 동영상 파일의 videoID 생성 by uuid
    const videoID=uuidv4();
    console.log('생성된 video id',videoID);

    // 블록체인에 동영상 해시값 저장
    // 아이디,해시 저장
    const transactionID=await blockchainService.storeVideoHash(videoID);
    const transactionHash = await blockchainService.storeVideoHash(videoHash);

    // 클라우드에 동영상 파일 업로드
    await cloudService.uploadVideo(bucketName,videoID, videoFile)
    .then(url => {
      console.log('Video uploaded successfully. URL:', url);
    })
    .catch(err => {
      console.error('Error uploading video:', err);
    });


    // 응답 데이터 생성
    const response = {
      videoID,
      transactionID,
      videoHash,
      transactionHash,
      message: '동영상이 업로드되었습니다.',
    };

    // 클라이언트에 응답 전송
    res.status(200).json(response);
  } catch (error) {
    console.error('동영상 업로드 실패:', error);
    res.status(500).json({ message: '동영상 업로드에 실패했습니다.' });
  }
}

// 동영상 재생 요청 API 핸들러
async function playVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 파일 ID 받기
    const videoID = req.vID;

    //videoID로 원본 영상 찾기

    const originVideo=await databaseService.getVideoURLByID(videoID);

    // 응답 데이터 생성 - 원본 영상 url
    const response = {
      originVideo
    };
    // 예시: 영상 재생 API 엔드포인트
  app.get('/video/:id', (req, res) => {
    const { id } = req.params;

    try {
    // 영상 재생 로직 작성
    // ...
    } catch (error) {
      res.status(500).json({ error: 'Failed to play video.' });
    }
  });

    // 클라이언트에 응답 전송
    res.status(200).json(response);
  } catch (error) {
    console.error('동영상 재생 요청 실패:', error);
    res.status(500).json({ message: '동영상 재생 요청에 실패했습니다.' });
  }

}

// 동영상 다운로드 요청 API 핸들러
async function downloadVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 파일 받기
    const videoID = req.vid;

    // 블록체인에서 해당 동영상의 해시값 조회
    const blockchainHash = await blockchainService.getVideoHash(videoID);
    const originVideo=await cloudService.downloadVideo(bucketName,videoID);

    //클라우드로부터 받아온 영상의 해시값
    const originVideoHash=generateHash(originVideo);

    // 해시값 비교하여 무결성 검증
    const isValid = originVideoHash === blockchainHash;

    //무결성 확인 되면 전송 안 되면 에러
    if(isValid){
      //client에게 video file 전송
      // 응답 데이터 생성
    const response = {
      originVideo,
      isValid,
    };
    // 예시: 영상 URL 저장 API 엔드포인트
  app.post('/video', async (req, res) => {
    const { videoURL } = req.body;
  
    try {
      await saveVideoURL(videoURL);
      res.status(200).json({ message: 'Video URL saved successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save video URL.' });
    }
  });


    }else{
      console.log("무결성 검증에 실패했습니다");
    }
    // 클라이언트에 응답 전송
    res.status(200).json(response);
  } catch (error) {
    console.error('동영상 재생 요청 실패:', error);
    res.status(500).json({ message: '동영상 재생 요청에 실패했습니다.' });
  }
}

module.exports = {
  uploadVideo,
  playVideo,
};




