// Factors For Gameplay, Constant Variables, Adjusted for Balancing
const TIME_FACTORS = {MONTHS_PER_MIN: 1};

const LUMBER_FACTORS  = {WORTH: 2};
const FOOD_FACTORS    = {WORTH: 1};
const STONE_FACTORS   = {WORTH: 3};
const GOLD_FACTORS    = {WORTH: 1};
const WEAPON_FACTORS  = {WORTH: 20, STONE_COST: 5, GOLD_COST: 5};

const LAND_FACTORS    = {SQR_MILES: 25};
const SOLDIER_FACTORS = {GOLD_TRAIN: 20, WEAPON_TRAIN: 1, MONTHLY_WAGE: 5, BOOST: 0.01};
const ARCHER_FACTORS  = {GOLD_TRAIN: 50, WEAPON_TRAIN: 1, MONTHLY_WAGE: 5, BOOST: 0.02};
const CATAPULT_FACTORS = {GOLD_TRAIN: 100, LUMBER_COST: 50, SOLIDER_COST: 2, BOOST: .05, MONTHLY_WAGE: 10};
const CITIZEN_FACTORS = {FOOD_NEEDS: 1, CIT_INCOME: 10, BASE_SATISFACTION: 0.6, TAX_TO_SAT: 5, VISITORS: 0.25};

const GATHER_WOOD_FACTORS = {LUMBER: 20, TIME: .08, COOLDOWN_BOOL: 1};
const HUNT_FACTORS        = {FOOD: 10,   TIME: 0.5, COOLDOWN_BOOL: 1};
const TOWN_FAIR_FACTORS   = {FOOD: 100, GOLD: 50, SAT_BOOST: 0.1, TIME: 0.5, COOLDOWN_BOOL: 1, BOOST_LAST: 5, LOSS_BOOL: 0};

const HOUSE_FACTORS    = {PER_LAND: 20, LUMBER_COST: 100, BEDS: 5};
const FARM_FACTORS     = {PER_LAND: 5,  LUMBER_COST: 200, WORKER_SLOTS: 10, INCOME_PER_WORKER: 2};
const CW_FACTORS       = {PER_LAND: 1,  LUMBER_COST: 300};
const LM_FACTORS       = {PER_LAND: 2,  LUMBER_COST: 300, WORKER_SLOTS: 5,  INCOME_PER_WORKER: 30};
const BRK_FACTORS      = {PER_LAND: 1,  LUMBER_COST: 200, STONE_COST: 100};
const MINE_FACTORS     = {PER_LAND: 2,  LUMBER_COST: 100, WORKER_SLOTS: 10, INCOME_PER_WORKER: 2};
const TAVERN_FACTORS   = {PER_LAND: 1,  LUMBER_COST: 400, STONE_COST: 300,  WORKER_SLOTS: 3, INCOME_PER_WORKER: 5, SAT_BOOST: 0.1};
const MARKET_FACTORS   = {PER_LAND: 1,  LUMBER_COST: 200, GOLD_COST: 200,   GOLD_INCOME: 30, SAT_BOOST: 0.05};
const WALL_FACTORS     = {PER_LAND: 5,  LUMBER_COST: 300, STONE_COST: 500,  DEFENCE_BONUS: 0.1};
const SIEGE_FACTORS    = {PER_LAND: 1,  LUMBER_COST: 300, STONE_COST: 500,  GOLD_COST: 200};
const TOWN_SQR_FACTORS = {PER_LAND: 1,  LUMBER_COST: 50,  GOLD_COST: 50,    POPULATION: 30, SAT_BOOST: 0.05};

const DISASTER_FACTORS = {FIRE: 0.1, INVASION: 0.1, ROBBERS: 0.1, STORM: 0.1, PLAGUE: 0.1, FAMINE: 0.1, BEASTS: 0.1};
const BANKRUPT_FACTORS = {SAT_DEPRESSION: .1}
const STARVE_FACTORS = {SAT_DEPRESSION: .30}
const PLAGUE_FACTORS = {CIT_LOSS = 0.25};
const FAMINE_FACTORS = {FOOD_LOSS = 0.5};
const BEASTS_FACTORS = {CIT_LOSS = 0.2};

// Inicializing In-Game Variables
var monthTime = 0;
var resourceStat = {lumber: 0, food: 0, stone: 0, gold: 0, weaponsNum: 0, landNum: 0};
var citizensStat = {population: 2, satisfaction: 0.75, taxRate: 0.00};
var buildingNum = {houses: 1, farm: 0, carpenter: 0, lumbermill: 0, barracks: 0, mine: 0, tavern: 0, market: 0, walls: 0, siege: 0, townsqr: 0};
var laborDistribution = {farm: 0, lumber: 0, soldier: 0, mine: 0, tavern: 0, archer: 0, catapult: 0, free: 0};
var monthlyIncome = {lumberRate: 0, foodRate: 0, stoneRate: 0, goldRate: 0};
var chancesRatios = {defense: 0.0}

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-----------------------------------------------------------------TIME------------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// Game Start Time keeping Program
function main() 
{
    //Time Tracking
    var gameDone = 0;
    var startTime = Date.now();

    while (!gameDone)
    {
        monthChangeCheck = monthTime;
        monthTime = Math.floor((Date.now() - startTime) / (60000 * TIME_FACTORS.MONTHS_PER_MIN));
        
        monthlyIncome();
        satisfactionUpdates();

        if (newMonth != monthTime)
        {
            newMonth();
            immigrationChance();
        }
        
        updateStats()
    }


}

// Function for Cooldowns
function cooldownTimer(secondTimer)
{
    var count = 0;
    function addOne() { count = count + 1}
    var now = Date.now();

    while (Date.now() - now < (60000 * secondTimer))
    {
        addOne()
    }
    return 1;
}

// Adjusts Monthly Incomes
function monthlyIncome()
{
    // Food
    var foodIncome = 0;
    foodIncome += (laborDistribution.farm * FARM_FACTORS.INCOME_PER_WORKER);
    foodIncome -= (citizensStat.population * CITIZEN_FACTORS.FOOD_NEEDS);
    monthlyIncome.foodRate = Math.round(foodIncome);
    // Lumber
    var lumberIncome = 0;
    lumberIncome += (laborDistribution.lumber * LM_FACTORS.INCOME_PER_WORKER);
    monthlyIncome.lumberRate = Math.round(lumberIncome);
    // Stone
    var stoneIncome = 0;
    stoneIncome += (laborDistribution.mine * MINE_FACTORS.INCOME_PER_WORKER);
    monthlyIncome.stoneRate = Math.round(stoneIncome);
    // Gold
    var goldIncome = 0;
    goldIncome += (citizensStat.population * (CITIZEN_FACTORS.CIT_INCOME * citizensStat.taxRate));
    goldIncome += (TAVERN_FACTORS.INCOME_PER_WORKER * laborDistribution.tavern);
    goldIncome += (buildingNum.market * MARKET_FACTORS.GOLD_INCOME);
    goldIncome -= (laborDistribution.soldier * SOLDIER_FACTORS.MONTHLY_WAGE);
    goldIncome -= (laborDistribution.archer * ARCHER_FACTORS.MONTHLY_WAGE);
    goldIncome -= (laborDistribution.catapult * CATAPULT_FACTORS.MONTHLY_WAGE);
    monthlyIncome.goldRate = Math.round(goldIncome);

    return null;
}

function satisfactionUpdates()
{
    var baseSatisfaction = CITIZEN_FACTORS.BASE_SATISFACTION;
    baseSatisfaction += (buildingNum.tavern * TAVERN_FACTORS.SAT_BOOST);
    baseSatisfaction += (buildingNum.market * MARKET_FACTORS.SAT_BOOST);
    baseSatisfaction += (buildingNum.townsqr * TOWN_SQR_FACTORS.SAT_BOOST);
    baseSatisfaction -= (citizensStat.taxRate * TAX_TO_SAT);
    citizensStat.satisfaction = baseSatisfaction;
    return null;
}

// Update User Stats
function updateStats()
{
    document.getElementById("date").innerHTML = "Month: " + monthTime;
    document.getElementById("population").innerHTML = "Citizens: " + citizensStat.population;
    document.getElementById("satisfaction").innerHTML = "Satisfaction: " + citizensStat.satisfaction + "%";
    document.getElementById("food").innerHTML = "Food: " + resourceStat.food;
    document.getElementById("lumber").innerHTML = "Lumber: " + resourceStat.lumber;
    document.getElementById("stone").innerHTML = "Stone: " + resourceStat.stone;
    document.getElementById("wealth").innerHTML = "Gold: " + resourceStat.gold;
    document.getElementById("foodRate").innerHTML = "Food Income: " + monthlyIncome.foodRate + " per Month";
    document.getElementById("lumberRate").innerHTML = "Lumber Income: " + monthlyIncome.lumberRate + " per Month";
    document.getElementById("stoneRate").innerHTML = "Stone Income: " + monthlyIncome.stoneRate + " per Month";
    document.getElementById("wealthRate").innerHTML = "Gold Income: " + monthlyIncome.goldRate + " per Month";
    if (resourceStat.weaponsNum > 0)
    {
        document.getElementById("weapons").innerHTML = "Weapons: " + resourceStat.weaponsNum;
    }
    return null;
}

// Adds values each month. Checks for negative values, applies consequences.
function newMonth()
{
    resourceStat.lumber += monthlyIncome.lumberRate;
    if ((resourceStat.food += monthlyIncome.foodRate) < 0)
    {
        resourceStat.food = 0;
        citizensStat.population -= ((resourceStat.food += monthlyIncome.foodRate) / CITIZEN_FACTORS.FOOD_NEEDS);
        document.getElementById("notes").innerHTML = "Builder: Sire, our people are dying of stavation, we lost " + ((resourceStat.food += monthlyIncome.foodRate) / CITIZEN_FACTORS.FOOD_NEEDS) + " good people.";
        citizensStat.satisfaction -= STARVE_FACTORS.SAT_DEPRESSION;
    }
    else
    {
        resourceStat.food += monthlyIncome.foodRate;
    }
    resourceStat.stone += monthlyIncome.stoneRate;
    if ((resourceStat.gold += monthlyIncome.goldRate) < 0)
    {
        resourceStat.gold = 0;
        var goldDebt = -(resourceStat.gold += monthlyIncome.goldRate);
        for (var i = 0; i < goldDebt;)
        {
            if (laborDistribution.catapult > 0)
            {
                laborDistribution.catapult -= 1;
                laborDistribution.free += 2;
                i + CATAPULT_FACTORS.MONTHLY_WAGE;
            }
            else if (laborDistribution.archer > 0)
            {
                laborDistribution.archer -= 1;
                laborDistribution.free += 1;
                i + ARCHER_FACTORS.MONTHLY_WAGE;
            }
            else if (laborDistribution.soldier > 0)
            {
                laborDistribution.soldier -= 1;
                laborDistribution.free += 1;
                i + SOLDIER_FACTORS.MONTHLY_WAGE;
            }
            else 
            {
                resourceStat.gold += monthlyIncome.goldRate;
            }
        }
        document.getElementById("notes").innerHTML = "Builder: Sire we cannot afford to pay our army, those who were not paid have left their posts";
        citizensStat.satisfaction -= BANKRUPT_FACTORS.SAT_DEPRESSION;
    }
    else
    {
        resourceStat.gold += monthlyIncome.goldRate;
    }
    return null;
}

function immigrationChance()
{
    var newVisitors = citizensStat.population * CITIZEN_FACTORS.VISITORS;
    var availableBeds = (buildingNum.houses * HOUSE_FACTORS.BEDS) - citizensStat.population;
    var possibleImg = newVisitors;
    var imgOutcome = "but none were able to stay."
    var immigrantCit = 0;
    
    if (availableBeds < newVisitors)
    {
        possibleImg = availableBeds;
    }

    for (var i = 0; i < possibleImg; i++)
    {
        if (Math.random() < citizensStat.satisfaction)
        {
            immigrantCit += 1;
        }
    }
    if (immigrantCit > 0)
    {
        imgOutcome = immigrantCit + " were chose to stay."
    }
    document.getElementById("notes").innerHTML = "Builder: The kingdom had " + newVisitors + " visitors, " + imgOutcome;
    return null;
}

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-----------------------------------------------------------------ACTIONS---------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// GATHERING WOOD
function gatherWood()
{
    if (GATHER_WOOD_FACTORS.COOLDOWN_BOOL)
    {
        GATHER_WOOD_FACTORS.COOLDOWN_BOOL = 0;
        GATHER_WOOD_FACTORS.COOLDOWN_BOOL = cooldownTimer(GATHER_WOOD_FACTORS.TIME)
        while(!GATHER_WOOD_FACTORS.COOLDOWN_BOOL)
        {
            document.getElementById("notes").innerHTML = "Builder: Gathering wood...";
            if (GATHER_WOOD_FACTORS.COOLDOWN_BOOL)
            {
                resourceStat.lumber += GATHER_WOOD_FACTORS.LUMBER;
                document.getElementById("notes").innerHTML = "Builder: We have returned with the lumber!";
                return null;
            }
        }
    }
    else
    {
        document.getElementById("notes").innerHTML = "Builder: You have to wait until you bring back the wood from your last gathering!";
        return null;
    }
}

// HUNTING FOR FOOD
function huntFood()
{
    if (HUNT_FACTORS.COOLDOWN_BOOL)
    {
        HUNT_FACTORS.COOLDOWN_BOOL = 0;
        HUNT_FACTORS.COOLDOWN_BOOL = cooldownTimer(HUNT_FACTORS.TIME)
        while(!HUNT_FACTORS.COOLDOWN_BOOL)
        {
            document.getElementById("notes").innerHTML = "Builder: A hunting party has been sent out...";
            if (HUNT_FACTORS.COOLDOWN_BOOL)
            {
                resourceStat.food += HUNT_FACTORS.FOOD;
                document.getElementById("notes").innerHTML = "Builder: The hunting party has returned successfully!";
                return null;
            }
        }
    }
    else
    {
        document.getElementById("notes").innerHTML = "Builder: You have to wait until the current hunting party returns!";
        return null;
    }
}

// TOWN FAIRE!
function townFaire()
{
    if (TOWN_FAIR_FACTORS.COOLDOWN_BOOL)
    {
        resourceStat.food -= TOWN_FAIR_FACTORS.FOOD;
        resourceStat.gold -= TOWN_FAIR_FACTORS.GOLD;
        TOWN_FAIR_FACTORS.COOLDOWN_BOOL = 0;
        TOWN_FAIR_FACTORS.COOLDOWN_BOOL = cooldownTimer(TOWN_FAIR_FACTORS.TIME)
        while(!TOWN_FAIR_FACTORS.COOLDOWN_BOOL)
        {
            document.getElementById("notes").innerHTML = "Builder: The village is preparing for the faire!";
            if (TOWN_FAIR_FACTORS.COOLDOWN_BOOL)
            {
                citizensStat.satisfaction += TOWN_FAIR_FACTORS.SAT_BOOST;
                document.getElementById("notes").innerHTML = "Builder: The faire was a huge success, moral is high!";
                var moralLost = TOWN_FAIR_FACTORS.BOOST_LAST;
                TOWN_FAIR_FACTORS.COOLDOWN_BOOL = 0;
                TOWN_FAIR_FACTORS.COOLDOWN_BOOL = cooldownTimer(1);
                while(moralLost != 0)
                {
                    if (TOWN_FAIR_FACTORS.COOLDOWN_BOOL)
                    {
                        moralLost -= 1;
                        citizensStat.satisfaction -= (.02);
                        TOWN_FAIR_FACTORS.COOLDOWN_BOOL = 0;
                        TOWN_FAIR_FACTORS.COOLDOWN_BOOL = cooldownTimer(1);
                    }
                }
            }
        }
    }
    else
    {
        document.getElementById("notes").innerHTML = "Builder: We already have a faire planned Sire!";
        return null;
    }
}

// CHANGE TAXES
function addTaxes()
{
    citizensStat.taxRate += 0.01;
    return null;
}
function subTaxes()
{
    citizensStat.taxRate -= 0.01;
    return null;
}

// Training Troops
function trainTroops()
{
    if ((resourceStat.gold >= SOLDIER_FACTORS.GOLD_TRAIN) && (laborDistribution.free > 0) && (resourceStat.weaponsNum >= SOLDIER_FACTORS.WEAPON_TRAIN))
    {
        laborDistribution.soldier += 1;
        laborDistribution.free -= 0;
        resourceStat.gold -= SOLDIER_FACTORS.GOLD_TRAIN;
        resourceStat.weaponsNum -= SOLDIER_FACTORS.WEAPON_TRAIN;
        document.getElementById("notes").innerHTML = "Builder: A new soldier was trained.";
        return null;
    }
    else if (resourceStat.gold < SOLDIER_FACTORS.GOLD_TRAIN)
    {
        document.getElementById("notes").innerHTML = "Builder: We don't have enough gold to train!";
        return null;
    }
    else if (laborDistribution.free < 1)
    {
        document.getElementById("notes").innerHTML = "Builder: Free up some workers to train a soldier!";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have any weapons to train him with."
        return null;
    }
}

// Train Archers
function trainArchers()
{
    if ((resourceStat.gold >= ARCHER_FACTORS.GOLD_TRAIN) && (laborDistribution.free > 0) && (resourceStat.weaponsNum >= ARCHER_FACTORS.WEAPON_TRAIN) && (buildingNum.walls > 0))
    {
        laborDistribution.archer += 1;
        laborDistribution.free -= 0;
        resourceStat.gold -= ARCHER_FACTORS.GOLD_TRAIN;
        resourceStat.weaponsNum -= ARCHER_FACTORS.WEAPON_TRAIN;
        document.getElementById("notes").innerHTML = "Builder: A new archer was trained.";
        return null;
    }
    else if (buildingNum.walls < 1)
    {
        document.getElementById("notes").innerHTML = "Builder: We need walls to train an archer.";
        return null;
    }
    else if (resourceStat.gold < ARCHER_FACTORS.GOLD_TRAIN)
    {
        document.getElementById("notes").innerHTML = "Builder: We don't have enough gold to train!";
        return null;
    }
    else if (laborDistribution.free < 1)
    {
        document.getElementById("notes").innerHTML = "Builder: Free up some workers to train an archer!";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have any weapons to train him with."
        return null;
    }
}

// Build Catapults
function buildCatapults()
{
    if ((resourceStat.gold >= CATAPULT_FACTORS.GOLD_TRAIN) && ((laborDistribution.free > 1) || (laborDistribution.soldier > 1)) && (resourceStat.lumber >= CATAPULT_FACTORS.LUMBER_COST) && (buildingNum.siege > 0))
    {
        laborDistribution.catapult += 1;
        if (laborDistribution.free > 1)
        {
            laborDistribution.free -= 2;
        }
        else
        {
            laborDistribution.soldier -= 2;
        }
        resourceStat.gold -= CATAPULT_FACTORS.GOLD_TRAIN;
        resourceStat.lumber -= CATAPULT_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: A new catapult is ready.";
        return null;
    }
    else if (buildingNum.siege < 1)
    {
        document.getElementById("notes").innerHTML = "Builder: We need a siege factory to build a catapult.";
        return null;
    }
    else if (resourceStat.lumber < CATAPULT_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: We don't have enough lumber to build!";
        return null;
    }
    else if (resourceStat.gold < CATAPULT_FACTORS.GOLD_TRAIN)
    {
        document.getElementById("notes").innerHTML = "Builder: We don't have enough gold to train!";
        return null;
    }
    else
    {
        document.getElementById("notes").innerHTML = "Builder: There are no free soldiers or civilians to train!";
        return null;
    }
}

//
function makeWeapons()
{
    if ((resourceStat.stone >= WEAPON_FACTORS.STONE_COST) && (resourceStat.gold >= WEAPON_FACTORS.GOLD_COST))
    {
        resourceStat.weaponsNum += 1;
        resourceStat.gold -= WEAPON_FACTORS.GOLD_COST;
        resourceStat.stone -= WEAPON_FACTORS.STONE_COST;
        document.getElementById("notes").innerHTML = "Builder: Weapons built.";
        return null;
    }
    else if (resourceStat.gold < WEAPON_FACTORS.GOLD_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: We don't have enough gold to make this!";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we don't have enough stone to make this!"
        return null;
    }
}

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-----------------------------------------------------------------BUILDING--------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// BUILD A HOUSE
function buildHouse()
{
    if ((resourceStat.lumber >= HOUSE_FACTORS.LUMBER_COST) && (buildingNum.houses < (HOUSE_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.houses += 1;
        resourceStat.lumber -= HOUSE_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: A new house was built! We now have space for more citizens.";
        return null;
    }
    else if (buildingNum.houses >= (HOUSE_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: You cannot build any more houses sire, we need more land.";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

// START A FARM
function startFarm()
{
    if ((resourceStat.lumber >= FARM_FACTORS.LUMBER_COST) && (buildingNum.farm < (FARM_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.farm += 1;
        resourceStat.lumber -= FARM_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: The villiagers have started a new farm to provide food!";
        return null;
    }
    else if (buildingNum.farm >= (FARM_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: You cannot build any more farms sire, we need more land.";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

// BUILD CARPENTERS WORKSHOP
function buildCarpentersWorkshop()
{
    if ((resourceStat.lumber >= CW_FACTORS.LUMBER_COST) && (buildingNum.carpenter < (CW_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.carpenter += 1;
        resourceStat.lumber -= CW_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: We built a carpenter's workshop! I can now create all kinds of buildings, Sire.";
        return null;
    }
    else if (buildingNum.houses >= (HOUSE_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We do not need another carpenter's workshop!";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

// BUILD LUMBER MILL
function buildLumberMill()
{
    if ((resourceStat.lumber >= LUMBER_FACTORS.LUMBER_COST) && (buildingNum.lumbermill < (LUMBER_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.lumbermill += 1;
        resourceStat.lumber -= LUMBER_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: We now have a lumbermill! Send citizens to work there and they'll automatically gather!";
        return null;
    }
    else if (buildingNum.lumbermill >= (LM_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: You cannot build any more lumbermills sire, our land has no available forests.";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

// START A MINE
function startMine()
{
    if ((resourceStat.lumber >= MINE_FACTORS.LUMBER_COST) && (buildingNum.mine < (MINE_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.mine += 1;
        resourceStat.lumber -= MINE_FACTORS.LUMBER_COST;
        document.getElementById("notes").innerHTML = "Builder: We now have a mine! Send citizens to work there and they'll automatically gather!";
        return null;
    }
    else if (buildingNum.mine >= (MINE_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: You cannot build any more mines sire, we need more land.";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

// BUILD A BARRACKS
function buildBarracks()
{
    if ((resourceStat.lumber >= BRK_FACTORS.LUMBER_COST) && (resourceStat.stone >= BRK_FACTORS.STONE_COST) && (buildingNum.barracks < (BRK_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.barracks += 1;
        resourceStat.lumber -= BRK_FACTORS.LUMBER_COST;
        resourceStat.stone -= BRK_FACTORS.STONE_COST;
        document.getElementById("notes").innerHTML = "Builder: Sire, we now have a barracks in which we can train troops.";
        return null;
    }
    else if (buildingNum.barracks >= (BRK_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We do not need another barracks Sire!";
        return null;
    }
    else if (resourceStat.lumber < BRK_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough stone."
        return null;
    }
}

// BUILD A TAVERN
function buildTavern()
{
    if ((resourceStat.lumber >= TAVERN_FACTORS.LUMBER_COST) && (resourceStat.stone >= TAVERN_FACTORS.STONE_COST) && (buildingNum.tavern < (TAVERN_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.tavern += 1;
        resourceStat.lumber -= TAVERN_FACTORS.LUMBER_COST;
        resourceStat.stone -= TAVERN_FACTORS.STONE_COST;
        document.getElementById("notes").innerHTML = "Builder: We now have a tavern!";
        return null;
    }
    else if (buildingNum.tavern >= (TAVERN_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We can't build another tavern Sire!";
        return null;
    }
    else if (resourceStat.lumber < TAVERN_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough stone."
        return null;
    }
}

// BUILD A MARKET
function buildMarket()
{
    if ((resourceStat.lumber >= MARKET_FACTORS.LUMBER_COST) && (resourceStat.gold >= MARKET_FACTORS.GOLD_COST) && (buildingNum.market < (MARKET_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.market += 1;
        resourceStat.lumber -= MARKET_FACTORS.LUMBER_COST;
        resourceStat.gold -= MARKET_FACTORS.GOLD_COST;
        document.getElementById("notes").innerHTML = "Builder: We now have a market, you can trade gold for resources or vice versa. Taxes from the market provide wealth monthly.";
        return null;
    }
    else if (buildingNum.barracks >= (MARKET_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We do not need another market Sire!";
        return null;
    }
    else if (resourceStat.lumber < MARKET_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough gold."
        return null;
    }
}

// BUILD WALLS
function buildWalls()
{
    if ((resourceStat.lumber >= WALL_FACTORS.LUMBER_COST) && (resourceStat.stone >= WALL_FACTORS.STONE_COST) && (buildingNum.walls < (WALL_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.walls += 1;
        resourceStat.lumber -= WALL_FACTORS.LUMBER_COST;
        resourceStat.stone -= WALL_FACTORS.STONE_COST;
        document.getElementById("notes").innerHTML = "Builder: The walls are up! We are better prepared to fight off any invasion and we can now train archers.";
        return null;
    }
    else if (buildingNum.walls >= (WALL_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: Our walls can't be built up any more!";
        return null;
    }
    else if (resourceStat.lumber < WALL_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough stone."
        return null;
    }
}

// BUILD A SIEGE WORKSHOP
function buildSiegeWorkshop()
{
    if ((resourceStat.lumber >= SIEGE_FACTORS.LUMBER_COST) && (resourceStat.stone >= SIEGE_FACTORS.STONE_COST) && (resourceStat.gold >= SIEGE_FACTORS.GOLD_COST) && (buildingNum.siege < (SIEGE_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.siege += 1;
        resourceStat.lumber -= SIEGE_FACTORS.LUMBER_COST;
        resourceStat.stone -= SIEGE_FACTORS.STONE_COST;
        resourceStat.gold -= SIEGE_FACTORS.GOLD_COST;
        document.getElementById("notes").innerHTML = "Builder: The siege factory is now ready to produce catapults!";
        return null;
    }
    else if (buildingNum.siege >= (SIEGE_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We do not need another barracks Sire!";
        return null;
    }
    else if (resourceStat.lumber < SIEGE_FACTORS.LUMBER_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
    else if (resourceStat.gold < SIEGE_FACTORS.GOLD_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough gold."
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough stone."
        return null;
    }
}

// BUILD A TOWN SQUARE
function buildTownSquare()
{
    if (((citizensStat.population >= TOWN_FAIR_FACTORS.POPULATION) && resourceStat.townsqr >= TOWN_SQR_FACTORS.LUMBER_COST) && (resourceStat.gold >= TOWN_SQR_FACTORS.GOLD_COST) && (buildingNum.townsqr < (TOWN_SQR_FACTORS.PER_LAND * resourceStat.landNum)))
    {
        buildingNum.townsqr += 1;
        resourceStat.lumber -= TOWN_SQR_FACTORS.LUMBER_COST;
        resourceStat.gold -= TOWN_SQR_FACTORS.GOLD_COST;
        document.getElementById("notes").innerHTML = "Builder: The citizens love the town square! Throw faires to make them happy.";
        return null;
    }
    else if (buildingNum.townsqr >= (TOWN_SQR_FACTORS.PER_LAND * resourceStat.landNum))
    {
        document.getElementById("notes").innerHTML = "Builder: We already love the town square we have!";
        return null;
    }
    else if (citizensStat.population < TOWN_FAIR_FACTORS.POPULATION)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we don't have enough people for a town square!"
        return null;
    }
    else if (resourceStat.gold < TOWN_SQR_FACTORS.GOLD_COST)
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough gold.";
        return null;
    }
    else 
    {
        document.getElementById("notes").innerHTML = "Builder: Sire, we do not have enough wood."
        return null;
    }
}

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    /*
    var location = [1, 1]
    document.getElementById("location").innerHTML = location[0];

        
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
        */