import * as THREE from 'three'
import { sizes } from './sizes.js'
import { loadingManager } from './loadingManager.js'

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl'),
    antialias: true,
    powerPreference: "high-performance",
    loadingManager: loadingManager
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000000')

export { renderer }

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})