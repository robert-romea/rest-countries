//search
const addContent = document.querySelector(".container");
const search = document.querySelector(".search");

//filter
const dropElem = document.querySelector(".drop");
const dropDown = document.querySelector(".drop-down")
const continents = document.querySelectorAll(".continents");

//modal
const countryCard = document.querySelectorAll(".country-card");
const back = document.querySelector(".back");
const containerModal = document.querySelector(".modal-container");

//hidden class
const hidden = document.querySelector(".hidden");


function unhideElement() {
    hidden.classList.remove("hidden")
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



let sortedCountries = [];

async function getCountries() {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (response.status > 400) {
        console.log("ERROR");
    } else {
        const data = await response.json();
        console.log(data);
        //sorting the countries
        sortedCountries = data.sort((a, b) => (a.name.common > b.name.common) ? 1 : ((b.name.common > a.name.common) ? -1 : 0))
        sortedCountries.forEach((element, idx) => cardBuilder(element, idx));
        //modal country details


    }
}
getCountries();

// second argument "idx" was created for modal (i need to know the index of each country card to display infos about it)
function cardBuilder(country, idx) {

    addContent.innerHTML += `
            <div class="country-card" data-country="${idx}" onclick="showMoreDetails(this);">
                <div class="flag">
                    <div class="image-dimensions">
                        <img src="${country.flags.png}">
                    </div>
                </div>
                <div >
                    <div class="card-title countryName"> <span> ${country.name.common} </span> </div>   
                    <div class="country-infos">
                        <div class="card-infos"> Population:  ${numberWithCommas(country.population)}  </div>
                        <div class="card-infos continentsName"> Continent : ${country.continents}  </div>
                        <div class="card-infos capitalsName"> Capaital: ${country.capital}  </div> 
                    </div>
                </div>
            </div>
            `
}



// --- search countries by name ---
const countryName = document.getElementsByClassName("countryName")  // to create an array of country names later
const capitalsName = document.getElementsByClassName("capitalsName")

search.addEventListener("input", () => {
    //console.log(search.value.toLowerCase()); // show what letter is typed
    //searching for name of countries
    Array.from(countryName).forEach(el => {
        console.log(typeof el.parentElement.parentElement.style.display);

        if (el.innerText.toLowerCase().includes(search.value.toLowerCase())) {
            el.parentElement.parentElement.style.display = "block";
        } else {
            el.parentElement.parentElement.style.display = "none";
        }

    });

    //searching for name of country capitals ==> i will think later how to integrate those 2 simultaneously
    // ** both works but just separately **

    // Array.from(capitalsName).forEach(el => {
    //     if (el.innerText.toLowerCase().includes(search.value.toLowerCase())) {
    //         el.parentElement.parentElement.parentElement.style.display = "block";
    //     } else {
    //         el.parentElement.parentElement.parentElement.style.display = "none";
    //     }
    // });

})

//  --- filter countries by continent ---
dropDown.addEventListener("click", () => {
    dropElem.classList.toggle("show-drop-down");
})

const continentsName = document.getElementsByClassName("continentsName");
continents.forEach(element => {
    element.addEventListener("click", () => {
        console.log(element.innerText);
        Array.from(continentsName).forEach(el => {
            console.log(el);
            if (el.innerText.includes(element.innerText) || element.innerText === "All") {
                el.parentElement.parentElement.parentElement.style.display = "block";
            } else {
                el.parentElement.parentElement.parentElement.style.display = "none";
            }
        })
    })
})


//  --- MODAL ---

function backToDom() {
    containerModal.classList.toggle("hidden");
}


let countryIdx; //declared globally for future use (in ModalBuilder)
function showMoreDetails(event) {
    containerModal.classList.toggle("hidden");
    // pass country Id as a data attribute 
    countryIdx = event.getAttribute("data-country");
    console.log(sortedCountries[countryIdx]);
    console.log(sortedCountries);
    // retrieve country based on data id
    modalBuilder(sortedCountries[countryIdx])
}


// building the modal 
function modalBuilder(country) {

    const currencies = Object.values(sortedCountries[countryIdx].currencies);
    containerModal.innerHTML += `
    <div class="country-modal hidden">
    <button class="back" onclick = "backToDom();"> Back </button>

    
    <div class="modal">
           
        <div class="left-side">
            <div class="centered">
                <h1>${country.name.common} </h1>
            </div>
            <img class = "rounded-flag" src="${country.flags.png}">
        </div>

        <div class="right-side">
            <div class="modal-infos">

                <div class="first-col column">
                    <div class="inf-modal"> <strong>Region:</strong> ${country.region} </div>
                    <div class="inf-modal"><strong>Population:</strong>  ${numberWithCommas(country.population)} </div>
                    <div class="inf-modal "><strong>Continent:</strong>  ${country.continents} </div>
                    <div class="inf-modal "><strong>Capaital:</strong> ${country.capital} </div>
                    <div class="inf-modal "><strong>Alpha code:</strong> ${country.altSpellings[0]} </div>
                </div>

                <div class="second-col column">

                    <div class="inf-modal"><strong>Official Currency: </strong>  ${currencies.map(el => el.name)} </div>
                    <div class="inf-modal"><strong>Language: </strong>  ${Object.values(sortedCountries[countryIdx].languages)[0]}   </div >
                    <div class="inf-modal"><strong>Area: </strong>  ${country.area} </div>
                    <div class="inf-modal"><strong>Time zone:</strong>  ${country.timezones[0]} </div>
                    <div class="inf-modal "><strong>Lat/Long:</strong>  ${country.latlng[0]}/${country.latlng[1]} </div>
                    <div class="inf-modal "><strong>Borders:</strong>  ${country.borders.map(el => el)} </div>
                </div >
            </div >
        </div >
    </div >
</div >
        `;
}


//for currencies 🠗🠗🠗

// const currenciesData = sortedCountries[countryIdx].currencies;
// console.log(currenciesData);
// const currenciesS = Object.values(currenciesData);
// console.log(currenciesS);
// const lang = Object.values(sortedCountries[countryIdx].languages).forEach(myFunction);
// console.log(lang);

// let text = "";
// function myFunction(item, index) {
//     text += index + ": " + item + "<br>";
// }