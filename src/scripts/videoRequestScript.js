//for requesting videos from nearby vehicles
//접수하기에서 접수를 해 그럼 지도에 핀이 찍히고 그럼 이제...
//1. 접수하기 버튼 누르기 전에 위치 정보 기준으로 helper테이블 조회 주변 차량 영상 제공
//-> 그때 조회된 사용자들에의 영상 url을 보내줌 (접근 횟수 제한은 안드로이드에서)
//-> 없으면 핀 안 꽂힘 , 당사자 위치정보 안드에서 저장해뒀다가 마지막에 접수하기 버튼 누를때 위치정보 함께 전송
//2. 접수하기 버튼을 눌렀을때-> 내 영상을 클라우드에 저장하고 들어온 사고 정보 값들을 DB에 저장해줘야함
//-> 추가로 그때 조회된 사용자들중에 선택된 사람들에게 영상 제공 요청 알림이 감
//-> 이때부터 acc테이블 조회가능
//3. 영상 삭제 불가능하기 때문에 위치 정보 기준으로 조회한 영상 개수에 변화가 생기면(내꺼 올라간 직후부터) 사고 당사자에게 알림이 가게 해야함
//4. 요청버튼을 누르면 보상금이 지급되고 해당 영상정보들은 accident테이블에 추가됨
//-> 이제부터 당사자에게 v_url 제공 시작 (acc테이블 접근 가능하니까 url도 뜨는거지)

const videoController = require('src/controllers/videoController.js');
const db = require('src/services/databaseService.js');
const cloud=require('src/services/cloudService.js');




// 1.  위치 정보 기준으로 helper 테이블 조회하여 주변 차량 v_id, v_url 제공 (마커 찍을때 필요)
function requestWitnessVideos(location) {
  const witnesses = db.getWitnessData();
  //걍 다 보내자..
  const responseData=witnesses.map((row)=>{
    return {
      wVideoID:row.wv_id,
      wUserID:row.wu_id,
      wVideoURL:row.wv_url,
      wLocation:row.w_place,
      wTime:row.w_time,
    };
  });
  res.json(responseData);
  res.status(200).json({ message: 'searching Witness data successfully.'});
}

// -> 안드로이드에서 선별해서 요청보낼 u_id,v_id줌
// -> 그럼 node.js에서 받아서 u_id,v_id로 helper table조회해서 목격자의 정보를 조회 -> 푸쉬알림

// 2. 요청하기 버튼 누르면 영상 업로드 및 사고 정보 저장 -> file,사고 당사자's정보
function saveAccidentReport(accidentData, videoFile) {
  // 영상을 클라우드에 업로드
  const videoData = videoController.handleVideoUpload(videoFile,res);
  const videoID=videoData.videoID;
  const videoURL=videoData.videoURL;
  accidentData.v=videoID;

  if(videoURL){
       // 사고 정보를 데이터베이스에 저장
      db.saveAccidentReportData(accidentData);
  } else {
    res.json("동영상 업로드에 실패했습니다.")
  }

}
function alarmToWitness(selectedWitnessList){
    // 선택된 목격자들에게 알림 보내기
  selectedWitnessList.forEach((wu_id) => {
    // wu_id를 사용하여 해당 목격자의 정보를 가져오는 함수 호출
    const acceptWitnessData = getWitnessDatabyID(wu_id);
    // 알림 데이터를 저장하거나 전송하는 함수 호출
    db.saveRequestData(acceptWitnessData);
    // 알림을 보내는 또 다른 함수 호출
    //sendNotificationToUser(wu_id);
  });

}


// // 3. u_id,v_id로 helper table조회해서 목격자의 정보를 조회 & 푸쉬알림
// function alarm2Witness(alarmList){
// //목격자 정보 조회해서 알림 넣기 -> 알람리스트에서 하나씩 뽑아서 조회 -> 토큰 정보 토대로 알림


// // 푸시 알림 보내기 예시
// const deviceToken = 'DEVICE_TOKEN'; // 안드로이드 디바이스 토큰
// const message = '업로드하신 영상 제공 요청이 들어왔습니다';




// }



// // 4. 요청 수락 버튼을 누르면 보상금 지급 및 영상 정보를 accident 테이블에 추가
// function processRequestButton(accidentData, helperData) {
//   //가나슈 지갑 연결 - 보상금 지급 관리
  
//   //보상금 지급 되면 db반영
//     db.updateReward(accidentData); // 보상금 지급 여부 db반영
//     db.saveAccidentVideo(accidentData, helperData); // 목격자가 준 정보를 accident 테이블에 추가
  
// }

module.exports = {
  requestWitnessVideos,
  saveAccidentReport,
  alarmToWitness,
  notifyAccidentLocationChange,
  processRequestButton,
};
