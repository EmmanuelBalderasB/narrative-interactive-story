import * as THREE from 'three'
import earthVertexShader from '../shaders/earth/vertex.glsl'
import earthFragmentShader from '../shaders/earth/fragment.glsl'
import atmosphereVertexShader from '../shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from '../shaders/atmosphere/fragment.glsl'
import { loadingManager } from './loadingManager.js'

const earthParameters = {
    atmosphereDayColor: '#a3a3a3',
    atmosphereTwilightColor: '#878787'
}

// Textures
const textureLoader = new THREE.TextureLoader(loadingManager)

const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

// MUCH lower resolution geometry - this was killing your performance!
// 128x64 is plenty for a smooth sphere and will give you 60+ FPS
const earthGeometry = new THREE.SphereGeometry(40, 128, 64)

// Earth material
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
})

// Debugging material
//const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true })
const earth = new THREE.Mesh(earthGeometry, earthMaterial)

// Use separate geometry for atmosphere to save memory
const atmosphereGeometry = new THREE.SphereGeometry(40, 64, 32) // Even lower resolution for atmosphere

const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
})

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)

export { earth, atmosphere, earthMaterial, atmosphereMaterial, earthParameters }