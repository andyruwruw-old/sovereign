// Inicializing Game Cookies.
function inicializeCookie(name, value, days) 
{
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; espires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path =/";
}

// Returns Cookie Value off name.
function getCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEq.length,c.length);
    }
    return null;
}

// Deletes Cookies for Reset
function eraseCookie(name) 
{
    document.cookie = name + '=; Max-Age = -99999999;';
}

function gameStartCookies()
{
    inicializeCookie(monthTime, 0, 1);
    inicializeCookies(lumberResource, 0, 1);
    inicializeCookies(foodResource, 0, 1);
    inicializeCookies(stoneResource, 0, 1);
    inicializeCookies(goldResource, 0, 1);

    inicializeCookies(housesNum, 0, 1);
    inicializeCookies(citizensNum, 0, 1);
    inicializeCookies(soldiersNum, 0, 1);
    inicializeCookies(satisfaction, 0.75, 1);

    inicializeCookies(workersFarm, 0, 1);
    inicializeCookies(workersLumber, 0, 1);
    inicializeCookies(workersSoldier, 0, 1);
    inicializeCookies(workersMine, 0, 1);
    inicializeCookies(workersTavern, 0, 1);
    inicializeCookies(workersArcher, 0, 1);

    inicializeCookies(weaponsNum, 0, 1);
    inicializeCookies(landNum, 0, 1);

    inicializeCookies(houseBuilding, 1, 1);
    inicializeCookies(farmBuilding, 0, 1);
    inicializeCookies(carpenterBuilding, 0, 1);
    inicializeCookies(lumberBuilding, 0, 1);
    inicializeCookies(barracksBuilding, 0, 1);
    inicializeCookies(mineBuilding, 0, 1);
    inicializeCookies(tavernBuilding, 0, 1);
    inicializeCookies(marketBuilding, 0, 1);
    inicializeCookies(wallsBuilding, 0, 1);
    inicializeCookies(siegeBuilding, 0, 1);
    inicializeCookies(townsqBuilding, 0, 1);

    inicializeCookies(lumberRate, 0, 1);
    inicializeCookie(foodRate, 0, 1);
    inicializeCookie(stoneRate, 0, 1);
    inicializeCookie(goldRate, 0, 1);
}

// Game Start Time keeping Program
function main() 
{
    // Fuction inicializes statistic Cookies.
    gameStartCookies();

    //Time Trackig
    var gameDone = 0;
    var startTime = Date.now();

    // Loops rus throughout game.
    while (!gameDone)
    {
        newMonth = monthTime;
        {
            monthTime = Math.floor((Date.now() - startTime) / 60000);
        }
        if (newMonth != monthTime)
        {
            
        }
    }

    var location = [1, 1]
    document.getElementById("location").innerHTML = location[0];
}

// Uses random to determin Invasion
function possibleInvasion()
{
    var invasionChance;
    if (Math.random() > invasionChance)
    {
        return 1;
    }
    else 
    {
        return 0;
    }
}

// Build's house, checks for land and lumber
function buildHouse(housesNum, landNum, lumberResource)
{
    var HOUSE_COST = 30;
    var HOUSES_PER_LAND = 50;
    if ((lumberResource < houseCost) && (housesNum <= (HOUSES_PER_LAND * landNum)))
    {
        housesNum += 1;
        lumberResource -= HOUSE_COST;
        
        return housesNum;
    }
    if (lumberResource < houseCost)
    {
        document.getElementById("notes").innerHTML = "Builder: You cannot build any more houses sire, we need more land.";
        return housesNum;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return housesNum;
    }
}

