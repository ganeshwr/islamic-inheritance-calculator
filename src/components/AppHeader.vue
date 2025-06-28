<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">
            <span class="logo-icon">☪️</span>
            <h1 class="logo-text">{{ $t('app.title') }}</h1>
          </div>
          <p class="logo-subtitle">{{ $t('app.subtitle') }}</p>
        </div>
        
        <div class="header-actions">
          <div class="language-selector">
            <button @click="toggleLanguage" class="language-btn">
              <span>🌐</span>
              {{ currentLanguageLabel }}
            </button>
          </div>
          
          <button @click="toggleInfo" class="info-btn">
            <span>ℹ️</span>
            {{ $t('header.about') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Info Modal -->
    <div v-if="showInfo" class="modal-overlay" @click="closeInfo">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('about.title') }}</h3>
          <button @click="closeInfo" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="info-section">
            <h4>{{ $t('about.purpose.title') }}</h4>
            <p>{{ $t('about.purpose.description') }}</p>
          </div>
          
          <div class="info-section">
            <h4>{{ $t('about.sources.title') }}</h4>
            <ul>
              <li>{{ $t('about.sources.quran') }}</li>
              <li>{{ $t('about.sources.hadith') }}</li>
              <li>{{ $t('about.sources.consensus') }}</li>
              <li>{{ $t('about.sources.fatwas') }}</li>
            </ul>
          </div>
          
          <div class="info-section">
            <h4>{{ $t('about.features.title') }}</h4>
            <ul>
              <li>{{ $t('about.features.fardh') }}</li>
              <li>{{ $t('about.features.asabah') }}</li>
              <li>{{ $t('about.features.hajb') }}</li>
              <li>{{ $t('about.features.aul') }}</li>
              <li>{{ $t('about.features.education') }}</li>
            </ul>
          </div>
          
          <div class="info-section disclaimer">
            <h4>{{ $t('about.disclaimer.title') }}</h4>
            <p>{{ $t('about.disclaimer.text') }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '../composables/useI18n';

const showInfo = ref(false);
const { locale, setLocale } = useI18n();

const currentLanguageLabel = computed(() => {
  return locale.value === 'en' ? 'EN' : 'ID';
});

function toggleLanguage() {
  const newLocale = locale.value === 'en' ? 'id' : 'en';
  setLocale(newLocale);
}

function toggleInfo() {
  showInfo.value = !showInfo.value;
}

function closeInfo() {
  showInfo.value = false;
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #14b8a6 0%, #059669 100%);
  color: white;
  padding: 24px 0;
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  opacity: 0.3;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.language-selector {
  position: relative;
}

.language-btn,
.info-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.language-btn:hover,
.info-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
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
  color: #1f2937;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 600;
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

.info-section {
  margin-bottom: 24px;
}

.info-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.info-section p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 8px;
}

.info-section ul {
  color: #6b7280;
  padding-left: 20px;
}

.info-section li {
  margin-bottom: 4px;
  line-height: 1.5;
}

.disclaimer {
  background: #fef3c7;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #fbbf24;
}

.disclaimer h4 {
  color: #92400e;
}

.disclaimer p {
  color: #92400e;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .logo-icon {
    font-size: 36px;
  }
  
  .app-header {
    padding: 16px 0;
  }
  
  .header-container {
    padding: 0 16px;
  }
  
  .header-actions {
    flex-direction: row;
    gap: 12px;
  }
}
</style>