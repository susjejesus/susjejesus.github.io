import { Vector3 } from "../../../../modules/three.js-dev/build/three.module.js";
import Model from "./model.js";

export default class Weapon {
    constructor(scene, object, camera, loadingManager) {
        this.scene = scene;
        this.object = object;
        this.camera = camera;

        this.loadingManager = loadingManager;

        this.init();
    }

    init() {
        this.model = new Model(this.scene, '../../../../resources/models/fps_pistol_animations/scene.gltf', new Vector3(1, 1, 1), new Vector3(0.11, -0.133, -0.13), true, this.object, this.camera, false, true, false, this.loadingManager);
    }
    
    update(d) {
        this.model.update(d);
    }
}