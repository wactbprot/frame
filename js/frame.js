(function($){

  // once at the begining
  var $content_link =  $("#content_link")
  var url = $content_link.attr("href")
  $.get( url, function( html ) {
    $content_link.replaceWith( function() {
      return $(html).hide().fadeIn(300);
    });
  });

  setInterval(function(){
    // poll state
    var $state =  $(".state");
    if($state.length > 0){
      var path = $state.data("path")
      console.log()
      $.get( path, function( html ) {
        $state.replaceWith( html );
      });
    }
  }, 500)

})(jQuery);
