(function($){

  // once at the begining
  var $content_link =  $("#content_link")
  var url = $content_link.attr("href")
  $.get( url, function( html ) {
    $content_link.replaceWith( function() {
      return $(html).hide().fadeIn(300);
    });
  });

  var O = 3
    , N = N || O
    , M = M || 0

  setInterval(function(){
    // poll state
    var $state =  $(".state");
    if($state.length > 0){
      var path = $state.data("path")
      $.get( path, function( html ) {
        $state.replaceWith( html );
      });
    }
    // poll elements
    var $poll =  $(".poll")
      , L = $poll.length
    if( L > 0){
      for(var i = 0; i < L; i++){
        if(M > L){
          M = 0;
          N = O;
        }
        if(i < N && i >= M){
          var path = $poll.eq(i).data("path");
          $.get( path, function( html ) {
            $poll.eq(i).parent().replaceWith( html );
          });
        }else{
          M = M + O
          N = N + O
          break;
        }
      };
    }
  }, 500)

})(jQuery);
