document.addEventListener("DOMContentLoaded", () => {
    initializeParticles();
    initializePhotoStacks();
});

function initializeParticles() {
    const particleLayer = document.querySelector(".particle-layer");
    if (!particleLayer) return;

    particleLayer.replaceChildren();

    const particles = [];
    const particleCount = 80;
    const rootStyles = getComputedStyle(document.body);
    const particleRGB = rootStyles.getPropertyValue("--particle-rgb").trim() || "212, 71, 96";

    const randomBetween = (minimum, maximum) =>
        Math.random() * (maximum - minimum) + minimum;

    function createParticle() {
        const element = document.createElement("span");
        const size = randomBetween(3, 8);
        const brightness = randomBetween(0.58, 0.88);

        const particle = {
            element,
            x: randomBetween(0, window.innerWidth),
            y: randomBetween(0, window.innerHeight),
            velocityX: randomBetween(-0.16, 0.16),
            velocityY: randomBetween(-0.16, 0.16),
            baseOpacity: randomBetween(0.30, 0.52),
            pulseAmount: randomBetween(0.04, 0.09),
            pulseSpeed: randomBetween(1400, 2800),
            phase: randomBetween(0, Math.PI * 2)
        };

        element.className = "particle";
        element.style.setProperty("--particle-size", `${size}px`);
        element.style.setProperty("--particle-color", `rgba(${particleRGB}, ${brightness})`);
        element.style.setProperty("--particle-glow", `rgba(${particleRGB}, 0.38)`);
        element.style.setProperty("--particle-opacity", particle.baseOpacity);
        element.style.setProperty("--particle-blur", `${randomBetween(0.15, 0.75)}px`);

        particleLayer.appendChild(element);
        return particle;
    }

    for (let index = 0; index < particleCount; index += 1) {
        particles.push(createParticle());
    }

    function animateParticles(time) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        particles.forEach((particle) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            if (particle.x < -30) particle.x = width + 30;
            if (particle.x > width + 30) particle.x = -30;
            if (particle.y < -30) particle.y = height + 30;
            if (particle.y > height + 30) particle.y = -30;

            const pulse =
                particle.pulseAmount *
                Math.sin(time / particle.pulseSpeed + particle.phase);

            particle.element.style.opacity =
                Math.max(0.22, particle.baseOpacity + pulse);

            particle.element.style.transform =
                `translate3d(${particle.x}px, ${particle.y}px, 0)`;
        });

        requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
}

function initializePhotoStacks() {
    document.querySelectorAll("[data-photo-stack]").forEach((container) => {
        const stack = container.querySelector(".photo-stack");
        const cards = Array.from(container.querySelectorAll("[data-photo-card]"));
        const previousButton = container.querySelector("[data-photo-previous]");
        const nextButton = container.querySelector("[data-photo-next]");
        const dotsContainer = container.querySelector("[data-photo-dots]");

        if (!stack || cards.length === 0) return;

        let activeIndex = Math.max(0, cards.findIndex(
            (card) => card.dataset.active === "true"
        ));

        let isAnimating = false;
        const accentRotations = ["5deg", "-4deg", "7deg", "-6deg", "3deg", "-7deg"];

        const dots = cards.map((card, index) => {
            const dot = document.createElement("button");
            dot.className = "photo-stack-dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Show photo ${index + 1}`);
            dot.addEventListener("click", () => {
                if (index === activeIndex || isAnimating) return;
                moveToPhoto(index, index > activeIndex ? "forward" : "backward");
            });
            dotsContainer.appendChild(dot);
            return dot;
        });

        function updateStack() {
            cards.forEach((card, index) => {
                const distance = (index - activeIndex + cards.length) % cards.length;
                card.removeAttribute("data-active");

                if (distance === 0) {
                    card.dataset.stackPosition = "0";
                    card.dataset.active = "true";
                } else if (distance === 1) {
                    card.dataset.stackPosition = "1";
                } else if (distance === 2) {
                    card.dataset.stackPosition = "2";
                } else {
                    card.dataset.stackPosition = "hidden";
                }
            });

            dots.forEach((dot, index) => {
                dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
            });

            container.style.setProperty(
                "--accent-rotation",
                accentRotations[activeIndex % accentRotations.length]
            );
        }

        function moveToPhoto(index, direction) {
            if (isAnimating || cards.length < 2) return;

            isAnimating = true;
            stack.classList.toggle("is-moving-forward", direction === "forward");
            stack.classList.toggle("is-moving-backward", direction === "backward");

            setTimeout(() => {
                activeIndex = (index + cards.length) % cards.length;
                updateStack();
                stack.classList.remove("is-moving-forward", "is-moving-backward");

                setTimeout(() => {
                    isAnimating = false;
                }, 420);
            }, 220);
        }

        nextButton?.addEventListener("click", () =>
            moveToPhoto(activeIndex + 1, "forward")
        );

        previousButton?.addEventListener("click", () =>
            moveToPhoto(activeIndex - 1, "backward")
        );

        updateStack();
    });
}
