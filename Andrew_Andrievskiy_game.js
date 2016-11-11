function Creature(globalClass,localClass){
    var heroClasses = {
        warrior: {
            charClass: "Warrior",
            life: 30,
            damage: 4
        },
        rogue: {
            charClass: "Rogue",
            life: 25,
            damage: 3
        },
        sorcerer: {
            charClass: "Sorcerer",
            life: 20,
            damage: 5
        }
    };
    var monsterClasses = {
        zombie: {
            charClass: "Zombie",
            life: 8,
            damage: 4
        },
        skeleton: {
            charClass: "Skeleton",
            life: 10,
            damage: 6
        },
        holem: {
            charClass: "Holem",
            life: 15,
            damage: 6
        }
    };

    this.setAll = function(localClass){
        switch (localClass){
            case "warrior":
            case "rogue":
            case "sorcerer":
                for(key in heroClasses[localClass]){
                    this[key]=heroClasses[localClass][key];
                }
                break;
            case "zombie":
            case "skeleton":
            case "holem":
                for(key in monsterClasses[localClass]){
                    this[key]=monsterClasses[localClass][key];
                }
                break;
            default:
                throw new Error("Incorrect character class provided");
                break;


        }

    }
}
Creature.prototype.getCharClass = function(){
    return this.charClass;
}
Creature.prototype.getName= function() {
    return this.name;
}
Hero.prototype = new Creature();
function Hero(name, heroClass){
    var localClass = heroClass.toString().toLowerCase();
    this.setAll(localClass);
    this.name = name;
}

Hero.prototype.attack = function(target){
    if(target.name||(typeof target!=='object')){
        return  "I will attack only monsters";
    }
    else{
        target.life-=this.damage;
        if(target.life<0||target.life===0){
            target.life=0;
            return  "Hero attacked, " + target.charClass + " killed";
        }
        else{
            return "Hero attacked, done " +this.damage+" damage to "+ target.charClass;
        }
    }

}
////////////////////
Monster.prototype = new Creature();
function Monster(monsterClass){
    var localClass = monsterClass.toString().toLowerCase();
    this.setAll(localClass);
}
Monster.prototype.getName= function() {
    return "I am "+ this.charClass+ " I don`t have name";
}

Monster.prototype.attack = function(target){
    if(!target.name){
        return  "I will attack only hero";
    }
    else{
        target.life-=this.damage;
        if(target.life<0||target.life===0){
            target.life=0;
            return  "Hero attacked, " + target.charClass + " killed";
        }
        else{
            return "done " +this.damage+" damage to "+ target.charClass;
        }
    }
}
////////////////////////////
function addActor(){
    var maxMonsters = 2;
    var monsterCounter=0;
    this.addMonster=function(monster){
        if(monster.name|| (typeof monster!=='object') ){ //not Hero and not something(number,string...)
            throw new Error("Only monster Instances can become monsters");
        }
        if(this.monsters.length>=maxMonsters){
            throw new Error("Only 2 monsters can exist");
        }
        if(this.monsters[0]===monster){
            throw new Error("Please, create another Monster");
        }
        this.monsters.push(monster);
        monsterCounter++;
        return  "Monster Created, "+ this.monsters[this.monsters.length-1].charClass+ " appeared in the world";
    }
    this.addHero=function(Hero){
        if(this.hero){
            throw new Error("Only one hero can exist");
        }
        if(!Hero.name){
            throw new Error("Only hero instance can be hero");
        }
        this.hero=Hero;
        return"Hero created, welcome " + this.hero.name;
    }
}
Game.prototype = new addActor();
function Game(){
    this.monsters = [];
    this.status="Idle";

    this.fight = function(){
        if(this.status!=="In progress"){
            throw new Error("Begin your journey to start fighting monsters");
        }
        var monsterDead = false;

        if(this.monsters[0].life>0){
            while(this.hero.life>0&&this.monsters[0].life>0){
                this.hero.attack(this.monsters[0]);
                this.monsters[0].attack(this.hero);
            }
            return 'Hero win';
        }
        if((this.monsters.length-1)&&this.monsters[this.monsters.length-1].life>0){
            while(this.hero.life>0&&this.monsters[this.monsters.length-1].life>0){
                this.hero.attack(this.monsters[this.monsters.length-1]);
                this.monsters[this.monsters.length-1].attack(this.hero);
            }
            if(this.hero.life>0){
                return 'Hero win';
            }
            else{
                return 'Monster win';
            }
        }

    }
}
Game.prototype.beginJourney = function(){
    if(!this.hero||!this.monsters[0]){
        throw new Error("Cannot start journey, populate the world with hero and mosters first");
    }
    else{
        this.status="In progress";
        return  "Your journey has started, fight monsters";
    }
}
Game.prototype.finishJourney = function(){
    var monstersDead = true;
    for(var i=0; i<this.monsters.length; i++){//All monster dead
        if(this.monsters[i].life>0){
            monstersDead=false;
        }
    }
    if(this.status="In progress") {
        if (this.hero.life <= 0) {
            this.status='Finished';
            return  "The Game is finished. Hero is dead :(";
        }
        if (monstersDead) {
            this.status = "Finished";
            return "The Game is finished. Monstrs are dead. Congratulations";
        }
        else {
            this.status=  'In progress';
            return  "Don`t stop. Some monsters are still alive. Kill`em all";
        }

    }
}

var h = new Hero("Me", "Warrior");
var holem = new Monster("Holem");
var g = new Game();
g.addHero(h);
g.addMonster(holem);
g.beginJourney();
g.fight();
g.finishJourney();
