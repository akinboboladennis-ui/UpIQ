/* ==========================================================================
   Animated particle background
   Lightweight canvas particle field with connecting lines that respond
   to cursor movement. Pairs with the CSS gradient for depth.
   ========================================================================== */

(function () {
    "use strict";

    const canvas = document.getElementById("particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Honor users who prefer reduced motion — draw nothing, animate nothing.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let width, height, particles;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: null, y: null, radius: 140 };

    const COLORS = ["#2f6bff", "#4d8bff", "#38e1ff", "#7db0ff"];

    function particleCount() {
        // Scale density with screen size, capped for performance.
        return Math.min(Math.floor((width * height) / 14000), 110);
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        init();
    }

    function init() {
        particles = [];
        const count = particleCount();
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.8 + 0.6,
                color: COLORS[(Math.random() * COLORS.length) | 0],
            });
        }
    }

    function update() {
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges for a seamless field.
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            // Gentle push away from the cursor.
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += (dx / dist) * force * 1.6;
                    p.y += (dy / dist) * force * 1.6;
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Connecting lines between nearby particles.
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.35;
                    ctx.strokeStyle = "rgba(77, 139, 255, " + alpha + ")";
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Particles themselves, with a soft glow.
        for (const p of particles) {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    // Events
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", function () {
        mouse.x = null;
        mouse.y = null;
    });

    resize();
    loop();
})();

/* ==========================================================================
   Contact form
   Client-side validation with inline status feedback. No backend is wired
   up yet, so a successful submit just confirms locally.
   ========================================================================== */

(function () {
    "use strict";

    const form = document.getElementById("contact-form");
    if (!form) return;

    const status = document.getElementById("form-status");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name || !email || !message) {
            status.style.color = "#ff6b6b";
            status.textContent = "Please fill in every field before sending.";
            return;
        }

        if (!emailValid) {
            status.style.color = "#ff6b6b";
            status.textContent = "That email address doesn't look right.";
            return;
        }

        status.style.color = "";
        status.textContent =
            "Thanks, " + name + "! Your message has been received — I'll be in touch soon.";
        form.reset();
    });
})();
