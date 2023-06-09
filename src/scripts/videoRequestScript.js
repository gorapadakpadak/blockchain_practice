//for requesting videos from nearby vehicles
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-west-2', // 필요에 따라 지역(region) 설정
});

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

// 푸시 알림 보내기 예시
const deviceToken = 'DEVICE_TOKEN'; // 안드로이드 디바이스 토큰
const message = 'Hello, this is a push notification!';

sendPushNotification(deviceToken, message);

//푸쉬알림 보낼때 기준을 사고 당사자의 영상의 위치 정보 기준 반경 10m이내 이런식으로 잡아야겠다
//푸쉬알림에 영상 같이 보내면 될듯
//토탈 보상금 지급 액을 표시해줘야할듯 -> 에러 주의 : 내 지갑 용량보다 크면 신청을 못하니까...제한을 둘 뭔가가 필요하긴하겠다