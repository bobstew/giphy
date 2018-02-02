//sart with some universal variables

var cartoonArray = [
    "Archer", "Futurama", "Aqua Teen Hunger Force",
    "Space Ghost", "GI Joe", "Thunder Cats", "Animaniacs"
  ];
// my key and giphy address and limiter
var urlSnippet  = "https://api.giphy.com/v1/gifs/search";
var gifyAPI   = "We5CcOkUntjjhgiBPhaBVxTrsSezcz0k";
var limit     = 10;


//some awesome functions

//make some buttons
function makeButtons(renderLast) {
  $(".buttons").empty();
  for (var i = 0; i < cartoonArray.length; i++) {
    var btns = $("<button>");
    $(btns).addClass("toons btn btn-primary");
    $(btns).html(cartoonArray[i]);
    $(".buttons").append(btns);
  }

  $(".toons").click(function() {
    getTheGif(this);
  });

  if (renderLast) {
    getTheGif(".toons:last");
  }
}
// function gets info from API
function getTheGif(toons) {
  
  $(".buttons .active").removeClass("active");
  $(toons).addClass("active");
  // set up query string
  query = {
    "api_key"   : gifyAPI,
    "q"         : $(toons).html(),
    "limit"     : limit,
    
  };
  query = $.param(query);
  path = urlSnippet + "?" + query;
  // ajax stuff
  $.ajax({
    url: path,
    type: 'GET',
  })
  .done(function(response) {
   
    // Clear old gifs
    $(".card-columns").empty();
    // Loop through results
    var gifArray = response.data;
    for (var i = 0; i < gifArray.length; i++) {
      // Build a card

      var imgSrc = gifArray[i].images.downsized_still.url;
      var imgLink = gifArray[i].url;
      var embedLink = gifArray[i].embed_url;
      // some html info
      var card = [
        "<div class='card'>",
        "<img class='card-img-top' src='"+imgSrc+"'>",
        "<div class='card-block'>",
        "<a href='"+imgLink+"' target='_blank' class=''><i class='fa fa-external-link' aria-hidden='true'></i>View on Giphy</a> ",
        "<a class='clip' data-toggle='tooltip' title='Copied!' data-clipboard-text='"+embedLink+"' href='#'><i class='fa fa-clipboard' aria-hidden='true'></i> Copy embed link</a>",
        "</div>",
        "<div class='card-footer card-inverse text-muted'>Rating: "+gifArray[i].rating.toUpperCase(),
        "</div>",
        "</div>"
      ];
      // Use join to concatenate html block in the card array
      $(".card-columns").prepend(card.join(''));
    }
  })
  .fail(function() {
    console.log("error");
  });
}

function togglePlay(card) {
  // get url of clicked card
  var imgPath = $(card).attr("src");
  // Does it end with "_s.gif"?
  if (imgPath.endsWith("_s.gif")) {
    imgPath = imgPath.replace("_s.gif", ".gif");
  } else {
    imgPath = imgPath.replace(".gif", "_s.gif");
  }
  // Update image 
  $(card).attr("src", imgPath);

}


$(document).ready(function() {

  makeButtons();

  

  $("form").submit(function(event) {
    event.preventDefault();
    newtoons = $("#cartoon").val().trim();
    if(newtoons !== "") {
      cartoonArray.push($("#cartoon").val().trim());
      makeButtons(true);
    }
    // clear the input
    this.reset();
  });

  // make it play
  $(".gifs").on("click", ".card-img-top", function() {
    togglePlay(this);
  });

  $(".gifs").on("click", ".clip", function(event) {
    event.preventDefault();
  });

  

});
