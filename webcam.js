let video = document.getElementById("webcam");

export class WebCam {
	constructor() {
		this.video = null;
		this.frame_callback = null;
	}

	static get supported() {
		return !!navigator.mediaDevices?.getUserMedia;
	}

	async init( videoTag ) {
		if(!WebCam.supported) throw new Error('mediaDevices not supported');
		if(!videoTag) throw new Error('invalid video tag');

		let stream = await navigator.mediaDevices.getUserMedia( {video: true } );
		this.video = videoTag;
		this.video.srcObject = stream;
	}

	_nextFrame() {
		if(!this.frame_callback) return;

		let proceed = this.frame_callback(this.video);
		if( proceed ) {
			window.requestAnimationFrame(() => this._nextFrame() );
		}
	}

	startListen( callback ) {
		if(!this.video) return false;
		if(typeof(callback) != 'function') return false;
		this.frame_callback = callback;

		this.video.addEventListener("loadeddata", () => this._nextFrame() );
		return true;
	}

	stopListen() {
		this.frame_callback = null;
	}
}

