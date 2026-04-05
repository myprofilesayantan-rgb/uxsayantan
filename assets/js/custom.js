(function ($) {
    "use strict";

    // =====================================
    // DOCUMENT READY
    // =====================================
    $(document).ready(function () {

        console.log("Custom JS Loaded ✅");


        // =====================================
        // SENTINEL CUSTOM SLIDER
        // =====================================
        let currentSlide = 0;
        const slides = $('.sentinel-slider .slide');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.removeClass('active');
            slides.eq(index).addClass('active');
        }

        // Right Arrow
        $('.arrow.right').on('click', function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        });

        // Left Arrow
        $('.arrow.left').on('click', function () {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        });


        // =====================================
        // OPTIONAL AUTO PLAY (can disable)
        // =====================================
        let autoSlide = setInterval(function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 5000);

        // Stop autoplay on hover
        $('.sentinel-slider').hover(
            function () {
                clearInterval(autoSlide);
            },
            function () {
                autoSlide = setInterval(function () {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    showSlide(currentSlide);
                }, 5000);
            }
        );


        // =====================================
        // FIX: ENSURE FIRST SLIDE VISIBLE
        // =====================================
        showSlide(0);


        // =====================================
        // WOW INIT (safe fallback)
        // =====================================
        if (typeof WOW === "function") {
            new WOW().init();
        }


        // =====================================
        // DEBUG HELPERS
        // =====================================
        console.log("Slides Found:", totalSlides);

    });


    // =====================================
    // WINDOW LOAD (AFTER IMAGES LOAD)
    // =====================================
    $(window).on('load', function () {
        console.log("All assets fully loaded 🚀");
    });

})(jQuery);