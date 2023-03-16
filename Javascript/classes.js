class Character {
    constructor (name, gender, height, mass, hairColor,eyeColor, skinColor, movies, homeworld, starships, vehicles ,pictureURL) {
        this.name = name;
        this.gender = gender;
        this.height = height;
        this.mass = mass;
        this.hairColor = hairColor;
        this.eyeColor = eyeColor;
        this.skinColor = skinColor;
        this.movies = movies;
        this.homeworld = homeworld;
        this.starships = starships;
        this.vehicles = vehicles;
        this.pictureURL = pictureURL;
    }
    async getFirstMovieDate() {
        try {
          const response = await fetch(this.movies[0]);
          const data = await response.json();
          return data.release_date;
        } catch (error) {
          console.error(error);
        }
    }
    async getAllMovies() {
        try {
            const movies = [];
            for (let movie of this.movies) {
                const response = await fetch(movie);
                const data = await response.json();
                const movieDetails = {
                    title: data.title
                };
                movies.push(movieDetails);
            }
            return movies;
        } catch (error) {
            console.error(error);
        }
    }
    async getHomePlanet() {
        try {
          const response = await fetch(this.homeworld);
          const data = await response.json();
          return data.name;
        } catch (error) {
          console.error(error);
        }
    }
    async getAllStarshipsAndVehicles() {
        try {
          const starships = [];
          const vehicles = [];
      
          for (let starship of this.starships) {
            const response = await fetch(starship);
            const data = await response.json();
            const starshipDetails = {
                cost_in_credits: data.cost_in_credits,
                name: data.name
            };
            starships.push(starshipDetails);
          }
      
          for (let vehicle of this.vehicles) {
            const response = await fetch(vehicle);
            const data = await response.json();
            const vehicleDetails = {
                cost_in_credits: data.cost_in_credits,
                name: data.name
            };
            vehicles.push(vehicleDetails);
          }
      
          return {
            starships: starships,
            vehicles: vehicles
          };
        } catch (error) {
          console.error(error);
        }
      }
      
}