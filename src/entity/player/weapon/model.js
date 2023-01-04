import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from '../../../../modules/datgui.js';
import WeaponStates from './weaponFSM.js';

let run = 0;

export default class Model {
    constructor(scene, path, scale, position, mainGun, player, camera, rotation, castShadow, receiveShadow, loadingManager) {
        this.scene = scene;
        this.path = path;
        this.scale = scale;
        this.position = position;
        this.mainGun = mainGun;
        this.player = player;
        this.camera = camera;
        this.rotation = rotation;
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
        this.loadingManager = loadingManager;

        if(run >= 1) return;
        run += 1;

        this.loadModel();
    }

    loadModel() {
        this.loader = new GLTFLoader(this.loadingManager);
        this.loader.load(this.path, (gltf) => {
            gltf.scene.traverse(c => {
                if(this.castShadow === true) c.castShadow = true;
                if(this.receiveShadow === true) c.receiveShadow = true;
            });

            this.model = gltf.scene;
            this.gltf = gltf;
            this.camera.add(this.model);
            this.model.position.set(0.08, -0.17, -0.06);
            this.model.rotation.set(0.1, 3.24, 0.25);
            this.model.scale.copy(this.scale);
            this.scene.add(this.camera);

            this.gui = new GUI();
            this.folder = this.gui.addFolder('Scale');
            this.folder.add(this.model.scale, 'x', 0.001, 6);
            this.folder.add(this.model.scale, 'y', 0.001, 6);
            this.folder.add(this.model.scale, 'z', 0.001, 6);
            this.folder2 = this.gui.addFolder('Position');
            this.folder2.add(this.model.position, 'x', -1, 1);
            this.folder2.add(this.model.position, 'y', -1, 1);
            this.folder2.add(this.model.position, 'z', -1, 1);
            this.folder3 = this.gui.addFolder('Rotation');
            this.folder3.add(this.model.rotation, 'x', -3, 3);
            this.folder3.add(this.model.rotation, 'y', -4, 4);
            this.folder3.add(this.model.rotation, 'z', -3, 3);
            this.folder2 = this.gui.addFolder('Camera Position');
            this.folder2.add(this.camera.position, 'x', -100, 100);
            this.folder2.add(this.camera.position, 'y', -100, 100);
            this.folder2.add(this.camera.position, 'z', -100, 100);

            this.folder.close();
            this.folder2.close();
            this.folder3.close();

            this.weaponFSM = new WeaponStates(this.model, this.gltf);
        });
    }

    update(delta) {
        if(this.model) {
            this.weaponFSM.update(delta);
        }
    }
}