<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Início</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="records" href="/records">
          <ion-icon :icon="listOutline" />
          <ion-label>Registros</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="settingsOutline" />
          <ion-label>Ajustes</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/vue'
import { homeOutline, listOutline, settingsOutline } from 'ionicons/icons'
</script>
