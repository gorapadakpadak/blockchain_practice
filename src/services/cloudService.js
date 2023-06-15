//cloudService.js 역할 : 클라우드와의 상호작용을 담당
//1. 동영상 파일을 클라우드에 업로드하거나 다운로드하는 기능
//2. 클라우드와의 연결을 설정하고 파일 업로드/다운로드 수행

//cloud연동 코드
//DB연동 코드
const db=require('./databaseService.js');

// AWS SDK 로드
const AWS = require('aws-sdk');

// AWS 계정의 인증 정보 설정
AWS.config.update({
  accessKeyId: 'accesskeyid',
  secretAccessKey: 'accesskey',
});

// S3 인스턴스 생성
const s3 = new AWS.S3();

// 영상 업로드 메소드
function uploadVideoToCloud(bucketName, fileName, fileData) {
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

// 영상 재생 메소드
function playVideo(bucketName, fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.getSignedUrlPromise('getObject', params);
}

//영상 다운로드 메소드
function downloadFile(bucketName, fileName) {
  return new Promise((resolve, reject) => {
    const s3GetObjectParams = {
      Bucket: bucketName,
      Key: fileName,
    };
    s3.getObject(s3GetObjectParams, (error, data) => {
      if (error) {
        console.error(error);
        reject(new Error('Failed to download file from S3'));
      } else {
        resolve(data.Body);
      }
    });
  });
}


//푸쉬알림 awsSNS로 구현..?
const sns = new AWS.SNS();

async function sendPushNotification(deviceToken, message) {
  const payload = {
    default: message,
    APNS: JSON.stringify({
      aps: {
        alert: message,
        sound: 'default',
      },
    }),
    GCM: JSON.stringify({
      data: {
        message: message,
      },
    }),
  };

  const params = {
    MessageStructure: 'json',
    Message: JSON.stringify(payload),
    TargetArn: deviceToken,
  };

  try {
    const response = await sns.publish(params).promise();
    console.log('Push notification sent:', response.MessageId);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}


//푸쉬알림 보낼때 기준을 사고 당사자의 영상의 위치 정보 기준 반경 10m이내 이런식으로 잡아야겠다
//푸쉬알림에 영상 같이 보내면 될듯
//토탈 보상금 지급 액을 표시해줘야할듯 -> 에러 주의 : 내 지갑 용량보다 크면 신청을 못하니까...제한을 둘 뭔가가 필요하긴하겠다

module.exports = { downloadFile };


