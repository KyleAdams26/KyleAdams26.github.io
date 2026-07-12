// --------------------------------------------------
// Shared floating particle animation
// Colors are read from each page's CSS theme.
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const particleLayer = document.querySelector(".particle-layer");

    if (!particleLayer) {
        console.error("Particle layer not found.");
        return;
    }

    particleLayer.replaceChildren();

    const particles = [];
    const particleCount = 80;

    const rootStyles = getComputedStyle(document.body);
    const particleRGB =
        rootStyles.getPropertyValue("--particle-rgb").trim() || "212, 71, 96";

    function randomBetween(minimum, maximum) {
        return Math.random() * (maximum - minimum) + minimum;
    }

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
        element.style.setProperty(
            "--particle-color",
            `rgba(${particleRGB}, ${brightness})`
        );
        element.style.setProperty(
            "--particle-glow",
            `rgba(${particleRGB}, 0.38)`
        );
        element.style.setProperty(
            "--particle-opacity",
            particle.baseOpacity
        );
        element.style.setProperty(
            "--particle-blur",
            `${randomBetween(0.15, 0.75)}px`
        );

        particleLayer.appendChild(element);
        return particle;
    }

    for (let index = 0; index < particleCount; index += 1) {
        particles.push(createParticle());
    }

    function wrapParticle(particle) {
        const margin = 30;
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (particle.x < -margin) {
            particle.x = width + margin;
        } else if (particle.x > width + margin) {
            particle.x = -margin;
        }

        if (particle.y < -margin) {
            particle.y = height + margin;
        } else if (particle.y > height + margin) {
            particle.y = -margin;
        }
    }

    function animateParticles(time) {
        particles.forEach((particle) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            wrapParticle(particle);

            const pulse =
                particle.pulseAmount *
                Math.sin(time / particle.pulseSpeed + particle.phase);

            particle.element.style.opacity = Math.max(
                0.22,
                particle.baseOpacity + pulse
            );

            particle.element.style.transform =
                `translate3d(${particle.x}px, ${particle.y}px, 0)`;
        });

        requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
    console.log(`${particleCount} themed particles created.`);
});
