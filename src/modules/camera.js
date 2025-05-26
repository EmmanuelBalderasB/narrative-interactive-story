import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { sizes } from './sizes.js'

// Base camera
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 0.1, 100)

camera.position.set(15, 0, -5)

// Handle window esize for controls
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})


export { camera } 