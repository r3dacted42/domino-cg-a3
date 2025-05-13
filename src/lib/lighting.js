import * as THREE from 'three';

export class LightingManager {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    this.lightHelpers = [];
    this.lightingMode = 1; // Number of active lights (1, 2, or 3)
    this.helpersVisible = true; // Track helper visibility
    this.setupLighting();
  }

  setupLighting() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Primary light (always active)
    const primaryLight = new THREE.DirectionalLight(0xffffff, 0.8);
    primaryLight.position.set(5, 10, 7);
    primaryLight.castShadow = true;
    
    primaryLight.shadow.mapSize.width = 2048;
    primaryLight.shadow.mapSize.height = 2048;
    primaryLight.shadow.camera.near = 0.5;
    primaryLight.shadow.camera.far = 50;
    
    this.optimizeShadowFrustum(primaryLight, 10);
    
    this.scene.add(primaryLight);
    this.lights.push(primaryLight);
    
    // Create helper for primary light
    const primaryHelper = new THREE.DirectionalLightHelper(primaryLight, 1);
    this.scene.add(primaryHelper);
    this.lightHelpers.push(primaryHelper);
    
    // Secondary light
    const secondaryLight = new THREE.DirectionalLight(0xffa500, 0.6); // Orange light
    secondaryLight.position.set(-5, 8, -7);
    secondaryLight.castShadow = true;
    secondaryLight.shadow.mapSize.width = 1024;
    secondaryLight.shadow.mapSize.height = 1024;
    this.optimizeShadowFrustum(secondaryLight, 10);
    this.scene.add(secondaryLight);
    this.lights.push(secondaryLight);
    
    // Create helper for secondary light
    const secondaryHelper = new THREE.DirectionalLightHelper(secondaryLight, 1);
    this.scene.add(secondaryHelper);
    this.lightHelpers.push(secondaryHelper);
    
    // Third light (blue accent light)
    const accentLight = new THREE.DirectionalLight(0x0088ff, 0.4); // Blue light
    accentLight.position.set(7, 6, -4);
    this.scene.add(accentLight);
    this.lights.push(accentLight);
    
    // Create helper for accent light
    const accentHelper = new THREE.DirectionalLightHelper(accentLight, 1);
    this.scene.add(accentHelper);
    this.lightHelpers.push(accentHelper);
    
    // Initially set lighting mode
    this.setLightingMode(this.lightingMode);
  }

  optimizeShadowFrustum(light, size) {
    light.shadow.camera.left = -size;
    light.shadow.camera.right = size;
    light.shadow.camera.top = size;
    light.shadow.camera.bottom = -size;
  }

  getLights() {
    return this.lights;
  }
  
  setLightingMode(mode) {
    this.lightingMode = mode;
    
    // Primary light (index 1) is always visible
    
    // Toggle secondary light (index 2)
    if (this.lights[2]) {
      this.lights[2].visible = mode >= 2;
      if (this.lightHelpers[1]) this.lightHelpers[1].visible = mode >= 2 && this.helpersVisible;
    }
    
    // Toggle accent light (index 3)
    if (this.lights[3]) {
      this.lights[3].visible = mode >= 3;
      if (this.lightHelpers[2]) this.lightHelpers[2].visible = mode >= 3 && this.helpersVisible;
    }
    
    return this.lightingMode;
  }
  
  cycleLightingMode() {
    // Cycle through 1, 2, 3 lights
    const newMode = (this.lightingMode % 3) + 1;
    return this.setLightingMode(newMode);
  }
  
  toggleHelpers() {
    this.helpersVisible = !this.helpersVisible;
    
    // Update all helpers visibility
    for (let i = 0; i < this.lightHelpers.length; i++) {
      // For the primary light helper (index 0), always follow the helpersVisible flag
      if (i === 0) {
        this.lightHelpers[i].visible = this.helpersVisible;
      } 
      // For secondary light helper (index 1), check if light is active (mode >= 2)
      else if (i === 1) {
        this.lightHelpers[i].visible = this.helpersVisible && this.lightingMode >= 2;
      } 
      // For accent light helper (index 2), check if light is active (mode >= 3)
      else if (i === 2) {
        this.lightHelpers[i].visible = this.helpersVisible && this.lightingMode >= 3;
      }
    }
    
    return this.helpersVisible;
  }
  
  updateLightHelpers() {
    this.lightHelpers.forEach(helper => {
      if (helper && helper.update) {
        helper.update();
      }
    });
  }
}