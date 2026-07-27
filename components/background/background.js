/**
 * Atmospheric Background Canvas Engine
 * Manages Night Sky (twinkling stars, moving clouds, shooting comet showers)
 * and Morning Vibe (soft dawn sunrise, morning clouds, floating light particles)
 */

const SkyBackground = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  stars: [],
  nightClouds: [],
  morningClouds: [],
  morningParticles: [],
  comets: [],
  lastCometSpawn: 0,
  isLightMode: false,

  init() {
    this.canvas = document.getElementById('sky-background-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());

    // Detect initial mode
    this.checkMode();

    // Observe mode changes on html / body
    const observer = new MutationObserver(() => this.checkMode());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Seed elements
    this.initStars();
    this.initNightClouds();
    this.initMorningClouds();
    this.initMorningParticles();

    // Start render loop
    requestAnimationFrame((t) => this.render(t));
  },

  checkMode() {
    this.isLightMode = document.documentElement.classList.contains('light-mode') || document.body.classList.contains('light-mode');
  },

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  initStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 10000); // Responsive star count
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random(),
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        phase: Math.random() * Math.PI * 2
      });
    }
  },

  initNightClouds() {
    this.nightClouds = [];
    for (let i = 0; i < 5; i++) {
      this.nightClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.6),
        radius: Math.random() * 180 + 120,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.04 + 0.02
      });
    }
  },

  initMorningClouds() {
    this.morningClouds = [];
    for (let i = 0; i < 4; i++) {
      this.morningClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.4),
        radius: Math.random() * 220 + 140,
        speed: Math.random() * 0.12 + 0.04,
        opacity: Math.random() * 0.18 + 0.08
      });
    }
  },

  initMorningParticles() {
    this.morningParticles = [];
    for (let i = 0; i < 25; i++) {
      this.morningParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  },

  spawnComet() {
    // Spawn comet from top-right down towards bottom-left
    const startX = Math.random() * (this.width * 0.8) + (this.width * 0.2);
    const startY = Math.random() * (this.height * 0.3);
    const length = Math.random() * 140 + 90;
    const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 deg

    this.comets.push({
      x: startX,
      y: startY,
      length: length,
      speed: Math.random() * 10 + 12,
      vx: -Math.cos(angle),
      vy: Math.sin(angle),
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 40 + 35
    });
  },

  render(timestamp) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.isLightMode) {
      this.renderMorningMode();
    } else {
      this.renderNightMode(timestamp);
    }

    requestAnimationFrame((t) => this.render(t));
  },

  renderNightMode(timestamp) {
    // 1. Render Twinkling Stars
    for (let star of this.stars) {
      star.phase += star.twinkleSpeed;
      const currentAlpha = Math.max(0.1, star.baseAlpha + Math.sin(star.phase) * 0.3);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha.toFixed(2)})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Render Moving Night Clouds
    for (let cloud of this.nightClouds) {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.radius < 0) {
        cloud.x = this.width + cloud.radius;
      }
      const grad = this.ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
      grad.addColorStop(0, `rgba(138, 140, 180, ${cloud.opacity})`);
      grad.addColorStop(1, 'rgba(11, 11, 14, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Render Shooting Star / Comet Shower
    if (timestamp - this.lastCometSpawn > 6000 + Math.random() * 6000) {
      this.spawnComet();
      this.lastCometSpawn = timestamp;
    }

    for (let i = this.comets.length - 1; i >= 0; i--) {
      const comet = this.comets[i];
      comet.life++;
      comet.x += comet.vx * comet.speed;
      comet.y += comet.vy * comet.speed;

      const fadeRatio = 1 - (comet.life / comet.maxLife);
      comet.alpha = Math.max(0, fadeRatio);

      const tailX = comet.x - comet.vx * comet.length;
      const tailY = comet.y - comet.vy * comet.length;

      const grad = this.ctx.createLinearGradient(comet.x, comet.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${comet.alpha})`);
      grad.addColorStop(0.3, `rgba(126, 242, 157, ${(comet.alpha * 0.7).toFixed(2)})`);
      grad.addColorStop(1, 'rgba(90, 164, 249, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(comet.x, comet.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      // Glowing head spark
      this.ctx.fillStyle = `rgba(255, 255, 255, ${comet.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(comet.x, comet.y, 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      if (comet.life >= comet.maxLife) {
        this.comets.splice(i, 1);
      }
    }
  },

  renderMorningMode() {
    // 1. Soft Morning Sunrise Aura
    const sunGrad = this.ctx.createRadialGradient(this.width * 0.15, this.height * 0.1, 0, this.width * 0.15, this.height * 0.1, this.width * 0.5);
    sunGrad.addColorStop(0, 'rgba(255, 230, 180, 0.35)');
    sunGrad.addColorStop(0.5, 'rgba(230, 242, 255, 0.18)');
    sunGrad.addColorStop(1, 'rgba(247, 249, 252, 0)');
    this.ctx.fillStyle = sunGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Moving Soft Morning Clouds
    for (let cloud of this.morningClouds) {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.radius < 0) {
        cloud.x = this.width + cloud.radius;
      }
      const grad = this.ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
      grad.addColorStop(0.7, `rgba(255, 245, 230, ${(cloud.opacity * 0.5).toFixed(2)})`);
      grad.addColorStop(1, 'rgba(247, 249, 252, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Floating Morning Dust/Light Particles
    for (let p of this.morningParticles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < 0) {
        p.y = this.height;
        p.x = Math.random() * this.width;
      }
      this.ctx.fillStyle = `rgba(255, 215, 150, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SkyBackground.init();
});
