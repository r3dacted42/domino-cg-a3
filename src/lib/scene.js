import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  constructor(container) {
    this.container = container || document.createElement('div');
    if (!container) {
      this.container.classList.add('app-container');
      document.body.appendChild(this.container);
    }
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.setupEventListeners();
    this.floor = null;
    this.shaderManager = null;
    this.lightingManager = null;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1, 
      1000 
    );
    this.camera.position.set(0, 3, 10);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();
  }

  setShaderManager(shaderManager) {
    this.shaderManager = shaderManager;
  }
  
  setLightingManager(lightingManager) {
    this.lightingManager = lightingManager;
  }

  addFloor(shaderManager) {
    if (this.floor) {
      this.scene.remove(this.floor);
    }
    
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = shaderManager ? 
      shaderManager.createFloorMaterial(0xdedede, 0.8, 0.2) :
      new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.8, metalness: 0.2 });
    
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2; 
    this.floor.position.y = -1.0; 
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
    
    if (shaderManager) {
      shaderManager.registerMesh(this.floor, true);
    }
    return this.floor;
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  
  render() {
    this.controls.update();
    
    if (this.shaderManager) {
      this.shaderManager.updateUniforms();
    }
    
    if (this.lightingManager) {
      this.lightingManager.updateLightHelpers();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  stop() {
    this.renderer.setAnimationLoop(null);
  }
}