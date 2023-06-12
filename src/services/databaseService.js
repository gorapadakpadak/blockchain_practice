//database service scripts

const mysql = require('mysql2');

// 마리아DB 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  port:'port num',
  user: 'user_name',
  password: 'your_password',
  database: 'db_namee',
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err);
  } else {
    console.log('Connected to MariaDB');
  }
});

const database = require('path/to/database');

// 영상 ID로 URL 조회
async function getVideoURLByID(videoID) {
  try {
    // DB에서 영상 ID에 해당하는 URL 조회 로직 작성
    const videoURL = await database.query('SELECT url FROM videos WHERE id = ?', [videoID]);

    return videoURL;
  } catch (error) {
    throw error;
  }
}

// // URL로 영상 ID 조회
// async function getVideoIDByUrl(videoURL) {
//   try {
//     // DB에서 영상 URL에 해당하는 ID 조회 로직 작성
//     const videoID = await database.query('SELECT id FROM videos WHERE url = ?', [videoURL]);

//     return videoID;
//   } catch (error) {
//     throw error;
//   }
// }

// 위치 정보 기준으로 사고 당사자 조회 메소드 (videoHelperScript.js 1)
async function getAccidentData(data){

  //있다 -> accident data 제공

  //없다 -> 없다 리턴
}

//위치 정보 기준으로 헬퍼 영상 조회 메소드 (videoRequest.Script.js 1)
async function getHelperData(data){ 
  //있다 -> helper data 제공
  //      안드에서 helper data 중 첨엔 url만 쓰고 선택된애들한테만 요청 알림 보냄
  //      나중에 요청 수락하면 헬퍼 데이터 사고 데이터로 올리기

  //없다 -> 없다 리턴
}

//accident 테이블에 accident 정보 저장
async function saveAccidentData(accidentdata){

}

//helper 테이블에 helper정보 저장
async function saveHelpData(helpData){

}

//목격자 video 저장
async function saveHelperVideo(videoeID,videoURL){

}
//사고당사자 video 저장
async function saveVictimVideo(videoeID,videoURL){
  
}

//유저 정보 저장
async function saveUserData(userData){

}

//유저 정보 조회
async function getUserData(userData){

}

module.exports = {
  getVideoURLByID,
  getVideoIDByUrl,
};
