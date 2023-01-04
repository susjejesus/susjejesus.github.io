import Weapon from "./weapon";

export default class WeaponSystem {
    constructor(scene, object, camera, mainGun, pistol) {
        this.scene = scene;
        this.object = object;
        this.camera = camera;

        this.mainGun = mainGun;
        this.pistol = pistol;

        this.pistolMaxAmmo = 17;
        this.pistolTotalAmmo = 119;
        this.pistolAmmo = 17;
        this.shoot = 0;
    }

    init() {
        this.weapon = new Weapon(this.scene, this.object, this.camera);
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
}