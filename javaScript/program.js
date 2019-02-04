// Inicializing Game Variables
var monthTime = 0;
var resourceStat = {lumber: 0, food: 0, stone: 0, gold: 0, weaponsNum: 0, landNum: 0};
var citizensStat = {population: 2, satisfaction: 0.75};
var buildingsStat = {houses: 1, farm: 0, carpenter: 0, lumbermill: 0, barracks: 0, mine: 0, tavern: 0, market: 0, walls: 0, siege: 0, townsqr: 0};
var laborDistribution = {farm: 0, lumber: 0, soldier: 0, mine: 0, tavern: 0, archer: 0, free: 0};
var monthlyIncome = {lumberRate: 0, foodRate: 0, stoneRate: 0, goldRate: 0};

var SOLDIER_FACTORS = {GOLD_TRAIN_SOLDIER: 20, WEAPON_TRAIN_SOLDIER: 1, MONTHLY_SOLDIER_WAGE: 5}
var CITIZEN_FACTORS = {CIT_PER_HOUSE: 5, HOUSES_PER_LAND: 20, FOOD_PER_CIT: 1, GOLD_TRAIN_SOLDIER: 20, WEAPON_TRAIN_SOLDIER}

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

