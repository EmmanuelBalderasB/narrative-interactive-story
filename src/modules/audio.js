import * as THREE from 'three'
import { camera } from './camera.js'

export default class Voice {
    constructor(url, length, startTime, id, audioListener,audioLoader) {
        this.url = url;
        this.length = length;
        this.startTime = startTime;
        this.id = id;
        this.isLoaded = false;
        this.buffer = null;
        this.audioListener = audioListener;
        this.audioLoader = audioLoader;
        this.ready = false;
        // Use the shared audioListener
        this.source = new THREE.Audio(this.audioListener);
        // Add the audio source to the camera so it can be heard
        camera.add(this.source);

        // Load audio immediately
        this.loadAudio();
    }

    loadAudio() {
        console.log(`Loading voice ${this.id}...`);

        this.audioLoader.load(this.url, (buffer) => {
            this.buffer = buffer;
            this.source.setBuffer(buffer);
            this.source.setVolume(0.5);
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
        this.source.setVolume(0.5);
        camera.add(this.source);

        this.source.play();
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
}