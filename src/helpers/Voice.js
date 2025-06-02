import * as THREE from 'three'

export default class Voice {
    constructor(url, length, startTime, id, audioListener,audioLoader, camera) {
        this.url = url;
        this.length = length;
        this.startTime = startTime;
        this.id = id;
        this.isLoaded = false;
        this.buffer = null;
        this.audioListener = audioListener;
        this.audioLoader = audioLoader;
        this.ready = false;
        this.camera = camera;
        // Use the shared audioListener
        this.source = new THREE.Audio(this.audioListener);

        // Load audio immediately
        this.loadAudio();
    }

    loadAudio() {
        console.log(`Loading voice ${this.id}...`);

        this.audioLoader.load(this.url, (buffer) => {
            this.buffer = buffer;
            this.isLoaded = true;
            this.ready = true;
            console.log(`Voice ${this.id} loaded and ready`);
        });
    }

    play() {
        if (!this.isLoaded) {
            console.warn(`Voice ${this.id} not loaded yet`);
            return;
        }

        if (this.source.isPlaying) {
            this.source.stop();
        }   

        // Create a new audio source for each play to avoid conflicts
        this.source = new THREE.Audio(this.audioListener);
        this.source.setBuffer(this.buffer);
        this.source.setVolume(0.3);
        this.camera.add(this.source);

        // Set up the onEnded callback before playing
        this.source.onEnded = () => {
            console.log(`Voice ${this.id} ended`);
            if (this.onEndedCallback) {
                this.onEndedCallback();
            }
        };

        this.source.play(2);
        console.log(`Playing voice ${this.id}`);
    }

    stop() {
        if (this.source && this.source.isPlaying) {
            this.source.stop();
            console.log(`Stopped voice ${this.id}`);
        }
    }

    isPlaying() {
        return this.source && this.source.isPlaying;
    }

    setOnEnded(callback) {
        this.onEndedCallback = callback;
    }
}