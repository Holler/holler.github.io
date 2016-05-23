// We want to generate quick links for each of the lead magnet types
  // As the user scrolls we want to update the quick links to the nearest lead magnet
  // Want to be able to toggle visibility of a lead magnet type
  // Want to be able to sort by time required, lead magnet name, default

  function jumpUpdate(event){
    var scrollPos = $(document).scrollTop();
    $('#jumpdrop-links a').each(function(){
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if( refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos )
      {
        // Update the value of #jumpdrop
        currLink.parent().addClass("active");
      }else{
        currLink.parent().removeClass("active");
      }
    });
  }

  function stickyNav(event){
    var scrollPos = $(document).scrollTop();
    var refElement = $("#pre-nav");
    if(  refElement.position().top + refElement.height() + $('#stickynav').height() + parseInt($('body').css('padding-top')) <= scrollPos ){
      if( !$("#stickynav").hasClass("navbar-fixed-top") ){
        $("#stickynav").addClass("navbar-fixed-top");
      }
    }else{
      $("#stickynav").removeClass("navbar-fixed-top");
    }
  }

  function stickyBar(event){
    var scrollPos = $(document).scrollTop();
    var refElement = $("#logo");
    if(  refElement.position().top + refElement.height() + parseInt($('body').css('padding-top')) <= scrollPos ){
      $("#bottom-bar").slideDown();
      $("#bottom-bar-book").slideDown();
    }else{
      $("#bottom-bar").slideUp();
      $("#bottom-bar-book").slideUp();
    }
  }

  function sortMagnetsByTime(){
    var sorted = $('.magnet-box').sort(function(a,b){
      var time1 = parseInt( $(a).data('min-time') );
      var time2 = parseInt( $(b).data('min-time') );
      return ( time1 < time2 ) ? -1 : ( time1 > time2 ) ? 1 : 0;
    });
    $('#magnets').html( sorted );
    // $("#sortdrop").html( "Creation Time <span class='caret'></span>" );
  }

  function sortMagnetsByName(){
    var sorted = $('.magnet-box').sort(function(a,b){
      return $(a).data('type').toUpperCase().localeCompare($(b).data('type').toUpperCase());
    });
    $('#magnets').html( sorted );
    // $("#sortdrop").html( "Alphabetical <span class='caret'></span>" );
  }

  function defaultSort(){
    var sorted = $('.magnet-box').sort(function(a,b){
      var num1 = parseInt( $(a).attr('id').replace("magnet","") );
      var num2 = parseInt( $(b).attr('id').replace("magnet","") );
      return ( num1 < num2 ) ? -1 : ( num1 > num2 ) ? 1 : 0;
    });
    $('#magnets').html( sorted );
    // $("#sortdrop").html( "Sort By <span class='caret'></span>" );
  }

  function quickLinkNav(){
    $('#jumpdrop-links > li > a').click(function(){
      
    });
  }

  function collapseAllMagnets(){
    $('.magnet-body').each(function(){
      var body = $(this);
      if( body.hasClass('in') ){
        body.removeClass('in');
      }
    });

    $('.magnet-toggle').each(function(){
      setMagnetButtonToClosedState( $(this) );
    });

    window.magnetsCollapsed = true;
    $('#toggle-all-magnets').text("Expand All Magnets");
  }

  function expandAllMagnets(){
    // Open all the magnet bodies
    $('.magnet-body').each(function(){
      var body = $(this);
      if( !body.hasClass('in') ){
        body.addClass('in');
      }
    });

    // Update all the magnet toggle states
    $('.magnet-toggle').each(function(){
      setMagnetButtonToOpenedState( $(this) );
    });


    window.magnetsCollapsed = false;
    $('#toggle-all-magnets').text("Minimize All Magnets");
  }

  function toggleMagnets(){
    if( window.magnetsCollapsed ){
      expandAllMagnets();
    }else{
      collapseAllMagnets();
    }
  }

  function setMagnetButtonToClosedState(button){
    var toggledBody = $(button.data('target'));
    var innerSpan = $(button.children()[0]);

    innerSpan.removeClass('glyphicon-minus');
    innerSpan.addClass('glyphicon-plus');
  }

  function setMagnetButtonToOpenedState(button){
    var toggledBody = $(button.data('target'));
    var innerSpan = $(button.children()[0]);
    
    innerSpan.removeClass('glyphicon-plus');
    innerSpan.addClass('glyphicon-minus');
  }

  function toggleMagnetToggleButton(button){
    var toggledBody = $(button.data('target'));
    var innerSpan = $(button.children()[0]);

    if( toggledBody.hasClass('in') ){
      // Being Closed
      setMagnetButtonToClosedState( button );
    }else{
      // Being opened
      setMagnetButtonToOpenedState( button );
    }
  }

  $(document).ready(function(){
    // $(document).on("scroll", jumpUpdate);
    $(document).on("scroll", stickyNav);
    $(document).on("scroll", stickyBar);
    // Set the state of magnets to collapsed by default
    window.magnetsCollapsed = false;

    // Expand them by default
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      collapseAllMagnets();
    }
    // expandAllMagnets();

    // Add a handler for the navigation magnet toggle
    $('#toggle-all-magnets').click(function(){
      toggleMagnets();
    });

    $('.magnet-toggle').click(function(){
      // Update the button's inner span icon to be minimized or maximized
      // Get the data-target attribute
      toggleMagnetToggleButton( $(this) );
    });

    // Add tweet link
    $('.tweet').click(function(event) {
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = this.href,
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;
      
      window.open(url, 'twitter', opts);
   
      return false;
    });
    $('.share').click(function(event) {
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = this.href,
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;
      
      window.open(url, 'facebook', opts);
   
      return false;
    });

  });