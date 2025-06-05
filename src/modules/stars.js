import * as THREE from 'three'
import { scene } from './scene.js'

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(10000 * 3);
for (let i = 0; i < 10000; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
});

const stars = new THREE.Points(geometry, material)

export { stars }