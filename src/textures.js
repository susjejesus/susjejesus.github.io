import * as THREE from '../../modules/three.js-dev/build/three.module.js';

let loader = new THREE.TextureLoader();
const colorMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_albedo.png');
colorMap.wrapS = THREE.RepeatWrapping;
colorMap.wrapT = THREE.RepeatWrapping;
colorMap.repeat.set(10, 10);
const normalMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_normal.png');
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(10, 10);
// const displacementMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_height.png');
// displacementMap.wrapS = THREE.RepeatWrapping;
// displacementMap.wrapT = THREE.RepeatWrapping;
// displacementMap.repeat.set(10, 10);
const roughnessMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_roughness.png');
roughnessMap.wrapS = THREE.RepeatWrapping;
roughnessMap.wrapT = THREE.RepeatWrapping;
roughnessMap.repeat.set(10, 10);
const aoMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_ao.png');
aoMap.wrapS = THREE.RepeatWrapping;
aoMap.wrapT = THREE.RepeatWrapping;
aoMap.repeat.set(10, 10);
const metallicMap = loader.load('./resources/textures/floor/TexturesCom_Fabric_SciFi7_512_metallic.png');
metallicMap.wrapS = THREE.RepeatWrapping;
metallicMap.wrapT = THREE.RepeatWrapping;
metallicMap.repeat.set(10, 10);

colorMap.encoding = THREE.sRGBEncoding;

const materials = {
    colorMap: colorMap,
    normalMap: normalMap,
    // displacementMap: displacementMap,
    roughnessMap: roughnessMap,
    aoMap: aoMap,
    metallicMap: metallicMap
}

const colorMap2 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_albedo.png');
colorMap2.wrapS = THREE.RepeatWrapping;
colorMap2.wrapT = THREE.RepeatWrapping;
colorMap2.repeat.set(3, 1);
const normalMap2 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_normal.png');
normalMap2.wrapS = THREE.RepeatWrapping;
normalMap2.wrapT = THREE.RepeatWrapping;
normalMap2.repeat.set(3, 1);
// const displacementMap2 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_height.png');
// displacementMap2.wrapS = THREE.RepeatWrapping;
// displacementMap2.wrapT = THREE.RepeatWrapping;
// displacementMap2.repeat.set(3, 1);
// const roughnessMap2 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_roughness.png');
// roughnessMap2.wrapS = THREE.RepeatWrapping;
// roughnessMap2.wrapT = THREE.RepeatWrapping;
// roughnessMap2.repeat.set(3, 1);
const aoMap2 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_ao.png');
aoMap2.wrapS = THREE.RepeatWrapping;
aoMap2.wrapT = THREE.RepeatWrapping;
aoMap2.repeat.set(3, 1);

colorMap2.encoding = THREE.sRGBEncoding;

const materials2 = {
    colorMap: colorMap2,
    normalMap: normalMap2,
    // displacementMap: displacementMap2,
    // roughnessMap: roughnessMap2,
    aoMap: aoMap2,
};

const colorMap3 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_albedo.png');
colorMap3.wrapS = THREE.RepeatWrapping;
colorMap3.wrapT = THREE.RepeatWrapping;
colorMap3.repeat.set(3, 1);
const normalMap3 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_normal.png');
normalMap3.wrapS = THREE.RepeatWrapping;
normalMap3.wrapT = THREE.RepeatWrapping;
normalMap3.repeat.set(3, 1);
// const displacementMap3 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_height.png');
// displacementMap3.wrapS = THREE.RepeatWrapping;
// displacementMap3.wrapT = THREE.RepeatWrapping;
// displacementMap3.repeat.set(3, 1);
// const roughnessMap3 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_roughness.png');
// roughnessMap3.wrapS = THREE.RepeatWrapping;
// roughnessMap3.wrapT = THREE.RepeatWrapping;
// roughnessMap3.repeat.set(3, 1);
const aoMap3 = loader.load('./resources/textures/brick/TexturesCom_Brick_Rustic2_1K_ao.png');
aoMap3.wrapS = THREE.RepeatWrapping;
aoMap3.wrapT = THREE.RepeatWrapping;
aoMap3.repeat.set(3, 1);

colorMap3.encoding = THREE.sRGBEncoding;

colorMap3.rotation = 1.6;
normalMap3.rotation = 1.6;
// displacementMap3.rotation = 1.6;
// roughnessMap3.rotation = 1.6;
aoMap3.rotation = 1.6;

const materials3 = {
    colorMap: colorMap3,
    normalMap: normalMap3,
    // displacementMap: displacementMap3,
    // roughnessMap: roughnessMap3,
    aoMap: aoMap3,
};

export const threeJSfloorMaterial = new THREE.MeshStandardMaterial({ 
    map: materials.colorMap,
    normalMap: materials.normalMap,
    // displacementMap: materials.displacementMap,
    // displacementScale: 0.01,
    // roughnessMap: materials.roughnessMap,
    // roughness: 0.01,
    aoMap: materials.aoMap,
    metalnessMap: materials.metallicMap
});

export const threeJSbrickMaterial = new THREE.MeshStandardMaterial({
    map: materials2.colorMap,
    normalMap: materials2.normalMap,
    // displacementMap: materials2.displacementMap,
    // displacementScale: 0.01,
    // roughnessMap: materials2.roughnessMap,
    // roughness: 0.02,
    aoMap: materials2.aoMap,
});

export const threeJSbrickMaterial2 = new THREE.MeshStandardMaterial({
    map: materials3.colorMap,
    normalMap: materials3.normalMap,
    // displacementMap: materials3.displacementMap,
    // displacementScale: 0.01,
    // roughnessMap: materials3.roughnessMap,
    // roughness: 0.02,
    aoMap: materials3.aoMap,
});