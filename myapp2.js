//setup global vars here
var clientID = "731574675dda477485eff1a07fb69f49";
var clientSECRET = "24f4faf1e011478f80fa16c23ab72a2c";

//create key to make sure all clients aren't looking at the same collection
var curDate = new Date();
var key = "photos" + curDate.getMilliseconds();

//other global vars needed
var jqxhr = 0;
var somethingGood =0;
var tagVAR = "sunset";
var tagNextPage = "null"; 
var instaPhoto = new Meteor.Collection(null);
instaPhoto.remove({});

if (Meteor.is_client) {
  Template.hello.greeting = function () {
    return "Welcome to the very seed of Particle dude.";
  };

  Template.hello.events = {
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined' && document.getElementById("q").value !="") {
        console.log("You pressed the button with " + document.getElementById("q").value);
        //console.log("You entered" + document.getElementById("q").value);
        fetchPhotosJSON(document.getElementById("q").value);}
    }
  };

  if (instaPhoto.find().count() != 0) {
    console.log("the collection has this many rows " + instaPhoto.find().count());
  }
   Template.gridOfImages.photos = function () {
      return instaPhoto.find();
    }
}

function fetchPhotosJSON(qITEM) {
	if (qITEM != null || qITEM != "" ) {
	    tagVAR = qITEM;
    }
    
    var MeteorCALL = "https://api.instagram.com/v1/tags/"+ tagVAR +"/media/recent/"+"?client_id=" +clientID + "&callback=?"; 
    
    jqxhr = $.getJSON(MeteorCALL, function(data){handleResults(data)});
}

function fetchPhotosJSONURL(nextPage) {
    var MeteorCALL = nextPage;
    jqxhr = $.getJSON(MeteorCALL + "&callback=?", function(data){handleResults(data)});
}

function fetchMorePhotos() {
  console.log("YES YES YES");
  fetchPhotosJSONURL(tagNextPage);
}

function handleResults(someVar) { 
	console.log(someVar);
	somethingGood = someVar.data;

  // grabbing pagination data to make sure we can loop through results
  console.log("the next url is " + someVar.pagination.next_url);
  tagNextPage = someVar.pagination.next_url;

  console.log("lets do this loop");

  // looping through results and putting it in the collection
  for (i = 0; i < someVar.data.length; i++) {
    item = someVar.data[i];
    console.log("lets look at the object " + item);
    //console.log("the caption is " + item.caption.text + " and thumb location is " + item.images.standard_resolution.url);
    instaPhoto.insert({name: "anything", url:item.images.standard_resolution.url, thumb:item.images.low_resolution.url});
  }
	/*if (data.statusCode === 200) {
		result = JSON.parse(result.content);
		console.log("we made it in here");
	} */
}



function fetchPhotos(qITEM){
	if (qITEM === null || qITEM === "" ) {
    	tagVAR = "sunset";    
    } else {
	    tagVAR = qITEM;
    }
    
    // setup the URI we're going to call
    var MeteorCALL = "https://api.instagram.com/v1/tags/"+ tagVAR +"/media/recent/"+"?client_id=" +clientID + "&callback=?"; 
    
    
    // make the call and look for a 200
    
    console.log("here is the url " + MeteorCALL);
    Meteor.http.call("GET", MeteorCALL, 
    	function(error, result) { 
    		//console.log("results are " + result.statusCode)
    		if (result.statusCode === 200) {
    			result = JSON.parse(result.content);
	    		console.log("we made it in here");
    		}
    	
    	}
    );
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}