// import { OrbitControls } from '../modules/three.js-dev/examples/js/controls/OrbitControls.js';

import World from './Level/world.js';

export default class Game{
    constructor(camera, renderer, scene, brickMat, brickMat2, floor, loadingManager) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.brickMat = brickMat;
        this.brickMat2 = brickMat2;
        this.floor = floor;
        this.loadingManager = loadingManager;

        this.init();
    }

    init() {
        // Orbit controls
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.target.set(0, 10, 0);
        // this.controls.update();

        this.gameWorld = new World(this.scene, this.renderer, this.camera, this.brickMat, this.brickMat2, this.floor, this.loadingManager);
    }

    update(deltaTime) {
        this.gameWorld.update(deltaTime);
    }
}