<template>
  <div style="min-height: 100vh; padding: 2rem 1rem;">
    <div style="max-width: 400px; margin: 0 auto; width: 100%;">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" style="margin-bottom: 1rem;" />

      <div style="margin-bottom: 2rem;">
        <h1 style="margin: 0 0 0.25rem;">Criar conta</h1>
        <p style="color: var(--p-text-muted-color); margin: 0;">Preencha os dados abaixo para comecar</p>
      </div>

      <form style="display: flex; flex-direction: column; gap: 1rem;" @submit.prevent="handleSignup">
        <div class="p-fluid">
          <label for="signup-name">Nome completo</label>
          <IconField>
            <InputIcon class="pi pi-user" />
            <InputText id="signup-name" v-model="name" placeholder="Seu nome" autocomplete="name" />
          </IconField>
        </div>

        <div class="p-fluid">
          <label for="signup-email">E-mail</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText id="signup-email" v-model="email" type="email" placeholder="seu@email.com" autocomplete="email" />
          </IconField>
        </div>

        <div class="p-fluid">
          <label for="signup-password">Senha</label>
          <Password id="signup-password" v-model="password" placeholder="Crie uma senha" toggle-mask autocomplete="new-password" />
          <div v-if="password" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1rem; margin-top: 0.5rem;">
            <div v-for="rule in passwordRules" :key="rule.label" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem;" :style="{ color: rule.valid ? 'var(--p-green-500)' : 'var(--p-text-muted-color)' }">
              <i :class="rule.valid ? 'pi pi-check-circle' : 'pi pi-times-circle'" style="font-size: 0.875rem;" />
              <span>{{ rule.label }}</span>
            </div>
          </div>
        </div>

        <div class="p-fluid">
          <label for="signup-confirm">Confirmar senha</label>
          <Password id="signup-confirm" v-model="confirmPassword" placeholder="Repita a senha" toggle-mask :feedback="false" autocomplete="new-password" />
          <small v-if="confirmPassword && !passwordsMatch" class="p-error">As senhas nao coincidem</small>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
          <Checkbox v-model="acceptTerms" :binary="true" input-id="terms" />
          <label for="terms" style="color: var(--p-text-muted-color); font-size: 0.875rem;">
            Li e aceito os <a href="#" @click.prevent style="color: var(--p-primary-color); text-decoration: none;">Termos de Uso</a> e a <a href="#" @click.prevent style="color: var(--p-primary-color); text-decoration: none;">Politica de Privacidade</a>
          </label>
        </div>

        <Button label="Criar conta" type="submit" :disabled="!isFormValid" />
      </form>

      <p style="text-align: center; color: var(--p-text-muted-color); margin-top: 1.5rem; font-size: 0.875rem;">
        Ja tem uma conta?
        <a href="#" @click.prevent="router.push('/examples/login')" style="color: var(--p-primary-color); text-decoration: none; font-weight: 600;">Faca login</a>
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
