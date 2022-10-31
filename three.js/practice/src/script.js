import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import * as lil from "lil-gui";
import { NearestFilter } from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
	"textures/meadow/px.png",
	"textures/meadow/nx.png",
	"textures/meadow/py.png",
	"textures/meadow/ny.png",
	"textures/meadow/pz.png",
	"textures/meadow/nz.png",
]);

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;
material.envMap = environmentMapTexture;
material.envMapIntensity = 1;
environmentMapTexture.magFilter = NearestFilter;
scene.background = environmentMapTexture;

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 128), material);
// scene.add(sphere);

let drops = [];
for (let i = 0; i < 200; i++) {
	const radius = Math.floor(Math.random() * 10000) * 0.0001 + 0.8;
	const x = Math.random() * 80 - 50;
	const y = Math.random() * 100 - 20;
	const z = Math.random() * 80 - 40;

	const drop = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 128, 128),
		material
	);
	drop.position.set(x, y, z);
	drops.push({
		obj: drop,
		anim: -Math.floor(Math.random() * 100) * 0.001,
	});
	scene.add(drop);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 40;
pointLight.position.y = 40;
pointLight.position.z = 40;
scene.add(pointLight);

const gui = new lil.GUI();

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0.1;
camera.position.y = 0;
camera.position.z = 0.1;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

// controls.lookSpeed = 0.1;
// controls.movementSpeed = 10;

const renderer = new THREE.WebGL1Renderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	drops.forEach((drop) => {
		drop.obj.position.y += Math.sin(elapsedTime * 0.3) * drop.anim;
	});

	controls.update();

	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
