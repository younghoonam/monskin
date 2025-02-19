import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import gsap from "gsap";

const discDir = "./models/disc-animation.glb";
const shadeDiscDir = "./models/shadeDisc.glb";

// Example usage
const shadesData = [
  {
    title: "17C 아이보리 포슬린",
    rgb: { r: 245, g: 235, b: 225 },
    description:
      "밝고 쿨한 느낌의 아이보리 색상으로 맑고 깨끗한 톤을 표현합니다.",
    materialConfig: {
      color: new THREE.Color(245 / 255, 235 / 255, 225 / 255),
      metalness: 0.1,
      roughness: 0.8,
      reflectivity: 0.4,
    },
  },
  {
    title: "19N 페어 베이지",
    rgb: { r: 240, g: 224, b: 207 },
    description: "뉴트럴 톤의 밝은 베이지로, 투명하고 자연스러운 색상입니다.",
    materialConfig: {
      color: new THREE.Color(240 / 255, 224 / 255, 207 / 255),
      metalness: 0.1,
      roughness: 0.75,
      reflectivity: 0.5,
    },
  },
  {
    title: "21C 라이트 누드",
    rgb: { r: 235, g: 215, b: 200 },
    description:
      "쿨톤의 밝은 누드 컬러로 차분하면서도 자연스러운 피부 톤입니다.",
    materialConfig: {
      color: new THREE.Color(235 / 255, 215 / 255, 200 / 255),
      metalness: 0.2,
      roughness: 0.7,
      reflectivity: 0.5,
    },
  },
  {
    title: "21W 소프트 샌드",
    rgb: { r: 230, g: 210, b: 190 },
    description: "웜톤의 밝은 베이지로 따뜻한 느낌을 주는 색상입니다.",
    materialConfig: {
      color: new THREE.Color(230 / 255, 210 / 255, 190 / 255),
      metalness: 0.15,
      roughness: 0.65,
      reflectivity: 0.6,
    },
  },
  {
    title: "23N 내추럴 베이지",
    rgb: { r: 220, g: 200, b: 180 },
    description:
      "뉴트럴 톤의 중간 베이지로, 대부분의 피부 톤에 잘 맞는 클래식한 색상입니다.",
    materialConfig: {
      color: new THREE.Color(220 / 255, 200 / 255, 180 / 255),
      metalness: 0.2,
      roughness: 0.6,
      reflectivity: 0.65,
    },
  },
  {
    title: "23W 웜 허니",
    rgb: { r: 210, g: 185, b: 160 },
    description: "웜톤의 건강한 베이지 톤으로 따뜻함을 강조하는 색상입니다.",
    materialConfig: {
      color: new THREE.Color(210 / 255, 185 / 255, 160 / 255),
      metalness: 0.25,
      roughness: 0.5,
      reflectivity: 0.7,
    },
  },
  {
    title: "25N 골든 베이지",
    rgb: { r: 200, g: 170, b: 145 },
    description:
      "뉴트럴 톤의 골드빛 베이지로, 자연스러운 태닝된 피부를 표현합니다.",
    materialConfig: {
      color: new THREE.Color(200 / 255, 170 / 255, 145 / 255),
      metalness: 0.3,
      roughness: 0.45,
      reflectivity: 0.75,
    },
  },
  {
    title: "27W 탠 카라멜",
    rgb: { r: 180, g: 140, b: 110 },
    description:
      "웜톤의 깊은 카라멜 브라운으로 중간 톤의 피부에 잘 맞는 색상입니다.",
    materialConfig: {
      color: new THREE.Color(180 / 255, 140 / 255, 110 / 255),
      metalness: 0.35,
      roughness: 0.4,
      reflectivity: 0.8,
    },
  },
  {
    title: "31N 딥 아몬드",
    rgb: { r: 150, g: 110, b: 90 },
    description:
      "뉴트럴 톤의 깊고 부드러운 아몬드 브라운으로 어두운 피부 톤에 적합합니다.",
    materialConfig: {
      color: new THREE.Color(150 / 255, 110 / 255, 90 / 255),
      metalness: 0.4,
      roughness: 0.35,
      reflectivity: 0.85,
    },
  },
  {
    title: "33C 리치 에스프레소",
    rgb: { r: 90, g: 60, b: 50 },
    description:
      "쿨톤의 다크 브라운으로, 깊고 풍부한 어두운 피부 톤을 위한 색상입니다.",
    materialConfig: {
      color: new THREE.Color(90 / 255, 60 / 255, 50 / 255),
      metalness: 0.5,
      roughness: 0.3,
      reflectivity: 0.9,
    },
  },
];

const lineupProductsData = [
  {
    title: "MONSKIN 벨벳 쿠션",
    skinTypeExpression: "실키 매트",
    recommendedSkinType: "복합성, 지성",
    moistureLevel: 2,
    finishLevel: 4,
    thicknessLevel: 3,
  },
  {
    title: "MONSKIN 글로우 쿠션",
    skinTypeExpression: "광채 글로우",
    recommendedSkinType: "건성, 복합성",
    moistureLevel: 4,
    finishLevel: 3,
    thicknessLevel: 2,
  },
  {
    title: "MONSKIN 내추럴 쿠션",
    skinTypeExpression: "내추럴 피니시",
    recommendedSkinType: "모든 피부 타입",
    moistureLevel: 3,
    finishLevel: 3,
    thicknessLevel: 3,
  },
];

const shadeViewports = [],
  lineupViewports = [];
let renderer, shadeDiscGeometry, compactModel;
let shadeLoaded = false;
let compactLoaded = false;
const canvas = document.querySelector("#cardCanvas");

const loader = new GLTFLoader();
loader.load(shadeDiscDir, (glb) => {
  shadeDiscGeometry = glb.scene.children[0].geometry;
  shadeLoaded = true;
  if (compactLoaded) {
    init();
  }
});
loader.load(discDir, (glb) => {
  compactModel = glb.scene;
  compactModel.scale.multiplyScalar(25);
  console.log(compactModel);
  compactLoaded = true;
  if (shadeLoaded) {
    init();
  }
});

function init() {
  createShadeCards(shadesData);
  createLineupCard(lineupProductsData);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearAlpha(0);
  renderer.setAnimationLoop(animate);

  updateSize();
  window.addEventListener("resize", updateSize);

  initShadesGsap();
}

function animate() {
  renderer.domElement.style.transform = `translateY(${window.scrollY}px)`;

  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);

  renderViewports(shadeViewports);
  renderViewports(lineupViewports);
}

function initShadesGsap() {
  shadeViewports.forEach(({ scene, element }) => {
    const card = element.parentElement;
    const container = card.parentElement;

    const mesh = scene.children[0];
    gsap.to(mesh.rotation, {
      z: 3.14,
      duration: 0.8,
      scrollTrigger: {
        trigger: card,
        horizontal: true,
        start: "right right",
        end: "right center",
        scroller: container,
        toggleActions: "play play play reverse",
        // markers: true,
      },
    });
  });
}

function renderViewports(viewports) {
  viewports.forEach(function (viewport) {
    const element = viewport.element;
    const rect = element.getBoundingClientRect();
    // check if it's offscreen. If so skip it
    if (
      rect.bottom < 0 ||
      rect.top > renderer.domElement.clientHeight ||
      rect.right < 0 ||
      rect.left > renderer.domElement.clientWidth
    ) {
      return; // it's off screen
    }
    // set the viewport
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.render(viewport.scene, viewport.camera);
  });
}

function updateSize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
  }

  shadeViewports.forEach((viewport) => {
    viewport.camera.aspect =
      viewport.element.clientWidth / viewport.element.clientHeight;
    viewport.camera.updateProjectionMatrix();
  });

  lineupViewports.forEach((viewport) => {
    viewport.camera.aspect =
      viewport.element.clientWidth / viewport.element.clientHeight;
    viewport.camera.updateProjectionMatrix();
  });
}

function createShadeCards(shadeCardsData) {
  const sideScrollContainer = document.querySelector("#shadeCardContainer");

  shadeCardsData.forEach(({ title, description, materialConfig }) => {
    // Create shade-card container
    const shadeCard = document.createElement("div");
    shadeCard.classList.add("shade-card");

    // Create shade-canvas for Three.js scene
    const shadeViewportElement = document.createElement("div");
    shadeViewportElement.classList.add("shade-canvas", "border");
    shadeCard.appendChild(shadeViewportElement);

    // Create shade-card-title element
    const shadeCardTitle = document.createElement("div");
    shadeCardTitle.classList.add("shade-card-title");
    shadeCardTitle.textContent = title;
    shadeCard.appendChild(shadeCardTitle);

    // Create shade-card-description element
    const shadeCardDescription = document.createElement("div");
    shadeCardDescription.classList.add("shade-card-description");
    shadeCardDescription.textContent = description;
    shadeCard.appendChild(shadeCardDescription);

    // Append shade-card to the side-scroll container
    sideScrollContainer.appendChild(shadeCard);

    // Initialize Three.js scene for each shadeViewportElement
    shadeViewports.push(
      setupShadeViewport(shadeViewportElement, materialConfig)
    );
  });
}

function setupShadeViewport(element, material) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(15, 1, 1, 30);
  camera.position.set(0, 0, 18);

  const mesh = new THREE.Mesh(
    shadeDiscGeometry,
    new THREE.MeshStandardMaterial(material)
  );
  mesh.rotation.set(1, 0, 1);
  const hemisphereLight = new THREE.HemisphereLight(0xbbbbbb, 0x666666, 5);
  const directionalLight = new THREE.DirectionalLight(0xffdbac, 1.5);
  directionalLight.position.set(-1, 1, 1);

  scene.add(mesh);
  scene.add(hemisphereLight);
  scene.add(directionalLight);
  const viewport = {
    scene: scene,
    camera: camera,
    element: element,
  };
  return viewport;
}

function setupLineupViewports(element, material) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, 1, 1, 20);
  camera.position.set(0, 0, 10);

  const lineupProduct = compactModel.clone();
  console.log(lineupProduct);
  lineupProduct.rotation.set(0.6, 0, 0);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x666666, 5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(-1, 1, 1);

  scene.add(lineupProduct);
  scene.add(hemisphereLight);
  scene.add(directionalLight);
  const viewport = {
    scene: scene,
    camera: camera,
    element: element,
  };
  return viewport;
}

function createLineupCard(lineupCardsData) {
  const lineupContainer = document.querySelector("#lineupCardContainer");

  lineupCardsData.forEach(
    ({
      title,
      skinTypeExpression,
      recommendedSkinType,
      moistureLevel,
      finishLevel,
      thicknessLevel,
    }) => {
      // Create the lineup card container
      const lineupCard = document.createElement("div");
      lineupCard.classList.add("lineup-card");

      // Create the canvas element
      const lineupCanvas = document.createElement("div");
      lineupCanvas.classList.add("lineup-canvas");
      lineupCard.appendChild(lineupCanvas);

      // Create and set the title
      const lineupTitle = document.createElement("div");
      lineupTitle.classList.add("lineup-card-title");
      lineupTitle.textContent = title;
      lineupCard.appendChild(lineupTitle);

      // Create the lineup card table container
      const lineupCardTable = document.createElement("div");
      lineupCardTable.classList.add("lineup-card-table");

      // Function to add item and content pairs
      function addItem(itemText, contentText) {
        const item = document.createElement("div");
        item.classList.add("lineup-card-item");
        item.textContent = itemText;
        lineupCardTable.appendChild(item);

        const content = document.createElement("div");
        content.classList.add("lineup-card-content");
        content.textContent = contentText;
        lineupCardTable.appendChild(content);
      }

      // Add "피부 표현" and "추천 피부 타입" sections
      addItem("피부 표현", skinTypeExpression);
      addItem("추천 피부 타입", recommendedSkinType);

      // Function to add pills based on level
      function addPillRow(itemText, fillCount) {
        const item = document.createElement("div");
        item.classList.add("lineup-card-item");
        item.textContent = itemText;
        lineupCardTable.appendChild(item);

        const content = document.createElement("div");
        content.classList.add("lineup-card-content");

        // Create filled pills
        for (let i = 0; i < fillCount; i++) {
          const pill = document.createElement("div");
          pill.classList.add("pill", "pill-fill");
          content.appendChild(pill);
        }

        // Create empty pills (5 total minus filled pills)
        for (let i = fillCount; i < 5; i++) {
          const pill = document.createElement("div");
          pill.classList.add("pill");
          content.appendChild(pill);
        }

        lineupCardTable.appendChild(content);
      }

      // Add "촉촉함," "결정돈," and "두께감" pill sections
      addPillRow("촉촉함", moistureLevel);
      addPillRow("결정돈", finishLevel);
      addPillRow("두께감", thicknessLevel);

      // Append the table to the lineup card
      lineupCard.appendChild(lineupCardTable);

      lineupContainer.appendChild(lineupCard);

      lineupViewports.push(setupLineupViewports(lineupCanvas));
    }
  );
}
