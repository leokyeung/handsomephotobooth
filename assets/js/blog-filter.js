(() => {
    const filters = document.querySelectorAll(".blog-chip[data-filter]");
    const cards = document.querySelectorAll(".blog-post-card[data-category]");

    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.filter;
            filters.forEach((button) => {
                const active = button === filter;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
            cards.forEach((card) => {
                card.hidden = category !== "all" && card.dataset.category !== category;
            });
        });
    });
})();