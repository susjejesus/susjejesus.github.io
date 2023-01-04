import GraphicsPlayerObject from "../entity/player/graphics/playerObject.js";
import KinematicPlayerController from "../entity/player/input/kinematicObjectController.js";

export default class KinematicPlayerObject {
    constructor(physicsWorld, scene, renderer, camera, shape, invis, position, quat, canJump, jumpSpeed, fallSpeed, affectedByGravity, gravity, controllable, mainPlayer, otherPlayer, otherPlayerArray, geometry, material, loadingManager) {
        this.physicsWorld = physicsWorld;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;

        this.shape = shape;
        this.invis = invis;
        this.pos = new Ammo.btVector3(position.x, position.y, position.z);
        this.quat = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
        this.canJump = canJump;
        this.jumpSpeed = jumpSpeed;
        this.jumpSpeed = parseInt(this.jumpSpeed);
        this.fallSpeed = fallSpeed;
        this.fallSpeed = parseInt(this.fallSpeed);
        this.affectedByGravity = affectedByGravity;
        this.gravity = gravity;
        this.controllable = controllable;
        this.mainPlayer = mainPlayer;
        this.otherPlayer = otherPlayer;
        this.otherPlayerArray = otherPlayerArray;
        this.geometry = geometry;
        this.material = material;

        this.loadingManager = loadingManager;

        this.bodies = [];

        this.init();
    }

    init() {
        this.ghostObject = new Ammo.btPairCachingGhostObject();
        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
        this.transform.setOrigin(this.pos);
        this.transform.setRotation(this.quat);
        this.ghostObject.setWorldTransform(this.transform);
        this.ghostObject.setCollisionShape(this.shape);
        this.ghostObject.setCollisionFlags(this.ghostObject.getCollisionFlags() | 16); //CHARACTER_OBJECT

        this.controller = new Ammo.btKinematicCharacterController(this.ghostObject, this.shape, 0.35, 1);
        this.controller.setUseGhostSweepTest(true);
        if (this.affectedByGravity === true) this.controller.setGravity(this.gravity);
        this.controller.setMaxSlope(Math.PI / 4);
        if (this.canJump) this.controller.setJumpSpeed(this.jumpSpeed);
        this.controller.setFallSpeed(this.fallSpeed);

        // addCollisionObject(collisionObject: Ammo.btCollisionObject, collisionFilterGroup?: number | undefined, collisionFilterMask?: number | undefined): void
        this.physicsWorld.addCollisionObject(this.ghostObject, 1, -1);
        this.physicsWorld.addAction(this.controller);

        this.bodies.push(this.controller);

        if (this.invis === false) {
            // view the object in three js
            this.graphicPlayerObject = new GraphicsPlayerObject(this.scene, this.bodies, this.geometry, this.material, this.camera);
        }

        if (this.controllable === true && this.mainPlayer === true) {
            // character controller
            this.objectController = new KinematicPlayerController(this.controller, this.renderer, this.camera, this.scene, this.physicsWorld, this.loadingManager);
        }

        if(this.otherPlayer === true) {
            // Add a script to be able to view the other player
        }
    }

    update(d) {
        if(this.invis === false) this.graphicPlayerObject.update();
        if(this.controllable && this.mainPlayer) this.objectController.update(d);
        // console.log(this.shape)
    }
}