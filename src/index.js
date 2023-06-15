//서버의 진입점으로, Express 애플리케이션을 설정하고 서버를 실행
const express = require('express');
const app = express();

const videoController = require('./controllers/videoController');
const userController = require('./controllers/userController');

const databaseService=require('./services/databaseService')
databaseService.connection.connect();
app.use(express.json());

// 동영상 업로드 및 비교를 위한 라우트 핸들러 등록
app.post('/upload', videoController.handleVideoUpload);
//app.post('/compare', videoController.compareVideo);

// 로그인을 위한 라우트 핸들러 등록
app.post('/login', userController.login);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});