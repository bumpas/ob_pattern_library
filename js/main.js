$(function(){

	// Set drawer column heights based on # of list items
	var mostItems = 0;
	$('.available-devices').find('ul').each(function(){
		var items = $(this).find('li');
		if (items.length > mostItems) mostItems = items.length;
	}).end().append("<style>@media (min-width: 768px){ .available-devices ul { height: " + mostItems*1.8 + "rem; } }</style>");

	// Slick Slider instantiation
	$('.slick--mobile').slick({
		mobileFirst:true,
		arrows: false,
		dots: true,
		dotsClass: "slickDots slickDots--default",
		responsive: [
		{
			breakpoint: 767,
			settings: "unslick"
		}
	]
	});

	//slick plugin for module50pad
	$('.slick--module50pad').slick({
		mobileFirst: true,
		arrowsClass: "slickArrows",
		dots: true,
		dotsClass: "slickDots slickDots--default",
		responsive: [
			{
				breakpoint: 991,
				settings: {
					row: 2,
					slidesToShow: 2
				}
			}
		]
	});

	//module3 read more drawer expand
	$('.module3__more').on('click', function(){
		var el =$(this);
		var prev =$(this).prev();
		if (el.text() == el.data("text-swap")) {
			el.removeClass("active");
    		el.text(el.data("text-original"));
    		prev.slideUp();
  		} else {
    		el.data("text-original", el.text());
    		el.addClass("active");
    		el.text(el.data("text-swap"));
    		prev.slideDown();
    	}
	});

	// Drawer opening & closing events
	$('.module--drawer').on('open', function(){
		$(this).stop().slideDown().removeClass('drawer--closed').addClass('drawer--opened');
		$('.btn[data-drawer-toggle="#' + $(this).attr('id') + '"] svg.plus-circle').addClass('minus');
	}).on('close', function(){
		$(this).stop().slideUp().removeClass('drawer--opened').addClass('drawer--closed');
		$('.btn[data-drawer-toggle="#' + $(this).attr('id') + '"] svg.plus-circle').removeClass('minus');
	});

	// Drawer triggers via buttons
	$('.btn[data-drawer-toggle]').on('click', function(){
		var button = $(this);
		var drawer = $(button.attr('data-drawer-toggle') + '.module--drawer');

		if (drawer.hasClass('drawer--opened')) {
			drawer.trigger('close');
		} else {
			drawer.trigger('open');
		}
	});

	// Drawer triggers via close button
	$('.module--drawer .close').on('click', function(){
		$(this).trigger('close');
	});

	// Scroll to Top buttons
	$('.scroll-to-top').on('click', function(){
		$('html,body').animate({scrollTop: 0}, 1000);
	});

	// PDP Whats in the box link
	$('.pdp-buystack a#whatsinthebox, .pdp-buystack a:last').on('click', function(){
		var whatsInTheBoxModule = $('.otter-tab .whats-in-the-box'),
			classes = whatsInTheBoxModule.closest('.otter-tab').attr('class').split(' '),
			tab = null;

		// Determine which otter tab "What's in the box?" is on.
		for(c in classes) {
			if (classes[c] == 'otter-tab' || classes[c] == 'primetime') continue;
			if ($('.otter-tabs nav li[data-section="' + classes[c] + '"]').length == 1) {
				tab = classes[c];
				break;
			}
		}
		// If no tab found, don't do anything
		if (tab == null) {
			return false;
		}

		// Click the tab if necessary
		var tab = $('.otter-tabs nav li[data-section="' + tab + '"]');
		if (!tab.hasClass('active')) {
			tab.trigger('click');
		}

		// Scroll to the module
		$('html,body').animate({
			scrollTop: whatsInTheBoxModule.offset().top - 44 // Account for sticky nav height
		}, 1000);
	});

	//footer faux selects navigate all the time
	$('.footer__select').change(function() {
		window.location = $(this).find('option:selected').data('href');
	});

	// module23split video & module50pad video
	$('.btnPlay').on("click", function(e) {
	    var element = $(this).parent().next();
	    var vidId = $(element).data("vid-src");
	    var youtube = '<iframe src="//www.youtube.com/embed/'+ vidId +'?autoplay=1&showinfo=0&modestbranding=1&rel=0&autohide=1" frameborder="0" allowfullscreen></iframe>';
	    e.preventDefault();
	    $(element).append(youtube).dialog({
	    	dialogClass: "moduleVideo",
	    	width: "75%",
			resizable: false,
			draggable: false,
			modal: true,
			show: {
				effect: "fadeIn",
				duration: 300
			},
			hide: {
				effect: "fadeOut",
				duration: 300
			},
			open: function(event, ui) {
				// Close dialog when outside is clicked
				$('.ui-widget-overlay').bind('click', function(){
					$(element).dialog('close');
				});
			},
			close: function () {
				// necessary as it stops the video when the dialog is closed
				var iframe = $(this).children();
				$(this).dialog('destroy');
    			iframe.remove('iframe');
			}
	    });
	});

	//fineprint overlay
	$('.fineprint__text').on('click', function() {
		$(this).next().fadeIn();
	});

	$('.fineprint__close').on('click', function() {
		$(this).parent().fadeOut();
	});

});


