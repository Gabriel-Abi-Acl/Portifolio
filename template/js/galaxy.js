/**
 * Galáxia decorativa em canvas 2D, só dentro do modal.
 * Sem rede e sem biblioteca: arrastar gira, a roda aproxima, e o loop para ao fechar.
 */
(function () {
  function mulberry32(seed) {
    let state = seed >>> 0;
    return function rand() {
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function createParticles(rand) {
    const list = [];
    const arms = 3;
    const count = 880;

    for (let index = 0; index < count; index += 1) {
      const arm = index % arms;
      const radius = Math.pow(rand(), 0.72) * 1.08;
      const angle =
        radius * 3.6 + (arm / arms) * Math.PI * 2 + (rand() - 0.5) * 0.42;
      const thickness = (1.12 - radius) * 0.11;
      const teal = rand() > 0.34;
      list.push({
        angle,
        radius,
        y: (rand() - 0.5) * thickness,
        size: 0.55 + rand() * 1.45,
        color: teal ? 'rgba(62, 224, 197, 0.95)' : 'rgba(198, 186, 255, 0.9)',
      });
    }

    for (let index = 0; index < 48; index += 1) {
      list.push({
        angle: rand() * Math.PI * 2,
        radius: rand() * 0.14,
        y: (rand() - 0.5) * 0.05,
        size: 1.1 + rand() * 1.7,
        color: 'rgba(255, 252, 245, 0.96)',
      });
    }

    for (let index = 0; index < 160; index += 1) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const radius = 0.35 + rand() * 1.35;
      list.push({
        angle: theta,
        radius: Math.abs(Math.sin(phi)) * radius,
        y: Math.cos(phi) * radius * 0.62,
        size: 0.35 + rand() * 0.85,
        color: 'rgba(245, 243, 251, 0.75)',
      });
    }

    return list;
  }

  function mountGalaxy(canvas) {
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      return null;
    }

    const particles = createParticles(mulberry32(20261009));
    let yaw = 0.35;
    let pitch = 0.78;
    let zoom = 1;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let running = false;
    let frameId = 0;
    let lastTime = 0;

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width < 2 || height < 2) {
        return;
      }

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.round(width * ratio);
      const nextHeight = Math.round(height * ratio);
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width < 2 || height < 2) {
        return;
      }

      const ratio = canvas.width / width;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = '#070612';
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.42,
      );
      glow.addColorStop(0, 'rgba(124, 92, 214, 0.55)');
      glow.addColorStop(0.28, 'rgba(62, 224, 197, 0.16)');
      glow.addColorStop(1, 'rgba(7, 6, 18, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const projected = particles.map((particle) => {
        const spin = particle.angle + yaw;
        const x = Math.cos(spin) * particle.radius;
        const z = Math.sin(spin) * particle.radius;
        const y = particle.y * cosP - z * sinP;
        const depth = particle.y * sinP + z * cosP;
        return {
          x,
          y,
          depth,
          size: particle.size,
          color: particle.color,
        };
      });
      projected.sort((a, b) => a.depth - b.depth);

      const scale = Math.min(width, height) * 0.46 * zoom;
      const originX = width / 2;
      const originY = height / 2;

      for (const particle of projected) {
        const perspective = 1.65 / (1.65 + particle.depth);
        const x = originX + particle.x * scale * perspective;
        const y = originY + particle.y * scale * perspective;
        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = clamp(0.28 + perspective * 0.62, 0.15, 1);
        context.arc(
          x,
          y,
          Math.max(0.4, particle.size * perspective),
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      context.globalAlpha = 1;
    }

    function frame(now) {
      if (!running) {
        return;
      }

      const delta = lastTime ? Math.min(34, now - lastTime) : 16;
      lastTime = now;
      if (!dragging) {
        yaw += delta * 0.00018;
      }
      resize();
      draw();
      frameId = window.requestAnimationFrame(frame);
    }

    function onPointerDown(event) {
      dragging = true;
      canvas.classList.add('is-dragging');
      lastX = event.clientX;
      lastY = event.clientY;
      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }

    function onPointerMove(event) {
      if (!dragging) {
        return;
      }

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      yaw += dx * 0.005;
      pitch = clamp(pitch + dy * 0.004, 0.18, 1.28);
    }

    function endDrag() {
      dragging = false;
      canvas.classList.remove('is-dragging');
    }

    function onWheel(event) {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -0.08 : 0.08;
      zoom = clamp(zoom + direction, 0.62, 1.85);
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return {
      start() {
        if (running) {
          return;
        }
        running = true;
        lastTime = 0;
        resize();
        frameId = window.requestAnimationFrame(frame);
      },
      stop() {
        running = false;
        window.cancelAnimationFrame(frameId);
      },
      nudge(dyaw, dpitch) {
        yaw += dyaw;
        pitch = clamp(pitch + dpitch, 0.18, 1.28);
      },
      zoomBy(amount) {
        zoom = clamp(zoom + amount, 0.62, 1.85);
      },
      resize,
    };
  }

  window.mountGalaxy = mountGalaxy;
})();
