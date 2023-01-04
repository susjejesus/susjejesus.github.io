import { Euler, Vector3 } from "../../../../modules/three.js-dev/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/controls/PointerLockControls.js";

export default class CameraController {
    constructor(camera, renderer, object) {
        this.camera = camera;
        this.renderer = renderer;
        this.object = object;

        this.camPos = new Vector3();

        // camera head bob effect
        this.applyHeadBob = true;
        this.headBob = 0.5;
        this.decreaseHeadBob = false;
        this.currentHeadBob = 0.25;
        this.normalHeadBob = 0.25;
        this.headBobSpeed = 0.02;

        // camera fov
        this.normalFOV = 80;
        this.maxFOV = 95;
        this.ironSightsAimingFOV = 75;
        this.cameraFOVchangeSpeed = 1;
        this.cameraFOVaimingChangeSpeed = 2;

        // recoil setup
        this.euler = new Euler(0, 0, 0, 'YXZ');

        this.init();
    }

    init() {
        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        document.addEventListener('click', () => {
            this.controls.lock();
        });
    }

    update() {
        this.updateCamPos();
    }

    updateCamPos() {
        this.camPos.set(this.object.getGhostObject().getWorldTransform().getOrigin().x(), (this.object.getGhostObject().getWorldTransform().getOrigin().y() + 2.1) + this.currentHeadBob, this.object.getGhostObject().getWorldTransform().getOrigin().z());
        this.camera.position.copy(this.camPos);
    }

    calculateHeadBob() {
        if (this.applyHeadBob) {
            // Update the current head bob
            if (this.currentHeadBob < this.headBob && this.decreaseHeadBob == false) {
                this.currentHeadBob += this.headBobSpeed;
            } else if (this.currentHeadBob >= this.headBob || this.decreaseHeadBob) {
                this.decreaseHeadBob = true;
                this.currentHeadBob -= this.headBobSpeed;
            }

            // Don't decrease if headbob is less than or equal to 0
            if (this.currentHeadBob <= 0) {
                this.decreaseHeadBob = false;
            }
        } else {
            this.currentHeadBob = this.normalHeadBob;
        }
    }

    normalizeHeadBob() {
        if (this.applyHeadBob) {
            // If the headbob is more or less than 0.1 normalize it else do nothing
            if (this.currentHeadBob > this.normalHeadBob) {
                this.currentHeadBob -= this.headBobSpeed;
            } else if (this.currentHeadBob < this.normalHeadBob) {
                this.currentHeadBob += this.headBobSpeed;
            }
        } else {
            this.currentHeadBob = this.normalHeadBob;
        }
    }

    increaseFOV() {
        if (this.camera.fov < this.maxFOV) {
            this.camera.fov += this.cameraFOVchangeSpeed;
        } else if (this.camera.fov > this.maxFOV) {
            this.camera.fov -= this.cameraFOVchangeSpeed;
        }
        this.camera.updateProjectionMatrix();
    }

    decreaseFOV() {
        if (this.camera.fov > this.normalFOV) {
            this.camera.fov -= this.cameraFOVchangeSpeed;
        } else if (this.camera.fov < this.normalFOV) {
            this.camera.fov += this.cameraFOVaimingChangeSpeed;
        }
        this.camera.updateProjectionMatrix();
    }

    aimingFOV() {
        if (this.camera.fov > this.ironSightsAimingFOV) {
            this.camera.fov -= this.cameraFOVaimingChangeSpeed;
        }
        this.camera.updateProjectionMatrix();
    }

    increaseVerticleRecoil(value, increaseBy, totalIncrease, timeInterval) {
        let x = 0;
        let recoilInterval = window.setInterval(() => {

            this.euler.setFromQuaternion(this.camera.quaternion);

            if (this.euler.x != this.euler.x + value) this.euler.x += increaseBy;

            this.euler.x = Math.max((Math.PI / 2) - (Math.PI), Math.min((Math.PI / 2) - (0), this.euler.x))

            this.camera.quaternion.setFromEuler(this.euler);

            x += 1;

            if (x >= totalIncrease) {
                window.clearInterval(recoilInterval);
            }
        }, timeInterval, false);
    }
}