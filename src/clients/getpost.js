//받는 정보
//1. 위치 정보 (조회용)
//  1-1 사고당사자가 찍은 핀 in -> 목격자 테이블에서 확인해서 있으면 목격자 테이블 모두 out
//  1-2 목격자가 찍은 핀 in -> 사고 테이블에서 확인해서 있으면 사고 정보 out


//2. 요청하기를 눌렀을때 정보들 in
//  사고 정보 - 제목, 날짜, 시간, 위치, 내용, 보상금, 유저정보
//            Q. 날짜,시간을 timestamp로 묶어서줄건지?
//  영상 file들 -> 해시 형성해서 업로드 (VideoController.uploadVideo)
//  선정 목격자 list -> 영상 제공 요청 푸쉬알림 넣기



//3. 현재 사고나 사고이력에서 진행중인 사고 누르면 서버에 전송
// accident data out



//4. 처리 완료 버튼 눌리면 서버에 전송
//  accident table의 진행관련 컬럼값 완료로 변경



//5. 도와주기 눌렀을때 정보들 in
//  위치정보, 유저정보
//  영상 file

//6. 다운로드 요청 시 VideoController.downloadVideo



//7. 요청 수락 버튼 눌리면 서버에 해당 목격자 정보를 전송
//  해당 목격자 테이블을 accident table에 묶어줌



//8. 로딩할때 나한테 현재 사고 있는지 물어봄 -> 진행중인 accident 조회


//보내줄거

//1. 위치 정보 줬을때 목격자 테이블 out

//2. 위치 정보 줬을때 사고 테이블 out

//3. 현재 사고나 사고 이력에서 진행중인 사고 요청 ->  accident data out

//4. 다운로드 요청시 영상file전송
// 클라이언트에게 영상 파일 전송
async function sendVideo(originVideo) {
  res.sendFile(videoFile);
}

//5. 진행중인 accident table data out


//클라이언트에게 영상 url 전송
async function sendURL(originVideoURL){
  res.status(200).json(originVideoURL);
}



module.exports = {
  sendVideoToClient,
};


const express = require('express');
const app = express();

// 라우트 정의
app.get('/videos', (req, res) => {
  const location = req.query.location;

  // 위치 정보를 기반으로 목격자 데이터 조회 및 가공 로직 수행
  const witnesses = db.findWitness(location);
  const formattedWitnesses = witnesses.map(witness => {
    return {
      id: witness.id,
      name: witness.name,
      // 필요한 속성들을 추가로 추출하여 포맷팅
    };
  });

  // 클라이언트에 데이터 전송
  res.json(formattedWitnesses);
});

// 서버 시작
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
