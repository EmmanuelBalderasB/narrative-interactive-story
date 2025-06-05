import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { loadingManager } from './modules/loadingManager.js'
import { camera } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { ring, ringPositions } from './modules/ring.js'
import { audioListener, voices, backgroundAudio, playBackgroundAudio } from './modules/audio.js'
import { fadeToBlack, fadeToNormal } from './helpers/fade.js'
import { StageManager } from './modules/StageManager.js'
import { Stage } from './helpers/Stage.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const loadingText = document.querySelector('.loading-text')
const nextButton = document.querySelector('.next-button')
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


const originalOnLoad = loadingManager.onLoad;
loadingManager.onLoad = () => {
    for (let i = 0; i < 7; i++) {
        if (i === 0) {
            stageManager.addStage(new Stage(voices[i], camera, camera.position.clone(), clock, i, 4, oscillationAmplitude, oscillationFrequency, undefined, new THREE.Vector3(0, 0, 0)));
        } else {
            // Offset the camera position from the debris, and look at the debris
            const debrisPos = ringPositions[Math.floor(Math.random() * ringPositions.length)];
            const offset = new THREE.Vector3(0, 0, 20); // Move camera 20 units away in z
            const cameraPos = debrisPos.clone().add(offset);
            stageManager.addStage(new Stage(voices[i], camera, cameraPos, clock, i, 4, oscillationAmplitude, oscillationFrequency, undefined, debrisPos));
        }
    }
    scene.add(earth)
    scene.add(atmosphere)
    scene.add(ring)
    loadingText.addEventListener('click', (e) => {
        e.preventDefault();
        playBackgroundAudio();
        fadeToNormal(document.querySelector('.webgl'), isBlack);
       
        document.querySelector('.text-container').style.opacity = 1;
        
        e.target.style.display = 'none';
        stageManager.activateStage(0);
    })
    loadingText.textContent = 'Click to start'
    loadingText.style.cursor = 'pointer';
    
    objectsInScene = true;
    
    // Call original onLoad function
    if (originalOnLoad) {
        originalOnLoad();
    }
};

let ringPositionsLoaded = false;
window.stageManager = stageManager;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
let lastPosition = camera.position.clone();
const tick = () => {
    /* if (ringPositions.length > 1 && !ringPositionsLoaded) {
        for (const stageKey in stageManager.stages) {
            const stage = stageManager.stages[stageKey];
            console.log(`${stageKey} camera target position `, stage.cameraTargetPosition);
            if (stage.name != 0) {
                stage.cameraTargetPosition.copy(ringPositions[Math.floor(Math.random() * ringPositions.length)]);
            }
        }
        ringPositionsLoaded = true;
        console.log('Positions activated', stageManager.stages);
    } */
    if (Math.random() < 0.1) {
        const newPosition = camera.position.clone();
        if (!newPosition.equals(lastPosition)) {
           console.log(newPosition);
        }
        lastPosition = newPosition;
    }
    controls.update();
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime
    
    stageManager.update(deltaTime);
    // Update earth rotation
    earth.rotation.y = elapsedTime * 0.01

    // Always look at the current stage's lookAtTarget
    const currentStage = stageManager.getActiveStage && stageManager.getActiveStage();
    if (currentStage && currentStage.lookAtTarget) {
        camera.lookAt(currentStage.lookAtTarget);
    }

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
    /* if (key >= '1' && key <= '7') {
        const voiceIndex = parseInt(key) - 1;
        voices[voiceIndex].play();
    } */
    if (key === '0') {
        fadeToBlack(document.querySelector('canvas'), isBlack);
    }
    if (key === '9') {
        fadeToNormal(document.querySelector('canvas'), isBlack);
    }
    // Space to stop all voices
    /* if (key === ' ') {
        event.preventDefault(); // Prevent page scroll
        voices.forEach(voice => voice.stop());
        console.log('Stopped all voices');
    } */

    // 'b' to toggle background music
    if (key.toLowerCase() === 'b') {
        if (backgroundAudio.isPlaying) {
            backgroundAudio.pause();
            console.log('Background music paused');
        } else {
            playBackgroundAudio();
            console.log('Background music resumed');
        }
    }
});

nextButton.addEventListener('click', () => {
    stageManager.nextStage();
})
