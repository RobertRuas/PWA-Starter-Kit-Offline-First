<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons v-if="showBack" slot="start">
        <ion-back-button :default-href="backHref" />
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <slot name="actions" />
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue'

withDefaults(
  defineProps<{
    title: string
    showBack?: boolean
    backHref?: string
  }>(),
  {
    showBack: false,
    backHref: '/',
  },
)
</script>
