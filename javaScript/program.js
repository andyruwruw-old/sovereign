

function main() 
{
    var monthTime = 0,
    lumberResource = 0,
    foodResource = 0,
    stoneResource = 0,
    goldResource = 0,

    housesNum = 0,
    citizensNum = 0,
    soldiersNum = 0,
    satisfaction = 0.75,

    jobAssignment = {farm: 0, carpenter: 0, lumber: 0, soldier: 0, mine: 0, tavern: 0, archer: 0},

    weaponsNum = 0,
    landNum = 1,

    houseBuilding = 1,
    farmBuilding = 0,
    carpenterBuilding = 0,
    lumberBuilding = 0,
    barracksBuilding = 0,
    mineBuilding = 0,
    tavernBuilding = 0,
    marketBuilding = 0,
    wallsBuilding = 0,
    siegeBuilding = 0,
    townsqBuilding = 0;

    var gameDone = 0;
    var startTime = Date.now();

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

function possibleInvasion()
{

    if (Math.random() > invasionChance)
    {
        return 1;
    }
    else 
    {
        return 0;
    }
}

function buildHouse(housesNum, landNum, lumberResource)
{
    var HOUSE_COST = 10;
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

