import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { sizes } from './sizes.js'
import Controls from '../helpers/controls.js'

const clock = new THREE.Clock()
// Base camera
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(15, 0, -5)

const controls = new Controls(camera, window, clock)

// Handle window esize for controls
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})


export { camera, controls } 