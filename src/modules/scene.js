import * as THREE from 'three'
import { loadingManager } from './loadingManager.js'

const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader(loadingManager)

const backgroundTexture = textureLoader.load('./hdri/8k_stars.jpg')
//backgroundTexture.mapping = THREE.EquirectangularReflectionMapping
scene.background = backgroundTexture

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Add directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

export { scene } 