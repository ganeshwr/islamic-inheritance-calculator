<template>
  <div id="app">
    <AppHeader />
    
    <main class="main-content">
      <div v-if="!calculationResult" class="input-phase">
        <FamilyInputForm @calculate="handleCalculation" />
      </div>
      
      <div v-else class="results-phase">
        <!-- Results Header -->
        <div class="results-header">
          <button @click="resetCalculation" class="back-btn">
            {{ $t('results.backButton') }}
          </button>
        </div>
        
        <!-- Family Tree Visualization -->
        <FamilyTree 
          :family-members="currentCase?.familyMembers || []"
          :shares="calculationResult.shares"
          @member-click="handleMemberClick"
        />
        
        <!-- Inheritance Results -->
        <InheritanceResults 
          :result="calculationResult"
          :family-members="currentCase?.familyMembers || []"
          :estate-value="currentCase?.estateValue"
        />
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>{{ $t('app.footer.built') }}</p>
        <p>{{ $t('app.footer.consult') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from './composables/useI18n';
import AppHeader from './components/AppHeader.vue';
import FamilyInputForm from './components/FamilyInputForm.vue';
import FamilyTree from './components/FamilyTree.vue';
import InheritanceResults from './components/InheritanceResults.vue';
import { InheritanceCalculator } from './services/inheritanceCalculator';
import type { InheritanceCase, CalculationResult, FamilyMember } from './types/inheritance';

const { t } = useI18n();

const calculationResult = ref<CalculationResult | null>(null);
const currentCase = ref<InheritanceCase | null>(null);

function handleCalculation(inheritanceCase: InheritanceCase) {
  currentCase.value = inheritanceCase;
  calculationResult.value = InheritanceCalculator.calculateInheritance(inheritanceCase);
}

function resetCalculation() {
  calculationResult.value = null;
  currentCase.value = null;
}

function handleMemberClick(member: FamilyMember) {
  console.log('Member clicked:', member);
  // Could show detailed member information
}
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background: #f9fafb;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 32px 16px;
}

.input-phase {
  max-width: 1200px;
  margin: 0 auto;
}

.results-phase {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.results-header {
  display: flex;
  justify-content: flex-start;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.app-footer {
  background: #374151;
  color: white;
  text-align: center;
  padding: 24px 16px;
  margin-top: auto;
}

.footer-content p {
  margin-bottom: 4px;
  opacity: 0.8;
}

.footer-content p:last-child {
  margin-bottom: 0;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 16px 8px;
  }
  
  .results-phase {
    gap: 24px;
  }
}

/* Loading and transition states */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Accessibility improvements */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>