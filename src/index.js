//서버의 진입점으로, Express 애플리케이션을 설정하고 서버를 실행
const express = require('express');
const app = express();

const videoController = require('./controllers/videoController');
const userController = require('./controllers/userController');
const databaseService=require('./services/databaseService');
const videoRequestScript = require('./scripts/videoRequestScript');

const getPostRouter=require(src/clients/getPost);
databaseService.connection.connect();
app.use(express.json());

// 동영상재생
app.post('/playVideo', videoController.playVideo);

// 1. 사고 당사자 위치값을 받아서 사고 목격자 데이터를 보내는 라우터
app.post('/findWitness', async (req, res) => {
  try {
    const location = req.body.location;
    videoRequestScript.requestVideosBasedOnLocation(location);
  } catch (error) {
    console.error('error finding witness data:', error);
    res.status(500).json({ message: 'error finding witness data.' });
  }
});



// 2. 접수하기 클릭 시 사고 정보와 videoFile, 목격자 리스트를 받아서 처리하는 라우터
app.post('/handle-incident', async (req, res) => {
  try {
    const incidentData = req.body.incidentData; // 사고 정보
    const videoFile = req.body.videoFile; // videoFile 정보
    const selectedWitnessList = req.body.witnessList; // 목격자 리스트

    videoRequestScript.saveAccidentReport(incidentData,videoFile);
    videoRequestScript.alarmToWitness(selectedWitnessList);

    // 필요한 응답을 작성
    res.status(200).json({ message: 'Incident handled successfully.' });
  } catch (error) {
    console.error('Error handling incident:', error);
    res.status(500).json({ error: 'Failed to handle incident.' });
  }
});


//3. 이력 조회 ing/past
app.post('/status', (req, res) => {
  const historyID=req.body.history_id;
  const historyData= databaseService.getAccidentHistoryData(historyID);
  const status=historyData.status;
  if(status===0){
    res.json({message:'진행중'});
  }else if (staus===1){
    res.json({message:'처리 완료'});
  }

});
//4. 처리 완료 누르면 status는 진 to 완 & 처리 내용 추가로 입력할지?
app.post('/complete', (req, res) => {
  const status = req.body.status;
  const historyID = req.body.history_id;
  
  if (status === 1) {
    databaseService.updateStatus(historyID, 1); // status 값을 1로 업데이트
    res.json({ message: '처리 되었습니다.' });
  } else {
    // 처리 내용 추가로 입력하는 로직을 추가할 수 있습니다.
    // 처리 내용을 받아와서 필요한 처리를 수행합니다.
    // 처리 완료 상태가 아닐 경우에 대한 처리를 진행합니다.
    res.json({ message: '처리 상태가 유효하지 않습니다.' });
  }
});





//5. 목격자 위치값 -> 사고 당사자 data (accreq조회)
app.post('/findAccident', (req, res) => {
  const wLocation=req.body.location;
  findAccidentByLocation(wLocation);

});

//6. 도와주기 클릭 -> 목격자 data, videofile
app.post('/saveWitnessData', (req, res) => {
  try {
    const witnessData = req.body.witnessData; // 목격자 정보
    const videoFile = req.body.videoFile; // videoFile 정보

    helpButtonClicked(witnessData,videoFile);
    // 필요한 응답을 작성
    res.status(200).json({ message: 'witness data saved successfully.' });
  } catch (error) {
    console.error('Error handling witness data:', error);
    res.status(500).json({ error: 'Failed to save witness data.' });
  }
});
//7. 요청 수락 -> 목격자 테이블을 accWit에
app.post('/accept', (req, res) => {
  const isAccept=req.body.accept;
  const wv_id=req.body.wv_id;
  const wu_id=req.body.wu_id;
  const au_id=req.body.au_id;
  const acc_no=req.body.acc_no;
  const request_no=req.body.request_no;

  if(isAccept===1){
    databaseService.updateAccepted(request_no,isAccept);
    databaseService.saveAccidentWitnessData(wv_id,wu_id,acc_no,au_id);
  }else{

  }

});

//8. 도와준 이력 -> 목격자 테이블에 유저아이디 조회해서 데이터 출력
app.post('/witness-his', (req, res) => {
  const wu_id=req.body.wu_id;
  const helpHistory=databaseService.getHelpHistory(wu_id);
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
  res.status(200).json({ message: 'searching help data successfully.'});

});



// 로그인을 위한 라우트 핸들러 등록
app.post('/login', userController.login);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
