
$("button.savebtn").on("click",saveTechnews);
  



function saveTechnews(){
  console.log("savetechnews called");
  var $rootParent = $(this).parent().parent().parent();
  
  var $technews = {
    url:$rootParent.attr("data-url"),
    imageUrl:$rootParent.attr("data-imageurl"),
    title:$rootParent.attr("data-title"),
    info:$rootParent.attr("data-info"),
    postedTime:$rootParent.attr("data-postedtime"),
    authorlink:$rootParent.attr("data-authorlink"),
    authorName:$rootParent.attr("data-authorname")
  };

  console.log("data value: " + $technews);
  $.post("/api/technews",$technews,function(data){
    console.log(data);
    $rootParent.remove();
  });

}



