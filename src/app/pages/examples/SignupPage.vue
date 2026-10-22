<template>
  <div class="auth-page">
    <div class="auth-container">
      <Button
        icon="pi pi-arrow-left"
        text
        rounded
        size="small"
        class="auth-back"
        @click="router.push('/home')"
      />

      <div class="auth-header">
        <h1 class="auth-title">Criar conta</h1>
        <p class="auth-subtitle">Preencha os dados abaixo para comecar</p>
      </div>

      <form class="auth-form" @submit.prevent="handleSignup">
        <div class="p-fluid form-grid">
          <div class="form-field">
            <label for="signup-name">Nome completo</label>
            <IconField>
              <InputIcon class="pi pi-user" />
              <InputText id="signup-name" v-model="name" placeholder="Seu nome" autocomplete="name" />
            </IconField>
          </div>

          <div class="form-field">
            <label for="signup-email">E-mail</label>
            <IconField>
              <InputIcon class="pi pi-envelope" />
              <InputText id="signup-email" v-model="email" type="email" placeholder="seu@email.com" autocomplete="email" />
            </IconField>
          </div>

          <div class="form-field">
            <label for="signup-password">Senha</label>
            <Password id="signup-password" v-model="password" placeholder="Crie uma senha" toggle-mask autocomplete="new-password" />
            <div v-if="password" class="password-rules">
              <div
                v-for="rule in passwordRules"
                :key="rule.label"
                class="password-rule"
                :class="{ valid: rule.valid }"
              >
                <i :class="rule.valid ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
                <span>{{ rule.label }}</span>
              </div>
            </div>
          </div>

          <div class="form-field">
            <label for="signup-confirm">Confirmar senha</label>
            <Password id="signup-confirm" v-model="confirmPassword" placeholder="Repita a senha" toggle-mask :feedback="false" autocomplete="new-password" />
            <small v-if="confirmPassword && !passwordsMatch" class="p-error">As senhas nao coincidem</small>
          </div>

          <div class="auth-check">
            <Checkbox v-model="acceptTerms" :binary="true" input-id="terms" />
            <label for="terms" class="terms-label">
              Li e aceito os <a href="#" class="auth-link" @click.prevent>Termos de Uso</a> e a <a href="#" class="auth-link" @click.prevent>Politica de Privacidade</a>
            </label>
          </div>

          <Button label="Criar conta" type="submit" :disabled="!isFormValid" />
        </div>
      </form>

      <p class="auth-footer">
        Ja tem uma conta?
        <a href="#" class="auth-link-bold" @click.prevent="router.push('/examples/login')">Faca login</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const toast = useToast()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const passwordRules = computed(() => [
  { label: 'Minimo 8 caracteres', valid: password.value.length >= 8 },
  { label: 'Letra maiuscula', valid: /[A-Z]/.test(password.value) },
  { label: 'Letra minuscula', valid: /[a-z]/.test(password.value) },
  { label: 'Numero', valid: /\d/.test(password.value) },
])

const passwordsMatch = computed(
  () => confirmPassword.value.length > 0 && password.value === confirmPassword.value,
)

const isFormValid = computed(
  () =>
    name.value.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    passwordRules.value.every((r) => r.valid) &&
    passwordsMatch.value &&
    acceptTerms.value,
)

function handleSignup() {
  if (!isFormValid.value) {
    toast.add({ severity: 'warn', summary: 'Preencha todos os campos corretamente', life: 2000 })
    return
  }
  toast.add({ severity: 'success', summary: 'Conta criada com sucesso! (demo)', life: 2000 })
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--p-surface-ground);
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-back {
  margin-bottom: 1rem;
}

.auth-header {
  margin-bottom: 2rem;
}

.auth-title {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.auth-subtitle {
  color: var(--p-text-muted-color);
  margin: 0;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field label {
  font-weight: 600;
  font-size: 0.875rem;
}

.password-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem 1rem;
  margin-top: 0.375rem;
}

.password-rule {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.password-rule.valid {
  color: var(--p-green-500);
}

.password-rule i {
  font-size: 0.875rem;
}

.auth-check {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.terms-label {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  line-height: 1.4;
}

.auth-link {
  color: var(--p-primary-color);
  text-decoration: none;
}

.auth-footer {
  text-align: center;
  color: var(--p-text-muted-color);
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.auth-link-bold {
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 600;
}
</style>
