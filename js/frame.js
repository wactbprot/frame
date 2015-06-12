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
      $.get( path, function( html ) {
        $state.replaceWith( html );
      });
    }
  }, 500)


  // poll elements
  var i = 0;
  setInterval(function(){
    var $poll =  $(".poll")
      , L = $poll.length
    if( L > 0){
      var path = $poll.eq(i).data("path");
      $.get( path, function(j){
                     return  function( html ) {

                       var $html = $(html)

                       if($html.children().hasClass("poll")){

                         $html.children(".poll").focusin( function(e){
                           $html.children(".poll")
                           .removeClass("poll")
                           .addClass("usrinput")
                         });

                         $html.children(".poll").focusout( function(e){
                           $html.children(".usrinput")
                           .removeClass("usrinput")
                           .addClass("poll")
                         });

                         $html.children(".poll").change( function(e){
                           var $html_child = $html.children(".usrinput,.poll")
                             , value        = $html_child.val()
                             , path         = $html_child.data("path");
                           alert(value)
                           $.ajax({
                             method: "PUT",
                             url: path,
                             data: value
                           })
                         });

                       }

                       $poll.eq(j).parent().replaceWith( $html );
                     }
                   }(i));
      if(i < L){
        i++;
      }else{
        i = 0;
      }
    }
  }, 50);



})(jQuery);
