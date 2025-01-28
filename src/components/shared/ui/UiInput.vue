<script setup lang="ts">
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from 'vue'

type InputType = {
  type?: InputTypeHTMLAttribute
  required?: boolean
  name?: string
  placeholder?: string
  value?: string
  attrs?: InputHTMLAttributes
  isBorder?: boolean
}

const props = defineProps<InputType>()
const model = defineModel()
</script>

<template>
  <input
    ref="input"
    class="ui-input"
    :type="props.type ?? attrs?.type"
    :name="props.name ?? attrs?.name"
    :required="props.required || props.attrs?.required"
    :placeholder="props.placeholder"
    v-model="model"
    v-bind="props.attrs"
    :class="{ border: props.isBorder }"
  />
</template>

<style scoped>
.ui-input {
  width: 100%;
  padding: 0.3rem;
  border: none;
  box-sizing: border-box;
  background-color: transparent;

  &:user-invalid {
    border-color: var(--color-error-border);
  }

  &.border {
    border-radius: 0.25rem;
    border: 1px solid var(--color-border);
  }

  &:-webkit-autofill {
    background-color: transparent !important;
    box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  }
}
</style>
