<template>
  <div>
    <PageHeader title="Contactos" subtitle="Gestao de contactos" show-back back-href="/home">
      <template #actions>
        <Button label="Novo" icon="pi pi-plus" size="small" @click="openNew" />
      </template>
    </PageHeader>

    <div class="contacts-content">
      <!-- Search -->
      <div class="contacts-toolbar">
        <IconField class="contacts-search">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Buscar contacto..." />
        </IconField>
        <span class="contacts-count">
          {{ filteredContacts.length }} contacto{{ filteredContacts.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Table -->
      <DataTable
        :value="filteredContacts"
        data-key="id"
        striped-rows
        responsive-layout="scroll"
        :rows="10"
        :paginator="filteredContacts.length > 10"
        selection-mode="single"
        @row-select="onRowSelect"
      >
        <Column header="Nome" sortable field="name" style="min-width: 180px;">
          <template #body="{ data }">
            <div class="contact-name-cell">
              <Avatar :label="data.name.charAt(0)" shape="circle" />
              <div>
                <div class="contact-name">{{ data.name }}</div>
                <div class="contact-email">{{ data.email }}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column field="phone" header="Telefone" class="hide-mobile" />
        <Column field="company" header="Empresa" sortable class="hide-mobile" />
        <Column field="status" header="Estado" style="width: 110px;">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'Ativo' ? 'success' : 'secondary'"
              rounded
            />
          </template>
        </Column>
        <Column style="width: 80px;">
          <template #body="{ data }">
            <div class="contact-actions">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="openEdit(data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click.stop="confirmDelete(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingContact ? 'Editar contacto' : 'Novo contacto'"
      modal
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <div class="p-fluid dialog-form">
        <div class="form-field">
          <label for="c-name">Nome *</label>
          <InputText id="c-name" v-model="contactForm.name" placeholder="Nome completo" />
        </div>
        <div class="form-field">
          <label for="c-email">Email</label>
          <InputText id="c-email" v-model="contactForm.email" placeholder="email@exemplo.com" />
        </div>
        <div class="form-field">
          <label for="c-phone">Telefone</label>
          <InputMask id="c-phone" v-model="contactForm.phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
        </div>
        <div class="form-field">
          <label for="c-company">Empresa</label>
          <InputText id="c-company" v-model="contactForm.company" placeholder="Empresa" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="dialogVisible = false" />
        <Button label="Salvar" icon="pi pi-check" @click="saveContact" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import DataTable from 'primevue/datatable'
import type { DataTableRowSelectEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import PageHeader from '../../../components/ui/PageHeader.vue'

const toast = useToast()
const confirm = useConfirm()

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: 'Ativo' | 'Inativo'
}

const contacts = ref<Contact[]>([
  { id: 1, name: 'Ana Silva', email: 'ana.silva@email.com', phone: '(11) 99876-5432', company: 'TechCorp', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', email: 'bruno.costa@email.com', phone: '(21) 98765-4321', company: 'DataSoft', status: 'Ativo' },
  { id: 3, name: 'Carla Mendes', email: 'carla.m@email.com', phone: '(31) 97654-3210', company: 'DesignLab', status: 'Inativo' },
  { id: 4, name: 'Daniel Oliveira', email: 'daniel.o@email.com', phone: '(41) 96543-2109', company: 'CloudBase', status: 'Ativo' },
  { id: 5, name: 'Elena Ferreira', email: 'elena.f@email.com', phone: '(51) 95432-1098', company: 'WebFlow', status: 'Ativo' },
  { id: 6, name: 'Felipe Santos', email: 'felipe.s@email.com', phone: '(61) 94321-0987', company: 'AppNova', status: 'Inativo' },
  { id: 7, name: 'Gabriela Lima', email: 'gabi.lima@email.com', phone: '(71) 93210-9876', company: 'TechCorp', status: 'Ativo' },
  { id: 8, name: 'Hugo Pereira', email: 'hugo.p@email.com', phone: '(81) 92109-8765', company: 'DataSoft', status: 'Ativo' },
])

const searchQuery = ref('')
const dialogVisible = ref(false)
const editingContact = ref<Contact | null>(null)
let nextId = 9

const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
})

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  const q = searchQuery.value.toLowerCase()
  return contacts.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q),
  )
})

function openNew() {
  editingContact.value = null
  contactForm.name = ''
  contactForm.email = ''
  contactForm.phone = ''
  contactForm.company = ''
  dialogVisible.value = true
}

function openEdit(contact: Contact) {
  editingContact.value = contact
  contactForm.name = contact.name
  contactForm.email = contact.email
  contactForm.phone = contact.phone
  contactForm.company = contact.company
  dialogVisible.value = true
}

function onRowSelect(event: DataTableRowSelectEvent) {
  openEdit(event.data as Contact)
}

function saveContact() {
  if (!contactForm.name.trim()) {
    toast.add({ severity: 'warn', summary: 'O nome e obrigatorio.', life: 2000 })
    return
  }

  if (editingContact.value) {
    Object.assign(editingContact.value, {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      company: contactForm.company,
    })
    toast.add({ severity: 'success', summary: 'Contacto atualizado.', life: 2000 })
  } else {
    contacts.value.push({
      id: nextId++,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      company: contactForm.company,
      status: 'Ativo',
    })
    toast.add({ severity: 'success', summary: 'Contacto adicionado.', life: 2000 })
  }

  dialogVisible.value = false
}

function confirmDelete(contact: Contact) {
  confirm.require({
    message: `Deseja excluir "${contact.name}"?`,
    header: 'Excluir contacto',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Excluir',
    acceptClass: 'p-button-danger',
    accept: () => {
      contacts.value = contacts.value.filter((c) => c.id !== contact.id)
      toast.add({ severity: 'success', summary: 'Contacto excluido.', life: 2000 })
    },
  })
}
</script>

<style scoped>
.contacts-content {
  padding: 0 1.5rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.contacts-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.contacts-search {
  flex: 1;
  min-width: 200px;
}

.contacts-count {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.contact-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-name {
  font-weight: 600;
}

.contact-email {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.contact-actions {
  display: flex;
  gap: 0.25rem;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
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

@media (max-width: 640px) {
  .contacts-content {
    padding: 0 1rem 2rem;
  }

  :deep(.hide-mobile) {
    display: none;
  }
}
</style>
