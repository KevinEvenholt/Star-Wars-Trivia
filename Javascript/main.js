const selectGood = document.querySelector("select[name='good']");
const selectBad = document.querySelector("select[name='bad']");
const dataBtn = document.querySelector("#dataBtn");
const goodCharacterList = document.querySelector("#goodCharacterList");
const badCharacterList = document.querySelector("#badCharacterList");
const compareBtn = document.querySelector("#compare");
let messageDiv = document.querySelector(".messageBox");
let compareMoviesButton = document.querySelector("#compareMovies");
let goodCharacters = [];
let badCharacters = [];
let character = {};

async function getCharacterData(url, select) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const characters = data.results;
    const matchingCharacter = characters.find(
      (c) => c.name === select.value);
    if (matchingCharacter) {
      character = new Character(
        matchingCharacter.name,
        matchingCharacter.gender,
        matchingCharacter.height,
        matchingCharacter.mass,
        matchingCharacter.hair_color,
        matchingCharacter.eye_color,
        matchingCharacter.skin_color,
        matchingCharacter.films,
        matchingCharacter.homeworld,
        matchingCharacter.starships,
        matchingCharacter.vehicles,
        matchingCharacter.pictureURL
      );
      console.log(character);

    let pictureURL = `<img src="./assets/img/${character.name}.png" alt="${character.name}"></img>`;

      if (select === selectGood) {
        goodCharacterList.innerHTML += `<li>${pictureURL}<h2>${character.name}</h2></li>`;
        goodCharacters.push(character);
      } else {
        badCharacterList.innerHTML += `<li>${pictureURL}<h2>${character.name}</h2></li>`;
        badCharacters.push(character);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

dataBtn.addEventListener("click", () => {
    messageDiv.classList.remove("active");
    compareMoviesButton.classList.remove("active");
  const goodValue = selectGood.value;
  const badValue = selectBad.value;

  if (goodValue !== "" && badValue !== "") {
    getCharacterData(
      `https://swapi.dev/api/people/?search=${goodValue}`,
      selectGood
    );

    getCharacterData(
      `https://swapi.dev/api/people/?search=${badValue}`,
      selectBad
    );
    goodCharacterList.innerHTML = "";
    badCharacterList.innerHTML = "";
    goodCharacters = [];
    badCharacters = [];
    
  }
});

async function compareShips(goodCharacter, badCharacter, button) {
  try {
    const goodShipsAndVehicles = await goodCharacter.getAllStarshipsAndVehicles();
    const badShipsAndVehicles = await badCharacter.getAllStarshipsAndVehicles();
  
    let goodMostExpensive = { cost_in_credits: 0};
    for (let starship of goodShipsAndVehicles.starships) {
      if (parseInt(starship.cost_in_credits) > parseInt(goodMostExpensive.cost_in_credits)) {
        goodMostExpensive = starship;
      }
    }
    for (let vehicle of goodShipsAndVehicles.vehicles) {
      if (parseInt(vehicle.cost_in_credits) > parseInt(goodMostExpensive.cost_in_credits)) {
        goodMostExpensive = vehicle;
      }
    }

    let badMostExpensive = { cost_in_credits: 0 };
    for (let starship of badShipsAndVehicles.starships) {
      if (parseInt(starship.cost_in_credits) > parseInt(badMostExpensive.cost_in_credits)) {
        badMostExpensive = starship;
      }
    }
    for (let vehicle of badShipsAndVehicles.vehicles) {
      if (parseInt(vehicle.cost_in_credits) > parseInt(badMostExpensive.cost_in_credits)) {
        badMostExpensive = vehicle;
      }
    }
    console.log(goodMostExpensive);
    console.log(badMostExpensive);
    if (button === "good" && goodMostExpensive.cost_in_credits !== 0) {
      messageDiv.innerHTML = `<p>${goodCharacter.name}'s most expensive ship or vehicle is the <span style="color:#7d1db5">${goodMostExpensive.name}</span> worth <span style="color:#7d1db5">${goodMostExpensive.cost_in_credits}</span> credits.</p>`;
    }else if (button === "bad" && badMostExpensive.cost_in_credits !== 0 ){
      messageDiv.innerHTML = `<p>${badCharacter.name}'s most expensive ship or vehicle is the <span style="color:#7d1db5">${badMostExpensive.name}</span> worth <span style="color:#7d1db5">${badMostExpensive.cost_in_credits}</span> credits.</p>`;
    } else if (button === "good" && goodMostExpensive.cost_in_credits === 0) {
      messageDiv.innerHTML = `<p>${goodCharacter.name} dosen't own any ships or vehicles.</p>`;
    }else {
      messageDiv.innerHTML = `<p>${badCharacter.name} dosen't own any ships or vehicles.</p>`;
    }
  
  } catch (error) {
    console.error(error);
  }
}

async function comparePlanets(goodCharacter, badCharacter) {
  try {
    const goodPlanet = await goodCharacter.getHomePlanet();
    const badPlanet = await badCharacter.getHomePlanet();
    if (goodPlanet !== badPlanet) {
      messageDiv.innerHTML = `<p>${goodCharacter.name} is from <span style="color:red">${goodPlanet}</span> and ${badCharacter.name} is from <span style="color:red">${badPlanet}</span>.</p>`;
    } else {
      messageDiv.innerHTML = `<p>${goodCharacter.name} and ${badCharacter.name} is both from ${goodPlanet}.</p>`;
    }
  } catch (error) {
    console.error(error);
  }
}

async function compareMovies(goodCharacter, badCharacter) {

  const goodMovies = await goodCharacter.getAllMovies();
  const badMovies = await badCharacter.getAllMovies();
  
  const commonMovies = goodMovies.filter(movie => {
    return badMovies.some(badMovie => badMovie.title === movie.title);
  });
  
  if (commonMovies.length > 0) {
    const message = `<h2>Both ${goodCharacter.name} and ${badCharacter.name} appeared in:</h2><p> ${commonMovies.map(movie => movie.title).join(", ")}</p>`;
    messageDiv.innerHTML = message;
  } else {
    messageDiv.textContent = `There are no common movies between ${goodCharacter.name} and ${badCharacter.name}.`;
  }
}

let compareChar = (goodCharacter, badCharacter) => {
  goodCharacterList.innerHTML = "";
  badCharacterList.innerHTML = "";
  

  let goodCharacterAttr = `
    <p>Gender: <span style="color: ${goodCharacter.gender === badCharacter.gender ? 'purple' : 'black'}">${goodCharacter.gender}</span></p>
    <p>Height: <span style="color: ${parseInt(goodCharacter.height) > parseInt(badCharacter.height) ? 'green' : 'red'}">${goodCharacter.height} cm</span></p>
    <p>Mass: <span style="color: ${parseInt(goodCharacter.mass) > parseInt(badCharacter.mass) ? 'green' : 'red'}">${goodCharacter.mass} kg</span></p>
    <p>Hair color: <span style="color: ${goodCharacter.hairColor === badCharacter.hairColor ? 'purple' : 'black'}">${goodCharacter.hairColor}</span></p>
    <p>Eye color: <span style="color: ${goodCharacter.eyeColor === badCharacter.eyeColor ? 'purple' : 'black'}">${goodCharacter.eyeColor}</span></p>
    <p>Skin color: <span style="color: ${goodCharacter.skinColor === badCharacter.skinColor ? 'purple' : 'black'}">${goodCharacter.skinColor}</span></p>
    <p>Films: <span style="color: ${goodCharacter.movies.length === badCharacter.movies.length ? 'purple' : goodCharacter.movies.length > badCharacter.movies.length ? 'green' : 'red'}">${goodCharacter.movies.length}</span></p>
    <button id="mostMoviesGood">First appered in movie</button>
    <button id="homePlanetGood">Home Planet</button>
    <button id="expensiveShipGood">See most expensive ship</button>
  `;

  let badCharacterAttr = `
    <p>Gender: <span style="color: ${badCharacter.gender === goodCharacter.gender ? 'purple' : 'black'}">${badCharacter.gender}</span></p>
    <p>Height: <span style="color: ${parseInt(badCharacter.height) > parseInt(goodCharacter.height) ? 'green' : 'red'}">${badCharacter.height} cm</span></p>
    <p>Mass: <span style="color: ${parseInt(badCharacter.mass) > parseInt(goodCharacter.mass) ? 'green' : 'red'}">${badCharacter.mass} kg</span></p>
    <p>Hair color: <span style="color: ${badCharacter.hairColor === goodCharacter.hairColor ? 'purple' : 'black'}">${badCharacter.hairColor}</span></p>
    <p>Eye color: <span style="color: ${badCharacter.eyeColor === goodCharacter.eyeColor ? 'purple' : 'black'}">${badCharacter.eyeColor}</span></p>
    <p>Skin color: <span style="color: ${badCharacter.skinColor === goodCharacter.skinColor ? 'purple' : 'black'}">${badCharacter.skinColor}</span></p>
    <p>Films: <span style="color: ${badCharacter.movies.length === goodCharacter.movies.length ? 'purple' : badCharacter.movies.length > goodCharacter.movies.length ? 'green' : 'red' }">${badCharacter.movies.length}</span></p>
    <button id="mostMoviesBad">First appered in movie</button>
    <button id="homePlanetBad">Home Planet</button>
    <button id="expensiveShipBad">See most expensive ship</button>
  `;
  let goodImg = `<img src="./assets/img/${goodCharacter.name}.png" alt="${character.name}">`;
  let badImg = `<img src="./assets/img/${badCharacter.name}.png" alt="${character.name}">`;

  goodCharacterList.innerHTML += `<li>${goodImg}<h2>${goodCharacter.name}</h2>${goodCharacterAttr}</li>`;
  badCharacterList.innerHTML += `<li>${badImg}<h2>${badCharacter.name}</h2>${badCharacterAttr}</li>`;

  let mostMoviesGood = document.querySelector("#mostMoviesGood");
  let mostMoviesBad = document.querySelector("#mostMoviesBad");

  mostMoviesGood.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
      goodCharacter.getFirstMovieDate().then((date) => {
          messageDiv.innerHTML = "";
          messageDiv.innerHTML += `<p>${goodCharacter.name} first appeared in a movie <span style="color:blue">${date}</span></p>`;
        });
  });

  mostMoviesBad.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
      badCharacter.getFirstMovieDate().then((date) => {
          messageDiv.innerHTML = "";
          messageDiv.innerHTML += `<p>${badCharacter.name} first appeared in a movie <span style="color:blue">${date}</span></p>`;
        });
  });

  let homePlanetGood = document.querySelector("#homePlanetGood");
  let homePlanetBad = document.querySelector("#homePlanetBad");
  
  homePlanetGood.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
    comparePlanets(goodCharacters[0], badCharacters[0])
  });

  homePlanetBad.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
      comparePlanets(goodCharacters[0], badCharacters[0])
  });

  let expensiveShipGood = document.querySelector("#expensiveShipGood");
  expensiveShipGood.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
      compareShips(goodCharacters[0], badCharacters[0], "good");
  });
  let expensiveShipBad = document.querySelector("#expensiveShipBad");
  expensiveShipBad.addEventListener("click", () => {
    messageDiv.innerHTML = `<div class="loader"></div>`;
      compareShips(goodCharacters[0], badCharacters[0], "bad");
  });
  
}

compareBtn.addEventListener("click", () => {
  compareMoviesButton.classList.toggle("active");
  compareChar(goodCharacters[0], badCharacters[0]);
});

compareMoviesButton.addEventListener("click", () => {
  messageDiv.classList.toggle("active");
  messageDiv.innerHTML = `<div class="loader"></div>`;
  compareMovies(goodCharacters[0], badCharacters[0]);
});






