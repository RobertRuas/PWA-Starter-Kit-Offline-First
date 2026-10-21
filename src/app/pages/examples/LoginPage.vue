<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/vue';
import {
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  logoGoogle,
  logoApple,
  arrowBackOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

function handleLogin() {
  if (!email.value || !password.value) {
    toastMessage.value = 'Preencha todos os campos';
    showToast.value = true;
    return;
  }
  toastMessage.value = 'Login realizado com sucesso! (demo)';
  showToast.value = true;
}
</script>

<template>
  <IonPage>
    <IonContent
      class="login-content"
      :scroll-y="true"
    >
      <div class="login-container">
        <button
          class="back-button"
          @click="router.push('/home')"
        >
          <IonIcon :icon="arrowBackOutline" />
        </button>

        <div class="login-header">
          <div class="login-logo">
            <IonIcon :icon="lockClosedOutline" />
          </div>
          <h1 class="login-title">
            Bem-vindo de volta
          </h1>
          <p class="login-subtitle">
            Entre na sua conta para continuar
          </p>
        </div>

        <form
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <div class="input-group">
            <label
              class="input-label"
              for="login-email"
            >E-mail</label>
            <div class="input-wrapper">
              <IonIcon
                :icon="mailOutline"
                class="input-icon"
              />
              <IonInput
                id="login-email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="custom-input"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="input-group">
            <label
              class="input-label"
              for="login-password"
            >Senha</label>
            <div class="input-wrapper">
              <IonIcon
                :icon="lockClosedOutline"
                class="input-icon"
              />
              <IonInput
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Sua senha"
                class="custom-input"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <IonIcon :icon="showPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox">
              <span>Lembrar de mim</span>
            </label>
            <a
              href="#"
              class="forgot-link"
              @click.prevent
            >Esqueceu a senha?</a>
          </div>

          <IonButton
            expand="block"
            type="submit"
            class="login-button"
          >
            Entrar
          </IonButton>
        </form>

        <div class="divider">
          <span>ou continue com</span>
        </div>

        <div class="social-buttons">
          <button
            class="social-btn"
            type="button"
          >
            <IonIcon :icon="logoGoogle" />
            <span>Google</span>
          </button>
          <button
            class="social-btn"
            type="button"
          >
            <IonIcon :icon="logoApple" />
            <span>Apple</span>
          </button>
        </div>

        <p class="signup-prompt">
          Não tem uma conta?
          <a
            href="#"
            @click.prevent="router.push('/examples/signup')"
          >Cadastre-se</a>
        </p>
      </div>

      <IonToast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
        position="bottom"
        @did-dismiss="showToast = false"
      />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.login-content {
  --background: var(--color-background);
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.back-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  transition: background var(--transition-fast);
}

.back-button:hover {
  background: var(--color-surface-variant);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-logo {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  color: white;
  font-size: 28px;
}

.login-title {
  font-size: var(--font-size-2xl);
  margin: 0 0 var(--space-1);
  color: var(--color-text-primary);
}

.login-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 var(--space-2);
  background: var(--color-surface);
  transition: border-color var(--transition-fast);
}

.input-wrapper:focus-within {
  border-color: var(--color-primary);
}

.input-icon {
  color: var(--color-text-secondary);
  font-size: 18px;
  flex-shrink: 0;
}

.custom-input {
  --padding-start: 8px;
  --padding-end: 0;
  --background: transparent;
  flex: 1;
}

.toggle-password {
  all: unset;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 18px;
  display: flex;
  padding: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.remember-me input {
  accent-color: var(--color-primary);
}

.forgot-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.login-button {
  margin-top: var(--space-2);
  --border-radius: var(--radius-md);
  font-weight: 600;
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: var(--space-6) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--color-border);
}

.divider span {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.social-buttons {
  display: flex;
  gap: var(--space-2);
}

.social-btn {
  all: unset;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: background var(--transition-fast);
}

.social-btn:hover {
  background: var(--color-surface-variant);
}

.social-btn ion-icon {
  font-size: 18px;
}

.signup-prompt {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-6);
}

.signup-prompt a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}
</style>
