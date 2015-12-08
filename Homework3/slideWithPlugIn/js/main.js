$(function() {
    var jsonImageSrc = {
        "picfolder": "./img/",
        "data": ['slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg', 'slide-4.jpg']
    };

    $('.slideshow').slide(jsonImageSrc);
});
