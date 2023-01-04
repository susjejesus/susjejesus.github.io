import * as THREE from '../../modules/three.js-dev/build/three.module.js';
import Player from '../entity/player/player.js';

import PhysicsSetup from '../physics.js';
import RigidBody from '../physics/rigidBody.js';

export default class World {
    constructor(scene, renderer, camera, brickMat, brickMat2, floor, loadingManager) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.brickMat = brickMat;
        this.brickMat2 = brickMat2;
        this.floor = floor;
        this.loadingManager = loadingManager;

        this.rigidBodies = [];
        this.rigidMeshes = [];

        this.tmpTrans = new Ammo.btTransform();

        this.init();
    }

    init() {
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(50, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this.scene.add(light);

        light = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this.scene.add(light);

        let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
        // this.scene.add(hemiLight);

        // light = new THREE.SpotLight(0xffffff, 1);
        // light.position.set(0,15,35);
        // light.angle = Math.PI/8;
        // light.distance = 15;
        // light.penumbra = 0.05;
        // light.distance = 50;
        // light.decay = 0;

        // light.castShadow = true;
        // light.shadow.mapSize.width = 2048;
        // light.shadow.mapSize.height = 2048;
        // light.shadow.camera.near = 0.1;
        // light.shadow.camera.far = 1000.0;
        // light.shadow.camera.near = 0.5;
        // light.shadow.camera.far = 500.0;
        // light.shadow.camera.left = 100;
        // light.shadow.camera.right = -100;
        // light.shadow.camera.top = 100;
        // light.shadow.camera.bottom = -100;
        // this.scene.add(light);

        this.physics = new PhysicsSetup();

        this.createLevel();
    }

    createLevel() {
        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 0, y: 0, z: 0 }, new Ammo.btBoxShape(new Ammo.btVector3(50, 0.5, 50)), { x: 0, y: 0, z: 0, w: 1 }, 0, new THREE.BoxBufferGeometry(100, 1, 100, 100, 100), this.floor, false, false, true, 'world');
        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 0, y: 15, z: 50 }, new Ammo.btBoxShape(new Ammo.btVector3(50, 0.5, 15)), { x: 1, y: 0, z: 0, w: 1 }, 0, new THREE.BoxBufferGeometry(100, 1, 30, 150, 150), this.brickMat, false, true, true, 'world');
        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 0, y: 15, z: -50 }, new Ammo.btBoxShape(new Ammo.btVector3(50, 0.5, 15)), { x: 1, y: 0, z: 0, w: 1 }, 0, new THREE.BoxBufferGeometry(100, 1, 30, 150, 150), this.brickMat, false, true, true, 'world');
        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 50, y: 15, z: 0 }, new Ammo.btBoxShape(new Ammo.btVector3(15, 0.5, 50)), { x: 0, y: 0, z: 1, w: 1 }, 0, new THREE.BoxBufferGeometry(30, 1, 100, 150, 150), this.brickMat2, false, true, true, 'world');
        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: -50, y: 15, z: 0 }, new Ammo.btBoxShape(new Ammo.btVector3(15, 0.5, 50)), { x: 0, y: 0, z: 1, w: 1 }, 0, new THREE.BoxBufferGeometry(30, 1, 100, 150, 150), this.brickMat2, false, true, true, 'world');

        this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 0, y: 10, z: 0 }, new Ammo.btSphereShape(1), { x: 0, y: 0, z: 0, w: 1 }, 1, new THREE.SphereBufferGeometry(1, 50, 50), new THREE.MeshStandardMaterial({ color: new THREE.Color('red'), metalness: 1, roughness: 0 }), false, true, true, 'world');
        // this.object = new RigidBody(this.physics.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: -5, y: 100, z: 0 }, new Ammo.btBoxShape(new Ammo.btVector3(2, 4, 2)), { x: 0, y: 0, z: 0, w: 1 }, 1, new THREE.BoxBufferGeometry(4, 8, 4, 100, 100), new THREE.MeshStandardMaterial({ color: new THREE.Color('green') }), false, true, true);

        // create player
        this.player = new Player(this.physics.physicsWorld, this.scene, this.renderer, this.camera, this.loadingManager);
    }

    update(deltaTime) {
        if (this.physics.physicsWorld) {
            this.physics.physicsWorld.stepSimulation(deltaTime, 10);
        }

        for (var i = 0; i < this.rigidBodies.length; i++) {
            let ms = this.rigidBodies[i].getMotionState();
            if (ms) {
                ms.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                this.rigidMeshes[i].position.set(p.x(), p.y(), p.z());
                this.rigidMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }

        this.player.update(deltaTime);
    }
}