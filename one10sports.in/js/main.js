/**
 * ONE10 SPORTS — Official Client Script
 * Domain: one10sports.in
 * Contact: info@one10sports.in | +91 72769 15170
 */

// ==========================================
// CONFIGURATION: Google Apps Script Webhook
// ==========================================
// When your Google Sheet + Google Apps Script Webhook is ready, paste its deployment URL here:
const GOOGLE_SCRIPT_WEBHOOK_URL = ""; 

const WHATSAPP_PHONE = "917276915170";
const DISPLAY_PHONE = "+91 72769 15170";

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initHeroSlider();
    initEnquiryModal();
    initContactForm();
    initGalleryLightbox();
});

// ------------------------------------------
// 1. Header & Mobile Menu
// ------------------------------------------
function initHeader() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.contains("hidden");
            if (isHidden) {
                mobileMenu.classList.remove("hidden");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-bars");
                    menuIcon.classList.add("fa-xmark");
                }
            } else {
                mobileMenu.classList.add("hidden");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile menu when clicking any nav link
        document.querySelectorAll(".mobile-nav-link").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            });
        });
    }
}

// ------------------------------------------
// 2. Hero Slider (3 Slides Max)
// ------------------------------------------
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.getElementById("hero-prev-btn");
    const nextBtn = document.getElementById("hero-next-btn");
    const heroContainer = document.getElementById("hero-slider-container");

    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    function showSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add("active");
                dot.classList.remove("bg-white/20");
            } else {
                dot.classList.remove("active");
                dot.classList.add("bg-white/20");
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5500);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAutoPlay(); });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    if (heroContainer) {
        heroContainer.addEventListener("mouseenter", stopAutoPlay);
        heroContainer.addEventListener("mouseleave", startAutoPlay);

        // Touch swipe handling for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        heroContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
                startAutoPlay();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
                startAutoPlay();
            }
        }, { passive: true });
    }

    // Initialize first slide and start auto-play
    showSlide(0);
    startAutoPlay();
}

// ------------------------------------------
// 3. Quick Enquiry Modal
// ------------------------------------------
function initEnquiryModal() {
    const modal = document.getElementById("enquiry-modal");
    const closeBtn = document.getElementById("close-enquiry-modal");
    const modalTitle = document.getElementById("modal-product-title");
    const modalCategoryInput = document.getElementById("modal-category-input");
    const modalProductInput = document.getElementById("modal-product-input");

    window.openEnquiryModal = function(productName, categoryName) {
        if (!modal) {
            // If modal doesn't exist on page, prefill and scroll to contact form
            scrollToContact(productName, categoryName);
            return;
        }
        if (modalTitle) modalTitle.textContent = productName || "Product Enquiry";
        if (modalProductInput) modalProductInput.value = productName || "";
        if (modalCategoryInput) modalCategoryInput.value = categoryName || "";
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    };

    window.closeEnquiryModal = function() {
        if (!modal) return;
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", window.closeEnquiryModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) window.closeEnquiryModal();
        });
    }

    // Modal WhatsApp Send
    const modalWhatsappBtn = document.getElementById("modal-whatsapp-send");
    if (modalWhatsappBtn) {
        modalWhatsappBtn.addEventListener("click", () => {
            const prod = modalProductInput ? modalProductInput.value : "";
            const cat = modalCategoryInput ? modalCategoryInput.value : "";
            const qty = document.getElementById("modal-quantity")?.value || "1";
            const type = document.querySelector('input[name="modal-order-type"]:checked')?.value || "Retail";
            const name = document.getElementById("modal-user-name")?.value || "";

            let msg = `*ONE10 SPORTS Product Enquiry*\n`;
            if (prod) msg += `*Product:* ${prod}\n`;
            if (cat) msg += `*Category:* ${cat}\n`;
            msg += `*Order Type:* ${type}\n`;
            msg += `*Quantity:* ${qty}\n`;
            if (name) msg += `*From:* ${name}\n`;

            const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");
            window.closeEnquiryModal();
        });
    }
}

function scrollToContact(productName, categoryName) {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        const catSelect = document.getElementById("contact-category");
        if (catSelect && categoryName) {
            for (let i = 0; i < catSelect.options.length; i++) {
                if (catSelect.options[i].text.toLowerCase().includes(categoryName.toLowerCase())) {
                    catSelect.selectedIndex = i;
                    break;
                }
            }
        }
        const msgField = document.getElementById("contact-message");
        if (msgField && productName) {
            msgField.value = `Hi, I am interested in enquiries for ${productName}. Please share details and pricing options.`;
        }
    }
}

// ------------------------------------------
// 4. Contact & Enquiry Form (Isolated for Google Apps Script)
// ------------------------------------------
function initContactForm() {
    const form = document.getElementById("main-enquiry-form");
    if (!form) return;

    const feedbackContainer = document.getElementById("form-feedback");
    const submitBtn = document.getElementById("form-submit-btn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear feedback
        if (feedbackContainer) {
            feedbackContainer.classList.add("hidden");
            feedbackContainer.innerHTML = "";
        }

        const name = form.querySelector('[name="name"]')?.value.trim();
        const mobile = form.querySelector('[name="mobile"]')?.value.trim();
        const email = form.querySelector('[name="email"]')?.value.trim();
        const category = form.querySelector('[name="category"]')?.value;
        const quantity = form.querySelector('[name="quantity"]')?.value.trim();
        const orderType = form.querySelector('input[name="order_type"]:checked')?.value || "Retail";
        const city = form.querySelector('[name="city"]')?.value.trim();
        const message = form.querySelector('[name="message"]')?.value.trim();

        // Validation
        if (!name || !mobile || !category || !quantity || !city) {
            showFeedback("error", "Please fill in all required fields (Name, Mobile, Category, Quantity, and City).");
            return;
        }

        const formData = {
            timestamp: new Date().toISOString(),
            name,
            mobile,
            email: email || "Not provided",
            category,
            quantity,
            orderType,
            city,
            message: message || "No additional message"
        };

        // If Google Apps Script Webhook is configured, send HTTP POST
        if (GOOGLE_SCRIPT_WEBHOOK_URL && GOOGLE_SCRIPT_WEBHOOK_URL.startsWith("http")) {
            setSubmitState(true);
            try {
                const response = await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showFeedback("success", "Thank you! Your enquiry has been received successfully. Our team will contact you shortly.");
                    form.reset();
                } else {
                    showFeedback("error", "Backend submission error. Please contact us directly via WhatsApp or Phone.");
                }
            } catch (err) {
                console.error("Submission error:", err);
                showFeedback("error", "Network issue connecting to server. Please click below to send via WhatsApp.");
            } finally {
                setSubmitState(false);
            }
        } else {
            // Backend endpoint not yet connected:
            // STRICT RULE: Do not show a fake success message unless the backend confirms successful submission.
            // Instead, guide the user to forward the validated enquiry instantly via WhatsApp or direct Call.
            const waText = `*NEW ENQUIRY — ONE10 SPORTS*\n\n` +
                           `*Name:* ${name}\n` +
                           `*Mobile:* ${mobile}\n` +
                           (email ? `*Email:* ${email}\n` : ``) +
                           `*Category:* ${category}\n` +
                           `*Quantity:* ${quantity} Units\n` +
                           `*Order Type:* ${orderType}\n` +
                           `*City:* ${city}\n` +
                           (message ? `*Notes:* ${message}\n` : ``);

            const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

            if (feedbackContainer) {
                feedbackContainer.classList.remove("hidden");
                feedbackContainer.innerHTML = `
                    <div class="bg-[#181A20] border border-[#C7F000]/40 rounded-xl p-5 text-center mt-4">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-[#C7F000]/10 flex items-center justify-center text-[#C7F000]">
                            <i class="fab fa-whatsapp text-2xl"></i>
                        </div>
                        <h4 class="text-white font-bold text-lg mb-1">Enquiry Form Validated</h4>
                        <p class="text-gray-300 text-sm mb-4">Direct backend integration is pending. Complete your enquiry instantly with our team via WhatsApp:</p>
                        <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
                           class="inline-flex items-center justify-center gap-2 bg-[#C7F000] hover:bg-[#D4FF00] text-[#111318] font-bold px-6 py-3 rounded-lg transition duration-200 shadow-lime-glow">
                            <i class="fab fa-whatsapp text-lg"></i>
                            Send via WhatsApp (+91 72769 15170)
                        </a>
                        <p class="text-gray-400 text-xs mt-3">Or call us directly at <a href="tel:+917276915170" class="text-[#C7F000] underline">+91 72769 15170</a></p>
                    </div>
                `;
            }
        }
    });

    function setSubmitState(isSubmitting) {
        if (!submitBtn) return;
        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...`;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Submit Enquiry</span><i class="fas fa-arrow-right ml-2 text-sm"></i>`;
        }
    }

    function showFeedback(type, text) {
        if (!feedbackContainer) return;
        feedbackContainer.classList.remove("hidden");
        if (type === "success") {
            feedbackContainer.innerHTML = `
                <div class="bg-green-950/60 border border-green-500/50 text-green-300 p-4 rounded-xl text-center text-sm font-medium mt-4">
                    <i class="fas fa-check-circle mr-2 text-green-400"></i>${text}
                </div>
            `;
        } else {
            feedbackContainer.innerHTML = `
                <div class="bg-red-950/60 border border-red-500/50 text-red-300 p-4 rounded-xl text-center text-sm font-medium mt-4">
                    <i class="fas fa-exclamation-triangle mr-2 text-red-400"></i>${text}
                </div>
            `;
        }
    }
}

// ------------------------------------------
// 5. Brand Gallery Lightbox
// ------------------------------------------
function initGalleryLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("close-lightbox");

    if (!lightbox) return;

    window.openLightbox = function(src, caption) {
        if (lightboxImg) lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption || "";
        lightbox.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    };

    window.closeLightbox = function() {
        lightbox.classList.add("hidden");
        document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", window.closeLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) window.closeLightbox();
    });
}
