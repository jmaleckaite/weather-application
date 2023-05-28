let countries = ['London', 'Milan', 'Bangkok', 'Los Angeles', 'Nairobi'];
let cityWeatherArray = [{ city: 'London', temp: [], forecast: [] }, { city: 'Milan', temp: [], forecast: [] }, { city: 'Bangkok', temp: [], forecast: [] }, { city: 'Los Angeles', temp: [], forecast: [] }, { city: 'Nairobi', temp: [], forecast: [] }];

// Slider carousel creation
const slider = document.querySelector('.container');
let mouseDown = false;
let startX, scrollLeft;

let startDragging = function (e) {
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
};
let stopDragging = function (event) {
  mouseDown = false;
};

slider.addEventListener('mousemove', (e) => {
  e.preventDefault();
  if (!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
});

slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);



window.addEventListener("load", () => {
  formCityWeather();
});

const formCityWeather = async () => {
  countries.forEach(async (country, index) => {
    await fetchCityWeatherData(country, index);
  });
}

// Calling the weather API
const fetchCityWeatherData = async (cityName, index) => {
  // API URL
  const base =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&days=7&key=VNGGYXF6TNVPNV2XH5SC78VQ2&contentType=json`;

  try {
    let response = await fetch(base);
    let data = await response.json();
    cityWeatherArray[index].temp = data;
    let arr = [...slider.children];
    let childElement = arr[index];

    let paginationContainer = document.createElement('nav');
    paginationContainer.className = 'pagination-container';
    paginationContainer.setAttribute("card-index", index);
    for (let i = 0; i <= countries.length - 1; i++) {
      const pageIcon = document.createElement("button");
      pageIcon.setAttribute("page-index", i);
      if (i == index)
        pageIcon.className = "bx bxs-circle pagination-number";
      else
        pageIcon.className = "bx bx-circle pagination-number";
      paginationContainer.appendChild(pageIcon);
    }
    childElement.appendChild(paginationContainer);
    listenToPageClick();
    let location = document.createElement('div');
    location.className = 'location-title';
    location.innerHTML = `${cityWeatherArray[index].temp.address}`;
    childElement.appendChild(location);
    let description = document.createElement('div');
    description.className = 'description-title';
    description.innerHTML = `${cityWeatherArray[index].temp.currentConditions.conditions}`;
    childElement.appendChild(description);
    let temperature = document.createElement('div');
    temperature.className = 'temp-title';
    temperature.innerHTML = `${Math.floor(cityWeatherArray[index].temp.currentConditions.temp)}°`;
    childElement.appendChild(temperature);
    let temperatureMinMax = document.createElement('div');
    temperatureMinMax.className = 'temp-minmax-title';
    temperatureMinMax.innerHTML = `${Math.floor(cityWeatherArray[index].temp.days[0].tempmin)}°/${Math.floor(cityWeatherArray[index].temp.days[0].tempmax)}°`;
    childElement.appendChild(temperatureMinMax);
    formWeeklyForecast(data, index);
    let forecastElement = document.createElement('div');
    forecastElement.className = "forecast-container";
    cityWeatherArray[index].forecast.forEach((element, index) => {
      if (index < 7) {
        let forecastContainer = document.createElement('div');
        forecastContainer.className = "card";
        let forecastDate = document.createElement('div');
        forecastDate.className = 'forecast-date';
        element.datetime = new Date(element.datetime).toLocaleString('en-us', { weekday: 'short' })
        forecastDate.innerHTML = element.datetime;
        let forecastIcon = document.createElement('img');
        forecastIcon.src = `./MonochromeSVGIcons/${element.icon}.svg`;
        forecastIcon.className = 'forecast-icon';
        let forecastMinMaxContainer = document.createElement('div');
        let forecastMinMax = document.createElement('span');
        forecastMinMax.className = 'forecast-min-max';
        forecastMinMax.innerHTML = `${Math.floor(element.tempmin)}°/${Math.floor(element.tempmax)}°`;
        forecastContainer.appendChild(forecastDate);
        forecastContainer.appendChild(forecastIcon);
        forecastMinMaxContainer.appendChild(forecastMinMax);
        forecastContainer.appendChild(forecastMinMaxContainer);
        forecastElement.appendChild(forecastContainer);
      }
    });

    childElement.appendChild(forecastElement);
    addWaveSvg(childElement);
  } catch (error) {
    console.log(error);
  }
}

// Pagination click event
const listenToPageClick = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    const index = Number(button.getAttribute("page-index"));

    button.addEventListener("click", () => {
      switch (index) {
        case 0:
          document.getElementById("firstItem").scrollIntoView();
          break;
        case 1:
          document.getElementById("secondItem").scrollIntoView();
          break;
        case 2:
          document.getElementById("thirdItem").scrollIntoView();
          break;

        case 3:
          document.getElementById("fourthItem").scrollIntoView();
          break;

        case 4:
          document.getElementById("fifthItem").scrollIntoView();
          break;

        default:
          document.getElementById("firstItem").scrollIntoView();
          break;
      }
    });
  });
}

// Weekly forecast formation
const formWeeklyForecast = (data, index) => {
  let forecastArray = [];
  for (var i = 0; i < data.days.length; i++) {
    forecastArray.push(data.days[i]);
  }
  cityWeatherArray[index].forecast = forecastArray;
}

// Create Wave element
const addWaveSvg = (child) => {
  const waveSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const wavePath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  var gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  var stops = [
    {
      "color": "rgba(93.858, 112.308, 214.338, 1)",
      "offset": "0%"
    }, {
      "color": "rgba(14.96, 11, 255, 1)",
      "offset": "100%"
    }
  ];

  for (var i = 0, length = stops.length; i < length; i++) {
    var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', stops[i].offset);
    stop.setAttribute('stop-color', stops[i].color);
    gradient.appendChild(stop);
  }

  gradient.id = 'sw-gradient-0';
  gradient.setAttribute('x1', '0');
  gradient.setAttribute('x2', '0');
  gradient.setAttribute('y1', '1');
  gradient.setAttribute('y2', '0');
  defs.appendChild(gradient);

  waveSvg.setAttribute('id', 'svgWave');
  waveSvg.setAttribute('viewBox', '0 0 1440 450');
  waveSvg.setAttribute('version', '1.1');

  wavePath.setAttribute("id", "svgPath");
  wavePath.setAttribute(
    'd',
    'M0,315L18.5,330C36.9,345,74,375,111,382.5C147.7,390,185,375,222,367.5C258.5,360,295,360,332,345C369.2,330,406,300,443,300C480,300,517,330,554,345C590.8,360,628,360,665,360C701.5,360,738,360,775,315C812.3,270,849,180,886,172.5C923.1,165,960,240,997,270C1033.8,300,1071,285,1108,292.5C1144.6,300,1182,330,1218,322.5C1255.4,315,1292,270,1329,240C1366.2,210,1403,195,1440,217.5C1476.9,240,1514,300,1551,277.5C1587.7,255,1625,150,1662,127.5C1698.5,105,1735,165,1772,195C1809.2,225,1846,225,1883,210C1920,195,1957,165,1994,157.5C2030.8,150,2068,165,2105,150C2141.5,135,2178,90,2215,60C2252.3,30,2289,15,2326,52.5C2363.1,90,2400,180,2437,232.5C2473.8,285,2511,300,2548,315C2584.6,330,2622,345,2640,352.5L2658.5,360L2658.5,450L2640,450C2621.5,450,2585,450,2548,450C2510.8,450,2474,450,2437,450C2400,450,2363,450,2326,450C2289.2,450,2252,450,2215,450C2178.5,450,2142,450,2105,450C2067.7,450,2031,450,1994,450C1956.9,450,1920,450,1883,450C1846.2,450,1809,450,1772,450C1735.4,450,1698,450,1662,450C1624.6,450,1588,450,1551,450C1513.8,450,1477,450,1440,450C1403.1,450,1366,450,1329,450C1292.3,450,1255,450,1218,450C1181.5,450,1145,450,1108,450C1070.8,450,1034,450,997,450C960,450,923,450,886,450C849.2,450,812,450,775,450C738.5,450,702,450,665,450C627.7,450,591,450,554,450C516.9,450,480,450,443,450C406.2,450,369,450,332,450C295.4,450,258,450,222,450C184.6,450,148,450,111,450C73.8,450,37,450,18,450L0,450Z'
  );
  wavePath.setAttribute('fill', 'url(#sw-gradient-0)');

  waveSvg.appendChild(defs);
  waveSvg.appendChild(wavePath);
  child.appendChild(waveSvg);
}

// Mobile devices motion detection
const handleOrientation = (event) => {
  try {
    let gamma = event.gamma;
    let wavePath = document.getElementById("svgPath");

    // Right and left tilts
    if ((gamma > 0 && gamma < 90) || (gamma < 0 && gamma > -90)) {
      if (wavePath) {
        wavePath.setAttribute(
          'd',
          'M0,315L12.6,330C25.3,345,51,375,76,382.5C101.1,390,126,375,152,367.5C176.8,360,202,360,227,345C252.6,330,278,300,303,300C328.4,300,354,330,379,345C404.2,360,429,360,455,360C480,360,505,360,531,315C555.8,270,581,180,606,172.5C631.6,165,657,240,682,270C707.4,300,733,285,758,292.5C783.2,300,808,330,834,322.5C858.9,315,884,270,909,240C934.7,210,960,195,985,217.5C1010.5,240,1036,300,1061,277.5C1086.3,255,1112,150,1137,127.5C1162.1,105,1187,165,1213,195C1237.9,225,1263,225,1288,210C1313.7,195,1339,165,1364,157.5C1389.5,150,1415,165,1440,150C1465.3,135,1491,90,1516,60C1541.1,30,1566,15,1592,52.5C1616.8,90,1642,180,1667,232.5C1692.6,285,1718,300,1743,315C1768.4,330,1794,345,1806,352.5L1818.9,360L1818.9,450L1806.3,450C1793.7,450,1768,450,1743,450C1717.9,450,1693,450,1667,450C1642.1,450,1617,450,1592,450C1566.3,450,1541,450,1516,450C1490.5,450,1465,450,1440,450C1414.7,450,1389,450,1364,450C1338.9,450,1314,450,1288,450C1263.2,450,1238,450,1213,450C1187.4,450,1162,450,1137,450C1111.6,450,1086,450,1061,450C1035.8,450,1011,450,985,450C960,450,935,450,909,450C884.2,450,859,450,834,450C808.4,450,783,450,758,450C732.6,450,707,450,682,450C656.8,450,632,450,606,450C581.1,450,556,450,531,450C505.3,450,480,450,455,450C429.5,450,404,450,379,450C353.7,450,328,450,303,450C277.9,450,253,450,227,450C202.1,450,177,450,152,450C126.3,450,101,450,76,450C50.5,450,25,450,13,450L0,450Z'
        );
      }
    } else {
      if (wavePath) {
        wavePath.setAttribute(
          'd',
          'M0,315L18.5,330C36.9,345,74,375,111,382.5C147.7,390,185,375,222,367.5C258.5,360,295,360,332,345C369.2,330,406,300,443,300C480,300,517,330,554,345C590.8,360,628,360,665,360C701.5,360,738,360,775,315C812.3,270,849,180,886,172.5C923.1,165,960,240,997,270C1033.8,300,1071,285,1108,292.5C1144.6,300,1182,330,1218,322.5C1255.4,315,1292,270,1329,240C1366.2,210,1403,195,1440,217.5C1476.9,240,1514,300,1551,277.5C1587.7,255,1625,150,1662,127.5C1698.5,105,1735,165,1772,195C1809.2,225,1846,225,1883,210C1920,195,1957,165,1994,157.5C2030.8,150,2068,165,2105,150C2141.5,135,2178,90,2215,60C2252.3,30,2289,15,2326,52.5C2363.1,90,2400,180,2437,232.5C2473.8,285,2511,300,2548,315C2584.6,330,2622,345,2640,352.5L2658.5,360L2658.5,450L2640,450C2621.5,450,2585,450,2548,450C2510.8,450,2474,450,2437,450C2400,450,2363,450,2326,450C2289.2,450,2252,450,2215,450C2178.5,450,2142,450,2105,450C2067.7,450,2031,450,1994,450C1956.9,450,1920,450,1883,450C1846.2,450,1809,450,1772,450C1735.4,450,1698,450,1662,450C1624.6,450,1588,450,1551,450C1513.8,450,1477,450,1440,450C1403.1,450,1366,450,1329,450C1292.3,450,1255,450,1218,450C1181.5,450,1145,450,1108,450C1070.8,450,1034,450,997,450C960,450,923,450,886,450C849.2,450,812,450,775,450C738.5,450,702,450,665,450C627.7,450,591,450,554,450C516.9,450,480,450,443,450C406.2,450,369,450,332,450C295.4,450,258,450,222,450C184.6,450,148,450,111,450C73.8,450,37,450,18,450L0,450Z'
        );
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true);
}



