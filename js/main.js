/* Typing effect */
const roles = [
  "AWS & Kubernetes Specialist",
  "CI/CD Automation Engineer",
  "Cloud Platform Architect",
  "Terraform & IaC Expert",
  "Platform Reliability Engineer",
  "DevSecOps Practitioner"
];
let rI = 0, cI = 0, del = false;
const el = document.getElementById("typing");
(function tick() {
  const t = roles[rI];
  el.textContent = t.slice(0, cI);
  if (!del && cI < t.length) cI++;
  else if (del && cI > 0) cI--;
  else { del = !del; if (!del) rI = (rI + 1) % roles.length; }
  setTimeout(tick, del ? 38 : 72);
})();

const logs = [
  { t: "cmd", v: "$ terraform plan --out=prod.tfplan" },
  { t: "info", v: "Refreshing state... done." },
  { t: "ok", v: "Plan: 14 to add, 2 to change, 0 to destroy." },
  { t: "cmd", v: "$ terraform apply prod.tfplan" },
  { t: "ok", v: "Apply complete! Resources: 16 added. ✓" },
  { t: "cmd", v: "$ kubectl get nodes -o wide" },
  { t: "ok", v: "node-1  Ready  <none>  m5.xlarge  v1.29" },
  { t: "ok", v: "node-2  Ready  <none>  m5.xlarge  v1.29" },
  { t: "cmd", v: "$ kubectl get pods -n production" },
  { t: "ok", v: "api-7dc58-k6n5j     Running  1/1" },
  { t: "ok", v: "worker-6c65f-rj2tt  Running  1/1" },
  { t: "ok", v: "cache-84bd9-lx7km   Running  1/1" },
  { t: "cmd", v: "$ gh workflow run deploy.yml --ref main" },
  { t: "info", v: "Triggered: build → test → scan → deploy" },
  { t: "ok", v: "Release #212 deployed. Zero downtime. ✓" },
  { t: "cmd", v: "$ curl -s metrics.prod/health | jq .uptime" },
  { t: "ok", v: '"99.97%" — SLO: ✓ all green' }
];
const term = document.getElementById("terminal");
let lI = 0;
(function stream() {
  if (lI >= logs.length) {
    lI = 0;
    term.innerHTML = "";
    setTimeout(stream, 2400);
    return;
  }
  const d = document.createElement("div");
  d.className = "t-" + logs[lI].t;
  d.textContent = logs[lI].v;
  term.appendChild(d);
  term.scrollTop = term.scrollHeight;
  lI++;
  setTimeout(stream, lI === 1 ? 200 : 540);
})();

/* Background canvas */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let points = [];
function fitCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function initPoints() {
  const count = Math.max(40, Math.floor(window.innerWidth / 24));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  }));
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();
    for (let j = i + 1; j < points.length; j++) {
      const q = points[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 92) {
        ctx.strokeStyle = `rgba(103,232,249,${1 - dist / 92})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  if (!reducedMotion) requestAnimationFrame(animate);
}
fitCanvas();
initPoints();
if (!reducedMotion) animate();
window.addEventListener("resize", () => {
  fitCanvas();
  initPoints();
});
