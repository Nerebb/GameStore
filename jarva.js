const API_URL = "https://cs-steam-game-api.herokuapp.com/";

//get Url
function getUrl(param1, appid) {
  return `https://cs-steam-game-api.herokuapp.com/${param1}${appid}`;
}

//getData
const getData = async (link) => {
  try {
    const res = await fetch(link);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("getData", error);
  }
};

//Main Url
const urlAllGames = getUrl("games", "");
const urlGenresList = getUrl("genres", "");
const urlTagsList = getUrl("steamspy-tags", "");

let appId = "";
const urlGameDetail = getUrl("single-game", `/:${appId}`);
const urlFeaturedGames = getUrl("features", "");
let checkbox;
Promise.all([
  getData(urlAllGames),
  getData(urlGenresList),
  getData(urlTagsList),
  getData(urlFeaturedGames),
]).then((allData) => {
  dataAllGames = allData[0];
  dataGenresList = allData[1];
  dataTagsList = allData[2];
  dataFeatureGame = allData[3];

  renderImgFeatureGame(),
    renderImgAllGame(),
    renderCategories(),
    renderPlatform(),
    renderTypes(),
    console.log("dataAllGames", dataAllGames);
  console.log("dataGenresList", dataGenresList);
  console.log("dataTags", dataTagsList);
  console.log("dataFeatureGame", dataFeatureGame);
});

//Global variable
//search-field
const categories = document.querySelector(".search-fields.Categories");
const platform = document.querySelector(".search-fields.Platform");
const gameTags = document.querySelector(".search-fields.GameTags");
const gameTypes = document.querySelector(".search-fields.GameType");
const inputMinPrice = document.querySelector(".input-pricebox.Min");
const inputMaxPrice = document.querySelector(".input-pricebox.Max");

//Game frontpage
const featureGames = document.querySelector(".gameFrontPage");
const randomAllGames = document.querySelector(".gameList");
const ulImgFeatureGame = document.querySelector(".ulgameFrontPage");

const renderImgFeatureGame = async () => {
  try {
    dataFeatureGame.data.forEach((urlImg) => {
      const liImgFeatureGame = document.createElement("li");
      liImgFeatureGame.innerHTML = `<img class="imgFrontPage" src=${urlImg.header_image} alt="FeatureGame"/>`;
      ulImgFeatureGame.appendChild(liImgFeatureGame);
    });
  } catch (error) {
    console.log("renderImgFeatureGame", error);
  }
};

//RandomNum 1 - maxNum:
function randomNum(maxNum) {
  return Math.floor(Math.random() * (maxNum + 1));
}

//All game list
const renderImgAllGame = async () => {
  try {
    const randomIdxes = [];
    while (randomIdxes.length < 3) {
      let randomIdx = randomNum(9);
      while (randomIdxes.includes(randomIdx)) {
        randomIdx = randomNum(9);
      }
      randomIdxes.push(randomIdx);
    }
    const randomGames = randomIdxes.map((idx) => dataAllGames.data[idx]);

    randomAllGames.innerHTML = "";
    randomGames.forEach((key) => {
      const liAllGame = document.createElement("li");
      liAllGame.classList.add("gameDescript");
      const priceTag = key.price === 0 ? "Free" : `$${key.price}`;
      liAllGame.innerHTML = `
        <img class="gameImg" src=${key.header_image} alt="headGameImg"/>
        <p class="gameName">${key.name}</p>
        <p class="gamePlatform">${key.platforms}</p>
        <div class="gameFooter">
          <p class="gamePrice">${priceTag}</p>
          <button class="btn-buy btn" onclick="Buy()">Buy</button>
        </div>`;
      randomAllGames.appendChild(liAllGame);
    });
  } catch (error) {
    console.log("renderImgFeatureGame", error);
  }
};

//Add check list;
function addToList(data, ulList) {
  data.forEach((tag, index) => {
    const liList = document.createElement("li");
    liList.innerHTML = `
          <label title="${tag}" for="checkbox-${index}" class="checkbox-title">${tag}</label>
          <input type="checkbox" class="checkbox categories-input" id="checkbox-${index}" value="${tag}" />
          `;
    ulList.appendChild(liList);
  });
}

//Game categories
const renderCategories = () => {
  try {
    const list = dataAllGames.data.map((key) => key.categories);
    const arrList = list.flat(1);
    const uniqueList = [...new Set(arrList)];
    const ulCategoires = categories.children[1];
    ulCategoires.innerHTML = "";
    addToList(uniqueList, ulCategoires);
  } catch (error) {
    console.log("renderCatergories", error);
  }
};

//Game Platform
const renderPlatform = () => {
  try {
    const list = dataAllGames.data.map((key) => key.platforms);
    const arrList = list.flat(1);
    const uniqueList = [...new Set(arrList)];
    const ulPlatform = platform.children[1];
    ulPlatform.innerHTML = "";
    addToList(uniqueList, ulPlatform);
  } catch (error) {
    console.log("renderCatergories", error);
  }
};

//Game types
const renderTypes = () => {
  try {
    const list = dataGenresList.data.map((key) => key.name);
    const arrList = list.flat(1);
    const uniqueList = [...new Set(arrList)];
    const ulTypes = gameTypes.children[1];
    ulTypes.innerHTML = "";
    addToList(uniqueList, ulTypes);
  } catch (error) {
    console.log("renderCatergories", error);
  }
};

//event click - game tags
// const checkbox = document.querySelector(".checkbox");
checkbox = document.getElementById(`checkbox-${index}`);
checkbox.addEventListener("change", checkboxEvent);

function checkboxEvent() {
  checkValue = 
  Array.from(checkbox)
    .filter((i) => i.checked)
    .map((i) => i.vale);
  console.log(checkValue);
}

//return list to html
function searchGame() {}

//Categories to html
//Search game by price
//event input price
//return list to html
// Execute search - Apply filter
