import { FaceDetector } from './faceDetector.js';
import { WebCam } from './webcam.js'

let faceDetector = new FaceDetector(
	'/models/blaze_face_short_range.tflite',
	'/tasks-vision/wasm'
);
let webcam = new WebCam();

let loading = document.getElementById("loading");
let videoTag = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const startButton = document.getElementById("butStart");
const stopButton = document.getElementById("butStop");

// Keep a reference of all the child elements we create
// so we can remove them easilly on each render.
let children = [];


// Enable the live webcam view and start detection.
let lastVideoTime = -1;

async function start() {
	loading.classList.toggle('hidden');
	startButton.classList.toggle('hidden');
	stopButton.classList.toggle('hidden');
	

	console.log('Inizialize face detector');
	await faceDetector.initForVideo();
	console.log('- face detector initialized');

	console.log('Enabling webcam');
	await webcam.init( videoTag );
	console.log('- webcam Enabled');
	loading.classList.toggle('hidden');

	console.log('Listening to images from webcam');
	let ok = webcam.startListen( (video) => {
		let startTimeMs = performance.now();

		// Detect faces using detectForVideo
		if (video.currentTime !== lastVideoTime) {
			lastVideoTime = video.currentTime;
			const detections = faceDetector.detectForVideo(video, startTimeMs);
			if(!detections) {
				console.log('No faces detected');
				return true;
			}
			displayVideoDetections(video, detections);
		}
	
		return true; // continue listening
	});
	if( ok )
		console.log('- listening');
	else
		console.error('- FAILED listening');

}

function clearDetectionsTags() {
	for (let child of children) {
		liveView.removeChild(child);
	}
	children.splice(0);
}

function stop() {
	webcam.stopListen();
	clearDetectionsTags();	
}



function displayVideoDetections(video, detections) {
	// Remove any highlighting from previous frame.
	clearDetectionsTags();

	// Iterate through predictions and draw them to the live view
	for (let detection of detections) {
		let confidence = Math.round(parseFloat(detection.categories[0].score) * 100);
		// console.log('Face detected with confidence %s', confidence);
		const p = document.createElement("p");
		p.innerText =
			"Confidence: " +
			confidence +
			"% .";
		p.style =
			"left: " +
			(video.offsetWidth -
				detection.boundingBox.width -
				detection.boundingBox.originX) +
			"px;" +
			"top: " +
			(detection.boundingBox.originY - 30) +
			"px; " +
			"width: " +
			(detection.boundingBox.width - 10) +
			"px;";

		const highlighter = document.createElement("div");
		highlighter.setAttribute("class", "highlighter");
		highlighter.style =
			"left: " +
			(video.offsetWidth -
				detection.boundingBox.width -
				detection.boundingBox.originX) +
			"px;" +
			"top: " +
			detection.boundingBox.originY +
			"px;" +
			"width: " +
			(detection.boundingBox.width - 10) +
			"px;" +
			"height: " +
			detection.boundingBox.height +
			"px;";

		liveView.appendChild(highlighter);
		liveView.appendChild(p);

		// Store drawn objects in memory so they are queued to delete at next call
		children.push(highlighter);
		children.push(p);
		for (let keypoint of detection.keypoints) {
			const keypointEl = document.createElement("spam");
			keypointEl.className = "key-point";
			keypointEl.style.top = `${keypoint.y * video.offsetHeight - 3}px`;
			keypointEl.style.left = `${video.offsetWidth - keypoint.x * video.offsetWidth - 3
				}px`;
			liveView.appendChild(keypointEl);
			children.push(keypointEl);
		}
	}
}


// If webcam supported, add event listener to button for when user
// wants to activate it.
if (WebCam.supported) {
	startButton.addEventListener("click", start);
	stopButton.addEventListener("click", stop);
}
