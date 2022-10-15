const API_URL = "https://cs-steam-game-api.herokuapp.com/";
//getData
const getData = async (endPoint, args = {}) => {
  try {
    let queryParams = "";
    let link = `${API_URL}${endPoint}`;

    if (Object.keys(args).length) {
      queryParams = buildQsParams(args);
      link += queryParams;
    }

    const res = await fetch(link);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getData", error);
  }
};

//Querry Params
function buildQsParams(args) {
  if (Object.keys(args).length) {
    let qS = [];
    for (let key in args) {
      qS.push(`${args[key]}`);
    }
    return qS.map((value) => encodeURIComponent(value)).join("&");
  }
  return "";
}

let checkList = [];
Promise.all([
  getData("games"),
  getData("genres"),
  getData("steamspy-tags"),
  getData("features"),
]).then((allData) => {
  dataAllGames = allData[0];
  dataGenresList = allData[1];
  dataTagsList = allData[2];
  dataFeatureGame = allData[3];

  renderImgFeatureGame(),
    renderImgAllGame(),
    (renderImgAllGameInterval = setInterval(renderImgAllGame, 9000));
    (renderImgFeatureGameInterval = setInterval(renderImgFeatureGame, 9000));
    rendergameTags(),
    rendergameGenres();
});

//Global variable
//---search-field
const gameTags = document.querySelector(".search-fields.gameTags");
const gameGenres = document.querySelector(".search-fields.gameGenres");
const gameTypes = document.querySelector(".search-fields.GameType");
const inputMinPrice = document.querySelector(".input-pricebox.Min");
const inputMaxPrice = document.querySelector(".input-pricebox.Max");

//---Game frontpage
const featureGames = document.querySelector(".gameFrontPage");
const ulSlideDot = document.querySelector(".slideDot-menu");
const featureGameTotalImg = document.querySelector(".featureGameTotalImg");
const randomAllGames = document.querySelector(".gameList");

let randomGames = [];
let randomFeatureGames = [];
let gameIdx = 0;
let featureGameIdx = 0;

//renderHtml
const renderImgFeatureGame = () => {
  while (randomFeatureGames.length < 3) {
    featureGameIdx =
      featureGameIdx === dataFeatureGame.data.length ? 0 : featureGameIdx;
    randomFeatureGames.push(dataFeatureGame.data[featureGameIdx]);
    featureGameIdx += 1;
  }
  featureGameTotalImg.innerHTML = "";

  randomFeatureGames.forEach((game) => {
    const gameImg = document.createElement("div");
    gameImg.setAttribute("class", `featureGameImg-wrapper`);
    gameImg.classList.add("swiper-slide");
    gameImg.innerHTML = `<img src="${game.header_image}" alt="${game.name}">`;

    featureGameTotalImg.append(gameImg);
    featureGameTotalImg.classList.add("fade10s")
    randomFeatureGames = [];
  });
};

const addGameToList = (gameList, pageDesination) => {
  randomAllGames.innerHTML = "";
  randomAllGames.classList.add(`${pageDesination}`);
  gameList.forEach((key) => {
    const liAllGame = document.createElement("li");
    liAllGame.classList.add("gameCard");
    const priceTag = key.price === 0 ? "Free" : `$${key.price}`;
    liAllGame.innerHTML = `
    <div class="gameImg-wrapper">
      <img class="gameImg" src="${key.header_image}" alt="headGameImg" />
    </div>
      <div class="gameContent">
        <p class="gameName">${key.name}</p>
        <p title="${key.developer}" class="gameDev">${key.developer}</p>
        <p class="gamePlatform">${key.platforms}</p>
        <div class="gameFooter">
        <p class="gamePrice">${priceTag}</p>
        <button class="btn-buy btn" onclick="">Buy</button>
      </div>
        `;
    liAllGame.classList.add("fade10s");
    randomAllGames.appendChild(liAllGame);
  });
};

//All game list
const renderImgAllGame = () => {
  while (randomGames.length < 3) {
    gameIdx = gameIdx === dataAllGames.data.length ? 0 : gameIdx;
    randomGames.push(dataAllGames.data[gameIdx]);
    gameIdx += 1;
  }
  addGameToList(randomGames, "home");
  randomGames = [];
};

//Add check list;
function addSearchToList(data, ulList, tagList) {
  data.forEach((tag, index) => {
    const liList = document.createElement("li");
    liList.innerHTML = `
          <input type="checkbox" class="checkbox ${tagList}" id="checkbox-${tag}${tagList}" value="${tag}" onchange="setCurrentFilters()" />
          <label title="${tag}" for="checkbox-${tag}${tagList}" class="checkbox-title">${tag}</label>
          `;
    ulList.appendChild(liList);
    checkList.push(liList.input);
  });
}

//Game gameTags
const rendergameTags = () => {
  const list = dataTagsList.data.map((key) => key.name);
  const arrList = list.flat(1);
  const uniqueList = [...new Set(arrList)];
  const ulgameTags = gameTags.children[1];
  ulgameTags.innerHTML = "";
  addSearchToList(uniqueList, ulgameTags, "gameTags");
};

//Game gameGenres
const rendergameGenres = () => {
  const list = dataGenresList.data.map((key) => key.name);
  const arrList = list.flat(1);
  const uniqueList = [...new Set(arrList)];
  const ulgameGenres = gameGenres.children[1];
  ulgameGenres.innerHTML = "";
  addSearchToList(uniqueList, ulgameGenres, "genres");
};

//Apply Filters
let checkboxGameTags = [];
let checkboxGenres = [];

function setCurrentFilters() {
  checkboxGameTags = [
    ...document.querySelectorAll(".checkbox.gameTags:checked"),
  ].map((e) => e.value);

  checkboxGenres = [
    ...document.querySelectorAll(".checkbox.genres:checked"),
  ].map((e) => e.value);
}
//Apply filters
let urlGameTags = "";
let urlGenres = "";
let combineString = "";
let filteredGames = [];

async function filterGames() {
  try {
    if (Object.keys(checkboxGameTags).length) {
      qString = buildQsParams(checkboxGameTags);
      urlGameTags = "steamspy-tags" + "=" + qString;
    }
    if (Object.keys(checkboxGenres).length) {
      qString = buildQsParams(checkboxGenres);
      urlGenres = "genres" + "=" + qString;
    }
    combineString = "games?" + urlGameTags + "&" + urlGenres;
    filteredGames = await getData(combineString);
    clearInterval(renderImgAllGameInterval);
    featureGames.style.display = "none";
    addGameToList(filteredGames.data);
    combineString = "";
  } catch (error) {
    console.log("filterGamesErr", filterGames);
  }
  console.log("filteredGames", filteredGames);
}

//Search game by price
const minPrice = document.querySelector(".input-pricebox.Min");
const maxPrice = document.querySelector(".input-pricebox.Max");
let minPriceFilter;
let maxPriceFilter;

function priceGameFilter() {
  dataAllGames.data.forEach(() => {
    minPriceFilter = !minPrice.value ? 0 : Number(minPrice.value);
    maxPriceFilter = !maxPrice.value
      ? dataAllGames.data.reduce((prev, current) =>
          prev.price > current.price ? prev.price : current.price
        )
      : Number(maxPrice.value);
  });
}

// Search game by id
let gameID = "";
const inputString = document.querySelector(".inputString");
inputString.addEventListener("input", idFilter);
function idFilter() {
  document.querySelectorAll(".checkbox").disabled = true;
  gameID = buildQsParams(inputString.value);
}



function home() {
  clearInterval(renderImgAllGameInterval)
  clearInterval(renderImgFeatureGameInterval)
  featureGames.style.display = "block";
  renderImgFeatureGame(),
  renderImgAllGame(),
  (renderImgAllGameInterval = setInterval(renderImgAllGame, 10000));
  (renderImgFeatureGameInterval = setInterval(renderImgFeatureGame, 15000));
  rendergameTags(),
  rendergameGenres();
}
