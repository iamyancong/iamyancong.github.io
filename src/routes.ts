import type { RouteRecordRaw } from 'vue-router'
import { products } from './data/products'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/architecture', name: 'architecture', component: () => import('./pages/ArchitecturePage.vue') },
  ...products.map<RouteRecordRaw>((p) => ({
    path: `/products/${p.id}`,
    name: `product-${p.id}`,
    component: () => import('./pages/ProductPage.vue'),
    props: { id: p.id },
  })),
  { path: '/404', name: 'not-found', component: () => import('./pages/NotFound.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('./pages/NotFound.vue') },
]
