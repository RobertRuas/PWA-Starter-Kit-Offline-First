<template>
  <ion-page>
    <PageHeader title="Formulário completo" show-back back-href="/showcase" />
    <ion-content class="ion-padding">
      <div class="showcase-container">
        <h2 class="section-title">Todos os componentes de formulário</h2>

        <div class="form-card">
          <div class="form-row">
            <label class="form-row-label">Text input</label>
            <input type="text" class="form-row-input" placeholder="Texto simples" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Email</label>
            <input type="email" class="form-row-input" placeholder="email@example.com" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Número</label>
            <input type="number" class="form-row-input" placeholder="123" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Telefone</label>
            <input type="tel" class="form-row-input" placeholder="(11) 99999-9999" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Data</label>
            <input type="date" class="form-row-input" placeholder="DD/MM/YYYY" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Hora</label>
            <input type="time" class="form-row-input" placeholder="HH:MM" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Textarea</label>
            <textarea class="form-row-input form-row-textarea" placeholder="Texto longo..." rows="3" />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Select</label>
            <select class="form-row-input">
              <option>Opção 1</option>
              <option>Opção 2</option>
              <option>Opção 3</option>
            </select>
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Checkbox</label>
            <input type="checkbox" class="form-row-checkbox" />
          </div>
          <div class="form-divider" />
          <div class="form-row form-row-radio">
            <label class="form-row-label">Radio</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="demo-radio" /> Opção A
              </label>
              <label class="radio-option">
                <input type="radio" name="demo-radio" /> Opção B
              </label>
            </div>
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label class="form-row-label">Password</label>
            <input type="password" class="form-row-input" placeholder="••••••••" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import PageHeader from '../../../components/ui/PageHeader.vue'
</script>

<style scoped>
.showcase-container {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  padding: 0 var(--space-2);
}

.form-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.form-row {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  min-height: var(--touch-target-min);
  gap: var(--space-3);
}

.form-row-label {
  flex-shrink: 0;
  width: 70px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  line-height: 1.4;
}

.form-row-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-input);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  line-height: 1.4;
  padding: 0;
}

.form-row-input::placeholder {
  color: var(--color-text-muted);
  font-size: 12px;
}

.form-row-textarea {
  resize: none;
}

.form-row-checkbox {
  width: 20px;
  height: 20px;
  margin: 0;
}

.form-row-radio {
  align-items: flex-start;
}

.radio-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.radio-option input {
  width: 20px;
  height: 20px;
  margin: 0;
}

select.form-row-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23424242' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-2) center;
  padding-right: 32px;
}

.form-divider {
  height: 1px;
  background: var(--color-border-light);
  margin-left: var(--space-4);
}
</style>
