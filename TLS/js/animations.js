/* =========================================================
   TAVISA LIFE SCIENCES
   Animation Controller
   File: js/animations.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


        initPageLoad(reducedMotion);
        initScrollReveal(reducedMotion);
        initHeroAnimation(reducedMotion);
        initCounters(reducedMotion);
        initCardHover(reducedMotion);
        initImageHover(reducedMotion);
        initHeaderScroll();
        initButtonRipple(reducedMotion);
        initPageTransition(reducedMotion);

    });


    /* =====================================================
       01. PAGE LOAD
       ===================================================== */

    function initPageLoad(reducedMotion) {

        document.body.classList.add("page-loaded");

        if (reducedMotion) {
            return;
        }

        window.setTimeout(function () {

            document.body.classList.add(
                "page-ready"
            );

        }, 100);

    }


    /* =====================================================
       02. SCROLL REVEAL
       ===================================================== */

    function initScrollReveal(reducedMotion) {

        const elements =
            document.querySelectorAll(
                ".section-heading, " +
                ".intro-content, " +
                ".intro-card, " +
                ".approach-card, " +
                ".product-card, " +
                ".why-item, " +
                ".value-card, " +
                ".journey-item, " +
                ".about-fact, " +
                ".presence-location-card, " +
                ".featured-product-image, " +
                ".featured-product-content, " +
                ".contact-info, " +
                ".contact-form-card, " +
                ".contact-cta, " +
                ".cta-box"
            );


        if (!elements.length) {
            return;
        }


        /*
         * Reduced motion:
         * Show everything immediately.
         */

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(function (element) {

                element.classList.add(
                    "scroll-reveal",
                    "is-visible"
                );

            });

            return;

        }


        elements.forEach(function (element, index) {

            element.classList.add(
                "scroll-reveal"
            );


            /*
             * Stagger animation.
             */

            const delay =
                Math.min(
                    (index % 5) * 70,
                    280
                );


            element.style.setProperty(
                "--reveal-delay",
                delay + "ms"
            );

        });


        const observer =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        elements.forEach(function (element) {

            observer.observe(element);

        });

    }


    /* =====================================================
       03. HERO ANIMATION
       ===================================================== */

    function initHeroAnimation(reducedMotion) {

        if (reducedMotion) {
            return;
        }


        const hero =
            document.querySelector(
                ".hero-content"
            );

        const pageHero =
            document.querySelector(
                ".page-hero-inner"
            );


        animateHeroElement(hero, 150);
        animateHeroElement(pageHero, 100);

    }


    function animateHeroElement(
        element,
        delay
    ) {

        if (!element) {
            return;
        }


        element.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(32px)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0)"
                }
            ],
            {
                duration: 850,
                delay: delay,
                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both"
            }
        );

    }


    /* =====================================================
       04. NUMBER COUNTERS
       ===================================================== */

    function initCounters(reducedMotion) {

        const counters =
            document.querySelectorAll(
                ".hero-stat strong, " +
                ".about-fact strong"
            );


        if (
            !counters.length ||
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        animateCounter(
                            entry.target
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.6
                }
            );


        counters.forEach(function (counter) {

            observer.observe(counter);

        });

    }


    function animateCounter(element) {

        const text =
            element.textContent.trim();


        /*
         * Supports values such as:
         *
         * 2022
         * 09+
         * 9+
         * 01
         */

        const match =
            text.match(
                /^(\D*)(\d+)(.*)$/
            );


        if (!match) {
            return;
        }


        const prefix = match[1];
        const target = parseInt(
            match[2],
            10
        );
        const suffix = match[3];

        const duration = 1200;
        const start = performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime - start;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out cubic.
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.round(
                    target * eased
                );


            element.textContent =
                prefix +
                current +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            }

        }


        requestAnimationFrame(
            update
        );

    }


    /* =====================================================
       05. CARD HOVER
       ===================================================== */

    function initCardHover(reducedMotion) {

        if (reducedMotion) {
            return;
        }


        if (
            !window.matchMedia(
                "(hover: hover)"
            ).matches
        ) {
            return;
        }


        const cards =
            document.querySelectorAll(
                ".product-card, " +
                ".approach-card, " +
                ".presence-location-card, " +
                ".value-card"
            );


        cards.forEach(function (card) {

            card.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        ((y - centerY) /
                            centerY) *
                        -1.5;


                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        1.5;


                    card.style.transform =
                        "perspective(1000px) " +
                        "rotateX(" +
                        rotateX +
                        "deg) " +
                        "rotateY(" +
                        rotateY +
                        "deg) " +
                        "translateY(-6px)";

                }
            );


            card.addEventListener(
                "mouseleave",
                function () {

                    card.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       06. PRODUCT IMAGE HOVER
       ===================================================== */

    function initImageHover(reducedMotion) {

        if (reducedMotion) {
            return;
        }


        if (
            !window.matchMedia(
                "(hover: hover)"
            ).matches
        ) {
            return;
        }


        const containers =
            document.querySelectorAll(
                ".product-image"
            );


        containers.forEach(function (container) {

            const image =
                container.querySelector(
                    "img"
                );


            if (!image) {
                return;
            }


            container.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        container.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height;


                    const moveX =
                        (x - 0.5) * 8;


                    const moveY =
                        (y - 0.5) * 8;


                    image.style.transform =
                        "scale(1.04) " +
                        "translate(" +
                        moveX +
                        "px, " +
                        moveY +
                        "px)";

                }
            );


            container.addEventListener(
                "mouseleave",
                function () {

                    image.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       07. HEADER SCROLL
       ===================================================== */

    function initHeaderScroll() {

        const header =
            document.querySelector(
                ".site-header"
            );


        if (!header) {
            return;
        }


        let ticking = false;


        function updateHeader() {

            if (window.scrollY > 40) {

                header.classList.add(
                    "header-scrolled"
                );

            } else {

                header.classList.remove(
                    "header-scrolled"
                );

            }


            ticking = false;

        }


        window.addEventListener(
            "scroll",
            function () {

                if (ticking) {
                    return;
                }


                window.requestAnimationFrame(
                    updateHeader
                );


                ticking = true;

            },
            {
                passive: true
            }
        );


        updateHeader();

    }


    /* =====================================================
       08. BUTTON RIPPLE
       ===================================================== */

    function initButtonRipple(reducedMotion) {

        if (reducedMotion) {
            return;
        }


        const buttons =
            document.querySelectorAll(
                ".btn, .nav-cta"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const rect =
                        button.getBoundingClientRect();


                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );


                    const ripple =
                        document.createElement(
                            "span"
                        );


                    const x =
                        event.clientX -
                        rect.left -
                        size / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        size / 2;


                    ripple.className =
                        "button-ripple";


                    ripple.style.width =
                        size + "px";

                    ripple.style.height =
                        size + "px";

                    ripple.style.left =
                        x + "px";

                    ripple.style.top =
                        y + "px";


                    if (
                        getComputedStyle(
                            button
                        ).position === "static"
                    ) {

                        button.style.position =
                            "relative";

                    }


                    button.style.overflow =
                        "hidden";


                    button.appendChild(
                        ripple
                    );


                    const animation =
                        ripple.animate(
                            [
                                {
                                    transform:
                                        "scale(0)",
                                    opacity: 0.55
                                },
                                {
                                    transform:
                                        "scale(1)",
                                    opacity: 0
                                }
                            ],
                            {
                                duration: 550,
                                easing: "ease-out"
                            }
                        );


                    animation.onfinish =
                        function () {

                            ripple.remove();

                        };

                }
            );

        });

    }


    /* =====================================================
       09. PAGE TRANSITION
       ===================================================== */

    function initPageTransition(
        reducedMotion
    ) {

        if (reducedMotion) {
            return;
        }


        const links =
            document.querySelectorAll(
                'a[href$=".html"]'
            );


        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href.startsWith("#") ||
                        href.startsWith("http") ||
                        href.startsWith("mailto:") ||
                        href.startsWith("tel:") ||
                        link.target === "_blank"
                    ) {
                        return;
                    }


                    /*
                     * Don't animate if modifier
                     * keys are being used.
                     */

                    if (
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.metaKey ||
                        event.altKey
                    ) {
                        return;
                    }


                    event.preventDefault();


                    document.body.classList.add(
                        "page-exit"
                    );


                    window.setTimeout(
                        function () {

                            window.location.href =
                                href;

                        },
                        220
                    );

                }
            );

        });

    }


})();