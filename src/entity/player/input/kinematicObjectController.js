import * as THREE from '../../../../modules/three.js-dev/build/three.module.js';

import CameraController from '../camera/cameraController.js';
import WeaponPhysics from '../weapon/physics.js';
import Weapon from '../weapon/weapon.js';

const keys = {
    forward: false,
    backward: false,
    right: false,
    left: false,
    crouch: false,
    shift: false,
    space: false,
    reload: false,
    click: false,
    rightClick: false
}

const state = {
    running: false,
    walking: false,
    jumping: false,
    standing: true,
    crouching: false,
    reloading: false,
    aiming: false
}

export default class KinematicPlayerController {
    constructor(object, renderer, camera, scene, physicsWorld, loadingManager) {
        this.object = object;

        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;

        this.physicsWorld = physicsWorld;

        this.loadingManager = loadingManager;

        this.direction = new THREE.Vector3();
        this.forwardVector = new THREE.Vector3(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
        this.sideVector = new THREE.Vector3((keys.left ? 1 : 0) - (keys.right ? 1 : 0), 0, 0);

        this.ammoVec = new Ammo.btVector3(0, 0, 0);

        this.canRun = true;
        this.speed = 0.2;

        this.prevState = 'standing';
        this.shoot = 0;
        this.ammo = 17;
        this.maxAmmo = 17;
        this.totalAmmo = 'infinite';
        this.canShoot = true;

        this.reload = 0;

        this.weaponPhysics = new WeaponPhysics(this.camera, this.scene, this.physicsWorld);

        this.crouchingShape = new Ammo.btCapsuleShape(1, 2.55);
        this.standingShape = new Ammo.btCapsuleShape(1, 3.6);

        this.lightPosition = new THREE.Vector3(this.object.getGhostObject().getWorldTransform().getOrigin().x(), this.object.getGhostObject().getWorldTransform().getOrigin().y(), this.object.getGhostObject().getWorldTransform().getOrigin().z());
        this.targedObject = new THREE.Object3D();
        this.targedObject.castShadow = false;
        this.targedObject.receiveShadow = false;
        this.lightLookAt = new THREE.Vector3();
        this.lightRaycaster = new THREE.Raycaster();
        this.raycasterPointer = new THREE.Vector2();

        this.init();
        this.makeWeapon();
    }

    init() {
        this.cameraControls = new CameraController(this.camera, this.renderer, this.object);

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);

        document.addEventListener('mousedown', this.onMouseDown, false);
        document.addEventListener('mouseup', this.onMouseUp, false);

        this.light = new THREE.SpotLight(0xffffff, 4);
        this.light.position.set(0,15,35);
        this.light.angle = Math.PI/12;
        this.light.distance = 15;
        this.light.penumbra = 0.05;
        this.light.distance = 50;
        this.light.decay = 5;

        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 1000.0;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 500.0;
        this.light.shadow.camera.left = 100;
        this.light.shadow.camera.right = -100;
        this.light.shadow.camera.top = 100;
        this.light.shadow.camera.bottom = -100;
        this.scene.add(this.light);

        console.log(this.object.getGhostObject().getWorldTransform().getOrigin().x())
    }

    makeWeapon() {
        this.weapon = new Weapon(this.scene, this.object, this.camera, this.loadingManager);
    }

    update(d) {
        this.updateState();

        this.updateMovement();

        this.cameraControls.update();

        this.weapon.update(d);
        this.weaponPhysics.update();

        // console.log(this.lightPosition);
        this.updateFlashLight();
    }

    updateFlashLight() {
        this.shootRaycaster();

        this.lightPosition.set(this.object.getGhostObject().getWorldTransform().getOrigin().x(), this.object.getGhostObject().getWorldTransform().getOrigin().y(), this.object.getGhostObject().getWorldTransform().getOrigin().z());
        this.light.position.set(this.lightPosition.x, this.lightPosition.y + 10, this.lightPosition.z);
        // this.light.rotation.set(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
        this.targedObject.position.set(this.lightLookAt.x, this.lightLookAt.y, this.lightLookAt.z)
        this.light.target = this.targedObject;
        this.scene.add(this.light.target)
    }

    shootRaycaster() {
        this.raycasterPointer.x = 0;
        this.raycasterPointer.y = 0;

        this.lightRaycaster.setFromCamera( this.raycasterPointer, this.camera );

        // calculate objects intersecting the picking ray
        const intersects = this.lightRaycaster.intersectObjects( this.scene.children );
    
        for ( let i = 0; i < intersects.length; i ++ ) {
    
            // intersects[ i ].object.material.color.set( 0xff0000 );
            // console.log(intersects[ i ].point);
            this.lightLookAt.set(intersects[ i ].point.x, intersects[ i ].point.y, intersects[ i ].point.z);
            // console.log(this.lightLookAt);
    
        }
    }

    jump() {
        this.object.jump();
    }

    updateMovement() {
        this.updateVectors();

        this.object.setWalkDirection(this.ammoVec);
    }

    updateVectors() {
        this.forwardVector.z = (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0);
        this.sideVector.x = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
        this.direction.subVectors(this.forwardVector, this.sideVector).normalize().multiplyScalar(this.speed).applyEuler(this.camera.rotation);

        this.ammoVec.setX(this.direction.x);
        this.ammoVec.setZ(this.direction.z);
    }

    updateState() {
        if (keys.shift && keys.forward && !keys.click && this.canRun && !keys.crouch) {
            this.speed = 0.3;
            this.cameraControls.headBobSpeed = 0.03;
            this.cameraControls.cameraFOVchangeSpeed = 1;
            this.cameraControls.calculateHeadBob();
            this.cameraControls.increaseFOV();
            if (this.weapon.model.weaponFSM) {
                this.weapon.model.weaponFSM.walkingAnimation.setEffectiveTimeScale(1);
                this.weaponModelWalkingState();
                this.weapon.model.weaponFSM.runningState();
            }
            state.running = true;
            state.walking = false;
        } else if (!keys.shift && !keys.crouch && (keys.forward || keys.backward || keys.right || keys.left)) {
            if (!keys.rightClick) this.speed = 0.2;
            this.cameraControls.headBobSpeed = 0.02;
            if (!keys.click) this.cameraControls.calculateHeadBob();
            if (!keys.rightClick) this.cameraControls.decreaseFOV();
            if (this.weapon.model.weaponFSM) {
                if (!keys.rightClick) {
                    this.weapon.model.weaponFSM.normalPosition();
                    this.weapon.model.weaponFSM.walkingAnimation.setEffectiveTimeScale(0.4);
                    this.cameraControls.cameraFOVchangeSpeed = 1;
                } else if (keys.rightClick) {
                    this.cameraControls.cameraFOVchangeSpeed = 0.5;
                    this.weapon.model.weaponFSM.walkingAnimation.setEffectiveTimeScale(0.3);
                }
                this.weaponModelWalkingState();
            }
            state.walking = true;
            state.running = false;
        } else {
            if (!keys.rightClick) {
                this.speed = 0.15;
                this.cameraControls.normalizeHeadBob();
                this.cameraControls.decreaseFOV();
            }
            this.weaponModelStaticState();
            state.standing = true;
            state.jumping = false;
            state.running = false;
            state.walking = false;
        }

        if (keys.rightClick) {
            state.aiming = true;
            this.canRun = false;
            this.speed = 0.05;
            if (this.weapon.model.weaponFSM) {
                this.weapon.model.weaponFSM.aimingState();
                this.cameraControls.aimingFOV();
            }
        }

        if (!keys.rightClick && this.prevState != ('reloading' || 'shooting') && !state.reloading) {
            this.canRun = true;
        }

        if (keys.space === true) {
            this.jump();
            state.jumping = true;
        }

        if (keys.click === true) {
            this.weaponModelShootState(this.prevState);
            this.prevState = 'shooting';
        }

        if (keys.reload) {
            this.WeaponModelHalfReloadState(this.prevState);
            this.prevState = 'reloading';
        }
    }

    weaponModelStaticState() {
        if (this.weapon.model.weaponFSM) {
            this.weapon.model.weaponFSM.aFullReloadState = false;
            this.weapon.model.weaponFSM.aHalfReloadState = false;
            this.weapon.model.weaponFSM.aWalkingState = false;
            this.weapon.model.weaponFSM.aShootingState = false;
            if (state.running === true || state.walking === true) this.prevState = 'walking'; else if (this.prevState === 'standing') this.prevState = this.prevState;
            if (!keys.rightClick) this.weapon.model.weaponFSM.normalPosition();
            this.weapon.model.weaponFSM.staticState(this.prevState);
        }
    }

    weaponModelWalkingState() {
        if (this.weapon.model.weaponFSM) {
            this.weapon.model.weaponFSM.aFullReloadState = false;
            this.weapon.model.weaponFSM.aHalfReloadState = false;
            this.weapon.model.weaponFSM.aStaticState = false;
            this.weapon.model.weaponFSM.aShootingState = false;
            this.weapon.model.weaponFSM.walkingState(this.prevState);
        }
    }

    weaponModelShootState() {
        if (this.weapon.model.weaponFSM && this.canShoot) {
            if (this.shoot < 1 && this.ammo != 0) {
                this.shoot += 1;
                this.ammo -= 1;
                window.setTimeout(() => {
                    this.shoot = 0;
                }, 200);
                this.weaponPhysics.checkForHit();
                this.cameraControls.increaseVerticleRecoil(0.03, 0.03, 2, 0);
                this.weapon.model.weaponFSM.aFullReloadState = false;
                this.weapon.model.weaponFSM.aHalfReloadState = false;
                this.weapon.model.weaponFSM.aStaticState = false;
                this.weapon.model.weaponFSM.aShootingState = false;
                if (!keys.rightClick) this.weapon.model.weaponFSM.normalPosition();
                this.weapon.model.weaponFSM.shootingState(this.prevState);
            }

            if (this.ammo === 0) {
                state.reloading = true;
                this.WeaponModelEmptyReloadState();
            }
        }
    }

    WeaponModelEmptyReloadState() {
        if (this.ammo === 0 && this.reload < 1) {
            this.reload += 1;
            this.stopRunningAndOrShooting(1500, true, true);
            window.setTimeout(() => {
                this.ammo = 17;
                state.reloading = false;
                this.speed = 0.15;
                this.reload = 0;
            }, 1300);
            state.reloading = true;
            this.speed = 0.1;
            if (!keys.rightClick) this.weapon.model.weaponFSM.normalPosition();
            this.weapon.model.weaponFSM.aFullReloadState = false;
            this.weapon.model.weaponFSM.aHalfReloadState = false;
            this.weapon.model.weaponFSM.aStaticState = false;
            this.weapon.model.weaponFSM.aShootingState = false;
            if (!keys.rightClick) this.weapon.model.weaponFSM.normalPosition();
            this.weapon.model.weaponFSM.fullReloadState(this.prevState);
        }
    }

    WeaponModelHalfReloadState() {
        if (this.ammo != 0 && this.ammo < 17 && this.reload < 1) {
            this.reload += 1;
            this.stopRunningAndOrShooting(1150, true, true);
            window.setTimeout(() => {
                this.ammo = 17;
                state.reload = false;
                this.speed = 0.15;
                this.reload = 0;
            }, 1100);
            this.speed = 0.1;
            state.reloading = true;
            this.weapon.model.weaponFSM.aFullReloadState = false;
            this.weapon.model.weaponFSM.aHalfReloadState = false;
            this.weapon.model.weaponFSM.aStaticState = false;
            this.weapon.model.weaponFSM.aShootingState = false;
            if (!keys.rightClick) this.weapon.model.weaponFSM.normalPosition();
            this.weapon.model.weaponFSM.halfReloadState(this.prevState);
        }
    }

    stopRunningAndOrShooting(time, shoot, run) {
        if (run) this.canRun = false;
        if (shoot) this.canShoot = false;
        window.setTimeout(() => {
            this.canShoot = true;
            this.canRun = true;
        }, time);
    }

    onMouseDown(e) {
        if (e.button === 0) {
            keys.click = true;
        }
        if (e.button === 2) {
            keys.rightClick = true;
        }
        if (e.button === 3) {
            keys.reload = true;
        }
    }

    onMouseUp(e) {
        if (e.button === 0) {
            keys.click = false;
        }
        if (e.button === 2) {
            keys.rightClick = false;
        }
        if (e.button === 3) {
            keys.reload = false;
        }
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 87: // W
                keys.forward = true;
                break;
            case 65: // A
                keys.left = true;
                break;
            case 83: // S
                keys.backward = true;
                break;
            case 68: // D
                keys.right = true;
                break;
            case 82: // R
                keys.reload = true;
                break;
            case 67: // C
                // if(!keys.crouch) keys.crouch = true; else keys.crouch = false;
                break;
            case 32: // SPACE
                keys.space = true;
                break;
            case 16: // SHIFT
                keys.shift = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.keyCode) {
            case 87: // W
                keys.forward = false;
                break;
            case 65: // A
                keys.left = false;
                break;
            case 83: // S
                keys.backward = false;
                break;
            case 68: // D
                keys.right = false;
                break;
            case 82: // R
                keys.reload = false;
                break;
            case 32: // SPACE
                keys.space = false;
                break;
            case 16: // SHIFT
                keys.shift = false;
                break;
        }
    }
}