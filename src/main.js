import * as THREE from 'three'
import { scene } from './modules/scene.js'
import { camera, controls } from './modules/camera.js'
import { renderer } from './modules/renderer.js'
import { earth, atmosphere } from './modules/earth.js'
import { debugSun } from './modules/sun.js'
import { voice1 } from './modules/audio.js'

// Add objects to scene
scene.add(earth)
scene.add(atmosphere)
scene.add(debugSun)

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime

    // Handle voice timing
    if ((elapsedTime > voice1.startTime && elapsedTime < voice1.startTime + voice1.length) && !voice1.source.isPlaying) {
        voice1.init()
    }

    // Update earth rotation
    earth.rotation.y = elapsedTime * 0.01

    // Update controls with delta time
    controls.update(deltaTime)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick() 