const userTab = document.querySelector('[data-userWeather]')
const SearchTab = document.querySelector('[data-searchWeather]')
const formContainer = document.querySelector('[data-search-form]')
const userInfo = document.querySelector('.user-info-container')
const grantAccessContainer = document.querySelector('.grant-location-container')
const loadingScreen = document.querySelector('.loading-container')
const API_KEY = 'aab3cc45e41cd16c4547d1b24065d080'
let currTab = userTab
currTab.classList.add('current-tab')
getfromSessionStorage()

function switchTab(clickedTab){
    if(currTab != clickedTab){
        let oldTab = currTab
        let newTab = clickedTab
        currTab = clickedTab
        oldTab.classList.remove('current-tab')
        newTab.classList.add('current-tab')

        if(newTab === userTab){
            formContainer.classList.remove('active')
            userInfo.classList.remove('active')
            getfromSessionStorage()
        }
        else{
            grantAccessContainer.classList.remove('active')
            userInfo.classList.remove('active')
            formContainer.classList.add('active')
        }
    }
}

userTab.addEventListener('click',() => {
    switchTab(userTab)
})

SearchTab.addEventListener('click',() => {
    switchTab(SearchTab)
})

function getfromSessionStorage(){
    let localCoordinates = sessionStorage.getItem('user-coordinates')
    if(!localCoordinates){
        grantAccessContainer.classList.add('active')
    }
    else{
        let coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}
const accessBtn = document.querySelector('[data-grant-access]')
accessBtn.addEventListener('click',() => {
    getLocation()
})

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert('Browser does not support the Geolocation features')
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        longi : position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

async function fetchUserWeatherInfo(coordinates){
    let lat = coordinates.lat
    let lon = coordinates.longi
    grantAccessContainer.classList.remove('active')
    loadingScreen.classList.add('active')
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data  = await response.json()
        loadingScreen.classList.remove('active')
        userInfo.classList.add('active')
        renderWeatherInfo(data)
    }
    catch(e){
        loadingScreen.classList.remove('active')
        console.log('Error Found => ', e)
    }
}

function renderWeatherInfo(data){
    const cityName = document.querySelector('[data-cityName]')
    const flag = document.querySelector('[data-weather-icon]')
    const desc = document.querySelector('[data-weatherDesc]')
    const icon = document.querySelector('[data-weatherIcon]')
    const temp = document.querySelector('[data-temp]')
    const windspeed = document.querySelector('[data-wind-speed]')
    const humidity = document.querySelector('[data-humidity]')
    const clouds = document.querySelector('[data-cloudiness]')
    cityName.innerText = data.name
    const countryCode = data.sys.country.toLowerCase()
    flag.src = `https://flagcdn.com/144x108/${countryCode}.png`
    desc.innerText = data.weather[0].description
    const iconCode = data.weather[0].icon
    icon.src = `http://openweathermap.org/img/w/${iconCode}.png`
    temp.innerText = `${data.main.temp} °C`
    windspeed.innerText = `${data.wind.speed} m/s`
    humidity.innerText = `${data.main.humidity} %`
    clouds.innerText = `${data.clouds.all} %`
}

const searchtext = document.querySelector('[data-search-input]')
const citybtn = document.querySelector('[data-search-form]')

citybtn.addEventListener('submit',(e) => {
    e.preventDefault()
    const city = searchtext.value
    if(city === "") return
    fetchSearchWeatherInfo(city)
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active')
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        console.log('Error Found => ', e)
    }
}