(function($) {
    var $title = $("#title"),
        no = $title.data("no")
    $("#idx_" + no).addClass("active");

    // exchange buttons
    $(document).on('click', '.exchange-button', function() {
        var $this = $(this),
            path = $this.data("path"),
            method = $this.data("method"),
            cmd = $this.data("cmd");
        //
        $this.attr('disabled', 'disabled');
        setInterval(function() {
            $this.removeAttr('disabled');
        }, 5000);

        $.ajax({
            "method": method,
            "processData": false,
            "contentType": "application/json",
            "url": path,
            "data": JSON.stringify({
                "cmd": cmd
            })
        });
    });

    // exchange select
    $(document).on('click', '.exchange-select', function() {
        var $this = $(this),
            path = $this.data("path"),
            value = $this.children("option:selected").val()
        $.ajax({
            "method": "PUT",
            "processData": false,
            "contentType": "application/json",
            "url": path,
            "data": JSON.stringify({
                "value": value
            })
        });
    });

    // poll messages
    setInterval(function() {
        var $msgid = $("#message"),
            $msgbtn = $("#msgbtn"),
            $msgcnt = $("#msgcnt"),
            path = $msgid.data("path")
        $.get(path, function(msg) {
            if ((msg != "no") && (msg != "ok")) {
                $msgcnt.replaceWith("<p id='msgcnt'>" + msg + "</p>")
                $msgbtn.css("opacity", 0.99);
            } else {
                $msgcnt.replaceWith("<p id='msgcnt'>no current message</p>")
                $msgbtn.css("opacity", 0.5);
            }
        });
    }, 1000)

    // poll cdid
    setInterval(function() {
        // calibration doc id link
        var $cdid_link = $("#cdid_link")
        if ($cdid_link.length > 0) {
            $.get($cdid_link.attr("href"), function(html) {
                if (html.length > 0) {
                    $cdid_link.replaceWith(function() {
                        return $(html).hide().fadeIn(300);
                    });
                }
            });
        }
        var $cdid = $(".cdid"),
            path = $cdid.data("path");
        if ($cdid.length > 0) {
            $.get(path, function(html) {
                $cdid.replaceWith(html);
            });
        }
    }, 2000)

    var intv = setInterval(function() {
        var $content_link = $("#content_link");
        if ($content_link.length > 0) {
            clearInterval(intv);
            $.get($content_link.attr("href"), function(html) {
                if (html.length > 0) {
                    $content_link.replaceWith(function() {
                        return $(html).hide().fadeIn(300);
                    });
                }
            });
        }
    }, 500)

    // poll state
    setInterval(function() {
        var $state = $(".state");
        if ($state.length > 0) {
            var path = $state.data("path")
            $.get(path, function(html) {
                if (html.length > 0) {
                    $state.replaceWith(html);
                }
            });
        }
    }, 500)

    // poll elements
    var i = 0;
    setInterval(function() {
        var $poll = $(".poll"),
            L = $poll.length
        if (L > 0) {
            var path = $poll.eq(i).data("path");
            $.get(path, function(j) {
                return function(html) {
                    if (html.length > 0) {

                        var $html = $(html)

                        if ($html.children().hasClass("poll")) {
                            // poll off on focus in
                            $html.children(".poll").focusin(function(e) {
                                $html.children(".poll")
                                    .removeClass("poll")
                                    .addClass("usrinput")
                            });
                            // poll on on focus out
                            $html.children(".poll").focusout(function(e) {
                                $html.children(".usrinput")
                                    .removeClass("usrinput")
                                    .addClass("poll")
                            });
                            // send value back on changes
                            $html.children(".poll").change(function(e) {
                                var $html_child = $html.children(".usrinput,.poll"),
                                    value = $html_child.val(),
                                    path = $html_child.data("path");

                                if ($html_child.hasClass("number")) {
                                    value = value.replace(/,/g, ".")
                                }
                                $.ajax({
                                    "method": "PUT",
                                    "processData": false,
                                    "contentType": "application/json",
                                    "url": path,
                                    "data": JSON.stringify({
                                        "value": value
                                    })
                                });
                            });
                        }
                        $poll.eq(j).parent().replaceWith($html);
                    }
                }
            }(i));
            if (i < L) {
                i++;
            } else {
                i = 0;
            }
        }
    }, 400);
})(jQuery);
