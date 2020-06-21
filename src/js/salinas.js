window.onload = () => {

	//000000000000000 COMMON 000000000000000\\

	// function that gets a cookie by name
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	// function that sets a cookie
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		console.log(cvalue);
	}

	// Check if cookie exists
	function checkCookie(checkme) {
		var cookiename = getCookie(checkme);
		if (cookiename == "") {
			return false;
		} else {
			return true;
		}
	}

	// Get the current date and time
	function timenow() {
		var now = new Date(),
		ampm = 'am',
		h = now.getHours(),
		m = now.getMinutes(),
		s = now.getSeconds();

		if (h >= 12) {
			if (h > 12) h -= 12;
				ampm = 'pm';
		}

		if (m < 10) m = '0' + m;
			if (s < 10) s = '0' + s;
				return now.toLocaleDateString() + ' ' + h + ':' + m + ':' + s + ' ' + ampm;
	}


	//000000000000000 Barchart API 000000000000000\\
	// Handle data from the Barchart API
	function getStocks() {
		var stockMarketData = document.getElementById("stockMarketData");
		var stockMarketDataSymbols = document.getElementById("stockMarketDataSymbols");

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {

		    	var res = JSON.parse(this.responseText);
		    	var output = '';

		    	for(var i=0; i < res.results.length; i++) {

	    			// Parse and convert to 2 decimal places
		    		var lastPrice = parseFloat(res.results[i].lastPrice).toFixed(2);
		    		var netChange = parseFloat(res.results[i].netChange).toFixed(2);
		    		var percentChange = parseFloat(res.results[i].percentChange).toFixed(2);

		    		// Adds highlight colors to the price changes. Green = positive price action, red = negative
		    		if(netChange >= 0)
		    			netChange = '<span class="pos">' + netChange + '</span>';
		    		else 
		    			netChange = '<span class="neg">' + netChange + '</span>';

		    		if(percentChange >= 0)
		    			percentChange = '<span class="pos">' + percentChange + '</span>';
		    		else 
		    			percentChange = '<span class="neg">' + percentChange + '</span>';

		    		output += 
		    			'<div class="flex-row flex-table-row">' +					
							'<div class="bold flex-1"><span class="badge badge-light on-md-sm">Symbol</span> '+ res.results[i].symbol +'</div>' +
							'<div class="flex-1"><span class="badge badge-light on-md-sm">Name</span> '+ res.results[i].name +'</div>' +
							'<div class="flex-1"><span class="badge badge-light on-md-sm">Last Price</span> '+ lastPrice +'</div>' +
							'<div class="flex-1"><span class="badge badge-light on-md-sm">Net Change</span> '+ netChange +'</div>' +
							'<div class="flex-1"><span class="badge badge-light on-md-sm">% Change</span> '+ percentChange +'</div>' +
							'<div class="flex-1"><span class="badge badge-light on-md-sm">Volume</span> '+ res.results[i].volume +'</div>' +
						'</div>';
		    	}
		    	stockMarketDataSymbols.innerHTML = output;
		    }
		};

		// Send request to the API
		setTimeout(function(){
			xhttp.open("GET", '/barchart');
			xhttp.send();
		}, 1000);
	}
	getStocks();


	//000000000000000 SEARCH SECTION 000000000000000\\
	var searchIcon = document.getElementById("searchIconContainer");
	var searchEngineForm = document.getElementById("searchEngineForm");

	var searchPreference_ck = "searchPreference";
	var searchEngine = "google";

	// Appends the input form elements to the search form based on the user's choice
	function setSearchEngine(pref) {
		if(pref == "google") {
			searchIcon.innerHTML = '<img src="./src/images/icons/google.png" alt="search icon">';
			searchEngineForm.innerHTML = '<input class="form-control" id="searchFormInput" data-search="google" placeholder="Search Google" type="text">';
		} else if (pref == "bing") {
			searchIcon.innerHTML = '<img src="./src/images/icons/bing.png" alt="search icon">';
			searchEngineForm.innerHTML = '<input class="form-control" id="searchFormInput" data-search="bing" placeholder="Search Bing" type="text">';
		} else {
			searchIcon.innerHTML = '<img src="./src/images/icons/duckduckgo.png" alt="search icon">';
			searchEngineForm.innerHTML = '<input class="form-control" id="searchFormInput" data-search="duckduckgo" placeholder="Search DuckDuckGo" type="text">';
		}
	}

	// Check if the cookie is set for the user's preferred search engine
	if(checkCookie(searchPreference_ck) == true) {
		if(getCookie(searchPreference_ck) != "google") {
			searchEngine = getCookie(searchPreference_ck);
			setSearchEngine(searchEngine);
		} else {
			setSearchEngine("google");
		}
	} else {
		setSearchEngine("google");
	}

	// Adds click event listener to all the dropdown items
	document.querySelectorAll('#searchOption').forEach(so => {
		so.addEventListener('click', event => {
			event.preventDefault();
			setSearchEngine(so.getAttribute('data-engine'));
			setCookie(searchPreference_ck, so.getAttribute('data-engine'), 365);
		});
	});

	// Handle the submit even for the search form
	searchEngineForm.addEventListener('submit', event => {
		event.preventDefault();
		var searchFormInput = document.getElementById("searchFormInput");
		var baseURL = '';

		// Determine which URL to add to the anchor tag
		if(searchFormInput.getAttribute('data-search') == 'google') {
			baseURL = "http://www.google.com/search?q=" + searchFormInput.value;
		} else if(searchFormInput.getAttribute('data-search') == 'bing') {
			baseURL = "https://www.bing.com/search?q=" + searchFormInput.value;
		} else if(searchFormInput.getAttribute('data-search') == 'duckduckgo'){
			baseURL = "https://duckduckgo.com/?q=" + searchFormInput.value;
		}

		// Add attributes to anchor tag and then click
		// Bypasses the need to open links like these in a new window rather than a new tab
		var searchAnchor = document.getElementById("searchAnchor");
		searchAnchor.setAttribute("href", baseURL);
		searchAnchor.setAttribute("target", "_blank");

		searchAnchor.click();
	});



	//000000000000000 NEWS API 000000000000000\\
	var c_code = "us";
	var newsItemsContainer = document.getElementById("news-items-container");
	var newsContent = '';

	function getNews(c_code) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    	var res = JSON.parse(this.responseText);

		    	for(var i = 0; i < 10; i++) {
		    		var author = '';

		    		if(res.articles[i].author === null || res.articles[i].author == '') {
		    			author = "<i>Unattributed</i>";
		    		} else {
		    			author = res.articles[i].author;
		    		}

		    		// Handle issue with "null" being returned by some article descriptions. Also strip HTML tags with .replace()
		    		var description = res.articles[i].description;
		    		if(description != null) {
		    			description = res.articles[i].description.replace(/(<([^>]+)>)/ig,"");
		    		} else {
		    			description = "";
		    		}

		    		// Handle issue with some articles not having images 
		    		var imageUrl = res.articles[i].urlToImage;
		    		if(imageUrl == null) {
		    			imageUrl = "src/images/salinas_logo.png";
		    		}

		    		newsContent += 
		    		'<div class="news-item">' +
						'<div class="flex-row">' +
							'<div flex-1>' +
								'<a href="'+res.articles[i].url+'" target="_blank"><div class="news-image"style="background-image:url('+imageUrl+');"></div></a>' +
							'</div>' +
							'<div class="flex-3">' +
								'<div class="news-content">' +
									'<a href="'+res.articles[i].url+'" target="_blank"><h5 class="news-title">'+res.articles[i].title+'</h5></a>' +
									'<span class="news-meta">' +
										author +' | '+res.articles[i].source.name+' | ' +res.articles[i].publishedAt + 
									'</span>' +
									'<div class="news-excerpt">' + description +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
		    	}

		    	newsItemsContainer.innerHTML = newsContent;
		    }
		};

		// Send request to the API
		setTimeout(function(){
			xhttp.open("GET", '/newsfeed');
			xhttp.send();
		}, 1000);

	}
	getNews();


	//000000000000000 The Weather Widget 000000000000000\\

	var API_KEY = "2ad65958f645f7dc372b22659ec2fbb0";
	var city_ck = "salinas-user-city";
	var current_city = "Toronto";
	var alertMessage = document.getElementById("alert-message");
	var setLocationForm = document.getElementById("setLocationForm");
	var setLocationResponse = document.getElementById("setLocationResponse");

	// Clear notification areas on launch
	alertMessage.innerHTML = "";

	// execute the function
	//checkCookie();
	if(checkCookie(city_ck) == false){
		$('#setLocationModal').modal('show');
	} else {
		current_city = getCookie(city_ck);
	}

	// Handle form submission for City selection
	setLocationForm.addEventListener("submit", function(event) {
		event.preventDefault();

		var city = document.getElementById("cityInput");
		
		setLocationResponse.innerHTML = '';

		// check if the location the user entered passes validation
		if (city.value.length > 0) {
			var regex = /^[a-zA-Z, ]*$/;
			if (regex.test(city.value)) {
				// calls the getCurrentWeather function with a flag that indicates the value
				// returned should be saved in the cookie
				getCurrentWeather(city.value, "new_cookie");
			} else {
				alert("Your city name can only contain letters and spaces."); // location contained special characters or numbers
			}
		} else {
			alert("Please type in a city name"); // no location entered
		}
	});

	/* ===== Get the current weather data =====*/
	function getCurrentWeather(c_city, flag) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {

		       	var res = JSON.parse(xhttp.responseText);

		       	document.getElementById("current-location-text").innerHTML = res.name + ", " + res.sys.country;
				document.getElementById("current-temp").innerHTML = parseFloat(res.main.temp).toFixed(1) + "<sup>°</sup>";
				document.getElementById("feels").innerHTML = res.main.feels_like + "°";
				document.getElementById("pressure").innerHTML = res.main.pressure + " pa";
				document.getElementById("humidity").innerHTML = res.main.humidity + " g/m3";
				document.getElementById("minMax").innerHTML = res.main.temp_min + "° to " + res.main.temp_max + "°";
				document.getElementById("wind").innerHTML = res.wind.speed+ " knots";
				document.getElementById("weather-icon").innerHTML = '<img src="http://openweathermap.org/img/wn/' + res.weather[0].icon + '.png" alt="weather-icon">';
				document.getElementById("current-weather-description").innerHTML = res.weather[0].main + ' (' + res.weather[0].description + ')';

				document.getElementById("timeNow").innerHTML = timenow();

				//save the cookie name
				if(flag == "new_cookie") {
					setCookie(city_ck, res.name, 365);
				}

		    } else if (this.readyState == 4 && this.status == 401) {
    			$('#alertModal').modal('show');
    			alertMessage.innerHTML = "401 Unauthorized Access.";
		    } else if (this.readyState == 4 && this.status == 404) {
		    	setLocationResponse.innerHTML = '<div class="msg msg-error">We couldn\'t find that city, pleast try again.</div>';
		    }
		};

		// Send request to the API
		setTimeout(function(){
			xhttp.open("GET", "https://api.openweathermap.org/data/2.5/weather?q="+ c_city +"&units=metric&appid="+API_KEY, true);
			xhttp.send();
		}, 1000);
	}

	// Call the function
	getCurrentWeather(current_city, null);

	// Add listener for the refresh button
	document.getElementById("current-w-refresh-button").addEventListener("click", function(e) {
		getCurrentWeather(current_city, null);
	});

} //===== /window.load