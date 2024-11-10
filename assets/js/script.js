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
    const equipmentBtns = document.querySelectorAll(".equipment-btn");
    const flipCard = document.querySelector(".flip-card");
    const flipCardHandler = () => {
        flipCard.classList.toggle("rotate")
    };
    equipmentBtns.forEach((btn) => {
        btn.addEventListener("click", flipCardHandler)
    });
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);
    const galleryTabs = document.querySelectorAll(".gallery-tabs > .tab");
    const galleryTabIndicator = document.querySelector(".gallery-tabs > .tab-indicator");
    const galleries = document.querySelectorAll(".gallery");
    galleryTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            galleryTabs.forEach((tab) => {
                tab.classList.remove("active")
            });
            galleries.forEach((gallery) => {
                gallery.classList.remove("active")
            });
            galleryTabIndicator.style.left = `${index * 140}px`;
            tab.classList.add("active");
            galleries[index].classList.add("active")
        })
    });
    let eventSlider = new Swiper(".event-slider", {
        slidesPerView: 1,
        spaceBetween: 130,
        loop: !0,
        autoplay: {
            delay: 2500,
            disableOnInteraction: !1,
        },
        navigation: {
            nextEl: ".next-event",
            prevEl: ".prev-event",
        },
        pagination: {
            el: ".event-slider-pagination",
            clickable: !0,
        },
    });
    const backVideo = document.querySelector(".back-video");
    const setVideoSrc = () => {
        if (window.innerWidth <= 680) {
            if (backVideo.getAttribute("src") !== "./assets/videos/mobile.mp4")
                backVideo.src = "./assets/videos/mobile.mp4"
        } else if (backVideo.getAttribute("src") !== "./assets/videos/light.mp4") {
            backVideo.src = "./assets/videos/light.mp4"
        }
    };
    window.addEventListener("resize", setVideoSrc);
    setVideoSrc()

    document.getElementById("scrollToAbout").addEventListener("click", function(event) {
        event.preventDefault();
        var aboutSection = document.getElementById("about");
        var offset = 50; // Adjust this value to control the offset
        var scrollPosition = aboutSection.offsetTop - offset;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      });
})();
// $('#mySelect').change(function () {
//     $('#mySelect').css("background", $("select option:selected").css("background-color"))
// })

  
