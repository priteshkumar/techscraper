/* TODO:

  1. Make a reusable function for creating a table body in index.html with the results from your MongoDB query
  Each row should have info for one animal.

  2. Make two AJAX functions that fire when users click the two buttons on index.html.
      a. When the user clicks the Weight button, the table should display the animal data sorted by weight.
      b. When the user clicks the Name button, the table should display the animal data sorted by name.

  Good luck!

  *Hint*: We don't want to keep adding to the table with each button click. We only want to show the new results.
  What can we do to the table to accomplish this?

  *Bonus*: Write code to set an 'active' state on the column header. It should make the color sorted-by column red.
  *Bonus*: Add additional ways to sort (e.g. by class or number of legs)
*/

// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in data (JSON) and creates a table body

$("#weight-sort").on("click",getWeightdata);
$("#name-sort").on("click",getNamedata);
  


function displayResults(data,activecol) {
  // Add to the table here...

  var $tbody = $("tbody");
  $tbody.empty();
  
  if(activecol === "name"){
    $("#animal-name").addClass("active");
    $("#animal-weight").removeClass("active");
  }
  else if(activecol === "weight"){
    $("#animal-weight").addClass("active");
    $("#animal-name").removeClass("active");
  }
  else {
    $("th").removeClass("active");
  }

  for(var i=0;i < data.length;i++){
    var $tr = $("<tr>");
    var $name = $("<td>");
    $name.text(data[i].name);
    $tr.append($name);
    var $numlegs = $("<td>");
    $numlegs.text("4");
    $tr.append($numlegs);
    var $clss = $("<td>");
    $clss.text("wildcreatures");
    $tr.append($clss);
    var $weight = $("<td>");
    $weight.text(data[i].weight);
    $tr.append($weight);
    var $altname = $("<td>");
    $altname.text("goodanimal");
    $tr.append($altname);
    $tbody.append($tr);
  }


}

$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  console.log(data);
  displayResults(data,"default");
});



function getNamedata(){
$.getJSON("/name", function(data) {
  // Call our function to generate a table body
  console.log(data);
  displayResults(data,"name");
});
}


function getWeightdata(){
  $.getJSON("/weight", function(data) {
  // Call our function to generate a table body
  console.log(data);
  displayResults(data,"weight");
  });
}


