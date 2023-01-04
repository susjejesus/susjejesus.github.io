import * as THREE from '../../../modules/three.js-dev/build/three.module.js'
import RigidBody from '../../physics/rigidBody.js';

export default class LevelObjects{
    constructor(physicsWorld, scene) {
        this.physicsWorld = physicsWorld;
        this.scene = scene;

        this.rigidBodies = [];
        this.rigidMeshes = [];

        this.tmpTrans = new Ammo.btTransform();

        this.textureLoader = new THREE.TextureLoader();;

        this.floorMaterial = {
            baseColor: this.textureLoader.load('../../../resources/textures/floor/TexturesCom_Fabric_SciFi7_512_albedo.tif'),
            normalMap: this.textureLoader.load('../../../resources/textures/floor/TexturesCom_Fabric_SciFi7_512_normal.tif')
        }

        this.init();
    }

    init() {
        this.object = new RigidBody(this.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, {x: 0, y:0, z: 0}, new Ammo.btBoxShape(new Ammo.btVector3(50, 0.5, 50)) , {x: 0, y: 0, z: 0, w: 1}, 0, new THREE.BoxBufferGeometry(100, 1, 100), new THREE.MeshStandardMaterial({ 
            
        }), false, false, true);
        this.object = new RigidBody(this.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, {x: 0, y:10, z: 0}, new Ammo.btSphereShape(1) , {x: 0, y: 0, z: 0, w: 1}, 1, new THREE.SphereBufferGeometry(1, 50, 50), new THREE.MeshStandardMaterial({ color: new THREE.Color('red') }), false, true, true);
        this.object = new RigidBody(this.physicsWorld, this.scene, this.rigidBodies, this.rigidMeshes, {x: -5, y:100, z: 0}, new Ammo.btBoxShape(new Ammo.btVector3(2, 4, 2)) , {x: 0, y: 0, z: 0, w: 1}, 1, new THREE.BoxBufferGeometry(4, 8, 4), new THREE.MeshStandardMaterial({ color: new THREE.Color('green') }), false, true, true);
    }

    update() {
        for(var i = 0; i < this.rigidBodies.length; i++) {
            let ms = this.rigidBodies[i].getMotionState();
            if(ms) {
                ms.getWorldTransform( this.tmpTrans );
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                this.rigidMeshes[i].position.set( p.x(), p.y(), p.z() );
                this.rigidMeshes[i].quaternion.set( q.x(), q.y(), q.z(), q.w() );
            }
        }
    }
}