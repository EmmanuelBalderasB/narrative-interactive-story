import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { loadingManager } from './modules/loadingManager.js'
import { camera } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
//import { debugSun } from './modules/sun.js'
import Voice from './modules/audio.js'
import { sizes } from './modules/sizes.js'
import { fadeToBlack, fadeToNormal } from './helpers/fade.js'
const loadingText = document.querySelector('.loading-text')
// Audio setup
const audioLoader = new THREE.AudioLoader(loadingManager)
const audioListener = new THREE.AudioListener()

// Add listener to camera
camera.add(audioListener)

// Background audio
const backgroundAudio = new THREE.Audio(audioListener)
audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', (buffer) => {
    backgroundAudio.setBuffer(buffer)
    backgroundAudio.setLoop(true)
    backgroundAudio.setVolume(0.5)
})



const voice1 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6CFTy6pBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 14, 10, 1, audioListener,audioLoader);
const voice2 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6C1UGrVBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 13, 24, 2, audioListener,audioLoader);
const voice3 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6cDzsnjeOt40dfgIDuQ9YPMvkmFVGUyL5KSae', 11, 37, 3, audioListener,audioLoader);
const voice4 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP60hdwjdan3Me5BhKlTQgzrdk2SRuA1HmwCtn4', 15, 48, 4, audioListener,audioLoader);
const voice5 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6o7v4IrVTkUpE81bgK3uCXhQ5cZtDNaYiJzeI', 14, 63, 5, audioListener,audioLoader);
const voice6 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6qRtr9WOjaTewnrFyYC4cVmM723xEAS6JsfKZ', 14, 77, 6, audioListener,audioLoader);
const voice7 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP694agx9cyATm5n8u9pedcghjwvyD7ExKCzfWF', 15, 91, 7, audioListener,audioLoader);

const voices = [voice1, voice2, voice3, voice4, voice5, voice6, voice7]

let objectsInScene = false;
// Keyboard controls for audio cues

let isBlack = true;

const clock = new THREE.Clock()
let lastTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime
    // if (voices.every(voice => voice.ready) && isBlack) {
    //     fadeToNormal(document.querySelector('canvas'));
    // }
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