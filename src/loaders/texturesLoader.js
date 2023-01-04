import * as THREE from '../../modules/three.js-dev/build/three.module.js';

export default class TexturesLoader {
    constructor(loadingManager, scene, renderer) {
        this.loadingManager = loadingManager;
        this.scene = scene;
        this.renderer = renderer;

        this.loader = new THREE.TextureLoader(this.loadingManager);

        this.colorMap = null;
        this.normalMap = null;
        this.displacementMap = null;
        this.roughnessMap = null;
        this.aoMap = null;
        this.metallicMap = null;
    }

    loadTextures(colorMapPath, normalMapPath, displacementMapPath, roughnessMapPath, aoMapPath, metallicMapPath, firstRepeat, lastRepeat, rotation) {
        this.colorMap = this.loader.load(colorMapPath);
        this.colorMap.wrapS = THREE.RepeatWrapping;
        this.colorMap.wrapT = THREE.RepeatWrapping;
        this.colorMap.repeat.set(firstRepeat, lastRepeat);
        this.colorMap.encoding = THREE.sRGBEncoding;

        this.normalMap = this.loader.load(normalMapPath);
        this.normalMap.wrapS = THREE.RepeatWrapping;
        this.normalMap.wrapT = THREE.RepeatWrapping;
        this.normalMap.repeat.set(firstRepeat, lastRepeat);
        
        this.displacementMap = this.loader.load(displacementMapPath);
        this.displacementMap.wrapS = THREE.RepeatWrapping;
        this.displacementMap.wrapT = THREE.RepeatWrapping;
        this.displacementMap.repeat.set(firstRepeat, lastRepeat);

        this.roughnessMap = this.loader.load(roughnessMapPath);
        this.roughnessMap.wrapS = THREE.RepeatWrapping;
        this. roughnessMap.wrapT = THREE.RepeatWrapping;
        this.roughnessMap.repeat.set(firstRepeat, lastRepeat);

        this.aoMap = this.loader.load(aoMapPath);
        this.aoMap.wrapS = THREE.RepeatWrapping;
        this.aoMap.wrapT = THREE.RepeatWrapping;
        this.aoMap.repeat.set(firstRepeat, lastRepeat);

        this.metallicMap = this.loader.load(metallicMapPath);
        this.metallicMap.wrapS = THREE.RepeatWrapping;
        this.metallicMap.wrapT = THREE.RepeatWrapping;
        this.metallicMap.repeat.set(firstRepeat, lastRepeat);

        this.colorMap.rotation = rotation;
        this.normalMap.rotation = rotation;
        this.displacementMap.rotation = rotation;
        this.roughnessMap.rotation = rotation;
        this.aoMap.rotation = rotation;

        this.materials = new THREE.MeshStandardMaterial({
            map: this.colorMap,
            normalMap: this.normalMap,
            displacementMap: this.displacementMap,
            roughnessMap: this.roughnessMap,
            aoMap: this.aoMap,
            metalnessMap: this.metallicMap,
        });

        return this.materials;
    }
}