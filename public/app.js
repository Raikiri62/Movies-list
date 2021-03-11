class Movie {
    title = "title";
    stars = 0;
    info = "info";
    posterURL = "";

    constructor(title,stars,info,posterURL)
    {
        this.title = title;
        this.stars = stars;
        this.info = info;
        this.posterURL = posterURL;
    }
}

class MovieItem { // render one item
    constructor(movie)
    {
        this.movie = movie;
    }
    render()
    {
        const movieEl = document.createElement("div");
        movieEl.className = "movie-item";
          let yellowStarsHtml = "";
          let greyStarsHtml = "";
          for(let i = 1; i<= this.movie.stars; i++){
            yellowStarsHtml += '<span class="fa fa-star checked"></span>';
          }
          for(let i = 0; i<5 - this.movie.stars; i++){
            greyStarsHtml += '<span class="fa fa-star"></span>';
          }
          movieEl.innerHTML = `
          <div class="item-poster">
          <img src="${this.movie.posterURL}" alt="poster">
      </div>
      <div class="item-content">
          <h3>
              ${this.movie.title}
          </h3>
          <div class="rating">
                ${yellowStarsHtml}${greyStarsHtml}
          </div>
          <p>
              ${this.movie.info}
          </p>
          <button class="btn btn-danger btn-delete">
              🗑️ delete 
          </button>
          <button class="btn btn-move">
              🔺 move up 
          </button>

          <button class="btn btn-move">
              🔻 move down 
          </button>
      </div>
          `;

          const deleteBtn = movieEl.querySelector(".btn-delete");
          deleteBtn.addEventListener("click", event => {
            confi().then(() =>{
            const btn = event.target;
              const selectedMovieEl = btn.parentNode.parentNode;
              const title = selectedMovieEl.querySelector("h3").textContent.trim();
              const theMovie = App.findMovie(title);
              App.deleteMovie(theMovie); // delete from movies list array.
              App.renderCounter();
              App.renderButtons();
              selectedMovieEl.remove();
            })
              


            });
            let moveBtns = movieEl.querySelectorAll(".btn-move");
            const moveUpBtn = moveBtns[0];
            const moveDownBtn = moveBtns[1];
            moveUpBtn.addEventListener("click", event => {
                const btn = event.target;
                const selectedMovieEl = btn.parentNode.parentNode;
                const title = selectedMovieEl.querySelector("h3").textContent.trim();
                const theMovie = App.findMovie(title);

                App.moveMovieUp(theMovie);
                App.clearAllMovies();
                App.render();
            });
            moveDownBtn.addEventListener("click", event => {
                const btn = event.target;
                const selectedMovieEl = btn.parentNode.parentNode;
                const title = selectedMovieEl.querySelector("h3").textContent.trim();
                const theMovie = App.findMovie(title);
                
                App.moveMovieDown(theMovie);
                App.clearAllMovies();
                App.render();
            });
        return movieEl;
      }
}

class MoviesList {
    movies = MoviesData.getMovies();
    counter = this.movies.length;
    addMovie(title,stars,info,posterURL)
    {
        let movie = new Movie(title,stars,info,posterURL);
        this.movies.push(movie);
        this.counter++;
        const theMovieItem = new MovieItem(movie);
        const movieElement = theMovieItem.render();
        const renderHook = document.querySelector('.flex-container-movies');
        renderHook.append(movieElement);
        this.renderButtons();
        this.renderCounter();
        setTimeout(() => {
            movieElement.scrollIntoView({behavior: "smooth"});
        },500);
    }
    deleteMovie(movie)
    {
        const index = this.movies.indexOf(movie);
        if (index > -1) {
            this.movies.splice(index, 1);
        }
        this.counter--;
    }
    moveMovieUp(movie)
    {
        const index = this.movies.indexOf(movie);
        if (index > 0) {
            [this.movies[index], this.movies[index -1]] = [this.movies[index -1], this.movies[index]];
        }
    }
    moveMovieDown(movie)
    {
        const index = this.movies.indexOf(movie);
        if (index >= 0 && index < this.movies.length -1) {
            [this.movies[index], this.movies[index +1]] = [this.movies[index +1], this.movies[index]];
        }
    }
    findMovie(name)
    {
        const TheMovie = this.movies.find(movie => movie.title === name);
        return TheMovie;
    }
    constructor(){}
    render() {
        this.counter = this.movies.length;     
        const renderHook = document.querySelector('.flex-container-movies');
        for (const movie of this.movies) {
          const movieItem = new MovieItem(movie);
          const movieElement = movieItem.render();
          renderHook.append(movieElement);
        }
        this.renderButtons();
        this.renderCounter();
      }
      renderCounter()
      {
        let counterHook = document.getElementById("counter");
        counterHook = counterHook.firstElementChild;
        counterHook.innerText = this.counter;
      }

      renderButtons()
      {
        const optionsDiv = document.querySelector(".options-menu");
        const optionsBtns = optionsDiv.querySelectorAll(".btn.btn-option");
        if(this.counter > 0)
        {
                for(const btn of optionsBtns){
                    if(btn.classList.contains("hide")){
                        btn.classList.toggle("hide");
                    }
                }
        }
        else
        {
            for(const btn of optionsBtns){
                if(!btn.classList.contains("hide")){
                    btn.classList.toggle("hide");
                }
            }
        }
      }
}
class MoviesData {
    constructor()
    {

    }
    static getMovies()
    {
        let arrayOfMovies = this.getLocalStorage();
        if(arrayOfMovies)
        {
            console.log("movies was inside localstorage");
            return arrayOfMovies;
        }
        else
        {
            console.log("movies was NOT inside localstorage");
            return [
                new Movie("The Shawshank Redemption (1994)",3,"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.","/images/posters/shawshank.jpg"),
                new Movie("The Lord of the Rings: The Return of the King",4,"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.","/images/posters/lordofrings.jpg"),
                new Movie("Kill Bill: Vol. 1 (2003)",3,"After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.","/images/posters/killbill.jpg"),
                new Movie("Gravity (2013)",2,"Two astronauts work together to survive after an accident leaves them stranded in space.","/images/posters/gravity.jpg"),
                new Movie("Inglourious Basterds (2009)",3,"In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.","/images/posters/basterds.jpg"),
                new Movie("Her (2013)",2,"In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.","/images/posters/her.jpg"),
                new Movie("The Dark Knight (2008)",4,"When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.","/images/posters/darkknight.jpg"),
                new Movie("About Time (I) (2013)",2,"At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think.","/images/posters/abouttime.jpg")
            ];
        }
    }
    static getLocalStorage()
    {
        let data = localStorage.getItem("data");
        if(data){
            return JSON.parse(data);
        }
        return data;
    }
    static setLocalStorage(arrayOfMovies)
    {
        let jsonArray = JSON.stringify(arrayOfMovies);
        localStorage.setItem("data",jsonArray);
    }
}

class App
{
    static elementsRendered = 0;
    static globalCurElementNumber = 3;

    static init()
    {
        const moviesList = new MoviesList();
        this.moviesList = moviesList;
        moviesList.render();
    }
    static render()
    {
        this.moviesList.render();
    }
    static moveMovieUp(movie)
    {
        this.moviesList.moveMovieUp(movie);
    }
    static moveMovieDown(movie)
    {
        this.moviesList.moveMovieDown(movie);
    }
    static addMovie(title,stars,info,posterURL)
    {
        this.moviesList.addMovie(title,stars,info,posterURL);
    }
    static deleteMovie(movie)
    {
        this.moviesList.deleteMovie(movie);
    }
    static findMovie(name)
    {
        return this.moviesList.findMovie(name);
    }
    static renderCounter()
    {
        this.moviesList.renderCounter();
    }
    static renderButtons()
    {
        this.moviesList.renderButtons();
    }
    static clearAllMovies()
    {
        const renderHook = document.querySelector('.flex-container-movies');
        let nodes = renderHook.querySelectorAll(".movie-item");
        for(let node of nodes)
        {
            node.remove();
        }
    }
    static deleteAllMovies()
    {
        this.moviesList.movies.splice(0,this.moviesList.movies.length);
        this.clearAllMovies();
    }
    static shuffleMovies()
    {
        let array = this.moviesList.movies;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}
class MovieFormAdder{
    static init()
    {
        const addMovieForm = document.getElementById("movie-form");
        addMovieForm.addEventListener("submit", event => {
            let inputs = document.querySelectorAll(".form-control");
            let title = inputs[2].value;
            let stars = parseInt(inputs[3].value);
            let info = inputs[4].value;
            let url = inputs[5].value;
        
            inputs[2].value = "";
            inputs[3].value = 5;
            inputs[4].value = "";
            inputs[5].value = ""; 
            let boolVal = this.check(title,stars,info,url);
            if(boolVal){
                App.addMovie(title,stars,info,url);
            }
            event.preventDefault();
        });
    }
    static check(title,stars,info,url)
    {
        let text = "";
        if(title.length <= 0){
            text += " The title is empty. ";
        }
        if(info.length <= 0){
            text += " The movie information is empty. ";
        }
        if(url.length <= 0){
            text += " The image url is empty. ";
        }
        else if(url.slice((url.length) - 4,url.length) !== ".jpg"){ /// .jpg
            text += " The image url is not ending with .jpg ";
        }

        if(text.length === 0){
            this.showAlert("Movie was added succesfully!","success");
            return true;
        }
        else{
            this.showAlert("Please fill in the required fields..." + " " + text, "danger");
            return false;
        }
    }
    static showAlert(msg,type)
    {
        const statusCardDiv = document.querySelector(".status.card");
        let alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = msg;
        setTimeout(function(){
            alertDiv.remove();
        },3550);
        statusCardDiv.append(alertDiv);
    }
}


//App:
App.init();
MovieFormAdder.init();



// options btns:
const clearAllBtn = document.getElementById("deleteAll");
clearAllBtn.addEventListener("click", () =>{
   
    confi().then(() =>{
        App.deleteAllMovies();
        App.render();
        saveBtn.click();
    });
});

const shuffleBtn = document.getElementById("shuffle");
shuffleBtn.addEventListener("click", () =>{
    App.shuffleMovies();
    App.clearAllMovies();
    App.render();
});







// backdrop:
const backdrop = document.getElementById('backdrop');
const warningModal = document.getElementById("warningModal");


const toggleBackdrop = () => {
    backdrop.classList.toggle('visible');
};

const toggleWarningModal = () => {
    warningModal.classList.toggle('visible');
    toggleBackdrop();
};
backdrop.addEventListener("click",toggleWarningModal);


const showWarningModal = () => {
    const promise = new Promise((resolve,reject) =>{
        toggleWarningModal();

        const noBtn = document.getElementById("noBtn");
        const yesBtn = document.getElementById("yesBtn");
        
        let noBtnListner = () =>{
            yesBtn.removeEventListener("click",yesBtnListener);
            backdrop.removeEventListener("click",backDropListner);
            toggleWarningModal();
            reject("no");
        }
        let yesBtnListener = () =>{
            noBtn.removeEventListener("click",noBtnListner);
            backdrop.removeEventListener("click",backDropListner);
            toggleWarningModal();
            resolve("OK");
        }
        let backDropListner = () =>{
            noBtn.removeEventListener("click",noBtnListner);
            yesBtn.removeEventListener("click",yesBtnListener);
            reject("no");
        }


        noBtn.addEventListener("click", noBtnListner,{
            // This will invoke the event once and de-register it afterward
            once: true
        });
        backdrop.addEventListener("click", backDropListner,{
            // This will invoke the event once and de-register it afterward
            once: true
        });
        yesBtn.addEventListener("click", yesBtnListener,{
            // This will invoke the event once and de-register it afterward
            once: true
        });
    });
    return promise;
};


function confi()
{
    const promise = new Promise((resolve,reject) => {
        showWarningModal().then((result)=>{
            resolve(result);
        }, (result) =>{
            reject(result);
        });
    });
    return promise;
}




//local storage:
function saveToLocalStorage()
{
    MoviesData.setLocalStorage(App.moviesList.movies);
}
const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click",saveToLocalStorage);




class MovieFormApi{
    static init()
    {
        const addMovieFormApi = document.getElementById("movie-form-api");
        addMovieFormApi.addEventListener("submit", event => {
        let inputs = document.querySelectorAll(".form-control");
        let title = inputs[6].value;
        inputs[6].value = ""; 
        if(title.trim() != ""){
            title = title.replace(/\s/g, "%20");
            //this.makeRequest(title);
            this.makeRequest(title).then(response =>{
                let imdbMovie = response;
                if(imdbMovie != null){
                    this.loadResult(imdbMovie);
                }
                else{
                    this.resetResult();
                }
            })
        }

        event.preventDefault();
        });
    }
    static makeRequest(string)
    {
        return fetch("https://www.omdbapi.com/?apikey=859e4bcf&t=" + string).then(res => {
            return res.json();
        });
        // const promise = new Promise((resolve,reject) => {
        // const xhr = new XMLHttpRequest();
        // xhr.open('GET',"http://www.omdbapi.com/?apikey=859e4bcf&t=" + string);
        // xhr.responseType = 'json';
    
        // xhr.onload = () => {
        //     resolve(xhr.response);
        // }
        // xhr.send();
        // });
        // return promise;


        // const xhr = new XMLHttpRequest();
        // xhr.open('GET',"http://www.omdbapi.com/?apikey=859e4bcf&t=" + string);
        // xhr.responseType = 'json';
    
        // xhr.onload = () => {
        //     let imdbMovie = xhr.response;
        //     if(imdbMovie != null){
        //         this.loadResult(imdbMovie);
        //     }
        //     else{
        //         this.resetResult();
        //     }
        // }
        // xhr.send();
    }
    static loadResult(imdbMovie)
    {
        const imdbMovieItem = new ImdbMovieItem(imdbMovie); // saving movie at the static class
        const imdbMovieElement = imdbMovieItem.render();
        const resultDiv = document.querySelector(".result");
        resultDiv.innerHTML = "";
        resultDiv.append(imdbMovieElement);
        setTimeout(() => {
            let form = document.getElementById("movie-form-api");
            form.scrollIntoView({behavior: "smooth"});
        },300);
    }
    static resetResult()
    {
        const resultDiv = document.querySelector(".result");
        resultDiv.innerHTML = "";
    }
}

class ImdbMovieItem { // render one item
    constructor(imdbMovie)
    {
        const title = imdbMovie.Title + " " + imdbMovie.Year + " " + imdbMovie.Runtime;
        const stars = Math.round(parseInt(imdbMovie.imdbRating) / 2);
        const info = imdbMovie.Plot;
        const posterURL = imdbMovie.Poster;
        const movie = new Movie(title,stars,info,posterURL);
        this.movie = movie;
    }
    render()
    {
        const movieEl = document.createElement("div");
        movieEl.className = "movie-item-imdb";
          let yellowStarsHtml = "";
          let greyStarsHtml = "";
          for(let i = 1; i<= this.movie.stars; i++){
            yellowStarsHtml += '<span class="fa fa-star checked"></span>';
          }
          for(let i = 0; i<5 - this.movie.stars; i++){
            greyStarsHtml += '<span class="fa fa-star"></span>';
          }
          movieEl.innerHTML = `
          <div class="item-poster">
          <img src="${this.movie.posterURL}" alt="poster">
      </div>
      <div class="item-content">
          <h3>
              ${this.movie.title}
          </h3>
          <div class="rating">
                ${yellowStarsHtml}${greyStarsHtml}
          </div>
          <p>
              ${this.movie.info}
          </p>
          <button class="btn btn-dark">
              Add this movie to your list!
          </button>
      </div>
          `;
          const addBtn = movieEl.querySelector(".btn");
          addBtn.addEventListener("click", event => {
                App.addMovie(...Object.values(this.movie));
                MovieFormApi.resetResult();
          });
        return movieEl;
      }
}

MovieFormApi.init();







function loadPublishing()
{
    let publish_list_div = document.querySelector(".publish-list");
    publish_list_div.classList.toggle("visible");
}
let li_click =  document.getElementById("create-public-list-li");
li_click.addEventListener("click",loadPublishing);





class PublishListServer{
    static init()
    {
        const publishFormServer = document.getElementById("publish-form-server");
        publishFormServer.addEventListener("submit", event =>
        {
            let inputs = document.querySelectorAll(".form-control");
            let username = inputs[0].value;
            let listName = inputs[1].value;
            // console.log("POST REQ " + username + " " + listName);

            inputs[0].value = "";
            inputs[1].value = "";
            if(username.trim() != "" && listName.trim() != ""){

                let record = {};
                record.username = username;
                record.listName = listName;
                record.movies = App.moviesList.movies;
                // console.log(record);

                this.sendListToServer(record).then(response =>
                    {
                        let res = response;
                        if(res === "OK"){
                            li_click.click();
                            alert("the list was uploaded to the server");
                            setTimeout(() =>{window.location = "/publicLists";},800);
                        }
                        else{
                            alert("the list was not upload to the server");
                        }
                    });
            }

            event.preventDefault();
        });
    }
    static sendListToServer(record) //JSON.stringify(record)
    {
        return fetch("/publish",{method: "POST", body: JSON.stringify(record), headers: {"Content-type": "application/json; charset=UTF-8"}}).then(res => {
            // return res.json();
            return res.text();
        });
    }
    // static loadResult(imdbMovie)
    // {
    //     const imdbMovieItem = new ImdbMovieItem(imdbMovie); // saving movie at the static class
    //     const imdbMovieElement = imdbMovieItem.render();
    //     const resultDiv = document.querySelector(".result");
    //     resultDiv.innerHTML = "";
    //     resultDiv.append(imdbMovieElement);
    //     setTimeout(() => {
    //         let form = document.getElementById("movie-form-api");
    //         form.scrollIntoView({behavior: "smooth"});
    //     },300);
    // }
    // static resetResult()
    // {
    //     const resultDiv = document.querySelector(".result");
    //     resultDiv.innerHTML = "";
    // }
}

PublishListServer.init();
