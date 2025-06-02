import { gltfLoader } from '../helpers/DracoLoader.js'
import { scene } from './scene.js'
const ring = gltfLoader.load('./ring/ring.gltf', (gltf) => {
    const ring = gltf.scene.children[0];
    console.log(ring);
    ring.position.set(70, 0, -5);
    ring.scale.set(4.5, 4.5, 4.5);
    scene.add(ring);
    return ring;
});
export { ring };
