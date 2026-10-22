<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 2rem 1rem;">
    <div style="max-width: 400px; margin: 0 auto; width: 100%;">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" style="margin-bottom: 1rem;" />

      <div style="text-align: center; margin-bottom: 2rem;">
        <i class="pi pi-lock" style="font-size: 2rem; padding: 1rem; border-radius: var(--p-border-radius); background: var(--p-primary-color); color: var(--p-primary-contrast-color); display: inline-block; margin-bottom: 1rem;" />
        <h1 style="margin: 0 0 0.25rem;">Bem-vindo de volta</h1>
        <p style="color: var(--p-text-muted-color); margin: 0;">Entre na sua conta para continuar</p>
      </div>

      <form style="display: flex; flex-direction: column; gap: 1rem;" @submit.prevent="handleLogin">
        <div class="p-fluid">
          <label for="login-email">E-mail</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText id="login-email" v-model="email" type="email" placeholder="seu@email.com" autocomplete="email" />
          </IconField>
        </div>

        <div class="p-fluid">
          <label for="login-password">Senha</label>
          <Password id="login-password" v-model="password" placeholder="Sua senha" toggle-mask :feedback="false" autocomplete="current-password" />
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <Checkbox v-model="rememberMe" :binary="true" input-id="remember" />
            <label for="remember" style="color: var(--p-text-muted-color); font-size: 0.875rem;">Lembrar de mim</label>
          </div>
          <a href="#" @click.prevent style="color: var(--p-primary-color); font-size: 0.875rem; text-decoration: none;">Esqueceu a senha?</a>
        </div>

        <Button label="Entrar" type="submit" />
      </form>

      <Divider align="center" style="margin: 1.5rem 0;">
        <span style="color: var(--p-text-muted-color); font-size: 0.75rem;">ou continue com</span>
      </Divider>

      <div style="display: flex; gap: 0.5rem;">
        <Button label="Google" icon="pi pi-google" outlined style="flex: 1;" />
        <Button label="Apple" icon="pi pi-apple" outlined style="flex: 1;" />
      </div>

      <p style="text-align: center; color: var(--p-text-muted-color); margin-top: 1.5rem; font-size: 0.875rem;">
        Nao tem uma conta?
        <a href="#" @click.prevent="router.push('/examples/signup')" style="color: var(--p-primary-color); text-decoration: none; font-weight: 600;">Cadastre-se</a>
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
