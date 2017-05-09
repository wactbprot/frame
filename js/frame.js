(function($){
  var $title = $("#title")
    , no     = $title.data("no")
    $("#idx_" + no).addClass("active");
 // once at the begining
  var $content_link =  $("#content_link");
  $.get( $content_link.attr("href"), function( html ) {
    $content_link.replaceWith( function() {
      return $(html).hide().fadeIn(300);
    });
  });

  // calibration doc id link
  var $cdid_link =  $("#cdid_link")
  $.get( $cdid_link.attr("href"), function( html ) {
    $cdid_link.replaceWith( function() {
      return $(html).hide().fadeIn(300);
    });
  });

  // exchange buttons
  $(document).on('click', '.exchange-button', function(){
    var $this  = $(this)
      , path   = $this.data("path")
      , method = $this.data("method")
      , cmd    = $this.data("cmd");
    //
    $this.attr('disabled','disabled');
    setInterval(function(){
      $this.removeAttr('disabled');
    }, 5000);

    $.ajax({
      method: method,
      url: path,
      data: "" + cmd
    });
  });

  // exchange select
  $(document).on('click', '.exchange-select', function(){
    var $this   = $(this)
      , path    = $this.data("path")
      , value   = $this.children( "option:selected" ).val()
    $.ajax({
      method: "PUT",
      url: path,
      data: "" + value
    });
  });

  // poll messages
  setInterval(function(){
    var $msgid  = $("#message")
      , $msgbtn = $("#msgbtn")
      , $msgcnt = $("#msgcnt")
      , path    = $msgid.data("path")
    $.get(path, function( msg ) {
      if((msg != "no") && (msg != "ok")){
        $msgcnt.replaceWith("<p id='msgcnt'>" + msg + "</p>")
        $msgbtn.fadeIn()
      } else {
        $msgcnt.replaceWith("<p id='msgcnt'>none</p>")
        $msgbtn.fadeOut()
      }
    });
  }, 1000)

  // poll cdid
  setInterval(function(){
    var $cdid =  $(".cdid")
      ,  path = $cdid.data("path")
    $.get( path, function( html ) {
      $cdid.replaceWith( html );
    })
  }, 5000)

  // poll state
  setInterval(function(){
    var $state =  $(".state");
    if($state.length > 0){
      var path = $state.data("path")
      $.get( path, function( html ) {
        $state.replaceWith( html );
      })
    }
  }, 500)

  // poll elements
  var i = 0;
  setInterval(function(){
    var $poll = $(".poll")
      , L     = $poll.length
    if( L > 0){
      var path = $poll.eq(i).data("path");
      $.get( path, function(j){
                     return  function( html ) {

                       var $html = $(html)

                       if($html.children().hasClass("poll")){
                         // poll off on focus in
                         $html.children(".poll").focusin( function(e){
                           $html.children(".poll")
                           .removeClass("poll")
                           .addClass("usrinput")
                         });
                         // poll on on focus out
                         $html.children(".poll").focusout( function(e){
                           $html.children(".usrinput")
                           .removeClass("usrinput")
                           .addClass("poll")
                         });
                         // send value back on changes
                         $html.children(".poll").change( function(e){
                           var $html_child = $html.children(".usrinput,.poll")
                             , value       = $html_child.val()
                             , path        = $html_child.data("path");
                           if($html_child.hasClass("number")){
                             value = value.replace(/,/g, ".")
                           }
                           $.ajax({
                             method: "PUT",
                             url: path,
                             data: value
                           });
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
  }, 400);
})(jQuery);
