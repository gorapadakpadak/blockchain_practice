//videoController.js 역할 : 클라이언트의 요청을 처리하는 라우트 핸들러 및 비즈니스 로직을 담당
//1. 클라이언트로부터 동영상을 받아와 해시값을 생성
//2. 생성된 해시값과 블록체인에서 조회한 해당 동영상의 해시값을 비교하여 무결성을 검증
//3. 필요한 경우 'blockchainServer.js'와 'cloudService.js'를 호출하여 블록체인과 클라우드와의 상호작용을 수행합니다.

const { generateHash } = require('../utils/generateHash');
const blockchainService = require('../services/blockchainService');
const cloudService = require('../services/cloudService');
const {v4:uuidv4}=require('uuid');
const bucketName = 'rlp-buck';
//영상 파일의 메타데이터를 추출 (미완)
const { exec } = require('child_process');

// 동영상 업로드 API 핸들러
async function uploadVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 파일 받기
    const videoFile = req.file;

    exec(`ffprobe -v quiet -print_format json -show_format -show_streams ${videoFile}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Failed to probe video:', err);
        return;
      }

      const metadata = JSON.parse(stdout);
      //console.log('Video metadata:', metadata);
      const timestamp = metadata.format.tags?.creation_time;
      console.log(timestamp);
      });


    // 동영상 파일로부터 해시값 생성
    const videoHash = generateHash(videoFile.path);
    // 동영상 파일의 videoID 생성 by uuid
    const videoID=uuidv4();
    console.log('생성된 video id',videoID);

    // 블록체인에 동영상 해시값 저장
    // 아이디,해시 저장
    await blockchainService.storeVideoHash(videoID,videoHash);

    // 클라우드에 동영상 파일 업로드
    await cloudService.uploadVideo(bucketName,videoID, videoFile)
    .then(url => {
      console.log('Video uploaded successfully. URL:', url);
    })
    .catch(err => {
      console.error('Error uploading video:', err);
    });

    //DB에 ID,시간,장소,동영상url업로드
    //ID,시간,url 은 여기서 처리하는데 장소 값은 유저가 지도에서 핀 꽂으면 거기 위경도 값을 받아와야함




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

// 동영상 재생 요청 API url주기
async function playVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 파일 ID 받기
    const videoID = req.vID;

    //videoID로 원본 영상 찾기

    const originVideoURL=await databaseService.getVideoURLByID(videoID);

      // 무결성 확인되면 동영상 파일 반환, 그렇지 않으면 에러 메시지 발생
    if (isValid) {
      // 응답 데이터 생성 - 원본 영상 url
      send2client.sendURL(originVideoURL);
      //res.status(200).json(originVideoURL);
   } else {
     throw new Error('무결성 검증에 실패했습니다.');
   }
  } catch (error) {
    console.error('동영상 재생 요청 실패:', error);
    res.status(500).json({ message: '동영상 재생 요청에 실패했습니다.' });
  }

}

// 동영상 다운로드 요청 API 핸들러
async function downloadVideo(req, res) {
  try {
    // 클라이언트로부터 동영상 아이디 받기
    const videoID = req.vid;

    // 블록체인에서 해당 동영상의 해시값 조회
    const blockchainHash = await blockchainService.getVideoHash(videoID);
    const originVideo=await cloudService.downloadVideo(bucketName,videoID);
    //클라우드로부터 받아온 영상의 해시값
    const originVideoHash=generateHash(originVideo);

    // 해시값 비교하여 무결성 검증
    const isValid = originVideoHash === blockchainHash;

    // 무결성 확인되면 동영상 파일 반환, 그렇지 않으면 에러 메시지 발생
    if (isValid) {
      send2client.sendVideo(originVideo);
    } else {
      throw new Error('무결성 검증에 실패했습니다.');
    }
  } catch (error) {
    console.error('동영상 다운로드 요청 실패:', error);
    res.status(500).json(res, '동영상 다운로드 요청에 실패했습니다.');
  }
}

module.exports = {
  uploadVideo,
  playVideo,
};




