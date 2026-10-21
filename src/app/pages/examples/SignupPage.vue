<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/vue';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const acceptTerms = ref(false);

const passwordRules = computed(() => [
  { label: 'Mínimo 8 caracteres', valid: password.value.length >= 8 },
  { label: 'Letra maiúscula', valid: /[A-Z]/.test(password.value) },
  { label: 'Letra minúscula', valid: /[a-z]/.test(password.value) },
  { label: 'Número', valid: /\d/.test(password.value) },
]);

const passwordsMatch = computed(() =>
  confirmPassword.value.length > 0 && password.value === confirmPassword.value
);

const isFormValid = computed(() =>
  name.value.length >= 2 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
  passwordRules.value.every(r => r.valid) &&
  passwordsMatch.value &&
  acceptTerms.value
);

function handleSignup() {
  if (!isFormValid.value) {
    toastMessage.value = 'Preencha todos os campos corretamente';
    showToast.value = true;
    return;
  }
  toastMessage.value = 'Conta criada com sucesso! (demo)';
  showToast.value = true;
}
</script>

<template>
  <IonPage>
    <IonContent
      class="signup-content"
      :scroll-y="true"
    >
      <div class="signup-container">
        <button
          class="back-button"
          @click="router.push('/home')"
        >
          <IonIcon :icon="arrowBackOutline" />
        </button>

        <div class="signup-header">
          <h1 class="signup-title">
            Criar conta
          </h1>
          <p class="signup-subtitle">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <form
          class="signup-form"
          @submit.prevent="handleSignup"
        >
          <div class="input-group">
            <label
              class="input-label"
              for="signup-name"
            >Nome completo</label>
            <div class="input-wrapper">
              <IonIcon
                :icon="personOutline"
                class="input-icon"
              />
              <IonInput
                id="signup-name"
                v-model="name"
                type="text"
                placeholder="Seu nome"
                class="custom-input"
                autocomplete="name"
              />
            </div>
          </div>

          <div class="input-group">
            <label
              class="input-label"
              for="signup-email"
            >E-mail</label>
            <div class="input-wrapper">
              <IonIcon
                :icon="mailOutline"
                class="input-icon"
              />
              <IonInput
                id="signup-email"
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
              for="signup-password"
            >Senha</label>
            <div class="input-wrapper">
              <IonIcon
                :icon="lockClosedOutline"
                class="input-icon"
              />
              <IonInput
                id="signup-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Crie uma senha"
                class="custom-input"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <IonIcon :icon="showPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
            <div
              v-if="password"
              class="password-rules"
            >
              <div
                v-for="rule in passwordRules"
                :key="rule.label"
                class="rule"
                :class="{ 'rule--valid': rule.valid }"
              >
                <IonIcon :icon="rule.valid ? checkmarkCircleOutline : closeCircleOutline" />
                <span>{{ rule.label }}</span>
              </div>
            </div>
          </div>

          <div class="input-group">
            <label
              class="input-label"
              for="signup-confirm"
            >Confirmar senha</label>
            <div
              class="input-wrapper"
              :class="{ 'input-wrapper--error': confirmPassword && !passwordsMatch }"
            >
              <IonIcon
                :icon="lockClosedOutline"
                class="input-icon"
              />
              <IonInput
                id="signup-confirm"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repita a senha"
                class="custom-input"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <IonIcon :icon="showConfirmPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
            <p
              v-if="confirmPassword && !passwordsMatch"
              class="error-text"
            >
              As senhas não coincidem
            </p>
          </div>

          <label class="terms">
            <input
              v-model="acceptTerms"
              type="checkbox"
            >
            <span>Li e aceito os <a
              href="#"
              @click.prevent
            >Termos de Uso</a> e a <a
              href="#"
              @click.prevent
            >Política de Privacidade</a></span>
          </label>

          <IonButton
            expand="block"
            type="submit"
            :disabled="!isFormValid"
            class="signup-button"
          >
            Criar conta
          </IonButton>
        </form>

        <p class="login-prompt">
          Já tem uma conta?
          <a
            href="#"
            @click.prevent="router.push('/examples/login')"
          >Faça login</a>
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
.signup-content {
  --background: var(--color-background);
}

.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
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

.signup-header {
  margin-bottom: var(--space-8);
}

.signup-title {
  font-size: var(--font-size-2xl);
  margin: 0 0 var(--space-1);
  color: var(--color-text-primary);
}

.signup-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.signup-form {
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

.input-wrapper--error {
  border-color: var(--color-error);
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

.password-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px var(--space-4);
}

.rule {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.rule ion-icon {
  font-size: 14px;
}

.rule--valid {
  color: var(--color-success);
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin: 0;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.terms input {
  accent-color: var(--color-primary);
  margin-top: 2px;
}

.terms a {
  color: var(--color-primary);
  text-decoration: none;
}

.signup-button {
  margin-top: var(--space-2);
  --border-radius: var(--radius-md);
  font-weight: 600;
}

.login-prompt {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-6);
}

.login-prompt a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}
</style>
