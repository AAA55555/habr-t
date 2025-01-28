<script setup lang="ts">
import UserSuggest from './components/suggest/ui/UserSuggest.vue'
import { defaultSuggestConfig, defaultSuggestConfigError } from '@/components/suggest/api'
</script>

<template>
  <div class="container">
    <header class="header">Summary</header>
    <main class="main">
      <div class="wrapper-suggest">
        <UserSuggest :api-config="defaultSuggestConfig"> Пользователь или компания</UserSuggest>
        <UserSuggest :api-config="defaultSuggestConfig" :max-tags="2">
          Пользователь или компания</UserSuggest
        >
        <UserSuggest :api-config="defaultSuggestConfigError" :required="false">
          Пользователь или компания (с ошибкой)</UserSuggest
        >
      </div>
    </main>
  </div>
</template>

<style scoped>
.header {
  font-size: 2rem;
  font-weight: 700;
}

.main {
  margin-top: 4rem;
  width: 100%;
}

@media (width >= 1024px) {
  .main {
    width: 40%;
  }
}

.wrapper-suggest {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
