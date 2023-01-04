import * as THREE from "../../../../modules/three.js-dev/build/three.module.js";
import RigidBody from "../../../physics/rigidBody.js";

export default class WeaponPhysics {
    constructor(camera, scene, physicsWorld) {
        this.camera = camera;
        this.scene = scene;
        this.physicsWorld = physicsWorld;

        this.rigidBodies = [];
        this.rigidMeshes = [];

        this.tmpTrans = new Ammo.btTransform();

        this.raycaster = new THREE.Raycaster();
        this.position = new THREE.Vector2(0, 0);
        this.tmpPos = new THREE.Vector3(0, 0, 0);

        this.init();
    }

    init() {
        this.rigidBody1 = new RigidBody(this.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, { x: 0, y: 10, z: -20 }, new Ammo.btSphereShape(1), { x: 0, y: 0, z: 0, w: 1 }, 0, new THREE.SphereBufferGeometry(1, 50, 50), new THREE.MeshStandardMaterial({ color: new THREE.Color('blue') }), false, true, true, 'sphereEntity')
    }

    checkForHit() {
        this.raycaster.setFromCamera(this.position, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if(intersects[0]) {
            if(intersects[0].object.userData.type === 'sphereEntity') {
                let x = this.getRandomPosition(5) - this.getRandomPosition(5);
                let y = this.getRandomPosition(5) + 2;
                let z = -20;
    
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin(new Ammo.btVector3(x, y, z));
                transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
                let motionState = new Ammo.btDefaultMotionState(transform);
                this.rigidBodies[0].setMotionState(motionState);
            }
        }
    }

    update() {
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
    }

    getRandomPosition(max) {
        return Math.floor(Math.random() * max);
    }
}