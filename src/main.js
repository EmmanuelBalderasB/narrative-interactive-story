import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { camera } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { debugSun } from './modules/sun.js'

// Add objects to scene
scene.add(earth)
//scene.add(atmosphere)
scene.add(debugSun)

// Audio setup
const audioLoader = new THREE.AudioLoader()
const audioListener = new THREE.AudioListener()

// Add listener to camera
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
        this.id = id;
        this.isLoaded = false;
        this.buffer = null;
        // Use the shared audioListener
        this.source = new THREE.Audio(audioListener);
        // Add the audio source to the camera so it can be heard
        camera.add(this.source);

        // Load audio immediately
        this.loadAudio();
    }

    loadAudio() {
        console.log(`Loading voice ${this.id}...`);

        audioLoader.load(this.url, (buffer) => {
            this.buffer = buffer;
            this.source.setBuffer(buffer);
            this.source.setVolume(0.5);
            this.isLoaded = true;
            console.log(`Voice ${this.id} loaded and ready`);
        },
            // Progress callback
            (progress) => {
                console.log(`Loading voice ${this.id}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
            },
            // Error callback
            (error) => {
                console.error(`Error loading voice ${this.id}:`, error);
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
        this.source = new THREE.Audio(audioListener);
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

const voice1 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6CFTy6pBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 14, 10, 1);
const voice2 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6C1UGrVBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 13, 24, 2);
const voice3 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6cDzsnjeOt40dfgIDuQ9YPMvkmFVGUyL5KSae', 11, 37, 3);
const voice4 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP60hdwjdan3Me5BhKlTQgzrdk2SRuA1HmwCtn4', 15, 48, 4);
const voice5 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6o7v4IrVTkUpE81bgK3uCXhQ5cZtDNaYiJzeI', 14, 63, 5);
const voice6 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6qRtr9WOjaTewnrFyYC4cVmM723xEAS6JsfKZ', 14, 77, 6);
const voice7 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP694agx9cyATm5n8u9pedcghjwvyD7ExKCzfWF', 15, 91, 7);

const voices = [voice1, voice2, voice3, voice4, voice5, voice6, voice7]

// Keyboard controls for audio cues
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Keys 1-5 to play voices
    if (key >= '1' && key <= '7') {
        const voiceIndex = parseInt(key) - 1;
        voices[voiceIndex].play();
    }

    // Space to stop all voices
    if (key === ' ') {
        event.preventDefault(); // Prevent page scroll
        voices.forEach(voice => voice.stop());
        console.log('Stopped all voices');
    }

    // 'b' to toggle background music
    if (key.toLowerCase() === 'b') {
        if (backgroundAudio.isPlaying) {
            backgroundAudio.pause();
            console.log('Background music paused');
        } else {
            backgroundAudio.play();
            console.log('Background music resumed');
        }
    }
});

console.log('Audio controls ready:');
console.log('Keys 1-5: Play voice clips');
console.log('Spacebar: Stop all voices');
console.log('B: Toggle background music');

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime

    // Update earth rotation
    earth.rotation.y = elapsedTime * 0.01

    // Camera orbit (uncomment if you want automatic camera movement)
    // camera.position.x = Math.sin(elapsedTime * 0.001) * 14
    // camera.position.z = Math.cos(elapsedTime * 0.001) * 14
    camera.lookAt(earth.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()