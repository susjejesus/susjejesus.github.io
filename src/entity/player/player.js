import * as THREE from '../../../modules/three.js-dev/build/three.module.js'
import { CapsuleGeometry } from '../../../modules/three.js-dev/src/geometries/CapsuleGeometry.js';

import KinematicPlayerObject from "../../physics/kinematicObject.js";

export default class Player{
    constructor(physicsWorld, scene, renderer, camera, loadingManager) {
        this.physicsWorld = physicsWorld;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.loadingManager = loadingManager;

        this.objectPropreties = {
            radius: 1,
            length: 3.6,
            capSegments: 5,
            radialSegments: 30
        };
        this.shape = new Ammo.btCapsuleShape(this.objectPropreties.radius, this.objectPropreties.length);
        this.invis = false;
        this.position = {
            x: -5,
            y: 5,
            z: 0
        };
        this.quat = {
            x: 0,
            y: 0,
            z: 0,
            w: 1
        };
        this.canJump = true;
        this.jumpSpeed = 30;
        this.fallSpeed = 10000;
        this.affectedByGravity = true;
        this.gravity = -this.physicsWorld.getGravity().y();
        this.controllable = true;
        this.mainPlayer = true;
        this.otherPlayer = false;
        this.otherPlayerArray = false;
        this.color = 0xffffff;
        this.threeJSgeometry = new CapsuleGeometry(this.objectPropreties.radius, this.objectPropreties.length, this.objectPropreties.capSegments, this.objectPropreties.radialSegments);
        this.material = new THREE.MeshStandardMaterial({ color: this.color });

        this.init();
    }

    init() {
        this.player = new KinematicPlayerObject(this.physicsWorld, this.scene, this.renderer, this.camera, this.shape, this.invis, this.position, this.quat, this.canJump, this.jumpSpeed, this.fallSpeed, this.affectedByGravity, this.gravity, this.controllable, this.mainPlayer, this.otherPlayer, this.otherPlayerArray, this.threeJSgeometry, this.material, this.loadingManager);

        /* TO DO*/
        // Make it so the kinematic body is passed into an array
        // and then it is updated from an external class not the playerObject.js class
        
        this.box = new KinematicPlayerObject(this.physicsWorld, this.scene, this.renderer, this.camera, new Ammo.btBoxShape( new Ammo.btVector3(1, 1, 1) ), false, {x: 5, y: 100, z: 0}, this.quat, false, this.jumpSpeed, this.fallSpeed, this.affectedByGravity, this.gravity, false, false, false, false, new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: new THREE.Color('gray') }), 'none');
        this.box2 = new KinematicPlayerObject(this.physicsWorld, this.scene, this.renderer, this.camera, new Ammo.btBoxShape( new Ammo.btVector3(1, 1, 1) ), false, {x: 10, y: 10, z: 0}, this.quat, false, this.jumpSpeed, this.fallSpeed, false, false, false, false, false, false, new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: new THREE.Color('gray') }), 'none');
    }

    update(d) {
        this.player.update(d);
        this.box.update();
        this.box2.update();
    }
}