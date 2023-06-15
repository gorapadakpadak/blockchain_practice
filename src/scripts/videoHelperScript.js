//for receiving videos from nearby vehicles
//요청 수락은 videoRequestScript에서 처리
//도와주기에서 접수하기랑 동일한 과정
//1. 위치 정보 기준으로 accident테이블 조회해서 사고 당사자가 접수했는지 체크
//-> O : 사고 당사자의 위치정보 줘서 핀 꽂을 수 있게 함 그거 클릭하게 해서 거기다 올리게 하고 다른데다 올려도 거기로 합쳐지겐 함...
//      -> accident테이블에서 당사자의 영상 받아와서 보여주기
//-> X : 그냥 아무것도 안 줌. -> null 값처리 안드에서 해줘야돼요~~ -> 목격자가 핀 꽂으면 위치정보를 안드에서 받아놨다가 나한테 마지막에 도와주기 버튼 누를때 같이 전송!
//2. 도와주기 버튼 누르면 값 전송되자나 그 값들 받아서 helper테이블에 넣기
//3. 알림을 받고 수락을 누르면...request에서 처리...

const cloudService = require('src/services/cloudService'); // 클라우드와 상호작용을 위한 모듈 import
const databaseService = require('src/services/databaseService'); // 데이터베이스 서비스 모듈 import
const videoController = require('src/controllers/videoController'); // 영상 컨트롤러 모듈 import

// 1. 위치 정보 기준으로 accident 테이블 조회
async function findAccident(){
  const accidentData = databaseService.getRequestData(); 

  if (accidentData) {
    const respose = {
      au_id: accidentData.au_id,
      location: accidentData.acc_place,
      acc_no: accidentData.acc_no,
      acc_vid: accidentData.acc_vid,
      acc_url: accidentData.acc_url,
      acc_title: accidentData.acc_title,
      acc_description: accidentData.acc_description,
      acc_time: accidentData.acc_time
  };
  
    
    res.status(200).json(respose);
  
   
  } else {
    // 1-3. 사고 당사자가 접수하지 않은 경우
    // 그냥 널 값 주거나 메시지로 없다고 창 한번 띄워주기
    res.status(200).json('해당 지역에 접수된 사고 내역이 없습니다.');
  
  }
}



// 2. 도와주기 버튼 누를 때 값 전송 및 Helper 테이블에 저장
function helpButtonClicked(helperData,videoFile) {

    //영상을 업로드 하고
    videoController.handleVideoUpload(videoFile);
    databaseService.saveWitnessData(helperData); // Helper 테이블에 도움 요청 데이터 저장

  }



// // 4. 영상 업로드 후 요청자에게 알림 전송 해줄까 말까
// videoController.uploadVideo(videoID)
//   .then(() => {
//     cloudService.sendNotification(requesterID, 'Your video upload is complete.'); // 요청자에게 알림 전송
//   })
//   .catch((error) => {
//     console.error('Failed to upload video:', error);
//   });


module={
  findAccident,
  helpButtonClicked,

}