import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { loadingManager } from './modules/loadingManager.js'
import { camera, controls } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { audioListener, audioLoader, voices, backgroundAudio } from './modules/audio.js'
import { sizes } from './modules/sizes.js'
import { fadeToBlack, fadeToNormal } from './helpers/fade.js'
const loadingText = document.querySelector('.loading-text')
// Audio setup


// Add listener to camera
camera.add(audioListener)


let objectsInScene = false;
// Keyboard controls for audio cues

let isBlack = true;

const clock = new THREE.Clock()
let lastTime = 0
let count = 0
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

    // camera.position.x = Math.sin(elapsedTime * 0.001) * 14
    // camera.position.z = Math.cos(elapsedTime * 0.001) * 14

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    if (count < 1) {
        count++;
        camera.lookAt(0,0,0);
    }
}

tick()
window.scene = scene;
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