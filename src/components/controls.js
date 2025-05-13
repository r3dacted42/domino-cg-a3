export class ControlsManager {
  constructor(
    dominoManager,
    shaderManager,
    scene,
    dominoCount,
    dominoSpacing,
    dominoProps,
    lightingManager
  ) {
    this.dominoManager = dominoManager;
    this.shaderManager = shaderManager;
    this.scene = scene;
    this.dominoCount = dominoCount;
    this.dominoSpacing = dominoSpacing;
    this.dominoProps = dominoProps;
    this.lightingManager = lightingManager;

    this.arrangementDisplay = document.querySelector(".arrangement-display");
    this.shadingDisplay = document.querySelector(".shading-display");
    this.lightingDisplay = document.querySelector(".lighting-display");
    this.helpersDisplay = document.querySelector(".helpers-display");

    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    window.addEventListener("keydown", (event) => {
      // Toggle arrangement (S key)
      if (event.key === "s" || event.key === "S") {
        const newArrangement = this.dominoManager.switchArrangement(
          this.scene,
          this.dominoCount,
          this.dominoSpacing,
          this.dominoProps
        );
        this.updateArrangementUI(newArrangement);
      }

      // Toggle shading model (G key)
      if (event.key === "g" || event.key === "G") {
        const newShading = this.shaderManager.toggleShading();
        this.updateShadingUI(newShading);
      }
      
      // Cycle lighting mode (L key)
      if (event.key === "l" || event.key === "L") {
        const newLightCount = this.lightingManager.cycleLightingMode();
        this.updateLightingUI(newLightCount);
      }
      
      // Toggle light helpers (H key)
      if (event.key === "h" || event.key === "H") {
        const helpersVisible = this.lightingManager.toggleHelpers();
        this.updateHelpersUI(helpersVisible);
      }
    });
  }

  updateArrangementUI(arrangement) {
    if (this.arrangementDisplay) {
      this.arrangementDisplay.textContent = `${
        arrangement === "uniform" ? "Uniform" : "Non-uniform"
      }`;
    }
  }
  
  updateShadingUI(shading) {
    if (this.shadingDisplay) {
      this.shadingDisplay.textContent = `${
        shading.charAt(0).toUpperCase() + shading.slice(1)
      }`;
    }
  }
  
  updateLightingUI(lightCount) {
    if (this.lightingDisplay) {
      this.lightingDisplay.textContent = lightCount.toString();
    }
  }
  
  updateHelpersUI(helpersVisible) {
    if (this.helpersDisplay) {
      this.helpersDisplay.textContent = helpersVisible ? "On" : "Off";
    }
  }
}