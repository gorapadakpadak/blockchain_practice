pragma solidity ^0.8.0;

contract VideoInfo {
  uint public videoCount; //동영상 개수 추적 변수
  string public name; //스마트 컨트랙트의 이름을 나타내는 문자열
  mapping(uint => Video) public videos;
//Video구조체를 저장하는 매핑입니다. Video 구조체는 동영상의 ID, 해시값, 제목, 작성자 주소를 포함

//video 구조체
  struct Video {
    uint id;
    string hash;
    string title;
    address author;
  }

//동영상이 업로드되었을때 발생하는 이벤트
  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );

//생성자 함수, 초기화 작업 수행
  constructor() {
    name="RLP";
    videoCount=0;
  }

//uploadvideo() 동영상을 업로드하는 함수
  function uploadVideo(string memory _videoHash, string memory _title) public {
	//동영상의 해시값, 제목을 인자로 받아서 스마트 컨트랙트에 저장
// Make sure the video hash exists
    require(bytes(_videoHash).length > 0,"Invalid video hash");
    // Make sure video title exists
    require(bytes(_title).length > 0,"Invalid video title");
    // Make sure uploader address exists
    require(msg.sender!=address(0),"Invalid uploader address");

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);
    // Trigger an event
//비디오 업로디드 이벤트 발생시킴
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }
}
