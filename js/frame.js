(function($){

 var $content_link =  $("#content_link")
  var url = $content_link.attr("href")
  $.get( url, function( data ) {
    $content_link.replaceWith( function() {
      return $(data).hide().fadeIn();
    });

});
})(jQuery);
