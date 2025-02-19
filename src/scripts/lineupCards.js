const lineupContainer = document.querySelector("#lineupCardContainer");

const lineupProducts = [
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

lineupProducts.forEach((product) => {
  const card = createLineupCard(
    product.title,
    product.skinTypeExpression,
    product.recommendedSkinType,
    product.moistureLevel,
    product.finishLevel,
    product.thicknessLevel
  );
  lineupContainer.appendChild(card); // Append each generated card to the container
});

lineupContainer.body.appendChild(card); // Or use any other container

function createLineupCard(
  title,
  skinTypeExpression,
  recommendedSkinType,
  moistureLevel,
  finishLevel,
  thicknessLevel
) {
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

  return lineupCard;
}
// Example usage:
