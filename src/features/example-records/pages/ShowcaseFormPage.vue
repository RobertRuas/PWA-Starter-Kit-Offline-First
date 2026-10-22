<template>
  <div>
    <PageHeader title="Formulario completo" show-back back-href="/showcase" />
    <div style="max-width: 600px; margin: 0 auto; padding: 1rem;">
      <h2 style="margin-bottom: 1rem;">Todos os componentes de formulario</h2>

      <Card>
        <template #content>
          <div class="p-fluid" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="f-text">Text input</label>
              <InputText id="f-text" placeholder="Texto simples" />
            </div>
            <div>
              <label for="f-email">Email</label>
              <InputText id="f-email" type="email" placeholder="email@example.com" />
            </div>
            <div>
              <label for="f-number">Numero</label>
              <InputNumber id="f-number" placeholder="123" />
            </div>
            <div>
              <label for="f-phone">Telefone</label>
              <InputMask id="f-phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label for="f-date">Data</label>
              <DatePicker id="f-date" date-format="dd/mm/yy" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <label for="f-textarea">Textarea</label>
              <Textarea id="f-textarea" placeholder="Texto longo..." rows="3" />
            </div>
            <div>
              <label for="f-select">Select</label>
              <Select
                id="f-select"
                :options="selectOptions"
                option-label="label"
                option-value="value"
                placeholder="Selecione"
              />
            </div>
            <div>
              <label>Checkbox</label>
              <Checkbox v-model="demoCheckbox" :binary="true" />
            </div>
            <div>
              <label>Radio</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <RadioButton v-model="demoRadio" input-id="r1" value="A" />
                  <label for="r1">Opcao A</label>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <RadioButton v-model="demoRadio" input-id="r2" value="B" />
                  <label for="r2">Opcao B</label>
                </div>
              </div>
            </div>
            <div>
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
