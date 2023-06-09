const cloudService = require('./cloudService');










//클라이언트에게 영상 url 전송
async function sendStreamingVideo(req,res){
    try {
        const { bucketName, fileName } = req.params;
    
        // 영상 파일 다운로드
        const videoURL = await cloudService.playVideo(bucketName, fileName);
    
        // 클라이언트로 영상 파일 전송
        res.sendURL(videoURL);
      } catch (error) {
        console.error('Failed to send videoURL to client:', error);
        res.status(500).json({ error: 'Failed to send videoURL to client' });
      }

}


// 클라이언트에게 영상 파일 전송
async function sendVideoToClient(req, res) {
  try {
    const { bucketName, fileName } = req.params;

    // 영상 파일 다운로드
    const videoFile = await cloudService.downloadFile(bucketName, fileName);

    // 클라이언트로 영상 파일 전송
    res.sendFile(videoFile);
  } catch (error) {
    console.error('Failed to send video to client:', error);
    res.status(500).json({ error: 'Failed to send video to client' });
  }
}

module.exports = {
  sendVideoToClient,
};