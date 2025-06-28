<template>
  <div class="family-input-form">
    <div class="form-header">
      <h2 class="form-title">{{ $t('form.title') }}</h2>
      <p class="form-subtitle">{{ $t('form.subtitle') }}</p>
    </div>

    <div class="user-role-section">
      <h3>{{ $t('form.userRole.title') }}</h3>
      <select v-model="userRole" @change="addUserAsMember" class="role-select">
        <option value="">{{ $t('form.userRole.placeholder') }}</option>
        <option v-for="(desc, role) in roleDescriptions" :key="role" :value="role">
          {{ desc }}
        </option>
      </select>
    </div>

    <div class="estate-value-section">
      <h3>{{ $t('form.estate.title') }}</h3>
      <div class="input-group">
        <label for="estate-value">{{ $t('form.estate.value') }}</label>
        <input 
          id="estate-value"
          type="number" 
          v-model="estateValue" 
          :placeholder="$t('form.estate.valuePlaceholder')"
          class="estate-input"
        />
      </div>
      
      <div class="input-group">
        <label>{{ $t('form.estate.gender') }}</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="deceasedGender" value="male" />
            {{ $t('form.estate.male') }}
          </label>
          <label class="radio-label">
            <input type="radio" v-model="deceasedGender" value="female" />
            {{ $t('form.estate.female') }}
          </label>
        </div>
      </div>
    </div>

    <div class="family-members-section">
      <h3>{{ $t('form.members.title') }}</h3>
      
      <div class="add-member-form">
        <select v-model="newMemberRole" class="role-select">
          <option value="">{{ $t('form.members.rolePlaceholder') }}</option>
          <option v-for="(desc, role) in availableRoles" :key="role" :value="role">
            {{ desc }}
          </option>
        </select>
        
        <input 
          v-model="newMemberName" 
          :placeholder="$t('form.members.namePlaceholder')"
          class="name-input"
        />
        
        <button @click="addFamilyMember" :disabled="!newMemberRole" class="add-btn">
          {{ $t('form.members.addButton') }}
        </button>
      </div>

      <div class="members-list">
        <div 
          v-for="member in familyMembers" 
          :key="member.id"
          class="member-card"
        >
          <div class="member-info">
            <h4>{{ roleDescriptions[member.role] }}</h4>
            <p v-if="member.name">{{ member.name }}</p>
            <span class="member-gender">{{ member.gender }}</span>
          </div>
          <button @click="removeMember(member.id)" class="remove-btn">
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="calculateInheritance" 
        :disabled="familyMembers.length === 0"
        class="calculate-btn"
      >
        {{ $t('form.calculate') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '../composables/useI18n';
import type { FamilyMember, FamilyRole, InheritanceCase } from '../types/inheritance';

const emit = defineEmits<{
  calculate: [inheritanceCase: InheritanceCase];
}>();

const { t } = useI18n();

// Form state
const userRole = ref<FamilyRole | ''>('');
const estateValue = ref<number>();
const deceasedGender = ref<'male' | 'female'>('male');
const familyMembers = ref<FamilyMember[]>([]);
const newMemberRole = ref<FamilyRole | ''>('');
const newMemberName = ref('');

const roleDescriptions = computed(() => {
  const roles: Record<FamilyRole, string> = {} as Record<FamilyRole, string>;
  const roleKeys: FamilyRole[] = [
    'father', 'mother', 'paternal_grandfather', 'paternal_grandmother', 
    'maternal_grandmother', 'husband', 'wife', 'son', 'daughter',
    'full_brother', 'full_sister', 'paternal_brother', 'paternal_sister',
    'maternal_brother', 'maternal_sister', 'paternal_uncle', 'paternal_nephew',
    'grandson_son', 'granddaughter_son'
  ];
  
  roleKeys.forEach(role => {
    roles[role] = t(`roles.${role}`);
  });
  
  return roles;
});

const availableRoles = computed(() => {
  const used = new Set(familyMembers.value.map(m => m.role));
  const available: Record<string, string> = {};
  
  Object.entries(roleDescriptions.value).forEach(([role, desc]) => {
    if (!used.has(role as FamilyRole)) {
      available[role] = desc;
    }
  });
  
  return available;
});

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getGenderForRole(role: FamilyRole): 'male' | 'female' {
  const femaleRoles: FamilyRole[] = [
    'mother', 'wife', 'daughter', 'full_sister', 'paternal_sister', 
    'maternal_sister', 'paternal_grandmother', 'maternal_grandmother',
    'granddaughter_son'
  ];
  return femaleRoles.includes(role) ? 'female' : 'male';
}

function addUserAsMember() {
  if (userRole.value) {
    addMemberWithRole(userRole.value, 'You');
  }
}

function addFamilyMember() {
  if (newMemberRole.value) {
    addMemberWithRole(newMemberRole.value as FamilyRole, newMemberName.value);
    newMemberRole.value = '';
    newMemberName.value = '';
  }
}

function addMemberWithRole(role: FamilyRole, name?: string) {
  const existing = familyMembers.value.find(m => m.role === role);
  if (existing) return; // Prevent duplicates
  
  const member: FamilyMember = {
    id: generateId(),
    role,
    name: name || undefined,
    alive: true,
    gender: getGenderForRole(role)
  };
  
  familyMembers.value.push(member);
}

function removeMember(id: string) {
  const index = familyMembers.value.findIndex(m => m.id === id);
  if (index > -1) {
    familyMembers.value.splice(index, 1);
  }
}

function calculateInheritance() {
  const inheritanceCase: InheritanceCase = {
    deceased: { gender: deceasedGender.value },
    familyMembers: familyMembers.value,
    estateValue: estateValue.value,
    userRole: userRole.value || undefined
  };
  
  emit('calculate', inheritanceCase);
}
</script>

<style scoped>
.family-input-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #6b7280;
  font-size: 16px;
}

.user-role-section,
.estate-value-section,
.family-members-section {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.user-role-section h3,
.estate-value-section h3,
.family-members-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.role-select,
.name-input,
.estate-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.15s ease;
}

.role-select:focus,
.name-input:focus,
.estate-input:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.add-member-form {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 12px;
  margin-bottom: 24px;
}

.add-btn {
  padding: 12px 24px;
  background: #14b8a6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.add-btn:hover:not(:disabled) {
  background: #0f766e;
}

.add-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.members-list {
  display: grid;
  gap: 12px;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.member-info h4 {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.member-info p {
  color: #6b7280;
  margin: 0 0 4px 0;
}

.member-gender {
  font-size: 14px;
  color: #9ca3af;
  text-transform: capitalize;
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.form-actions {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.calculate-btn {
  padding: 16px 32px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.calculate-btn:hover:not(:disabled) {
  background: #047857;
}

.calculate-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .add-member-form {
    grid-template-columns: 1fr;
  }
  
  .family-input-form {
    margin: 16px;
    padding: 16px;
  }
}
</style>