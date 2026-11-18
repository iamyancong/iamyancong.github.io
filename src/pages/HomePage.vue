<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { SITE } from '@/data/site'
import ArchitectureSection from '@/sections/home/ArchitectureSection.vue'
import ChainSection from '@/sections/home/ChainSection.vue'
import FinalCta from '@/sections/home/FinalCta.vue'
import HeroSection from '@/sections/home/HeroSection.vue'
import ManifestoSection from '@/sections/home/ManifestoSection.vue'
import ProductsSection from '@/sections/home/ProductsSection.vue'
import RoadmapSection from '@/sections/home/RoadmapSection.vue'

useHead({
  title: '',
  meta: [
    { property: 'og:title', content: SITE.name },
    { property: 'og:description', content: SITE.description },
    { property: 'og:url', content: `${SITE.url}/` },
  ],
  link: [{ rel: 'canonical', href: `${SITE.url}/` }],
})
</script>

<template>
  <HeroSection />
  <ManifestoSection />
  <ArchitectureSection />
  <ProductsSection />
  <ChainSection />
  <RoadmapSection />
  <FinalCta />
</template>
