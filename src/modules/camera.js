import * as THREE from 'three'
import { sizes } from './sizes.js'

const clock = new THREE.Clock()

// Base camera
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 0.1, 10000)

// Position camera to see the earth nicely
camera.position.set(140, 0, -5) // Good distance to see full earth (radius 40)
camera.lookAt(0, 0, 0)

// Handle window resize for controls
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

export { camera }