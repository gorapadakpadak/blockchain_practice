//cloudService.js 역할 : 클라우드와의 상호작용을 담당
//1. 동영상 파일을 클라우드에 업로드하거나 다운로드하는 기능
//2. 클라우드와의 연결을 설정하고 파일 업로드/다운로드 수행

//cloud연동 코드
//DB연동 코드
const cloudS3=require();
const db=require();

async function uploadVideo(videofile){

}

async function getVideo(videoID){
    const getURL=await ; //db에서 videoID로 검색해서 나온 url 반환
    const result=await ;//cloud에서 url조회해서 파일 받아오기

    return result.file;
}