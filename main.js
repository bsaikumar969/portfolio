// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('solid');
  else navbar.classList.remove('solid');
});

// Particle canvas
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

// Responsive particles
let particles = [];
let particleCount = 100;
let maxDistance = 120;
const mouse = { x: null, y: null };

function setResponsiveParticles() {
  const width = window.innerWidth;
  if (width < 600) { particleCount = 40; maxDistance = 80; }
  else if (width < 900) { particleCount = 70; maxDistance = 100; }
  else if (width < 1400) { particleCount = 120; maxDistance = 120; }
  else { particleCount = 160; maxDistance = 140; }
}
setResponsiveParticles();
window.addEventListener("resize", setResponsiveParticles);

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.radius = Math.random() * 2 + 1;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i=0; i<particleCount; i++) particles.push(new Particle());
}

function connectParticles() {
  for (let i=0; i<particles.length; i++) {
    for (let j=i; j<particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < maxDistance) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - distance/maxDistance})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    if (mouse.x && mouse.y) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < maxDistance) {
        ctx.strokeStyle = "rgba(0,150,255,0.8)";
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {p.move(); p.draw();});
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();

// Video autoplay on scroll
const videos = document.querySelectorAll("video");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.play();
    else entry.target.pause();
  });
}, {threshold:0.4});
videos.forEach(video => observer.observe(video));

// Staggered animation for sections
window.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".animate-on-load");
  sections.forEach((sec,index) => {
    sec.style.animationDelay = `${index*0.3}s`;
  });
});
