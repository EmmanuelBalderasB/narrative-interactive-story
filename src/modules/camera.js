import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { sizes } from './sizes.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'

// Base camera
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 0.1, 100)

const controls = new OrbitControls(camera, document.querySelector('canvas.webgl'))
controls.enableDamping = true

camera.position.set(5, 0, 5)
// Handle window esize for controls
window.addEventListener('resize', () => {
    controls.handleResize()
})

export { camera, controls } 