<template>
  <div class="poster" aria-hidden="true">
    <div class="aurora a1" />
    <div class="aurora a2" />
    <div class="aurora a3" />
    <!-- 与 3D 粒子同一组贝塞尔曲线生成的 3/4 斜侧剪影（lite / static 档使用） -->
    <svg class="swift" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="poster-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#8fb3ff" stop-opacity="0.9" />
          <stop offset="0.5" stop-color="#8b5cf6" stop-opacity="0.75" />
          <stop offset="1" stop-color="#22d3ee" stop-opacity="0.85" />
        </linearGradient>
        <path id="poster-swift" d="M373.3 67.8L377.3 76.2L377.3 82.0L376.5 87.3L375.3 92.3L373.8 97.2L372.1 102.0L370.2 106.6L370.3 107.9L383.0 108.0L394.8 108.5L405.8 109.3L415.9 110.5L425.4 112.3L434.1 114.7L442.3 117.8L449.8 121.8L456.9 126.7L463.5 132.7L469.7 139.7L475.5 148.0L481.1 157.6L486.5 168.7L491.6 181.2L496.7 195.4L501.7 211.3L506.6 229.0L511.6 248.5L516.8 270.1L522.0 293.8L527.5 319.7L533.3 347.9L539.4 378.5L538.4 380.0L537.4 361.6L535.7 343.6L530.7 330.3L526.4 315.4L522.7 299.1L516.1 286.9L509.1 275.1L503.3 261.1L495.6 249.9L486.6 240.6L478.6 229.4L469.6 219.8L460.2 210.9L450.4 202.6L440.3 194.8L429.9 187.7L419.3 181.1L408.5 175.1L397.5 169.6L386.4 164.7L375.2 160.3L363.9 156.5L352.7 153.1L341.5 150.3L338.0 148.0L335.0 150.9L332.1 153.6L329.0 156.4L325.9 159.1L322.8 161.8L320.6 165.1L323.8 169.4L322.2 173.9L320.7 178.5L319.3 183.0L318.0 187.6L316.7 192.2L315.6 196.8L314.5 201.5L313.5 206.1L312.6 210.8L311.9 215.4L311.2 220.1L310.7 224.8L310.2 229.5L310.0 234.3L309.8 239.0L309.8 243.8L309.9 248.6L310.2 253.4L310.7 258.3L311.3 263.1L312.1 268.0L313.1 272.9L314.3 277.9L315.6 282.8L316.7 281.2L315.2 276.1L313.9 271.1L312.7 266.1L311.7 261.0L310.8 256.0L310.1 251.0L309.5 246.0L309.0 241.0L308.7 236.0L308.5 231.1L308.5 226.1L308.5 221.2L308.7 216.2L309.0 211.3L309.3 206.4L309.8 201.5L310.4 196.6L311.0 191.7L311.8 186.8L312.6 181.9L313.4 177.0L314.4 172.2L315.4 167.3L316.5 162.5L303.3 179.8L313.6 160.5L310.2 163.7L306.7 166.9L303.2 170.0L299.7 173.0L296.2 176.0L292.6 179.0L289.1 181.8L285.5 184.6L281.8 187.4L278.2 190.0L274.5 192.6L270.8 195.1L267.0 197.5L263.2 199.8L259.4 202.0L255.6 204.1L251.7 206.1L247.8 208.0L243.8 209.7L239.8 211.4L235.8 212.9L231.7 214.3L227.6 215.6L223.5 216.8L222.4 218.4L226.5 217.2L230.5 215.9L234.4 214.4L238.3 212.7L242.1 210.9L245.9 209.0L249.6 206.9L253.3 204.8L256.9 202.5L260.5 200.1L264.1 197.6L267.5 195.0L271.0 192.3L274.4 189.6L277.8 186.7L281.1 183.7L284.5 180.7L287.7 177.6L291.0 174.4L294.2 171.2L297.4 167.9L300.6 164.5L303.7 161.1L306.8 157.7L310.7 158.3L312.8 154.9L314.2 151.0L315.5 147.1L317.0 143.2L318.5 139.4L320.0 135.6L317.5 133.7L312.9 125.7L308.0 117.8L302.6 110.2L296.9 102.9L290.7 95.9L284.2 89.3L277.3 83.1L270.1 77.3L262.4 71.9L254.3 67.1L245.9 62.9L237.1 59.2L227.9 56.2L217.7 54.8L208.6 51.8L198.5 50.6L186.6 52.4L176.1 52.1L165.5 52.3L152.3 57.0L140.0 60.4L128.9 62.6L114.8 69.7L100.6 77.6L101.6 76.1L126.1 66.7L148.7 58.1L169.6 50.4L188.7 43.6L206.2 37.6L222.2 32.5L236.7 28.3L249.8 24.9L261.7 22.4L272.3 20.8L281.8 20.0L290.3 20.1L297.9 21.1L304.6 22.9L310.6 25.6L315.8 29.2L320.5 33.7L324.6 39.0L328.3 45.2L331.7 52.3L334.8 60.2L337.8 69.1L340.6 78.7L343.5 89.3L344.5 88.9L347.6 85.1L350.8 81.4L354.2 77.8L357.8 74.4L361.7 71.2L366.1 68.4L373.3 67.8Z" />
        <filter id="poster-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <g filter="url(#poster-blur)" opacity="0.55">
        <use href="#poster-swift" fill="url(#poster-g)" />
      </g>
      <use href="#poster-swift" fill="none" stroke="url(#poster-g)" stroke-width="1.4" />
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
  top: 28%;
  width: min(620px, 84vw);
  transform: translate(-50%, -50%);
  opacity: 0.5;
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
