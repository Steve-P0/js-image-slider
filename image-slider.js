jQuery.fn.extend({
    carouselImages : function(options) {
        var settings = $.extend({
            "namespace": "carousel",
            "sizes": {"1": 33, "2": 66, "3":99},
            "before": $.noop,         // Function: Before callback
            "after": $.noop           // Function: After callback
        }, options);

        return this.each(function(){
            var carousel = $(this)[0];
            var items = $(carousel).find('li');
            var $navs = $('<div class="' + settings.namespace + '__nav-wrapper" >' +'<div class="' + settings.namespace + '__nav ' + settings.namespace + '__nav--left"></div><div class="' + settings.namespace + '__nav ' + settings.namespace + '__nav--right"></div></div>');

            //remove Selection of element
            carousel.onmousedown = function() { return false };
            carousel.onselectstart = function(){ return false };

            var shake = function(element, direction){
                var direction = direction == undefined? "left" : direction;
                if (direction == "right"){
                    $(element).stop(false,true).animate({"left": "-=50"}, "normal").stop(false,true).animate({"left": "+=50"}, "fast");
                    return true;
                }

                if (direction == "left"){
                    $(element).stop(false,true).animate({"left": "+=50"}, "normal").stop(false,true).animate({"left": "-=50"}, "fast");
                    return true;
                }
            }
            //add and configure navs element
            $(carousel).append($navs);

            $('.'+settings.namespace + "__nav--right").click(function(event) {
                var next_active_index = ($(".carousel__item--active").index('.carousel__item') + 1);

                //if index out of range just shake parent container
                if (next_active_index > items.length-1){
                    shake($(carousel).find('ul'),"right");
                    return;
                }

                $('.'+settings.namespace + "__item").trigger('CarouselScrollRight');

                $('.carousel__item--active').removeClass('carousel__item--active');
                var $next_active = $(".carousel__item").eq(next_active_index)
                $next_active.addClass('carousel__item--active')
            });
            $('.'+settings.namespace + "__nav--left").click(function(event) {
                var next_active_index = ($(".carousel__item--active").index('.carousel__item') - 1);
                //if index out of range just shake parent container
                if (next_active_index < 0){
                    shake($(carousel).find('ul'));
                    return;
                }

                var $next_active = $(".carousel__item").eq(next_active_index)
                $('.carousel__item--active').removeClass('carousel__item--active');
                $next_active.addClass('carousel__item--active')

                $('.'+settings.namespace + "__item").trigger('CarouselScrollLeft');
            });

            //add to first & last elements class respectively
            items.eq(0).addClass(settings.namespace+'__item--first').addClass(settings.namespace+'__item--active');
            items.eq(items.length-1).addClass(settings.namespace+'__item--last');
            $(".carousel__item--last").attr("data-size","3");

            var picture_shift = 0;
            $.each(items, function(index, val) {
                //building elements layout
                var item = items[index];
                var picture_size = settings.sizes[item.dataset['size']];
                $(item).addClass( settings.namespace+'__item')
                    .css({
                        "width": picture_size+"%",
                        "left": picture_shift+"%"
                    });
                picture_shift += picture_size+1;
            });

            //add events to slide right & left
            $(items[0])
                    .bind('CarouselScrollRight', function(event) {
                    var element_shift = parseInt(this.style.left);
                    var shift_length = settings.sizes[$(".carousel__item--active").data("size")]+1;
                    $('.carousel__item').stop(false,true)
                        .animate(
                            {"left": "-="+shift_length+"%"},
                            {
                                duration:"fast",
                            });
                    })
                    .bind('CarouselScrollLeft', function(event) {
                    var element_shift = parseInt(this.style.left);
                    var shift_length = settings.sizes[$(".carousel__item--active").data("size")]+1;
                    $('.carousel__item').stop(false,true)
                        .animate(
                            {"left": "+="+shift_length+"%"},
                            {
                                duration:"fast",
                            });
                    });

        });
    }
});
