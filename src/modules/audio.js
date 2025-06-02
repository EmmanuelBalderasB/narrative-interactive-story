import * as THREE from 'three'
import { loadingManager } from './loadingManager.js'
import Voice from '../helpers/Voice.js'
import { camera } from './camera.js'

const audioLoader = new THREE.AudioLoader(loadingManager)
const audioListener = new THREE.AudioListener()

const backgroundAudio = new THREE.Audio(audioListener)
let isBackgroundAudioLoaded = false;

audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', (buffer) => {
    backgroundAudio.setBuffer(buffer)
    backgroundAudio.setLoop(true)
    backgroundAudio.setVolume(1)
    isBackgroundAudioLoaded = true;
})

const playBackgroundAudio = () => {
    if (isBackgroundAudioLoaded && !backgroundAudio.isPlaying) {
        backgroundAudio.play();
    }
}

const voice1 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6CFTy6pBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 14, 15, 1, audioListener,audioLoader, camera);
const voice2 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6C1UGrVBw3qNKntEZOYIQ619UX4VrSPeWhjA2', 13, 29, 2, audioListener,audioLoader, camera);
const voice3 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6cDzsnjeOt40dfgIDuQ9YPMvkmFVGUyL5KSae', 11, 42, 3, audioListener,audioLoader, camera);
const voice4 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP60hdwjdan3Me5BhKlTQgzrdk2SRuA1HmwCtn4', 15, 53, 4, audioListener,audioLoader, camera);
const voice5 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6o7v4IrVTkUpE81bgK3uCXhQ5cZtDNaYiJzeI', 14, 68, 5, audioListener,audioLoader, camera);
const voice6 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6qRtr9WOjaTewnrFyYC4cVmM723xEAS6JsfKZ', 14, 82, 6, audioListener,audioLoader, camera);
const voice7 = new Voice('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP694agx9cyATm5n8u9pedcghjwvyD7ExKCzfWF', 15, 96, 7, audioListener,audioLoader, camera);

const voices = [voice1, voice2, voice3, voice4, voice5, voice6, voice7]

export { audioListener, audioLoader, voices, backgroundAudio, playBackgroundAudio }