// Navbar scroll effect
window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Recommendation System Visualization - Enhanced Version
const canvas = document.getElementById('recCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Enhanced visualization with particles and effects
const users = [];
const items = [];
const connections = [];
const particles = [];

// Create users with enhanced properties
for (let i = 0; i < 5; i++) {
  users.push({
    x: 80,
    y: (canvas.height / 6) * (i + 1),
    id: i,
    radius: 20,
    glowRadius: 0,
    pulsePhase: Math.random() * Math.PI * 2
  });
}

// Create items with categories
const categories = ['🎬', '📚', '🎮', '🎵', '🍔', '👕', '📱', '🏠'];
for (let i = 0; i < 8; i++) {
  items.push({
    x: canvas.width - 80,
    y: (canvas.height / 9) * (i + 1),
    id: i,
    emoji: categories[i],
    recommended: Math.random() > 0.5,
    radius: 18,
    rotation: 0,
    glowIntensity: 0
  });
}

// Create intelligent connections
users.forEach(user => {
  items.forEach(item => {
    if (Math.random() > 0.6) {
      connections.push({
        user: user,
        item: item,
        strength: Math.random(),
        particles: [],
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  });
});

// Particle class for flowing data
class DataParticle {
  constructor(connection) {
    this.connection = connection;
    this.progress = 0;
    this.speed = 0.005 + Math.random() * 0.01;
    this.size = 2 + Math.random() * 3;
    this.color = connection.item.recommended
      ? `rgba(6, 182, 212, ${0.8 + Math.random() * 0.2})`
      : `rgba(139, 92, 246, ${0.6 + Math.random() * 0.4})`;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 0;
      // Trigger glow effect on arrival
      this.connection.item.glowIntensity = 1;
    }
  }

  getPosition() {
    const t = this.progress;
    const startX = this.connection.user.x;
    const startY = this.connection.user.y;
    const endX = this.connection.item.x;
    const endY = this.connection.item.y;

    // Bezier curve for smooth path
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curvature = 50 * Math.sin(this.connection.pulseOffset + Date.now() * 0.001);

    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * (midY + curvature) + t * t * endY;

    return { x, y };
  }
}

// Initialize particles for each connection
connections.forEach(conn => {
  const particleCount = conn.item.recommended ? 5 : 3;
  for (let i = 0; i < particleCount; i++) {
    const particle = new DataParticle(conn);
    particle.progress = i / particleCount; // Distribute along path
    conn.particles.push(particle);
  }
});

function drawGradientLine(x1, y1, x2, y2, color1, color2, width) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawGlow(x, y, radius, color, intensity = 1) {
  // Extract RGB values from color string
  let r, g, b;
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      r = match[1];
      g = match[2];
      b = match[3];
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      r = match[1];
      g = match[2];
      b = match[3];
    }
  }

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.3 * intensity})`);
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.1 * intensity})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function animateRecommendation() {
  // Dark background with subtle gradient
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
  bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw connections with enhanced effects
  connections.forEach(conn => {
    const time = Date.now() * 0.001;
    conn.strength = (Math.sin(time + conn.user.id + conn.item.id) + 1) / 2;

    // Draw connection path with glow
    const midX = (conn.user.x + conn.item.x) / 2;
    const midY = (conn.user.y + conn.item.y) / 2;
    const curvature = 50 * Math.sin(conn.pulseOffset + time);

    ctx.beginPath();
    ctx.moveTo(conn.user.x, conn.user.y);
    ctx.quadraticCurveTo(
      midX, midY + curvature,
      conn.item.x, conn.item.y
    );

    // Multiple strokes for glow effect
    const baseColor = conn.item.recommended
      ? 'rgba(6, 182, 212,'
      : 'rgba(139, 92, 246,';

    // Outer glow
    ctx.strokeStyle = baseColor + `${conn.strength * 0.1})`;
    ctx.lineWidth = 20;
    ctx.stroke();

    // Middle glow
    ctx.strokeStyle = baseColor + `${conn.strength * 0.2})`;
    ctx.lineWidth = 10;
    ctx.stroke();

    // Core line
    ctx.strokeStyle = baseColor + `${conn.strength * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Update and draw particles
    conn.particles.forEach(particle => {
      particle.update();
      const pos = particle.getPosition();

      // Particle glow
      drawGlow(pos.x, pos.y, particle.size * 4, particle.color, 1);

      // Particle core
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
    });
  });

  // Draw users with enhanced effects
  users.forEach(user => {
    const time = Date.now() * 0.001;
    user.glowRadius = 30 + Math.sin(time + user.pulsePhase) * 10;

    // User glow effect
    drawGlow(user.x, user.y, user.glowRadius, 'rgb(59, 130, 246)', 1);

    // Outer ring
    ctx.beginPath();
    ctx.arc(user.x, user.y, user.radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Main circle with gradient
    const userGradient = ctx.createRadialGradient(
      user.x - 5, user.y - 5, 0,
      user.x, user.y, user.radius
    );
    userGradient.addColorStop(0, 'rgba(96, 165, 250, 1)');
    userGradient.addColorStop(1, 'rgba(59, 130, 246, 1)');

    ctx.beginPath();
    ctx.arc(user.x, user.y, user.radius, 0, Math.PI * 2);
    ctx.fillStyle = userGradient;
    ctx.fill();

    // Inner ring
    ctx.beginPath();
    ctx.arc(user.x, user.y, user.radius - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // User icon
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', user.x, user.y);
    ctx.restore();
  });

  // Draw items with enhanced effects
  items.forEach(item => {
    const time = Date.now() * 0.001;
    item.rotation += 0.01;
    item.glowIntensity *= 0.95; // Fade glow

    const baseRadius = item.radius + Math.sin(time * 2 + item.id) * 2;

    // Item glow effect
    if (item.recommended) {
      drawGlow(item.x, item.y, baseRadius + 20 + item.glowIntensity * 20, 'rgb(6, 182, 212)', 0.8 + item.glowIntensity);
    } else {
      drawGlow(item.x, item.y, baseRadius + 15, 'rgb(139, 92, 246)', 0.5);
    }

    // Rotating outer ring for recommended items
    if (item.recommended) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    // Main circle with gradient
    const itemGradient = ctx.createRadialGradient(
      item.x - 5, item.y - 5, 0,
      item.x, item.y, baseRadius
    );

    if (item.recommended) {
      itemGradient.addColorStop(0, 'rgba(34, 211, 238, 1)');
      itemGradient.addColorStop(1, 'rgba(6, 182, 212, 1)');
    } else {
      itemGradient.addColorStop(0, 'rgba(167, 139, 250, 1)');
      itemGradient.addColorStop(1, 'rgba(139, 92, 246, 1)');
    }

    ctx.beginPath();
    ctx.arc(item.x, item.y, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = itemGradient;
    ctx.fill();

    // Inner ring
    ctx.beginPath();
    ctx.arc(item.x, item.y, baseRadius - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Item icon with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, item.x, item.y);
    ctx.restore();

    // Recommendation badge
    if (item.recommended) {
      ctx.save();
      ctx.translate(item.x + baseRadius * 0.7, item.y - baseRadius * 0.7);

      // Badge background
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 1)';
      ctx.fill();

      // Checkmark
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(-1, 2);
      ctx.lineTo(3, -2);
      ctx.stroke();

      ctx.restore();
    }
  });

  requestAnimationFrame(animateRecommendation);
}
animateRecommendation();

// Matrix rain effect
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrixCanvas() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
}
resizeMatrixCanvas();
window.addEventListener('resize', resizeMatrixCanvas);

const columns = Math.floor(matrixCanvas.width / 20);
const drops = Array(columns).fill(0);
const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function drawMatrix() {
  matrixCtx.fillStyle = 'rgba(15, 23, 42, 0.05)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  matrixCtx.fillStyle = '#3b82f6';
  matrixCtx.font = '15px monospace';

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    matrixCtx.fillText(char, i * 20, drops[i] * 20);

    if (drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);