/**
 * directorySlider  - Loads all images in a specified directory and creates a slide show
 * Author: 
 */

(function ($) {
    var directorySlider = function (element, options) {
        var elem = $(element),
            obj = this,
            elemId = elem[0].id;
        //alert('here');
        // Merge config settings
        var config = $.extend({
            animation: 'uncover',
            filebase: 'img_',
            extension: 'jpg',
            speed: 1000,
            timeout: 4000,
            directory: '../Slider/img/',
            numslides: 1,
            height: null,
            width: '100%'
        }, options || {});

        // set slideshow dimensions if set
        if (config.height) {
            $(elem).css('height', config.height);
        }
        if (config.width) {
            $(elem).css('width', config.width);
        }

        //$(elem).css('position', 'relative');
        $(elem).css('overflow', 'hidden');

        // Get slides
        var slides = [],
        slideNumber = 1;

        //slides.push('<img id="main_slide" src="' + config.directory + config.filebase + slideNumber + '.' + config.extension + '" />');

        while (slideNumber <= config.numslides) {
            slides.push('<img src="' + config.directory + config.filebase + slideNumber + '.' + config.extension + '" />');
            slideNumber++;
        }




        // append slideshow
        // apply slide wrap 1st
        var slideWrap = $('<div class="slide-wrap" ></div>');
        //slideWrap.css({ width: '100%', height: '100%', display: 'table - cell' });
        slideWrap.appendTo(elem);

        // append slide and position absolutley
        $.each(slides, function (index, val) {
            $(val).css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: config.width ,
                height: 'auto'
                //display: 'block'
                //width: config.width // ADDED THIS SO WE DON'T NEED TO HAVE ALL IMAGES WITH SAME HEIGHT & WIDTH
            }).appendTo(slideWrap);
        });

        

        //$("#islider", window.parent.document).css({ width: '100%', height: '100%' });
        //$("#islider", window.parent.document).height($("body").height() + 1200);

        //alert($("elem").find('img:first-child').height());

        if (config.numslides > 1) {

            setInterval(function () {
                var firstSlide = elem.find('img:first-child'),
                    lastSlide = elem.find('img:last-child');
                // Apply animation
                switch (config.animation) {

                    case 'fade':
                        $(lastSlide).animate({
                            opacity: 0
                        },
                          config.speed, function () {
                              $(this).insertBefore(firstSlide).css('opacity', 1);
                          });
                        break;

                    case 'uncover':
                        lastSlide.animate({
                            marginLeft: -$(this).width()
                        },
                          config.speed, function () {
                              $(this).insertBefore(firstSlide).css('marginLeft', 0);
                          });
                        break;
                    default:



                        $(lastSlide).animate({
                            opacity: 0
                        },
                          config.speed, function () {
                              $(this).insertBefore(firstSlide).css({ opacity: 1 });
                        });
                        $(firstSlide).css({ opacity: 0 });
                        //$("#slider", window.parent.document).css({ width: '100%', height: auto });


                        //if (slideNumber == config.numslides) slideNumber = 1;
                        //else slideNumber++;
                        //$('#main_slide').animate({
                        //    height: '0px'
                        //},
                        //  config.speed, function () {
                        //      $(this).attr('src', config.directory + config.filebase + slideNumber + '.' + config.extension).css({ height:'auto' });
                        //  });


                        //$('#main_slide').animate({
                        //    opacity: 0
                        //},
                        //  config.speed, function () {
                        //      $(this).attr('src', config.directory + config.filebase + slideNumber + '.' + config.extension).css({opacity: 1});
                        //});
                }
            }, config.timeout);
        }
    };

    $.fn.directorySlider = function (options) {
        return this.each(function () {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('directoryslider')) return;

            // pass options to plugin constructor
            var directoryslider = new directorySlider(this, options);

            // Store plugin object in this element's data
            element.data('directoryslider', directoryslider);

        });
    };
})(jQuery);