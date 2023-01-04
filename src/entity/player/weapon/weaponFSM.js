import { AnimationMixer, LoopOnce } from '../../../../modules/three.js-dev/build/three.module.js';

export default class WeaponStates {
    constructor(object, gltf) {
        this.object = object;
        this.gltf = gltf;

        this.normalPositionm = {
            x: 0.08,
            y: -0.17,
            z: -0.06,
        };
        this.normalRotation = {
            x: 0.1,
            y: 3.24,
            z: 0.25,
        };

        this.runningPosition = {
            x: 0.08,
            y: -0.3,
            z: -0.27,
        };
        this.runningRotation = {
            x: 1.4,
            y: 3,
            z: 0.24,
        };

        this.aimingPosition = {
            x: -0.102,
            y: -0.12,
            z: -0.061,   
        };
        this.aimingRotation = {
            x: -0.01,
            y: 3.05,
            z: 0.25,
        }

        this.init();
    }

    init() {
        this.animations = new AnimationMixer(this.object);
        this.staticAnimation = this.animations.clipAction(this.gltf.animations[0]);
        this.walkingAnimation = this.animations.clipAction(this.gltf.animations[1]);
        this.shootingAnimation = this.animations.clipAction(this.gltf.animations[2]);
        this.halfReload = this.animations.clipAction(this.gltf.animations[3]);
        this.emptyReload = this.animations.clipAction(this.gltf.animations[4]);

        this.staticAnimationState = new StaticState(this.staticAnimation, this.walkingAnimation, this.shootingAnimation);
        this.walkingAnimationState = new WalkingState(this.walkingAnimation, this.staticAnimation, this.shootingAnimation);
        this.shootingAnimationState = new ShootingState(this.shootingAnimation, this.staticAnimation, this.walkingAnimation);
        this.halfReloadingAnimationState = new HalfRelodingState(this.halfReload, this.staticAnimation, this.walkingAnimation, this.shootingAnimation);
        this.fullReloadingAnimationState = new FullRelodingState(this.emptyReload, this.staticAnimation, this.walkingAnimation, this.shootingAnimation);

        this.aStaticState = false;
        this.aWalkingState = false;
        this.aShootingState = false;
        this.aHalfReloadState = false;
        this.aFullReloadState = false;
    }

    update(delta) {
        this.animations.update(delta);
    }

    staticState(prevState) {
        if (!this.aStaticState) {
            this.staticAnimationState.enterState(prevState);
            this.aStaticState = true;
        }
    }

    walkingState(prevState) {
        if (!this.aWalkingState) {
            this.walkingAnimationState.enterState(prevState);
            this.aWalkingState = true;
        }
    }

    runningState() {
        this.object.position.set(this.runningPosition.x, this.runningPosition.y, this.runningPosition.z);
        this.object.rotation.set(this.runningRotation.x, this.runningRotation.y, this.runningRotation.z);
    }

    normalPosition() {
        this.object.position.set(this.normalPositionm.x, this.normalPositionm.y, this.normalPositionm.z);
        this.object.rotation.set(this.normalRotation.x, this.normalRotation.y, this.normalRotation.z);
    }

    aimingState() {
        this.object.position.set(this.aimingPosition.x, this.aimingPosition.y, this.aimingPosition.z);
        this.object.rotation.set(this.aimingRotation.x, this.aimingRotation.y, this.aimingRotation.z);
    }

    shootingState(prevState) {
        if (!this.aShootingState) {
            this.shootingAnimationState.enterState(prevState);
            this.aShootingState = true;
        }
    }

    halfReloadState(prevState) {
        if (!this.aHalfReloadState) {
            this.halfReloadingAnimationState.enterState(prevState);
            this.aHalfReloadState = true;
        }
    }

    fullReloadState(prevState) {
        if (!this.aFullReloadState) {
            this.fullReloadingAnimationState.enterState(prevState);
            this.aFullReloadState = true;
        }
    }
}

class StaticState {
    constructor(state, movingOBJ, shootingOBJ) {
        this.state = state;
        this.movingOBJ = movingOBJ;
        this.shootingOBJ = shootingOBJ;
    }

    enterState(prevState) {
        if (prevState === ('walking' || 'running')) {
            this.state.crossFadeFrom(this.movingOBJ, 0.5, true);
        } else if (prevState === 'shooting') {
            this.state.crossFadeFrom(this.shootingOBJ, 0.5, true);
        }

        this.state.time = 0;
        this.state.enabled = true;
        this.state.setEffectiveTimeScale(1);
        this.state.setEffectiveWeight(1);
        this.state.play();
    }
}

class WalkingState {
    constructor(state, staticOBJ, shootingONJ) {
        this.state = state;
        this.staticOBJ = staticOBJ;
        this.shootingOBJ = shootingONJ;
    }

    enterState(prevState) {
        if (prevState === ('running' || 'walking')) {

        } else if (prevState === 'standing') {
            this.state.crossFadeFrom(this.staticOBJ, 0.5, true);
        } else if (prevState === 'shooting') {
            this.state.crossFadeFrom(this.shootingOBJ, 0.5, true);
        }

        this.state.time = 0;
        this.state.enabled = true;
        this.state.setEffectiveTimeScale(0.5);
        this.state.setEffectiveWeight(1);
        this.state.play();
    }

    exit() {
        this.state.enabled = false;
    }
}

class ShootingState {
    constructor(state, staticOBJ, movingOBJ) {
        this.state = state;
        this.staticOBJ = staticOBJ;
        this.movingOBJ = movingOBJ;
    }

    enterState(prevState) {
        if (prevState === ('running' || 'walking')) {
            this.state.crossFadeFrom(this.movingOBJ, 0.5, true);
        } else if (prevState === 'standing') {
            this.state.crossFadeFrom(this.staticOBJ, 0.5, true);
        } else {

        }

        this.state.time = 0;
        this.state.enabled = true;
        this.state.setEffectiveTimeScale(1);
        this.state.setEffectiveWeight(1);
        this.state.setLoop(LoopOnce);
        this.state.play();
    }
}

class HalfRelodingState {
    constructor(state, staticOBJ, movingOBJ, shootingOBJ) {
        this.state = state;
        this.staticOBJ = staticOBJ;
        this.movingOBJ = movingOBJ;
        this.shootingOBJ = shootingOBJ;
    }

    enterState(prevState) {
        if (prevState === ('running' || 'walking')) {
            this.state.crossFadeFrom(this.movingOBJ, 0.5, true)
        } else if (prevState === 'standing') {
            this.state.crossFadeFrom(this.staticOBJ, 0.5, true);
        } else if (prevState === 'shooting') {
            this.state.crossFadeFrom(this.shootingOBJ, 0.5, true);
        }

        this.state.time = 0;
        this.state.enabled = true;
        this.state.setEffectiveTimeScale(1);
        this.state.setEffectiveWeight(1);
        this.state.setLoop(LoopOnce);
        this.state.play();
    }
}

class FullRelodingState {
    constructor(state, staticOBJ, movingOBJ, shootingOBJ) {
        this.state = state;
        this.staticOBJ = staticOBJ;
        this.movingOBJ = movingOBJ;
        this.shootingOBJ = shootingOBJ;
    }

    enterState(prevState) {
        if (prevState === ('running' || 'walking')) {
            this.state.crossFadeFrom(this.movingOBJ, 0.5, true)
        } else if (prevState === 'standing') {
            this.state.crossFadeFrom(this.staticOBJ, 0.5, true);
        } else if (prevState === 'shooting') {
            this.state.crossFadeFrom(this.shootingOBJ, 0.5, true);
        }

        this.state.time = 0;
        this.state.enabled = true;
        this.state.setEffectiveTimeScale(1);
        this.state.setEffectiveWeight(1);
        this.state.setLoop(LoopOnce);
        this.state.play();
    }
}