import {
	FaceDetector as MediaPipeFaceDetector,
	FilesetResolver
} from "@mediapipe/tasks-vision";


export class FaceDetector {
	constructor(modelPath, fileset) {
		this.fd = null;
		this.modelPath = modelPath; // '/models/blaze_face_short_range.tflite'
		this.fileset = fileset || "/tasks-vision/wasm";
	}

	async init(runningMode) {
		const vision = await FilesetResolver.forVisionTasks( this.fileset );
		this.fd = await MediaPipeFaceDetector.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: this.modelPath,
				delegate: "GPU"
			},
			runningMode: runningMode || 'VIDEO'
		});
	}

	async initForImage() {
		return this.init('IMAGE');
	}

	async initForVideo() {
		return this.init('VIDEO');
	}

	detectForVideo( video, startTimeMs ) {
		const detections = this.fd.detectForVideo(video, startTimeMs).detections;
		return detections ?? [];
	}
}

