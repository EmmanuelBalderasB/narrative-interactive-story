import * as THREE from 'three'
import { camera } from './camera.js'

const audioLoader = new THREE.AudioLoader()
const audioListener = new THREE.AudioListener()
const audio = new THREE.Audio(audioListener)

// Add listener to camera
camera.add(audioListener)

// Background audio
audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', (buffer) => {
    audio.setBuffer(buffer)
    audio.setLoop(true)
    audio.setVolume(0.5)
    audio.play()
})

// Voice audio
const voice1 = {
    source: new THREE.Audio(audioListener),
    length: 14,
    startTime: 10,
    isInitialized: false,
    init: () => {
        if (voice1.isInitialized) return

        console.log('init voice 1')
        audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6CFTy6pBw3qNKntEZOYIQ619UX4VrSPeWhjA2', (buffer) => {
            voice1.source.setBuffer(buffer)
            voice1.source.setVolume(0.5)
            voice1.source.play()
            voice1.isInitialized = true
            console.log('playing voice 1')
        })
    }
}

// const voice2 = {
//     source: new THREE.Audio(audioListener),
//     length: 14,
//     startTime: 10,
//     isInitialized: false,
//     init: () => {
//         if (voice2.isInitialized) return
//         console.log('init voice 2')
//         audioLoader.load('https://b7ftxmps0k.ufs.sh/f/VCclx06vKdP6GzTrNDHpdA0OeNjSEu58bIy2lJ1sVPrcW6oq', (buffer) => {
//             voice2.source.setBuffer(buffer)
//             voice2.source.setVolume(0.5)
//             voice2.source.play()
//             voice2.isInitialized = true
//             console.log('playing voice 2')
//         })
//     }
// }

const voices = [voice1]

export { voices } 