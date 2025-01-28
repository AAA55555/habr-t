<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

type NotificationType = 'error' | 'warning' | 'info' | 'success' | 'loading'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String as () => NotificationType,
    default: 'error',
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const emit = defineEmits(['close'])

const getIcon = () => {
  switch (props.type) {
    case 'error':
      return '⚠️'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    case 'success':
      return '✅'
    case 'loading':
      return '🔄'
    default:
      return ''
  }
}

const getColor = () => {
  switch (props.type) {
    case 'error':
      return '#ffebee'
    case 'warning':
      return '#fff3e0'
    case 'info':
      return '#e3f2fd'
    case 'success':
      return '#e8f5e9'
    case 'loading':
      return '#f5f5f5'
    default:
      return '#ffebee'
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="ui-notification" :class="type" :style="{ backgroundColor: getColor() }" role="alert">
    <div class="notification-content">
      <span class="notification-icon">{{ getIcon() }}</span>
      <p class="notification-text">{{ message }}</p>
      <button
        v-if="type !== 'loading'"
        class="notification-close"
        @click="handleClose"
        aria-label="Закрыть уведомление"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.ui-notification {
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.notification-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.notification-icon {
  margin-right: 10px;
  font-size: 1.2em;
}

.notification-text {
  flex-grow: 1;
  margin: 0;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0 5px;
}

.error {
  border: 1px solid var(--color-error-border);
  color: var(--color-error);
}

.warning {
  border: 1px solid var(--color-warging);
  color: var(--color-warging);
}

.info {
  border: 1px solid var(--color-info);
  color: var(--color-info);
}

.success {
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.loading {
  border: 1px solid var(--color-loading);
  color: var(--color-loading);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading .notification-icon {
  animation: spin 1s linear infinite;
}
</style>
