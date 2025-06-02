import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadingManager } from '../modules/loadingManager.js'

const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath( 'jsm/libs/draco/' );

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

export { gltfLoader };
