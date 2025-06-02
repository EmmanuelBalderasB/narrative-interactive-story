import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { loadingManager } from './modules/loadingManager.js'
import { camera } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { audioListener, voices, backgroundAudio } from './modules/audio.js'
import { fadeToBlack, fadeToNormal } from './helpers/fade.js'
import { StageManager } from './modules/stageManager.js'
import { Stage } from './helpers/Stage.js'
const loadingText = document.querySelector('.loading-text')

// Add listener to camera
camera.add(audioListener)

const clock = new THREE.Clock()

// Flags
let objectsInScene = false;
let isBlack = true;
let lastTime = 0

const oscillationAmplitude = 0.01;
const oscillationFrequency = 1;

const stageManager = new StageManager();
stageManager.addStage(new Stage(voices[0], camera, camera.position.clone(), clock, 0, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[1], camera, new THREE.Vector3(camera.position.x - 100, 0, 0), clock, 1, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[2], camera, new THREE.Vector3(camera.position.x - 200, 0, 0), clock, 2, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[3], camera, new THREE.Vector3(camera.position.x - 30, 0, 0), clock, 3, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[4], camera, new THREE.Vector3(camera.position.x - 40, 0, 0), clock, 4, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[5], camera, new THREE.Vector3(camera.position.x - 50, 0, 0), clock, 5, 4, oscillationAmplitude, oscillationFrequency));
stageManager.addStage(new Stage(voices[6], camera, new THREE.Vector3(camera.position.x - 60, 0, 0), clock, 6, 4, oscillationAmplitude, oscillationFrequency));

window.stageManager = stageManager;
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime
    
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
            stageManager.activateStage(0);
        })
    }
    stageManager.update(deltaTime);
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