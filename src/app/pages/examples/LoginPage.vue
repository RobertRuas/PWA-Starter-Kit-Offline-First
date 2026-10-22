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
        <div class="auth-logo">
          <i class="pi pi-lock" />
        </div>
        <h1 class="auth-title">Bem-vindo de volta</h1>
        <p class="auth-subtitle">Entre na sua conta para continuar</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="p-fluid form-grid">
          <div class="form-field">
            <label for="login-email">E-mail</label>
            <IconField>
              <InputIcon class="pi pi-envelope" />
              <InputText
                id="login-email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                autocomplete="email"
              />
            </IconField>
          </div>

          <div class="form-field">
            <label for="login-password">Senha</label>
            <Password
              id="login-password"
              v-model="password"
              placeholder="Sua senha"
              toggle-mask
              :feedback="false"
              autocomplete="current-password"
            />
          </div>

          <div class="auth-options">
            <div class="auth-check">
              <Checkbox v-model="rememberMe" :binary="true" input-id="remember" />
              <label for="remember">Lembrar de mim</label>
            </div>
            <a href="#" class="auth-link" @click.prevent>Esqueceu a senha?</a>
          </div>

          <Button label="Entrar" type="submit" />
        </div>
      </form>

      <Divider align="center">
        <span class="auth-divider-text">ou continue com</span>
      </Divider>

      <div class="auth-social">
        <Button label="Google" icon="pi pi-google" outlined class="auth-social-btn" />
        <Button label="Apple" icon="pi pi-apple" outlined class="auth-social-btn" />
      </div>

      <p class="auth-footer">
        Nao tem uma conta?
        <a href="#" class="auth-link-bold" @click.prevent="router.push('/examples/signup')">Cadastre-se</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'

const router = useRouter()
const toast = useToast()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

function handleLogin() {
  if (!email.value || !password.value) {
    toast.add({ severity: 'warn', summary: 'Preencha todos os campos', life: 2000 })
    return
  }
  toast.add({ severity: 'success', summary: 'Login realizado com sucesso! (demo)', life: 2000 })
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
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--p-border-radius);
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.auth-title {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.auth-subtitle {
  color: var(--p-text-muted-color);
  margin: 0;
}

.auth-form {
  margin-bottom: 0;
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

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-check label {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.auth-link {
  color: var(--p-primary-color);
  font-size: 0.875rem;
  text-decoration: none;
}

.auth-divider-text {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
}

.auth-social {
  display: flex;
  gap: 0.5rem;
}

.auth-social-btn {
  flex: 1;
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
