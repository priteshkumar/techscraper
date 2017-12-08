
$("button.commentbtn").on("click",showCommentsui);
$("button.deletebtn").on("click",deleteNews);

  
var currenTechnews = {techinfoid:null,comments:null};

$('#commentsModal').on('show.bs.modal', function (event) {
    
      var modal = $(this);
      var $commentlist = $(".modal-body #commentlist");
      $(".modal-body #commentform").attr("data-id",currenTechnews.techinfoid); 
      for(var i=0;i < currenTechnews.comments.length;i++){
        console.log(currenTechnews.comments[i].body);
        var $li = $("<li>");
        var $p = $("<p>");
        $p.text(currenTechnews.comments[i].body);
        $li.append($p);
        $commentlist.append($li);
      }


});



$('#commentsModal').on('hide.bs.modal', function (event) {
    
  console.log("modal hiding completed");
  var modal = $(this);
            
     var $commentlist = $('.modal-body #commentlist');
     $commentlist.empty();
    
});




$("#commentform").submit(function(event){
  event.preventDefault();
  var $newsid = $(this).attr("data-id");
  var $comment = $("#commentform input[type=textarea]").val().trim();
  console.log($newsid);
  console.log($comment);
  $.post("/api/comments",{techinfoid:$newsid,comments:$comment},function(data){
    console.log(data);
  });


});



function deleteNews(){
  var $newsid = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/api/news/" + $newsid
    })
    .done(function() {
      console.log("delete news done");
      location.reload();
    });
  }




function showCommentsui(){
   console.log("called showcommentsui");
   var $newsid = $(this).attr("data-id");
   console.log($newsid);
   $.get("/api/comments/" + $newsid, function(data) {
    console.log(data);
    currenTechnews.techinfoid = $newsid;
    currenTechnews.comments = data;
    $("#commentsModal").modal();
  });    


}

