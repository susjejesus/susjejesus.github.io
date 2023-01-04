import * as THREE from '../../modules/three.js-dev/build/three.module.js';

export default class RigidBody {
    constructor(physicsWorld, scene, rigidBodies, rigidMeshes, position, shape, quat, mass, threeJSgeometry, threeJSmaterial, invis, cast, recieve, userData) {
        this.physicsWorld = physicsWorld;
        this.scene = scene;
        this.rigidBodies = rigidBodies;
        this.rigidMeshes = rigidMeshes;
        this.position = position;
        this.colShape = shape;
        this.quat = quat;
        this.mass = mass;
        this.geometry = threeJSgeometry;
        this.material = threeJSmaterial;
        this.invis = invis;
        this.cast = cast;
        this.recieve = recieve;
        this.userData = userData;

        this.createBody();
    }

    createBody() {
        // ammo js
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        transform.setRotation(new Ammo.btQuaternion(this.quat.x, this.quat.y, this.quat.z, this.quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        this.colShape.calculateLocalInertia(this.mass, this.localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, motionState, this.colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);


        this.physicsWorld.addRigidBody(body, 1, -1);

        // three js
        if (this.invis != true) {
            this.threeJSobject = new THREE.Mesh(this.geometry, this.material);
            this.threeJSobject.position.set(this.position.x, this.position.y, this.position.z);
            if (this.cast === true) this.threeJSobject.castShadow = true; else this.threeJSobject.castShadow = false;
            if (this.recieve === true) this.threeJSobject.receiveShadow = true; else this.threeJSobject.recieveShadow = false;
            this.threeJSobject.userData.type = this.userData;
            this.scene.add(this.threeJSobject);
            this.rigidMeshes.push(this.threeJSobject);
            this.rigidBodies.push(body);
        }
    }
}