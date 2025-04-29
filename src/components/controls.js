export class ControlsManager {
  constructor(
    dominoManager,
    shaderManager,
    scene,
    dominoCount,
    dominoSpacing,
    dominoProps
  ) {
    this.dominoManager = dominoManager;
    this.shaderManager = shaderManager;
    this.scene = scene;
    this.dominoCount = dominoCount;
    this.dominoSpacing = dominoSpacing;
    this.dominoProps = dominoProps;

    this.arrangementDisplay = document.querySelector(".arrangement-display");
    this.shadingDisplay = document.querySelector(".shading-display");

    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "s" || event.key === "S") {
        const newArrangement = this.dominoManager.switchArrangement(
          this.scene,
          this.dominoCount,
          this.dominoSpacing,
          this.dominoProps
        );
        this.updateArrangementUI(newArrangement);
      }

      if (event.key === "g" || event.key === "G") {
        const newShading = this.shaderManager.toggleShading();
        this.updateShadingUI(newShading);
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
}