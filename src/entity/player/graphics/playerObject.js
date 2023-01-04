import { Mesh } from '../../../../modules/three.js-dev/build/three.module.js';

export default class GraphicsPlayerObject {
    constructor(scene, bodies, geometry, material, camera) {
        this.scene = scene;
        this.bodies = bodies;
        this.geometry = geometry;
        this.material = material;
        this.camera = camera;

        this.init();
    }

    init() {
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }

    update() {
        for(var i = 0; i < this.bodies.length; i++) {
            this.mesh.position.set( this.bodies[i].getGhostObject().getWorldTransform().getOrigin().x(), this.bodies[i].getGhostObject().getWorldTransform().getOrigin().y(), this.bodies[i].getGhostObject().getWorldTransform().getOrigin().z() );
            this.mesh.quaternion.set( this.bodies[i].getGhostObject().getWorldTransform().getRotation().x(), this.bodies[i].getGhostObject().getWorldTransform().getRotation().y(), this.bodies[i].getGhostObject().getWorldTransform().getRotation().z(), this.bodies[i].getGhostObject().getWorldTransform().getRotation().w() );
        }
    }
}