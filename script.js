let cityinput = document.getElementById('city_input'),
searchbtn = document.getElementById('searchbtn'),
locationbtn = document.getElementById('locationbtn'),
api_key = '9e18414a4e5db893ff7922eeeabe9e7e',
currentweather = document.querySelectorAll('.weather-left .card')[0],
namdaysforecastcard = document.querySelector('.day-forecast'),
aqicard = document.querySelectorAll('.highlights .card')[0],
sunrisecard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById("humidityVal"),
pressureVal = document.getElementById("pressureVal"),
visibilityVal = document.getElementById("visibilityVal"),
windspeedVal = document.getElementById("windspeedVal"),
feelsVal = document.getElementById("feelsVal"),
hourlyforecastcard = document.querySelector('.hourly-forecast'),
aqilist = ['Tốt', 'Khá', 'Trung Bình', 'Kém', 'Rất Kém'];

searchbtn.addEventListener('click', getcitycoordinates);
locationbtn.addEventListener('click', getusercoordinates);
cityinput.addEventListener('keyup', e => e.key === 'Enter' && getcitycoordinates());
window.addEventListener('load', getusercoordinates);

function getusercoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let {lat, lon} = position.coords;
        let reverse = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`;

        fetch(reverse).then(res => res.json()).then(data => {
            console.log(lon, lat);
            let {name, country, state} = data[0];
            getweather(name, lat, lon, country, state);
        }).catch(() => {
            alert("Lấy vị trí thấ bại");
        })
    }, error => {
        if(error.code === error.PERMISSION_DENIED) {
            alert("Cập nhật quyền");
        }
    });
}

function getweather(name, lat, lon, country, state) {
    let forecast_api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    weather_api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    airpollution_api_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
        'Thứ Hai',
        'Thứ Ba', 
        'Thứ Tư', 
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
        'Chủ Nhật'
    ],
    month = [
        'Tháng Một',
        'Tháng Hai',
        'Tháng Ba',
        'Tháng Tư',
        'Tháng Năm',
        'Tháng Sáu',
        'Tháng Bảy',
        'Tháng Tám',
        'Tháng Chín',
        'Tháng Mưới',
        'Tháng Mười Mốt',
        'Tháng Mười Hai'
    ];

    fetch(airpollution_api_url).then(res => res.json()).then(data => {
        console.log(data);
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqicard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqilist[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-solid fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
    }).catch(() => {
        alert("Lỗi");
    })

    fetch(weather_api_url).then(res => res.json()).then(data => {
        let date = new Date();
        currentweather.innerHTML = `
            <div class="current-weather">
                <div class="detail">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-solid fa-calendar-days"></i> ${days[date.getDay()]}, ${date.getDate()}, ${month[date.getMonth()]}, ${date.getFullYear()}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;
        let{sunrise, sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind, 
        sunrisetime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
        sunsettime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        sunrisecard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-solid fa-sun fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sunrisetime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-solid fa-mountain-sun fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sunsettime}</h2>
                    </div>
                </div>
            </div>
        `;
        humidityVal.innerHTML = `${humidity}`;
        pressureVal.innerHTML = `${pressure}`
        visibilityVal.innerHTML = `${visibility  / 1000}`
        windspeedVal.innerHTML = `${speed}m/s`
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`
        console.log(data);
    }).catch(() => {
        alert("Xem thời tiết thất bại");
    })

    fetch(forecast_api_url).then(res => res.json()).then(data => {
        console.log(data);
        let hourlyforecast = data.list;
        hourlyforecastcard.innerHTML = ``;
        for(i = 0; i < 7; i++) {
            let hrforecastDate = new Date(hourlyforecast[i].dt_txt);
            let hr = hrforecastDate.getHours();
            let a = 'PM';
            if (hr< 12) a = 'AM';
            if(hr==0) hr = 12;
            if (hr > 12) hr = hr - 12;
            hourlyforecastcard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyforecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyforecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `;
        }
        let unique = [];
        let namdays = data.list.filter(forecasr => {
            let dayforecast = new Date(forecasr.dt_txt).getDate();
            if (!unique.includes(dayforecast)) {
                return unique.push(dayforecast);
            }
        });
        console.log(namdays);
        namdaysforecastcard.innerHTML = ``;
        for(i = 1; i< namdays.length; i++) {
            let date = new Date(namdays[i].dt_txt);
            namdaysforecastcard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${namdays[i].weather[0].icon}.png" alt="">
                        <span>${(namdays[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${month[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert("Lỗi xem thời tiết");
    })
}

function getcitycoordinates() {
    let cityname = cityinput.value.trim();
    console.log(cityname);
    cityinput.value = '';
    if (!cityname) return;
    let api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${api_key}`;
    fetch(api_url).then(res => res.json()).then(data => {
        console.log(data)
        let {name, lat, lon, country, state} = data[0];
        getweather(name, lat, lon, country, state)
    }).catch(() => {
        alert(`Đã có lỗi khi nhập tên thành phố của ${cityname}`)
    })
}



