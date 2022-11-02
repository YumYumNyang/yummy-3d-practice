import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
let matcapTextures = [];
matcapTextures.push(textureLoader.load("textures/matcaps/yellow.png"));
matcapTextures.push(textureLoader.load("textures/matcaps/white.png"));
matcapTextures.push(textureLoader.load("textures/matcaps/purple.png"));
matcapTextures.push(textureLoader.load("textures/matcaps/blue.png"));

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let donuts = [];
fontLoader.load("/fonts/Rubik_Mono_One_Regular.json", (font) => {
	// Material
	let materials = [];
	matcapTextures.forEach((texture) => {
		materials.push(new THREE.MeshMatcapMaterial({ matcap: texture }));
	});

	// Text
	const textGeometry = new TextGeometry(" YUM\n YUM\nNYANG", {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 30,
		bevelEnabled: true,
		bevelThickness: 0.15,
		bevelSize: 0.08,
		bevelOffset: 0.01,
		bevelSegments: 24,
	});
	textGeometry.center();

	const text = new THREE.Mesh(textGeometry, materials[0]);
	scene.add(text);

	// Donuts
	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

	for (let i = 0; i < 150; i++) {
		const donut = new THREE.Mesh(donutGeometry, materials[i % 4]);
		donut.position.x = (Math.random() - 0.5) * 10;
		donut.position.y = (Math.random() - 0.5) * 10;
		donut.position.z = (Math.random() - 0.5) * 10;
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		const anim = Math.random() * 0.1;
		donuts.push({ obj: donut, anim: anim });
		scene.add(donut);
	}
});

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

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = clock.getDelta();
	// Update controls
	controls.update();

	donuts.forEach((donut) => {
		donut.obj.position.y += Math.sin(elapsedTime) * 0.01 * donut.anim;
		donut.obj.rotation.y = elapsedTime * donut.anim * Math.PI;
		donut.obj.rotation.x = elapsedTime * donut.anim * Math.PI;
	});
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
