<template>
  <div class="poster" aria-hidden="true">
    <div class="aurora a1" />
    <div class="aurora a2" />
    <div class="aurora a3" />
    <svg class="swift" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="poster-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#8fb3ff" stop-opacity="0.9" />
          <stop offset="0.5" stop-color="#8b5cf6" stop-opacity="0.75" />
          <stop offset="1" stop-color="#22d3ee" stop-opacity="0.85" />
        </linearGradient>
        <filter id="poster-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <g filter="url(#poster-blur)" opacity="0.55">
        <path class="swift-path" d="M40 150c120-10 210 10 280 70 70-80 160-130 280-140-70 50-150 110-210 190-20 30-50 60-70 90l10-70c-90-20-180-70-290-140z" fill="url(#poster-g)" />
      </g>
      <path class="swift-path" d="M40 150c120-10 210 10 280 70 70-80 160-130 280-140-70 50-150 110-210 190-20 30-50 60-70 90l10-70c-90-20-180-70-290-140z" fill="none" stroke="url(#poster-g)" stroke-width="1.4" />
    </svg>
    <div class="grid" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.poster {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  animation: drift 18s ease-in-out infinite alternate;
}

.a1 {
  width: 60vmax;
  height: 60vmax;
  left: -18vmax;
  top: -24vmax;
  background: radial-gradient(circle, rgba(79, 124, 255, 0.75), transparent 62%);
}

.a2 {
  width: 50vmax;
  height: 50vmax;
  right: -16vmax;
  top: -8vmax;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent 60%);
  animation-delay: -6s;
}

.a3 {
  width: 46vmax;
  height: 46vmax;
  left: 22vw;
  bottom: -30vmax;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.45), transparent 60%);
  animation-delay: -12s;
}

.swift {
  position: absolute;
  left: 50%;
  top: 32%;
  width: min(760px, 92vw);
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

.swift-path {
  stroke-dasharray: 2200;
  stroke-dashoffset: 0;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, var(--bg) 100%);
}

@keyframes drift {
  to {
    transform: translate3d(6vmax, 4vmax, 0) scale(1.12);
  }
}
</style>
