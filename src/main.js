import './style.css';
import { SceneManager } from './lib/scene';
import { LightingManager } from './lib/lighting.js';
import { DominoManager } from './components/domino';
import { ShaderManager } from './components/shaders';
import { setupControls } from './components/tweakingfr.js';

class App {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('app-container');
    document.body.appendChild(this.container);
    
    // Initialize the scene and managers
    this.sceneManager = new SceneManager(this.container);
    this.shaderManager = new ShaderManager();
    this.lightingManager = new LightingManager(this.sceneManager.scene);
    
    // Connect managers and add floor
    this.shaderManager.setLights(this.lightingManager.getLights());
    this.sceneManager.setShaderManager(this.shaderManager);
    this.sceneManager.setLightingManager(this.lightingManager);
    this.sceneManager.addFloor(this.shaderManager);
    
    // Initialize domino manager with shader manager
    this.dominoManager = new DominoManager(this.shaderManager);
    
    this.dominoProps = {
      width: 0.8,
      height: 2.0,
      depth: 0.3,
    };
    
    this.dominoCount = 9;
    this.dominoSpacing = 1.5;
    
    // Add sample sphere (initially hidden) and register with domino manager
    const sampleSphere = this.sceneManager.addSampleSphere(this.shaderManager, false);
    this.dominoManager.registerExtraMesh(sampleSphere);
    
    // Create initial domino arrangement
    this.dominoManager.createDominoLine(
      this.sceneManager.scene,
      this.dominoCount, 
      this.dominoSpacing,
      this.dominoProps
    );
    
    // Update sample sphere to match a middle domino's material
    const midDominoIndex = Math.floor(this.dominoCount / 2);
    this.dominoManager.updateSampleSphere(sampleSphere, midDominoIndex);

    setupControls(
      this.dominoManager,
      this.shaderManager,
      this.sceneManager.scene,
      this.dominoCount,
      this.dominoSpacing,
      this.dominoProps,
      this.lightingManager,
      this.sceneManager
    );
    
    // Start animation loop
    this.sceneManager.animate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});