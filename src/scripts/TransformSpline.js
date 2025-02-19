// Imports
import * as THREE from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
// import * as Utils from "./Utils.js";
// import { max } from "three/webgpu";

// Constants for actions
const ACTION_SELECT = 1;
const ACTION_NONE = 0;

const scrollContainer = document.querySelector(".snap-container");

class TransformSpline {
  constructor(model, positionPoints, rotationPoints, camera, canvas, scene) {
    // Model and Scene References
    this.model = model;
    this.camera = camera;
    this.canvas = canvas;
    this.scene = scene;

    this.positionPoints = positionPoints;
    this.posSectionRange = [];
    this.numOfPosSections = 0;
    for (let index = 0; index < this.positionPoints.length; index++) {
      const element = this.positionPoints[index];
      if (element.keyframe) {
        this.numOfPosSections++;
      }
    }
    for (let index = 0; index < this.numOfPosSections; index++) {
      const element = this.positionPoints[index];
      if (element.keyframe) {
        this.posSectionRange.push(
          new Object({
            min: index * (1 / this.numOfPosSections),
            max: (index + 1) * (1 / this.numOfPosSections),
          })
        );
      } else {
        this.posSectionRange[index - 1].max += 1 / this.numOfPosSections;
      }
    }

    this.rotationPoints = rotationPoints;
    this.rotSectionRange = [];
    this.numOfRotSections = 0;
    for (let index = 0; index < this.rotationPoints.length; index++) {
      const element = this.rotationPoints[index];
      if (element.keyframe) {
        this.numOfRotSections++;
      }
    }
    for (let index = 0; index < this.numOfRotSections; index++) {
      const element = this.rotationPoints[index];
      if (element.keyframe) {
        this.rotSectionRange.push(
          new Object({
            min: index * (1 / this.numOfRotSections),
            max: (index + 1) * (1 / this.numOfRotSections),
          })
        );
      } else {
        this.rotSectionRange[index - 1].max += 1 / this.numOfRotSections;
      }
    }

    // Transform Spline Configuration
    this.curveHandles = [];
    this.lerpValue = 0.1;
    this.action = ACTION_NONE;
    this.initCurves(positionPoints, rotationPoints);

    // Visual elements
    this.positionLine = this.createPositionLine();
    this.initRaycaster();
    this.addScrollListener();
  }

  addKeyframes(keyframe) {
    this.keyframe = keyframe;
    this.updateTargetTransformKeyframe(
      this.keyframe.currentSection,
      this.keyframe.progress[this.keyframe.currentSection]
    );
  }

  // Initialize position and rotation splines
  initCurves(positionPoints, rotationPoints) {
    this.createHandles(positionPoints);
    this.positionSpline = new THREE.CatmullRomCurve3(
      this.curveHandles.map((handle) => handle.position)
    );
    this.rotationSpline = new THREE.CatmullRomCurve3(
      rotationPoints.map(
        (point) => new THREE.Vector3(point.x, point.y, point.z)
      )
    );
    this.targetPosition = new THREE.Vector3();
    this.targetQuaternion = new THREE.Quaternion();
    this.targetRotation = new THREE.Euler();
  }

  // Create visual handles for each position point
  createHandles(positionPoints) {
    positionPoints.forEach((handlePos) => {
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x666666 })
      );
      handle.position.copy(handlePos);
      this.curveHandles.push(handle);
    });
  }

  // Create a position line to visualize the spline path
  createPositionLine() {
    const numOfPoints = 50;
    const points = this.positionSpline.getPoints(numOfPoints);
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x3333ff })
    );
  }

  // Initialize raycaster and controls
  initRaycaster() {
    this.mouse = new THREE.Vector2();
    this.rayCaster = new THREE.Raycaster();
    this.control = new TransformControls(this.camera, this.canvas);

    // Update geometry on drag end
    this.control.addEventListener("dragging-changed", (event) => {
      if (!event.value) this.updateLineGeometry();
    });

    // Mouse event listener for selection
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  // Update line geometry after dragging
  updateLineGeometry() {
    const points = this.positionSpline.getPoints(50);
    this.positionLine.geometry.setFromPoints(points);
  }

  // Handle mouse down event for selecting objects
  handleMouseDown(event) {
    this.action = ACTION_SELECT;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Update transform controls for raycasting selection
  updateTransformControls() {
    if (this.action === ACTION_SELECT) {
      this.rayCaster.setFromCamera(this.mouse, this.camera);
      this.action = ACTION_NONE;

      const intersects = this.rayCaster.intersectObjects(
        this.curveHandles,
        false
      );
      if (intersects.length) {
        const target = intersects[0].object;
        this.control.attach(target);
        this.scene.add(this.control.getHelper());
      }
    }
  }

  // Update target transform based on scroll progress
  updateTargetTransform(posProgress, rotProgress) {
    // console.log(posProgress, rotProgress);
    this.targetPosition.copy(this.positionSpline.getPoint(posProgress));
    this.targetRotation.setFromVector3(
      this.rotationSpline.getPoint(rotProgress)
    );
    this.targetQuaternion.setFromEuler(this.targetRotation);
  }

  updateTargetTransformKeyframe(section, unMappedprogress) {
    // console.log(section, unMappedprogress);
    const sectionIndex = Math.min(this.numOfPosSections - 2, section);

    const mappedPosMin = this.posSectionRange[sectionIndex].min;
    const mappedPosMax = this.posSectionRange[sectionIndex].max;

    const mappedPosProgress = THREE.MathUtils.mapLinear(
      unMappedprogress,
      0,
      1,
      mappedPosMin,
      mappedPosMax
    );

    const mappedRotMin = this.rotSectionRange[sectionIndex].min;
    const mappedRotMax = this.rotSectionRange[sectionIndex].max;

    const mappedRotProgress = THREE.MathUtils.mapLinear(
      unMappedprogress,
      0,
      1,
      mappedRotMin,
      mappedRotMax
    );

    this.updateTargetTransform(mappedPosProgress, mappedRotProgress);
  }

  // Smoothly update the model's position and rotation
  updateModelTransform() {
    this.model.position.lerp(this.targetPosition, this.lerpValue);
    this.model.quaternion.slerp(this.targetQuaternion, this.lerpValue);
  }

  // Add handles and the position line to the scene
  addHandlesToScene() {
    this.curveHandles.forEach((handle) => this.scene.add(handle));
    this.scene.add(this.positionLine);
  }

  // Remove handles and control helper from the scene
  removeHandlesFromScene() {
    this.curveHandles.forEach((handle) => this.scene.remove(handle));
    this.scene.remove(this.positionLine);
    this.scene.remove(this.control.getHelper());
  }

  // Add scroll listener for updating transform based on scroll position
  addScrollListener() {
    scrollContainer.addEventListener("scroll", () => {
      // this.updateTargetTransform(Utils.getScrollProgress());
      this.updateTargetTransformKeyframe(
        this.keyframe.currentSection,
        this.keyframe.progress[this.keyframe.currentSection]
      );
    });
  }

  // Main update loop to update both model transform and transform controls
  update() {
    this.updateModelTransform();
    this.updateTransformControls();
  }

  // Accessor for position spline points
  getPositionPoints() {
    return this.positionSpline.points;
  }
}

export { TransformSpline };
