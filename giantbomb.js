/**
The data source for obtaining information from giantbomb
@param {string} apiKey - Consumer key.
@param {string} apiSecret - Consumer secret. 
@param {string} type request - search, game
https://www.giantbomb.com/api/documentation
@example 
var giant = new GiantBomb("Consumer key" ,10, "game" );
var r = giant.search('search/',query);
result(giant.getGamesArray(r));
//result( r , function(id) { return giant.extra(id);});



*/


/**
constructor
**/
function GiantBomb (apiKey ,searchLimit, type) {
    this.apiKey = apiKey;
    this.type = type;
	this.searchLimit = searchLimit;
	this.url = "https://www.giantbomb.com/api/";
	this.platformsPriority = ["PC","PS4","TurboGrafx-16","PC-FX","TGCD","PCFX"];
	
	
}
/**
Issue a search query to GiantBomb database.
@param {string} query - Search query.
@return json
*/
GiantBomb.prototype.search = function(resource,query) {
	var filter="&field_list=id";
  var searchString= this.url+resource+'?api_key='+this.apiKey+'&query='+ encodeURIComponent(query)+'&resources='+ this.type +'&format=json&limit='+this.searchLimit+filter;
  var result = http().get(searchString);
  var json = JSON.parse(result.body);
  return json.results;  
}///search

/**
@param (array) games : json results of the search
@description : build an array[title,desc]
**/
GiantBomb.prototype.getGamesArray = function(games) {
	var resultArray=[];
	for (i=0;i<games.length;i++){
		var object = {}; 
		var object = this.getGame(games[i].id);
		resultArray.push(object);
	}
	return (resultArray);
}///getGamesArray

/**
@param {string} id - The resource identifier.
@return array of game
*/
GiantBomb.prototype.getGame = function(id) {
	
	var gameID = '3030-'+id;
    var resource = 'game/' + gameID;
	var object = {}; 
	
	var filter ="&field_list=name,deck,original_release_date,publishers,developers,genres,platforms,image";
	var searchString= this.url+resource+'/?api_key='+this.apiKey+'&format=json'+filter;
	var result = http().get(searchString);
	var game = JSON.parse(result.body);
    
	var obj = game.results;
	var tab = []; var strGenre="";  var strPub = ""; var strDev = ""; var strPlat = "";
	for (x in obj.genres ){  tab.push(obj.genres[x].name);}
	strGenre = tab.toString();
	tab = [];
	for (x in obj.publishers ){  tab.push(obj.publishers[x].name);}
	strPub = tab.toString();
	tab = [];
	for (x in obj.developers ){  tab.push(obj.developers[x].name);}
	strDev = tab.toString();
	tab = [];
	for (x in obj.platforms ){  
		if (this.platformsPriority.indexOf(obj.platforms[x].abbreviation)>-1)
			tab.push(obj.platforms[x].abbreviation);
	}
	strPlat = tab.toString();

	object["title"]			= obj.name ;
	object["id"]			= id ;
	object["desc"]			= strPlat + "\n" +obj.deck ;
	object["date"]			= obj.original_release_date ;
	object["dev"]			= strDev ;
	object["pub"]			= strPub ;
	object["genres"]		= strGenre ;
	object["image"]			= obj.image.thumb_url ;
	
	
	return object;
	
	
	
}///getGame

