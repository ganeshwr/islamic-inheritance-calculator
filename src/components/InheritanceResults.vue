<template>
  <div class="inheritance-results">
    <div class="results-header">
      <h2 class="results-title">{{ $t('results.title') }}</h2>
      <p v-if="result.isAulCase" class="aul-notice">
        {{ $t('results.aulNotice') }}
      </p>
    </div>

    <div class="results-grid">
      <!-- Shares Summary -->
      <div class="shares-summary">
        <h3>{{ $t('results.summary.title') }}</h3>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">{{ $t('results.summary.totalHeirs') }}</span>
            <span class="stat-value">{{ result.shares.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('results.summary.totalDistributed') }}</span>
            <span class="stat-value">{{ formatFraction(result.totalShares) }}</span>
          </div>
          <div v-if="estateValue" class="stat-item">
            <span class="stat-label">{{ $t('results.summary.estateValue') }}</span>
            <span class="stat-value">{{ estateValue.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Individual Shares -->
      <div class="individual-shares">
        <h3>{{ $t('results.shares.title') }}</h3>
        <div class="shares-list">
          <div 
            v-for="share in result.shares" 
            :key="share.memberId"
            class="share-card"
            :class="share.shareType"
            @click="showShareDetails(share)"
          >
            <div class="share-header">
              <h4>{{ getMemberName(share.memberId) }}</h4>
              <span class="share-type">{{ share.shareType.toUpperCase() }}</span>
            </div>
            
            <div class="share-amount">
              <span class="fraction">{{ formatFraction(share.share) }}</span>
              <span v-if="share.amount" class="monetary">
                {{ share.amount.toLocaleString() }} 
              </span>
              <span class="percentage">
                ({{ (fractionToDecimal(share.share) * 100).toFixed(2) }}%)
              </span>
            </div>
            
            <p class="share-reasoning">{{ share.reasoning }}</p>
            
            <button class="details-btn" @click.stop="showShareDetails(share)">
              {{ $t('results.shares.viewEvidence') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Summary -->
    <div class="detailed-summary">
      <h3>{{ $t('results.calculationSummary') }}</h3>
      <div class="summary-content">
        <pre>{{ result.summary }}</pre>
      </div>
    </div>

    <!-- Share Details Modal -->
    <div v-if="selectedShare" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ getMemberName(selectedShare.memberId) }} - {{ $t('results.shareDetails.title') }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-section">
            <h4>{{ $t('results.shareDetails.title') }}</h4>
            <p><strong>{{ $t('results.shareDetails.share') }}</strong> {{ formatFraction(selectedShare.share) }}</p>
            <p><strong>{{ $t('results.shareDetails.type') }}</strong> {{ selectedShare.shareType.toUpperCase() }}</p>
            <p v-if="selectedShare.amount">
              <strong>{{ $t('results.shareDetails.amount') }}</strong> {{ selectedShare.amount.toLocaleString() }}
            </p>
          </div>
          
          <div class="detail-section">
            <h4>{{ $t('results.shareDetails.ruling') }}</h4>
            <p>{{ selectedShare.reasoning }}</p>
          </div>
          
          <div v-if="selectedShare.quranicReference" class="detail-section">
            <h4>{{ $t('results.shareDetails.quranicRef') }}</h4>
            <p class="reference-text">{{ selectedShare.quranicReference }}</p>
          </div>
          
          <div v-if="selectedShare.hadithReference" class="detail-section">
            <h4>{{ $t('results.shareDetails.hadithRef') }}</h4>
            <p class="reference-text">{{ selectedShare.hadithReference }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '../composables/useI18n';
import type { CalculationResult, InheritanceShare, FamilyMember, Fraction } from '../types/inheritance';

interface Props {
  result: CalculationResult;
  familyMembers: FamilyMember[];
  estateValue?: number;
}

const props = defineProps<Props>();
const { t } = useI18n();

const selectedShare = ref<InheritanceShare | null>(null);

function getMemberName(memberId: string): string {
  const member = props.familyMembers.find(m => m.id === memberId);
  if (!member) return t('common.unknown');
  
  return member.name || t(`roleLabels.${member.role}`) || member.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) return fraction.numerator.toString();
  return `${fraction.numerator}/${fraction.denominator}`;
}

function fractionToDecimal(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

function showShareDetails(share: InheritanceShare) {
  selectedShare.value = share;
}

function closeModal() {
  selectedShare.value = null;
}
</script>

<style scoped>
.inheritance-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.results-header {
  text-align: center;
  margin-bottom: 32px;
}

.results-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.aul-notice {
  background: #fef3c7;
  color: #92400e;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fbbf24;
  font-weight: 500;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 32px;
}

.shares-summary,
.individual-shares {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.shares-summary h3,
.individual-shares h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  color: #1f2937;
  font-weight: 600;
}

.shares-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-card:hover {
  border-color: #14b8a6;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.1);
}

.share-card.fardh {
  border-left: 4px solid #14b8a6;
}

.share-card.asabah {
  border-left: 4px solid #f59e0b;
}

.share-card.blocked {
  border-left: 4px solid #ef4444;
  opacity: 0.7;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.share-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.share-type {
  background: #14b8a6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.share-card.asabah .share-type {
  background: #f59e0b;
}

.share-card.blocked .share-type {
  background: #ef4444;
}

.share-amount {
  margin-bottom: 12px;
}

.fraction {
  font-size: 24px;
  font-weight: 700;
  color: #059669;
  margin-right: 8px;
}

.monetary {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-right: 8px;
}

.percentage {
  font-size: 14px;
  color: #6b7280;
}

.share-reasoning {
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.details-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn:hover {
  background: #e5e7eb;
}

.detailed-summary {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.detailed-summary h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.summary-content pre {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.detail-section p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 4px;
}

.reference-text {
  background: #f0fdfa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #14b8a6;
  font-style: italic;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .inheritance-results {
    padding: 16px;
  }
  
  .modal-content {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
}
</style>