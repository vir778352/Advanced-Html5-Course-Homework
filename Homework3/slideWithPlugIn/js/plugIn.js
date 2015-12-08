(function($) {
    $.fn.slide = function(options) {
        var $this = $(this);
        $this.append('<div class="slideshow-slides"></div>');
        for (var i = 0; i < options.data.length; i++) {
            $this.children().append('<a href="./" class="slide" id="slide-' + (i + 1) + '"></a>');
            $this.children().children().eq(i).append('<img src="' + options.picfolder + options.data[i] + '\" alt=\"\" width=\"1600\" height=\"465\">');
        }
        $this.append('<div class="slideshow-nav"></div>');
        $this.children().eq(1).append('<a href="#" class="prev">Prev</a>');
        $this.children().eq(1).append('<a href="#" class="next">Next</a>');
        $this.append('<div class="slideshow-indicator"></div>');

        $('.slideshow').each(function() {
            var $container = $(this),
                $slideGroup = $container.find('.slideshow-slides'),
                $slides = $slideGroup.find('.slide'),
                $nav = $container.find('.slideshow-nav'),
                $indicator = $container.find('.slideshow-indicator'),
                slideCount = $slides.length,
                currnetIndex = 0,
                interval = 3000, //自動切換時間
                indicatorHTML = '', //indicator的內容
                duration = 500, //切換效果的時間
                easing = "easeInOutExpo", //jquery animation的動畫含數
                timer; //計時器

            //加入indicator小圓點，幾張圖就加入幾個點
            $slides.each(function(i) {
                //把四張圖片排成一排，用相對位置，??減少圖片載入時間，當slide
                $(this).css({
                    left: 100 * i + '%' //left:後面是JSON，圖片左移100%`,圖排成一排
                });
                indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
            });
            $indicator.html(indicatorHTML);

            function goToSlide(index) {
                $slideGroup.animate({
                    left: -100 * index + '%'
                }, duration, easing);
                currnetIndex = index;
                updateNav();
            }

            function updateNav() {
                var $navPrev = $nav.find('.prev'),
                    $navNext = $nav.find('.next');

                //第一張圖時的按鍵
                if (currnetIndex === 0) {
                    $navPrev.addClass('disabled');
                } else {
                    $navPrev.removeClass('disabled');
                }
                //最後一張時的按鍵
                if (currnetIndex === slideCount - 1) {
                    $navNext.addClass('disabled');
                } else {
                    $navNext.removeClass('disabled');
                }
                $indicator.find('a').removeClass('active').eq(currnetIndex).addClass('active');
            }

            function startTime() {
                timer = setInterval(function() {
                    var nextIndex = (currnetIndex + 1) % slideCount;
                    goToSlide(nextIndex);
                }, interval);
            }

            function stopTimer() {
                clearInterval(timer);
            }

            //滑鼠在container不會自動換圖
            $container.on({ //註冊2個物件,{}是個json物件
                mouseenter: stopTimer,
                mouseleave: startTime
            });

            $nav.on('click', 'a', function(event) { //當click會做a連結，直接對DOM加入事件，可以比較有效率
                event.preventDefault(); //取消事件的預設動作，ex:click & a 同的DOM時
                if ($(this).hasClass('prev')) {
                    goToSlide(currnetIndex - 1);
                } else {
                    goToSlide(currnetIndex + 1);
                }
            });

            $indicator.on('click', 'a', function(event) { //當click會做a連結，直接對DOM加入事件，可以比較有效率
                event.preventDefault(); //取消事件的預設動作，ex:click & a 同的DOM時
                if (!$(this).hasClass('active')) {
                    goToSlide($(this).index());
                }
            });
        });

        return $this;
    };
}(jQuery));
