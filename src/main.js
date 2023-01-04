(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()

import * as THREE from '../modules/three.js-dev/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/GlitchPass.js';

import Game from './game.js';
import RgbeLoader from './loaders/RGBELoader.js';
import TexturesLoader from './loaders/texturesLoader.js';

class World {
    constructor() {
        this.init();
    }

    init() {
        this.loadingManager = new THREE.LoadingManager();

        this.loadingManager.onStart = function (url, item, total) {
            console.log('started loading')
        }

        this.loadingManager.onLoad = function () {

            console.log('Loading complete!');

        };


        this.loadingManager.onProgress = function (url, items, total) {

            console.log((items / total) * 100 + '%');

        };

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;


        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 3, 40)
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color('skyblue');
        this.sceneBackground = new RgbeLoader(this.scene, this.loadingManager, '../../resources/hdr/drackenstein_quarry_puresky_4k.hdr');
        console.log(this.sceneBackground)

        document.body.appendChild(this.renderer.domElement);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        // this.composer.addPass(new UnrealBloomPass({x: 1024, y: 1024}, 2.0, 0.0, 0.75));
        // this.composer.addPass(new GlitchPass());

        window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false);

        this.clock = new THREE.Clock();

        this.textures = new TexturesLoader(this.loadingManager, this.scene, this.renderer);
        const threeJSfloorMaterial = this.textures.loadTextures('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_albedo.png', './resources/textures/floor/TexturesCom_Fabric_SciFi7_512_normal.png', '', '', './resources/textures/floor/TexturesCom_Fabric_SciFi7_512_ao.png', './resources/textures/floor/TexturesCom_Fabric_SciFi7_512_metallic.png', 10, 10, 0);
        const threeJSbrickMaterial = this.textures.loadTextures('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_albedo.png', './resources/textures/brick/TexturesCom_Brick_Rustic2_1K_normal.png', '', '', './resources/textures/brick/TexturesCom_Brick_Rustic2_1K_ao.png', '', 3, 1, 0);
        const threeJSbrickMaterial2 = this.textures.loadTextures('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_albedo.png', './resources/textures/brick/TexturesCom_Brick_Rustic2_1K_normal.png', '', '', './resources/textures/brick/TexturesCom_Brick_Rustic2_1K_ao.png', '', 3, 1, 1.6);
        this.game = new Game(this.camera, this.renderer, this.scene, threeJSbrickMaterial, threeJSbrickMaterial2, threeJSfloorMaterial, this.loadingManager);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => {
            let deltaTime = this.clock.getDelta();
            this.game.update(deltaTime);

            // this.renderer.render(this.scene, this.camera);
            this.composer.render();

            this.animate();
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

let APP = null;

window.addEventListener('DOMContentLoaded', () => {
    Ammo().then((lib) => {
        Ammo = lib;

        APP = new World();
    });
});