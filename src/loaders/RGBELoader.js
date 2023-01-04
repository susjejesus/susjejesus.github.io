import * as THREE from '../../modules/three.js-dev/build/three.module.js'
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/RGBELoader.js';

export default class RgbeLoader {
    constructor(scene, loadingManager, path) {
        this.scene = scene;
        this.loadingManager = loadingManager;
        this.path = path;

        this.loader = new RGBELoader(this.loadingManager);

        this.createBackground();
    }

    createBackground() {
        this.loader.load(this.path, (hdr) => {
            hdr.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = hdr;
            this.scene.environment = hdr;
        });
    }
}