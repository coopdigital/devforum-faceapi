import "./face-api.js";

const video = document.querySelector("video");
const canvas = document.querySelector("canvas");

navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
  video.srcObject = stream;
  video.play();
});

(async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log(detections);

    faceapi.matchDimensions(canvas, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
})();
