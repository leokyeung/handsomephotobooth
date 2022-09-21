(() => {
    // Select HTML Elements
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");

    // Add/Remove Classes On Scroll
    window.addEventListener("scroll", () => {
        if (!hamburger.classList.contains("open")) {
            if (window.pageYOffset > 50) {
                header.classList.add("scroll");
            } else {
                header.classList.remove("scroll");
            }
        }
    });

    // Handles Mobile Navigation Bar
    const toggleMobileNav = () => {
        header.classList.toggle("open");
    };

    // Event Listeners
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);
})();
