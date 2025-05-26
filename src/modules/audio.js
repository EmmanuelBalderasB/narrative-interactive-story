import * as THREE from 'three'
import { camera } from './camera.js'

// Single audio loader and listener for the entire scene
const audioLoader = new THREE.AudioLoader()
const audioListener = new THREE.AudioListener()

// Add listener to camera (only once!)
camera.add(audioListener)

// Background audio
const backgroundAudio = new THREE.Audio(audioListener)
audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', (buffer) => {
    backgroundAudio.setBuffer(buffer)
    backgroundAudio.setLoop(true)
    backgroundAudio.setVolume(0.5)
    backgroundAudio.play()
})

class Voice {
    constructor(url, length, startTime, id) {
        this.url = url;
        this.length = length;
        this.startTime = startTime;
        this.isInitialized = false;
        this.id = id;
        // Use the shared audioListener instead of creating new ones
        this.source = new THREE.Audio(audioListener);
        // Add the audio source to the camera so it can be heard
        camera.add(this.source);
    }

    init() {
        if (this.isInitialized) return

        console.log(`Initializing voice ${this.id}`)

        // Use the shared audioLoader
        audioLoader.load(this.url, (buffer) => {
            this.source.setBuffer(buffer)
            this.source.setVolume(0.5)
            this.source.play()
            this.isInitialized = true
            console.log(`Playing voice ${this.id}`)
        },
            // Progress callback
            (progress) => {
                console.log(`Loading voice ${this.id}: ${(progress.loaded / progress.total * 100)}%`)
            },
            // Error callback
            (error) => {
                console.error(`Error loading voice ${this.id}:`, error)
            })
    }

    // Method to stop the voice if needed
    stop() {
        if (this.source && this.source.isPlaying) {
            this.source.stop()
        }
    }

    // Method to check if currently playing
    isPlaying() {
        return this.source && this.source.isPlaying
    }
}

const voice1 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', 14, 10, 1);
const voice2 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6C1UGrVBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 13, 24, 2);
const voice3 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6cDzsnjeOt40dfgIDuQ9YPMvkmFVGUyL5KSae', 11, 37, 3);
const voice4 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP60hdwjdan3Me5BhKlTQgzrdk2SRuA1HmwCtn4', 15, 48, 4);
const voice5 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6o7v4IrVTkUpE81bgK3uCXhQ5cZtDNaYiJzeI', 14, 63, 5);

const voices = [voice1, voice2, voice3, voice4, voice5]

// Export the shared audioListener in case other modules need it
export { voices, audioListener, audioLoader }