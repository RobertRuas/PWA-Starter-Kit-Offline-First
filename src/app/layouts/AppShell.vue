<script setup lang="ts">
import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { homeOutline, documentTextOutline, settingsOutline } from 'ionicons/icons';
</script>

<template>
  <IonApp>
    <IonTabs>
      <IonRouterOutlet />
      <template #bottom>
        <IonTabBar>
          <IonTabButton tab="home" href="/home">
            <IonIcon :icon="homeOutline" aria-hidden="true" />
            <IonLabel>Início</IonLabel>
          </IonTabButton>
          <IonTabButton tab="records" href="/records">
            <IonIcon :icon="documentTextOutline" aria-hidden="true" />
            <IonLabel>Registros</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon :icon="settingsOutline" aria-hidden="true" />
            <IonLabel>Configurações</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </template>
    </IonTabs>
  </IonApp>
</template>
