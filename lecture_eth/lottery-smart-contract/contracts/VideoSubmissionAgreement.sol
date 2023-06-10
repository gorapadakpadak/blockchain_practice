// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VideoSubmissionAgreement {
    address public owner; // 동의서 소유자 (영상 제공자)
    address public police; // 경찰 주소

    string public videoHash; // 제출된 영상의 해시값
    bool public isSubmitted; // 영상 제출 여부

    event VideoSubmitted(string videoHash, address indexed submitter);

    constructor(address _police) {
        owner = msg.sender;
        police = _police;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyPolice() {
        require(msg.sender == police, "Only the police can perform this action");
        _;
    }

    function submitVideo(string memory _videoHash) public onlyOwner {
        require(!isSubmitted, "Video has already been submitted");
        videoHash = _videoHash;
        isSubmitted = true;

        emit VideoSubmitted(_videoHash, msg.sender);
    }

    function approveSubmission() public onlyPolice {
        require(isSubmitted, "No video has been submitted yet");

        // 경찰의 처리 로직을 여기에 추가

        // 처리 완료 후 영상 해시값 초기화
        videoHash = "";
        isSubmitted = false;
    }
}
