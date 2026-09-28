(() => {
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");
    window.addEventListener("scroll", () => {
        if (!hamburger.classList.contains("open")) {
            if (window.pageYOffset > 50) {
                header.classList.add("scroll")
            } else {
                header.classList.remove("scroll")
            }
        }
    });
    const toggleMobileNav = () => {
        header.classList.toggle("open")
    };
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);
})();