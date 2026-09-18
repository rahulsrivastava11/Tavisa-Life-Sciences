```javascript
/* =========================================================
   TAVISA LIFE SCIENCES
   Main Website JavaScript
   File: js/main.js

   Responsibilities:
   - Mobile navigation
   - Product filtering
   - Contact form validation
   - Current year
   - Active navigation
   - Basic UI functionality

   Animations are handled separately by animations.js
   ========================================================= */


(function () {

    "use strict";


    /* =====================================================
       DOM READY
       ===================================================== */

    function initWebsite() {

        initMobileMenu();
        initProductFilters();
        initContactForm();
        initCurrentYear();
        initActiveNavigation();
        initEscapeKey();
        initExternalLinks();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initWebsite
        );

    } else {

        initWebsite();

    }


    /* =====================================================
       01. MOBILE NAVIGATION
       ===================================================== */

    function initMobileMenu() {

        const menuToggle =
            document.querySelector(".menu-toggle");

        const mainNav =
            document.querySelector(".main-nav");


        if (!menuToggle || !mainNav) {
            return;
        }


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        menuToggle.addEventListener(
            "click",
            function () {

                const isOpen =
                    mainNav.classList.toggle("active");


                menuToggle.classList.toggle(
                    "active",
                    isOpen
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                document.body.classList.toggle(
                    "menu-open",
                    isOpen
                );

            }
        );


        /* Close menu after clicking a link */

        const navLinks =
            mainNav.querySelectorAll("a");


        navLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMobileMenu();

                }
            );

        });


        /* Close menu when clicking outside */

        document.addEventListener(
            "click",
            function (event) {

                const clickedInsideNav =
                    mainNav.contains(event.target);

                const clickedToggle =
                    menuToggle.contains(event.target);


                if (
                    !clickedInsideNav &&
                    !clickedToggle &&
                    mainNav.classList.contains("active")
                ) {

                    closeMobileMenu();

                }

            }
        );


        function closeMobileMenu() {

            mainNav.classList.remove(
                "active"
            );

            menuToggle.classList.remove(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove(
                "menu-open"
            );

        }

    }


    /* =====================================================
       02. PRODUCT FILTERING
       ===================================================== */

    function initProductFilters() {

        const filterButtons =
            document.querySelectorAll(
                ".product-filter"
            );

        const productCards =
            document.querySelectorAll(
                ".products-grid .product-card"
            );


        /*
         * Product filters exist only on products.html.
         * Exit safely on other pages.
         */

        if (
            !filterButtons.length ||
            !productCards.length
        ) {
            return;
        }


        filterButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const selectedFilter =
                        button.dataset.filter ||
                        button.getAttribute(
                            "data-filter"
                        );


                    /* Active button */

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                            item.setAttribute(
                                "aria-selected",
                                "false"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-selected",
                        "true"
                    );


                    /* Filter cards */

                    productCards.forEach(
                        function (card) {

                            const category =
                                card.dataset.category ||
                                card.getAttribute(
                                    "data-category"
                                );


                            const shouldShow =
                                selectedFilter === "all" ||
                                !selectedFilter ||
                                category === selectedFilter;


                            if (shouldShow) {

                                card.classList.remove(
                                    "hidden"
                                );

                                card.removeAttribute(
                                    "aria-hidden"
                                );

                            } else {

                                card.classList.add(
                                    "hidden"
                                );

                                card.setAttribute(
                                    "aria-hidden",
                                    "true"
                                );

                            }

                        }
                    );

                }
            );

        });

    }


    /* =====================================================
       03. CONTACT FORM
       ===================================================== */

    function initContactForm() {

        const form =
            document.querySelector(
                "#contactForm"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (event) {

                /*
                 * The current website is static.
                 *
                 * Prevent the browser from pretending
                 * that the enquiry has been submitted
                 * to a real backend.
                 */

                event.preventDefault();


                const name =
                    form.querySelector(
                        "#name"
                    );

                const email =
                    form.querySelector(
                        "#email"
                    );

                const message =
                    form.querySelector(
                        "#message"
                    );


                clearFormMessages();


                /* Basic validation */

                if (
                    !name ||
                    !name.value.trim()
                ) {

                    showFormMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    focusField(name);

                    return;

                }


                if (
                    !email ||
                    !isValidEmail(
                        email.value.trim()
                    )
                ) {

                    showFormMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    focusField(email);

                    return;

                }


                if (
                    !message ||
                    !message.value.trim()
                ) {

                    showFormMessage(
                        "Please enter your message.",
                        "error"
                    );

                    focusField(message);

                    return;

                }


                /*
                 * No backend has been connected yet.
                 * Show a clear status instead of falsely
                 * claiming that the enquiry was delivered.
                 */

                showFormMessage(
                    "Your enquiry is ready. Connect this form to Tavisa's official email or form backend to enable submission.",
                    "info"
                );

            }
        );


        function isValidEmail(value) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                value
            );

        }


        function focusField(field) {

            if (field) {
                field.focus();
            }

        }


        function showFormMessage(
            message,
            type
        ) {

            let messageElement =
                form.querySelector(
                    ".form-message"
                );


            if (!messageElement) {

                messageElement =
                    document.createElement(
                        "div"
                    );

                messageElement.className =
                    "form-message";

                form.prepend(
                    messageElement
                );

            }


            messageElement.textContent =
                message;

            messageElement.dataset.type =
                type;

        }


        function clearFormMessages() {

            const existingMessage =
                form.querySelector(
                    ".form-message"
                );


            if (existingMessage) {
                existingMessage.remove();
            }

        }

    }


    /* =====================================================
       04. CURRENT YEAR
       ===================================================== */

    function initCurrentYear() {

        const yearElements =
            document.querySelectorAll(
                "#currentYear"
            );


        const currentYear =
            new Date().getFullYear();


        yearElements.forEach(
            function (element) {

                element.textContent =
                    currentYear;

            }
        );

    }


    /* =====================================================
       05. ACTIVE NAVIGATION
       ===================================================== */

    function initActiveNavigation() {

        const navLinks =
            document.querySelectorAll(
                ".main-nav a"
            );


        if (!navLinks.length) {
            return;
        }


        const currentPage =
            getCurrentPage();


        navLinks.forEach(
            function (link) {

                const href =
                    link.getAttribute("href");


                if (!href) {
                    return;
                }


                const linkPage =
                    getPageName(href);


                /*
                 * Remove manually assigned active
                 * state first.
                 */

                link.classList.remove(
                    "active"
                );


                if (
                    linkPage === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    function getCurrentPage() {

        let page =
            window.location.pathname
                .split("/")
                .pop();


        /*
         * Empty pathname normally means
         * homepage on local hosting.
         */

        if (!page) {
            page = "index.html";
        }


        return page.toLowerCase();

    }


    function getPageName(href) {

        /*
         * Ignore anchor links.
         */

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {

            return "";

        }


        /*
         * Remove query string and hash.
         */

        const cleanHref =
            href
                .split("?")[0]
                .split("#")[0];


        let page =
            cleanHref
                .split("/")
                .pop();


        if (!page) {
            page = "index.html";
        }


        return page.toLowerCase();

    }


    /* =====================================================
       06. ESCAPE KEY
       ===================================================== */

    function initEscapeKey() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                const menu =
                    document.querySelector(
                        ".main-nav"
                    );

                const toggle =
                    document.querySelector(
                        ".menu-toggle"
                    );


                if (
                    menu &&
                    menu.classList.contains(
                        "active"
                    )
                ) {

                    menu.classList.remove(
                        "active"
                    );


                    if (toggle) {

                        toggle.classList.remove(
                            "active"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }


                    document.body.classList.remove(
                        "menu-open"
                    );

                }

            }
        );

    }


    /* =====================================================
       07. EXTERNAL LINKS
       ===================================================== */

    function initExternalLinks() {

        const externalLinks =
            document.querySelectorAll(
                'a[target="_blank"]'
            );


        externalLinks.forEach(
            function (link) {

                const currentRel =
                    link.getAttribute(
                        "rel"
                    ) || "";


                const relValues =
                    new Set(
                        currentRel
                            .split(" ")
                            .filter(Boolean)
                    );


                relValues.add(
                    "noopener"
                );

                relValues.add(
                    "noreferrer"
                );


                link.setAttribute(
                    "rel",
                    Array.from(
                        relValues
                    ).join(" ")
                );

            }
        );

    }


})();
```
