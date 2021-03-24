/*const appid ="57a6a3685de2d63e40c9d930216199fc";
const units ="metric";
//48.790367
//2.455572
//api.openweathermap.org/data/2.5/onecall?lang=fr&units="+units+"&lat=48.85&lon=2.27&exclude=hourly,daily&appid="+appid*/


let instance=null;
class MeteoAPP{

	constructor(){
		this.appid= document.body.dataset.appid || null;
		this.units= document.body.dataset.units || "metric";
		this.lang= document.body.dataset.lang  || "fr" ;
		this.url = "//api.openweathermap.org/data/2.5/";
		this.coords = null;

		if (!this.appid) {
			throw new Error('Appid is not defined');
		}

		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(position=>{
				this.coords = position.coords;
				this.weather();	
				this.hourly();
				this.daily();
			})
		}
	}

	weather(){
		let $weather = document.querySelector("#weather");
		if ($weather) {
			this.api('weather', {
				lat:this.coords.latitude,
				lon:this.coords.longitude
			}).then(response=>{
				$weather.querySelector(".ciel").innerHTML   = response.weather[0].description;
				$weather.querySelector(".minimal").innerHTML    = Math.round(response.main.temp_min)+"°";
				$weather.querySelector(".maximal").innerHTML    = Math.round(response.main.temp_max)+"°";
				$weather.querySelector(".current").innerHTML=Math.round(response.main.temp)+"°";
				console.log(response);
			});
		}
	}

    hourly(){
        let $hourly = document.querySelector("#prevision-hours");
        if ($hourly) {
            this.api('onecall', {
                lat:this.coords.latitude,
                lon:this.coords.longitude
            }).then(response=>{
                const date = new Date(response.hourly[0].dt * 1000);
                let firstHour = date.getHours();
                firstHour = Number(firstHour);
                const lastHour = 24;
                const totalHours = lastHour - firstHour;

                const hoursParentElement = document.getElementById('hours');
                for (let i = 0; i <= totalHours; i++) {
                    const lastDate = new Date(response.hourly[i].dt * 1000);
                    const hourElement = document.createElement('div');
                    const textElement = document.createTextNode(lastDate.getHours() +'h');
                    hourElement.appendChild(textElement);
                    hoursParentElement.appendChild(hourElement);
                }

                const iconsParentElement = document.getElementById('icons');
                for (let i = 0; i <= totalHours; i++) {
                    const lastDate = new Date(response.hourly[i].dt * 1000);
                    const iconElement = document.createElement('img');
                    const url = "http://openweathermap.org/img/wn/";
                    const ext = "@2x.png";
                    const uri = url + response.hourly[i].weather[0].icon + ext;
                    iconElement.src = uri;
                    iconsParentElement.appendChild(iconElement);
                }

                const tempsParentElement = document.getElementById('temps');
                for (let i = 0; i <= totalHours; i++) {
                    const lastDate = new Date(response.hourly[i].dt * 1000);
                    const degElement = document.createElement('div');
                    const textDegElement = document.createTextNode(Math.round(response.hourly[i].temp)+"°");
                    degElement.appendChild(textDegElement);
                    tempsParentElement.appendChild(degElement);
                }
                console.log(response);
            })
        }

    }

    daily(){
        let $daily = document.querySelector("#prevision-days");
        if ($daily) {
            this.api('onecall', {
                lat:this.coords.latitude,
                lon:this.coords.longitude
            }).then(response=>{
                for (let i = 1; i <= response.daily.length; i++) {
                    const date = new Date(response.daily[i].dt * 1000);
                    const day = date.getDay();
                    // console.log(day);
                    const state = response.daily[i].weather[0].description;
                    // console.log(state);
                    const maxTemp = Math.round(response.daily[i].temp.max) + '°';
                    const minTemp = Math.round(response.daily[i].temp.min) + '°';
                    console.log(day, state, minTemp, maxTemp);
                }
            })
        }
    }

    daily(){
        let $daily = document.querySelector("#prevision-days");
        if ($daily) {
            this.api('onecall', {
                lat:this.coords.latitude,
                lon:this.coords.longitude
            }).then(response=>{
                const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi'];
                const parentElement = document.getElementById('days');
                for (let i = 1; i < response.daily.length; i++) {
                    const rowElement = document.createElement('tr');
                    rowElement.setAttribute('id', 'day' + [i]);
                    const dayElement = document.createElement('td');
                    const stateElement = document.createElement('td');
                    const maxTempElement = document.createElement('td');
                    const minTempElement = document.createElement('td');
                    parentElement.appendChild(rowElement);
                    const trParentElement = document.getElementById('day' + [i]);

                    const date = new Date(response.daily[i].dt * 1000);
                    let day = date.getDay();
                    for (let y = 0; y < days.length; y++) {
                        if (day === y) {
                            day = days[y];
                        }
                    }
                    const dayTextElement = document.createTextNode(day);
                    dayElement.appendChild(dayTextElement);
                    trParentElement.appendChild(dayElement);
                    const state = response.daily[i].weather[0].description;
                    const stateTextElement = document.createTextNode(state);
                    stateElement.appendChild(stateTextElement);
                    trParentElement.appendChild(stateElement);

                    const maxTemp = Math.round(response.daily[i].temp.max) + '°';
                    const maxTempTextElement = document.createTextNode(maxTemp);
                    maxTempElement.appendChild(maxTempTextElement);
                    trParentElement.appendChild(maxTempElement);

                    const minTemp = Math.round(response.daily[i].temp.min) + '°';
                    const minTempTextElement = document.createTextNode(minTemp);
                    minTempElement.appendChild(minTempTextElement);
                    trParentElement.appendChild(minTempElement);
                    console.log(day, state, minTemp, maxTemp);
                }
            })
        }
    }


	api(apiName, query={}){
		let url = this.url + apiName +"?appid="+this.appid+"&units="+this.units+"&lang="+this.lang;
		for(let param in query){
			url+="&"+param+"="+query[param];		
		}
		return fetch(url).then(response=>response.json()) ;

	}

	static run(){
		if (!instance) {
			instance = new this;
		}
		return instance;
	}

}

console.log(MeteoAPP.run());









































