async function changeURL() {
    var url = window.location.href;
    if (url.indexOf('?') === -1) {
        var newURL = url + '?filters=';
        var newState = { page: 1 };
        history.pushState(newState, 'New Page Title', newURL);
    }
}

function changeFilter(filter) {
    var button = document.getElementById(filter);
    if (button.className === "filter-btn") {
        button.className = "filter-btn-active";
        var url = window.location.href;
        var newURL = url + filter + ',';
        var newState = { page: 1 };
        history.pushState(newState, 'New Page Title', newURL);
        getFoods();
    }
    else {
        button.className = "filter-btn";
        var url = window.location.href;
        var newURL = url.replace(filter + ',', '');
        var newState = { page: 1 };
        history.pushState(newState, 'New Page Title', newURL);
        getFoods();
    }
}

function changeState(filter) {
    var button = document.getElementById(filter);
    if (button.className === "filter-btn") {
        button.className = "filter-btn-active";
    }
    else {
        button.className = "filter-btn";
    }
}


function getFilters() {
    var filters = new URLSearchParams(window.location.search).get('filters');
    if (filters) {
        var filtersArray = filters.split(',');
        if (filters.slice(-1) === ",") {
            filtersArray.pop();
        }
        return filtersArray;
    }
    else {
        return null;
    }

}

async function checkBtns() {
    filtersArray = getFilters();
    console.log(filtersArray);
    if (filtersArray != null) {
        filtersArray.forEach(element => {
            document.getElementById(element).className = "filter-btn-active";
        });
    }
    else {
        var activeBtns = document.getElementsByClassName("filter-btn-active");
        activeBtns = Array.from(activeBtns);
        activeBtns.forEach(element => {
            element.className = "filter-btn";
        });
    }
}


function removeFilters() {
    var url = window.location.href;
    var newURL = url.split('?')[0] + '?filters=';
    var newState = { page: 1 };
    history.pushState(newState, 'New Page Title', newURL);
    checkBtns();
    getFoods();
}

function getUp() {
    window.scrollTo(0, 0);
}

function getFavorites() {
    var div = document.getElementById('favorite-foods');
    div.innerHTML = '';
    var favorites = { ...localStorage };
    if (Object.keys(favorites).length === 0) {
        div.innerHTML = '<p class="empty">Zatím jsi neolajkoval/a žádná jídla.</p>';
    }
    else {
        Object.keys(favorites).forEach(element => {
            getFavorite(element);
        });
    }

}

function getFavorite(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var foods = JSON.parse(this.responseText);

        var food = foods.find(function (food) {
            return food.id === id;
        });
        var section = document.getElementById("favorite-foods");
        if (food.length != 0) {
            var tags = food.tags;
            var tagsHTML = "";
            tags.forEach(tag => {
                tagsHTML += '<div class="filter-tag row">' + tag + '</div>';
            });
            var favorites = { ...localStorage };
            if (food.id in favorites) {
                buttonHTML = 'bi bi-suit-heart-fill';
            }
            else {
                buttonHTML = 'bi bi-suit-heart';
            }
            section.innerHTML += '<div class="favorite-holder col-12 position-relative mb-3"><button class="like shadow-lg" onclick="(toggleFavorite2(\'' + food.id + '\'))"><i class="' + buttonHTML + '" id="' + food.id + '"></i></button><a href="food/?id=' + food.id + '" class="food-link"><div class="food-card shadow-lg row p-0 m-0"><div class="col-12 p-0"><img src="https://img.youtube.com/vi/' + food.ytId + '/0.jpg" alt="' + food.name + '" class="w-100"></div><div class="col-12"><h3>' + food.name + '</h3></div><div class="col-12 tags">' + tagsHTML + '</div></div></a></div>';
        }
        else {
            section.innerHTML = '<p class="empty">Zatím jsi neolajkoval žádná jídla.</p>'
        }
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/foods.json", true);
    xhttp.send();
}

async function getFoods() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var data = JSON.parse(this.responseText); //vsechny jidla
        data.reverse();
        var section = document.getElementById("foods");

        filtersArray = getFilters(); //podle nich hledame



        if (filtersArray == null) {
            var foods = data; //Tady by to chtelo random poradi, pripadne vepredu co mas rad
        }
        else {
            cousines = []; //jen kuchyne
            filtersArray = filtersArray.filter((filter) => {
                if (filter === "americka" || filter === "italska" || filter === "asijska" || filter === "ceska" || filter === "mexicka" || filter === "ostatni") {
                    cousines.push(filter);
                    return false;
                }
                return true;
            });

            console.log("Kuchyne:");
            console.log(cousines);
            console.log("Suroviny:");
            console.log(filtersArray);

            var foods = data;

            if (cousines.length != 0) {
                foods = data.filter(food => cousines.some(filter => food.filters.includes(filter)));
            }


            console.log("Po kuchyních:");
            console.log(foods);

            if (filtersArray.length != 0) {
                foods = foods.filter(food => filtersArray.every(filter => food.filters.includes(filter)) && filtersArray.some(filter => food.filters.includes(filter)));
            }

            console.log("Po surovinách:");
            console.log(foods);
        }

        var favorites = { ...localStorage };

        section.innerHTML = "";
        if (foods.length != 0) {
            foods.forEach(food => {
                var tags = food.tags;
                var tagsHTML = "";
                tags.forEach(tag => {
                    tagsHTML += '<span class="filter-tag me-2">' + tag + '</span>';
                });

                if (food.id in favorites) {
                    buttonHTML = 'bi bi-suit-heart-fill';
                }
                else {
                    buttonHTML = 'bi bi-suit-heart';
                }
                section.innerHTML += '<div class="food-holder col-12 col-md-6 col-lg-4 position-relative"><button class="like shadow-lg" onclick="(toggleFavorite(\'' + food.id + '\'))"><i class="' + buttonHTML + '" id="' + food.id + '"></i></button><a href="food/?id=' + food.id + '" class="food-link"><div class="food-card shadow-lg row p-0 m-0"><div class="col-12 p-0"><img src="https://img.youtube.com/vi/' + food.ytId + '/0.jpg" alt="' + food.id + '" class="w-100"></div><div class="col-12"><h3>' + food.name + '</h3></div><div class="col-12 tags">' + tagsHTML + '</div></div></a></div>';
            });
        }
        else {
            section.innerHTML = '<p class="empty">Filtrům bohužel nevyhovují zatím žádné recepty. Zkus ubrat suroviny, nebo přidat světové kuchyně.</p>'
        }
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/foods.json", true);
    xhttp.send();
}

function getFoodId() {
    var id = new URLSearchParams(window.location.search).get('id');
    return id;
}

function toggleFavorite(id) {
    if (document.getElementById(id).className === 'bi bi-suit-heart') {
        document.getElementById(id).className = 'bi bi-suit-heart-fill';
        localStorage.setItem(id, id);
    }
    else {
        document.getElementById(id).className = 'bi bi-suit-heart';
        localStorage.removeItem(id);
    }
}

function toggleFavorite2(id) {
    toggleFavorite(id);
    getFavorites();
    getFoods();
}

function getFood() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var foodId = getFoodId();
        var foods = JSON.parse(this.responseText);

        var food = foods.find(function (food) {
            return food.id === foodId;
        });
        console.log(food);
        var section = document.getElementById("food-container");
        section.innerHTML = "";
        if (food.length != 0) {
            var tags = food.tags;
            var tagsHTML = "";
            tags.forEach(tag => {
                tagsHTML += '<div class="filter-tag row">' + tag + '</div>';
            });
            var favorites = { ...localStorage };
            if (food.id in favorites) {
                buttonHTML = 'bi bi-suit-heart-fill';
            }
            else {
                buttonHTML = 'bi bi-suit-heart';
            }
            document.title = food.name;
            section.innerHTML += '<div class="row m-0 p-0 w-100"><div class="col-12 p-0 m-0 w-100"><iframe src="https://www.youtube.com/embed/' + food.ytId + '" title="YouTube video player" frameborder="0" class="w-100" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="col-12 my-3 mx-0 p-2 p-lg-0 fi-tags" id="food-content"><h1 class="mb-3"><button class="like-f me-3" onclick="(toggleFavorite(\'' + food.id + '\'))"><i class="' + buttonHTML + '" id="' + food.id + '"></i></button>' + food.name + '</h1><div class="tags-f">' + tagsHTML + '</div></div></div>';


        }
        else {
            section.innerHTML = '<p class="empty">Nic jsme nenašli.</p>'
        }
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/foods.json", true);
    xhttp.send();
}

async function initialize() {
    await getBtns();
    changeURL();
    checkBtns();
    getFoods();
}

async function getBtns() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var categories = JSON.parse(this.responseText);

        var section = document.getElementById("filters");
        section.innerHTML = "";
        var cousines = "";
        var meat = "";
        var veggies = "";
        var basic = "";
        var seasoning = "";
        var cheese = "";
        var fruit = "";
        categories.forEach(cat => {
            console.log(cat.category);

            switch (cat.category) {
                case '1':
                    cousines += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '2':
                    meat += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '3':
                    veggies += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '4':
                    basic += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '5':
                    seasoning += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '6':
                    cheese += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
                case '7':
                    fruit += '<button class="filter-btn" id="' + cat.id + '" onclick="changeFilter(\'' + cat.id + '\')">' + cat.name + '</button>';
                    break;
            }

        });
        section.innerHTML += '<div class="filter"><h2 class="filter-h">🥢 Jaká kuchyň?</h2><div class="buttons">' + cousines + '</div></div><div class="filter"><h2 class="filter-h">🥩 Maso?</h2><div class="buttons">' + meat + '</div></div><div class="filter"><h2 class="filter-h">🥕 Zelenina?</h2><div class="buttons">' + veggies + '</div></div><div class="filter"><h2 class="filter-h">🥚 Základní suroviny?</h2><div class="buttons">' + basic + '</div></div><div class="filter"><h2 class="filter-h">🧂 Dochucení a bylinky?</h2><div class="buttons">' + seasoning + '</div></div><div class="filter"><h2 class="filter-h">🧀 Sýr?</h2><div class="buttons">' + cheese + '</div></div><div class="filter"><h2 class="filter-h">🍎 Ovoce?</h2><div class="buttons">' + fruit + '</div></div>';
        checkBtns();
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/categories.json", true);
    xhttp.send();
}

function getBtns2() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var categories = JSON.parse(this.responseText);

        var section = document.getElementById("filters");
        section.innerHTML = "";
        var cousines = "";
        var meat = "";
        var veggies = "";
        var basic = "";
        var seasoning = "";
        var cheese = "";
        var fruit = "";
        categories.forEach(cat => {
            console.log(cat.category);

            switch (cat.category) {
                case '1':
                    cousines += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
                case '2':
                    meat += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
                case '3':
                    veggies += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
                case '4':
                    basic += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
                case '5':
                    seasoning += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '"  type="button">' + cat.name + '</button>';
                    break;
                case '6':
                    cheese += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
                case '7':
                    fruit += '<button class="filter-btn" id="' + cat.id + '" onclick="changeState(\'' + cat.id + '\')" value="' + cat.name + '" type="button">' + cat.name + '</button>';
                    break;
            }

        });
        section.innerHTML += '<div class="filter"><h2 class="filter-h">🥢 Jaká kuchyň?</h2><div class="buttons">' + cousines + '</div></div><div class="filter"><h2 class="filter-h">🥩 Maso?</h2><div class="buttons">' + meat + '</div></div><div class="filter"><h2 class="filter-h">🥕 Zelenina?</h2><div class="buttons">' + veggies + '</div></div><div class="filter"><h2 class="filter-h">🥚 Základní suroviny?</h2><div class="buttons">' + basic + '</div></div><div class="filter"><h2 class="filter-h">🧂 Dochucení a bylinky?</h2><div class="buttons">' + seasoning + '</div></div><div class="filter"><h2 class="filter-h">🧀 Sýr?</h2><div class="buttons">' + cheese + '</div></div><div class="filter"><h2 class="filter-h">🍎 Ovoce?</h2><div class="buttons">' + fruit + '</div></div>';
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/categories.json", true);
    xhttp.send();
}

function getLastId() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var allFoods = JSON.parse(this.responseText);
        var lastFood = allFoods[allFoods.length - 1];
        var lastId = lastFood.id;
        document.getElementById("last-id").value = lastId;
    }
    xhttp.open("GET", "https://hulba.g6.cz/chalky/foods.json", true);
    xhttp.send();
}

function addData() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

    }

    var name = document.getElementById("input-name").value;
    var url = document.getElementById("input-url").value;
    var urlObject = new URL(url);
    console.log(name + url + ytId);


    if (url.includes("watch")) {
        var ytId = urlObject.searchParams.get('v');
    }
    else if (url.includes("shorts")) {
        var urlParts = url.split("/");
        var ytId = urlParts[urlParts.length - 1];
        ytId = ytId.split('?')[0];
    }
    else if (url.includes("youtu.be")) {
        var urlParts = url.split("/");
        var ytId = urlParts[urlParts.length - 1];
        ytId = ytId.split('?')[0];
    }
    else {
        alert('Zadej youtube url adresu!');
        var btns = document.getElementsByClassName("filter-btn-active");
        btns = Array.from(btns);
        btns.forEach(element => {
            element.className = "filter-btn";
        });
        document.getElementById("input-name").value = "";
        document.getElementById("input-url").value = "";
        getLastId();
        return;
    }

    url = url.split('&')[0];

    var btns = document.getElementsByClassName("filter-btn-active");
    btns = Array.from(btns);

    var filters = [];
    var tags = [];
    btns.forEach(element => {
        tags.push(element.value);
        filters.push(element.id);
    });


    var lastId = document.getElementById("last-id").value;
    lastId++;
    lastId = lastId.toString();
    const currentDate = new Date().toDateString();

    var jsonData = {
        id: lastId,
        name: name,
        url: url,
        ytId: ytId,
        filters: filters,
        tags: tags,
        added: currentDate
    };

    jsonData = JSON.stringify(jsonData);



    xhttp.open("POST", "https://hulba.g6.cz/chalky/addData.php?data=" + jsonData, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("https://hulba.g6.cz/chalky/addData.php?data=" + jsonData);
    xhttp.send(jsonData);
    alert('Úspěšně přidáno');
    var btns = document.getElementsByClassName("filter-btn-active");
    btns = Array.from(btns);
    btns.forEach(element => {
        element.className = "filter-btn";
    });
    document.getElementById("input-name").value = "";
    document.getElementById("input-url").value = "";
    getLastId();
}

function redirect() {
    if (window.location.protocol !== "https:") {
        window.location.href = "https://" + window.location.host + window.location.pathname + window.location.search;
    }
}