import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { loadingManager } from './modules/loadingManager.js'
import { camera, controls } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { audioListener, voices, backgroundAudio } from './modules/audio.js'
import { sizes } from './modules/sizes.js'
import { fadeToBlack, fadeToNormal } from './helpers/fade.js'

const loadingText = document.querySelector('.loading-text')

// Add listener to camera
camera.add(audioListener)

const clock = new THREE.Clock()

// Flags
let objectsInScene = false;
let isBlack = true;
let lastTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime
    controls.update(deltaTime)
    
    if (loadingManager.isLoaded && !objectsInScene) {
        scene.add(earth)
        scene.add(atmosphere)

        loadingText.textContent = 'Click to start'
        objectsInScene = true;
        loadingText.style.cursor = 'pointer';
        loadingText.addEventListener('click', (e) => {
            e.preventDefault();
            backgroundAudio.play()
            fadeToNormal(document.querySelector('canvas'), isBlack);
           
            e.target.style.display = 'none';
        })
    }
    
    // Update earth rotation
    earth.rotation.y = elapsedTime * 0.01

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.scene = scene;

// Keyboard controls for audio cues
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Keys 1-5 to play voices
    if (key >= '1' && key <= '7') {
        const voiceIndex = parseInt(key) - 1;
        voices[voiceIndex].play();
    }
    if (key === '0') {
        fadeToBlack(document.querySelector('canvas'), isBlack);
    }
    if (key === '9') {
        fadeToNormal(document.querySelector('canvas'), isBlack);
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