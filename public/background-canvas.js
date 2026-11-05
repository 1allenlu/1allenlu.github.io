// A slow drifting constellation fixed behind the page that connects to the
// cursor. Shared by the homepage and gallery: add <canvas class="site-canvas">
// and load this script.
(function () {
    const canvas = document.querySelector('.site-canvas');
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    const LINK_DISTANCE = 130;
    const CURSOR_DISTANCE = 190;
    const MAX_PARTICLES = 70;
    const AREA_PER_PARTICLE = 16000;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let accent = '#548CFF';
    let cursor = null;
    let frame = 0;

    function readAccent() {
        accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || accent;
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const widthChanged = canvas.clientWidth !== width;
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!widthChanged) return;
        const count = Math.min(MAX_PARTICLES, Math.round((width * height) / AREA_PER_PARTICLE));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = accent;
        ctx.fillStyle = accent;
        ctx.lineWidth = 1;

        particles.forEach((p, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < LINK_DISTANCE) {
                    ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }

            if (cursor) {
                const dist = Math.hypot(p.x - cursor.x, p.y - cursor.y);
                if (dist < CURSOR_DISTANCE) {
                    ctx.globalAlpha = (1 - dist / CURSOR_DISTANCE) * 0.65;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(cursor.x, cursor.y);
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    function step() {
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
    }

    // Only runs while the tab is visible.
    function loop() {
        step();
        draw();
        frame = requestAnimationFrame(loop);
    }

    function start() {
        if (reduceMotion) {
            draw();
            return;
        }
        cancelAnimationFrame(frame);
        if (!document.hidden) frame = requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        cursor = { x: e.clientX, y: e.clientY };
        if (reduceMotion) draw();
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => {
        cursor = null;
        if (reduceMotion) draw();
    });

    new ResizeObserver(() => {
        resize();
        start();
    }).observe(canvas);

    new MutationObserver(() => {
        readAccent();
        if (reduceMotion) draw();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readAccent);
    document.addEventListener('visibilitychange', start);
    readAccent();
})();
