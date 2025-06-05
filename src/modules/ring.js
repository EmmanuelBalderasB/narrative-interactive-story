import * as THREE from 'three'
import { MathUtils } from 'three'
import { gltfLoader } from '../helpers/DracoLoader.js'
import { scene } from './scene.js'
let ringPositions = [];
const ring = gltfLoader.load('./ring/ring.gltf', (gltf) => {
    const ring = gltf.scene.children[0];
    
    // First set all positions before any scaling
    ring.children.forEach((child, index) => {
        // Generate positions in a sphere around the Earth
        const radius =  MathUtils.randFloat(65, 85);
        const theta = MathUtils.randFloat(0, Math.PI * 2);
        const phi = MathUtils.randFloat(0, Math.PI / 2);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        let position = new THREE.Vector3(x, y, z);
        const scalar = 5;
        //child.scale.setScalar(scalar);

        // Debugging Objects
        // const geometry = new THREE.BoxGeometry(5, 5, 5);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);
        // mesh.position.copy(position);//.divideScalar(scalar);
        
        child.position.copy(position);
        child.scale.multiplyScalar(scalar);
        ringPositions.push(child.position.clone());
        
        // Debug each child's position
        console.log(`Child ${index} type:`, child.type);
        console.log(`Child ${index} original position:`, position);
        
    });
    
    // Now apply scaling after positions are set and stored
    ring.scale.setScalar(1);
    //ring.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI * 1.5);
    
    scene.add(ring);
    return ring;
});

export { ring, ringPositions };
