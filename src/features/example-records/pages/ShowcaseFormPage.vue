<template>
  <div>
    <PageHeader title="Formulario completo" subtitle="Todos os componentes de formulario" show-back back-href="/showcase" />

    <div class="form-showcase-content">
      <Card>
        <template #content>
          <div class="p-fluid form-grid">
            <div class="form-field">
              <label for="f-text">Text input</label>
              <InputText id="f-text" placeholder="Texto simples" />
            </div>
            <div class="form-field">
              <label for="f-email">Email</label>
              <InputText id="f-email" type="email" placeholder="email@example.com" />
            </div>
            <div class="form-field">
              <label for="f-number">Numero</label>
              <InputNumber id="f-number" placeholder="123" />
            </div>
            <div class="form-field">
              <label for="f-phone">Telefone</label>
              <InputMask id="f-phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
            </div>
            <div class="form-field">
              <label for="f-date">Data</label>
              <DatePicker id="f-date" date-format="dd/mm/yy" placeholder="DD/MM/YYYY" />
            </div>
            <div class="form-field">
              <label for="f-textarea">Textarea</label>
              <Textarea id="f-textarea" placeholder="Texto longo..." rows="3" />
            </div>
            <div class="form-field">
              <label for="f-select">Select</label>
              <Select
                id="f-select"
                :options="selectOptions"
                option-label="label"
                option-value="value"
                placeholder="Selecione"
              />
            </div>
            <div class="form-field">
              <label>Checkbox</label>
              <div class="form-check-row">
                <Checkbox v-model="demoCheckbox" :binary="true" input-id="cb1" />
                <label for="cb1">Aceitar termos</label>
              </div>
            </div>
            <div class="form-field">
              <label>Radio</label>
              <div class="form-radio-list">
                <div class="form-check-row">
                  <RadioButton v-model="demoRadio" input-id="r1" value="A" />
                  <label for="r1">Opcao A</label>
                </div>
                <div class="form-check-row">
                  <RadioButton v-model="demoRadio" input-id="r2" value="B" />
                  <label for="r2">Opcao B</label>
                </div>
              </div>
            </div>
            <div class="form-field">
              <label for="f-password">Password</label>
              <Password id="f-password" placeholder="Senha" :feedback="false" toggle-mask />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Password from 'primevue/password'
import DatePicker from 'primevue/datepicker'
import PageHeader from '../../../components/ui/PageHeader.vue'

const selectOptions = [
  { label: 'Opcao 1', value: '1' },
  { label: 'Opcao 2', value: '2' },
  { label: 'Opcao 3', value: '3' },
]

const demoCheckbox = ref(false)
const demoRadio = ref('A')
</script>

<style scoped>
.form-showcase-content {
  padding: 0 1.5rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.form-check-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .form-showcase-content {
    padding: 0 1rem 2rem;
  }
}
</style>
