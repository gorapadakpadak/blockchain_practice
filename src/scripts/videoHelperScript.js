//for receiving videos from nearby vehicles
const cloudService=require('..')

const data=extractMetadata(videoFilePath);
databaseService.upload(); // metadata로부터 받은 시간과 위치 정보를 DB에 저장하는 코드

//영상을 업로드 하고


//업로드 되면 요청자에게 알림 가고


//토큰 지급됨 (사고 당사자 to 영상제공자 토큰 이동)

//-> by 스마트 컨트랙트로 구현
//요청할때 스마트 컨트랙트에 보상금 + 영상 제공 동의서도 주고 , 주변 차량의 영상이 업로드되면 바로 보상금 지급
