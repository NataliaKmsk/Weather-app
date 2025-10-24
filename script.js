const input = document.querySelector('input')
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error_msg');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const weatherDesc = document.querySelector('p.weather_description');
const feelsLike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const visibility = document.querySelector('span.visibility');
const clouds = document.querySelector('span.clouds');
const pollutionImg = document.querySelector('span.img_pollution');
const pollutionValue = document.querySelector('p.value');

const APIinfo = {
    link : 'https://api.openweathermap.org/data/2.5/weather?q=',
    key : '&appid=f1c539f66b82815578e29c8d8370a849',
    units : '&units=metric',
    lang : '&lang=pl'
};

function getWeather (){
    APIcity = input.value;
    apiURL = `${APIinfo.link}${APIcity}${APIinfo.key}${APIinfo.units}${APIinfo.lang}`;
    //console.log(apiURL);

    axios.get(apiURL).then((response) => {
        console.log(response.data);
        const dat = response.data;
        cityName.textContent = `${dat.name}${dat.sys.country}`;
        weatherImg.src = `https://openweathermap.org/img/wn/${dat.weather[0].icon}@2x.png`
        temp.textContent = `${Math.round(dat.main.temp)}°C`;
        weatherDesc.textContent = `${dat.weather[0].description}`;
        feelsLike.textContent = `${Math.round(dat.main.feels_like)}°C`;
        pressure.textContent = `${dat.main.pressure}hPa`;
        humidity.textContent = `${dat.main.humidity}%`;
        windSpeed.textContent = `${Math.round((dat.wind.speed) * 3.6)}km/h`;
        visibility.textContent = `${dat.visibility / 1000}km`;
        clouds.textContent = `${dat.clouds.all}%`;
        // napisać kod czyszczący paragraf z błedem 
        errorMsg.textContent = ' ';

        //odpytac drugie api i wyświetlić dane o zanieczyszczeniu powietrza
        apiURLpollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${APIinfo.key}`;

        axios.get(apiURLpollution).then((res) => {
            const pollutionValueNum = res.data.list[0].components.pm2_5
            pollutionValueNum.textContent = `${res.data.list[0].
            components.pm2_5}`;

            if (pollutionValueNum < 10){
                pollutionImg.style.backgroundColor = '#58d96dff';
            }else if (pollutionValueNum >= 10 && pollutionValueNum < 25) {
                pollutionImg.style.backgroundColor = '#c4ea5bff';
            }else if (pollutionValueNum >= 25 && pollutionValueNum < 50) {
                pollutionImg.style.backgroundColor = '#bdd80dff';
            }else if (pollutionValueNum >= 50 && pollutionValueNum < 75) {
                pollutionImg.style.backgroundColor = '#ec940fff';
            }else {
                pollutionImg.style.backgroundColor = '#cf1818ff';
            }

            //napisać kod który będzie zmieniał kolor tła ikony w zależności z jakiego zakresu jest wartość zanieczyszczenia
            //w przypadku błędu w nazwie miasta należy wyczyścić również wartości o zanieczyszczeniu powietrza

            
        })

    }).catch((error) => {
        console.log(error.response.data);
        errorMsg.textContent = `${error.response.data.message}`;
        //napisać kod czyszczący wszystkie pola, które zawieraja informacje z poprzedniego zapytania (możnq użych forEach())
        const elementsToClear = [
            cityName, temp, weatherDesc, feelsLike, pressure, humidity, windSpeed, visibility, clouds, pollutionValue
        ];
        elementsToClear.forEach(el => el.textContent = '');

        weatherImg.src = '';
        pollutionImg.style.backgroundColor = 'transparent';

    }).finally(() => {
        input.value = '';
    })
    }

    function getWeatherByEnter (e){
        if (e.key == 'Enter') {
            getWeather();
        }
    }

button.addEventListener('click', getWeather);
input.addEventListener('keypress', getWeatherByEnter);