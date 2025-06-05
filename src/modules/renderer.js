import * as THREE from 'three'
import { sizes } from './sizes.js'
import { loadingManager } from './loadingManager.js'
import { EffectComposer } from 'three/examples/jsm/Addons.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { scene } from './scene.js'
import { camera } from './camera.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl'),
    antialias: true,
    powerPreference: "high-performance",
    loadingManager: loadingManager
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000000')
//renderer.toneMapping = THREE.CineonToneMapping
//renderer.toneMappingExposure = 1.5
//renderer.outputColorSpace = THREE.SRGBColorSpace
const fx = new EffectComposer(renderer)
fx.setPixelRatio(sizes.pixelRatio)
fx.setSize(sizes.width, sizes.height);


const renderPass = new RenderPass(scene, camera)
fx.addPass(renderPass)

const bloomPass = new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height), 0.5, 0.4, 0.85)
fx.addPass(bloomPass)

export { renderer, fx }

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    fx.setSize(window.innerWidth, window.innerHeight)
    fx.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})