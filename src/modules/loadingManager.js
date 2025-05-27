import * as THREE from 'three'
import { sizes } from './sizes.js'
const loadingManager = new THREE.LoadingManager()
const loadingText = document.querySelector('.loading-text')
loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

loadingManager.onLoad = function ( ) {
	console.log( 'Loading complete!');
    loadingManager.isLoaded = true;
};

loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    const progress = Math.round((itemsLoaded / itemsTotal) * 100)
    loadingText.textContent = `${progress}%`
};

loadingManager.onError = function (url) {
    console.log('There was an error loading ' + url);
};
export { loadingManager }
