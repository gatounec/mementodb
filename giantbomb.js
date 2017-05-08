/**
The data source for obtaining information from giantbomb
@param {string} apiKey - Consumer key.
@param {string} apiSecret - Consumer secret. 
@param {string} type request - search, game
https://www.giantbomb.com/api/documentation
@example 
var giant = new GiantBomb("Consumer key" ,"Consumer secret" , "release" );
var r = giant.search('search/',query);
result(giant.getGamesArray(r));
//result( r , function(id) { return giant.extra(id);});



*/


/**
constructor
**/
function GiantBomb (apiKey , apiSecret, type) {
    this.apiKey = apiKey;
    this.type = type;
	this.url = "https://www.giantbomb.com/api/";
}
/**
Issue a search query to GiantBomb database.
@param {string} query - Search query.
@return json
*/
GiantBomb.prototype.search = function(resource,query) {
  var cherche= this.url+resource+'?api_key='+this.apiKey+'&query='+ encodeURIComponent(query)+'&ressources='+ this.type +'&format=json';
  var result = http().get(cherche);
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
		log(games[i].name+ ' ' +games[i].id+ '///' + games[i].deck);
		var object = {}; 
		object["title"] = games[i].name; object["id"] = games[i].id; 
		object["desc"]= games[i].original_release_date +' '+ games[i].deck;
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
    var resource = '/game/' + gameID;
	
	var cherche= this.url+resource+'?api_key='+this.apiKey+'&format=json';
    var resultJson = http().get(cherche);
    var jeu = JSON.parse(resultJson.body);
	
}///getGame
