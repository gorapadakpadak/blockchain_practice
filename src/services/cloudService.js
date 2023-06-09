//cloudService.js 역할 : 클라우드와의 상호작용을 담당
//1. 동영상 파일을 클라우드에 업로드하거나 다운로드하는 기능
//2. 클라우드와의 연결을 설정하고 파일 업로드/다운로드 수행

//cloud연동 코드
//DB연동 코드
const db=require('src/services/databaseService.js');

// AWS SDK 로드
const AWS = require('aws-sdk');

// AWS 계정의 인증 정보 설정
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
});

// S3 인스턴스 생성
const s3 = new AWS.S3();

// 영상 업로드 함수
function uploadVideo(bucketName, fileName, fileData) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // 업로드된 파일의 URL 반환
      }
    });
  });
}

// 영상 재생 함수
function playVideo(bucketName, fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.getSignedUrlPromise('getObject', params);
}


function downloadFile(bucketName, fileName) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Body); // 다운로드된 영상 데이터 반환
          }
        });
      });
}



