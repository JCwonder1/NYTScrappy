$("#delete").on("click", () => {
  $.ajax({
    url: "/delete",
    type: "DELETE",
    dataType: "json",
    complete: function(data) {
      
      window.location.href = "/";
    }
  });
});

$("#scrap").on("click", () => {
  $.ajax({
    url: "/",
    method: "POST",
    complete: function(data) {
      window.location.href = "/";
    }
  });
});

$("#exampleModal").on("show.bs.modal", function(event) {

  $("#recipient-name").val("");
  $("#message-text").val("");
  const button = $(event.relatedTarget); // Button that triggered the modal
  const articleId = button.data("whatever"); // Extract info from data-* attributes
  

  getComments(articleId);

  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $("#data");
  modal.removeData("article");
  modal.data("article", articleId);
  
});

$("#comment").on("click", event => {
  const alert = $(".alert");
  alert.addClass("d-none");

  const articleId = $("#data").data("article"); // Extract info from data-* attributes
  
    
  let name = $("#recipient-name").val() || "Guest";
  let comment = $("#message-text").val() || false;

  if (comment && name) {
    
    addComment(name, comment, articleId);
    $("#comment").attr("data-dismiss", "modal");
  } else {
    alert.removeClass("d-none");
  }
  
});

async function addComment(name, comment, article){
    $.ajax({
      url: "/",
      type: "PUT",
      data: `name=${name}&comment=${comment}&article=${article}`,
      success: function(data) {
         data ? console.log('Success') : console.log('Error');
      }
    });
}

async function getComments(articleId){
    $.ajax({
        url: `/comment/${articleId}`,
        type: "GET",
        success: data => {
            populateComments(data);
        }
    })
}

async function populateComments(comments){
    let modalComment = $(".modal-comments");  
    modalComment.empty();
    await comments.forEach(element => {
        modalComment.append(
          `<p><span class="text-primary font-weight-bold">${
            element.user
          }</span>: ${element.comment}</p> <hr>`
        );
        
    });
}