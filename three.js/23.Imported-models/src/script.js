import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
let mixer = null;

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
	mixer = new THREE.AnimationMixer(gltf.scene);
	const action = mixer.clipAction(gltf.animations[2]);
	action.play();

	gltf.scene.scale.set(0.025, 0.025, 0.025);
	scene.add(gltf.scene);
	// const children = [...gltf.scene.children];

	// for (const child of children) {
	// 	scene.add(child);
	// }
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

const directionalLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(directionalLight);

gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);

/**
 * Floor
 */

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: "#444444",
		metalness: 0,
		roughness: 0.5,
	})
);
floor.rotation.x = -0.5 * Math.PI;
scene.add(floor);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (_e) => {
	mouse.x = (_e.clientX / sizes.width) * 2 - 1;
	mouse.y = -(_e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
	if (currentIntersect) {
		switch (currentIntersect.object) {
			case object1:
				console.log("click on object 1");
				break;
			case object2:
				console.log("click on object 2");
				break;
			case object3:
				console.log("click on object 3");
				break;
		}
		console.log("click on sphere");
	}
});
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Update mixer
	mixer?.update(deltaTime);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
