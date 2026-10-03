// ==========================================
// APP.JS
// UI interactions for Agricultural Advisory
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Mobile navigation
    const menuButton =
        document.getElementById("menuButton");

    const navigation =
        document.getElementById("navigation");

    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            () => {

                navigation.classList.toggle(
                    "mobile-open"
                );

            }
        );
    }


    // Smooth scrolling
    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    const target =
                        document.querySelector(targetId);

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    if (navigation) {
                        navigation.classList.remove(
                            "mobile-open"
                        );
                    }

                }
            );

        });


    // Reveal animation
    const sections =
        document.querySelectorAll(
            ".animate-section"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        sections.forEach(section => {
            observer.observe(section);
        });

    } else {

        sections.forEach(section => {
            section.classList.add("visible");
        });

    }


    // Current year
    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    // Crop selection visual effect
    const crop =
        document.getElementById("cropSelect");

    if (crop) {

        crop.addEventListener(
            "change",
            () => {

                crop.classList.add(
                    "selected"
                );

                setTimeout(() => {

                    crop.classList.remove(
                        "selected"
                    );

                }, 500);

            }
        );
    }


    // Prevent accidental form submission
    document
        .querySelectorAll("form")
        .forEach(form => {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                }
            );

        });

});


// ==========================================
// SIMPLE TAB SYSTEM
// ==========================================

function openTab(tabId) {

    document
        .querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.remove("active");

        });

    document
        .querySelectorAll(".tab-button")
        .forEach(button => {

            button.classList.remove("active");

        });

    const selected =
        document.getElementById(tabId);

    if (selected) {

        selected.classList.add(
            "active"
        );

    }

    const clickedButton =
        document.querySelector(
            `[data-tab="${tabId}"]`
        );

    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    }

}


// ==========================================
// DARK / LIGHT MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        "agriTheme",
        isDark ? "dark" : "light"
    );

}


// Restore theme
(function restoreTheme() {

    const savedTheme =
        localStorage.getItem(
            "agriTheme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    }

})();


// ==========================================
// SAVE USER PREFERENCES
// ==========================================

function savePreference(key, value) {

    try {

        localStorage.setItem(
            `agri_${key}`,
            value
        );

    } catch (error) {

        console.log(
            "Could not save preference."
        );

    }

}


function getPreference(key) {

    try {

        return localStorage.getItem(
            `agri_${key}`
        );

    } catch (error) {

        return null;

    }

}


// ==========================================
// LOADING STATE
// ==========================================

function showLoading(button, loadingText = "Loading...") {

    if (!button) return;

    if (!button.dataset.originalText) {

        button.dataset.originalText =
            button.innerHTML;

    }

    button.disabled = true;

    button.innerHTML = `
        <span class="loading-spinner"></span>
        ${loadingText}
    `;

}


function hideLoading(button) {

    if (!button) return;

    button.disabled = false;

    if (button.dataset.originalText) {

        button.innerHTML =
            button.dataset.originalText;

    }

}


// ==========================================
// NUMBER FORMAT
// ==========================================

function formatNumber(number, decimals = 1) {

    if (
        number === null ||
        number === undefined ||
        isNaN(number)
    ) {

        return "--";

    }

    return Number(number)
        .toFixed(decimals);

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!(date instanceof Date)) {

        date = new Date(date);

    }

    if (isNaN(date.getTime())) {
        return "--";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// EXPORT FOR OTHER JS FILES
// ==========================================

window.AgriApp = {

    openTab,
    toggleTheme,
    savePreference,
    getPreference,
    showLoading,
    hideLoading,
    formatNumber,
    formatDate

};