<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <ul>
        <li>
          <RouterLink to="/requests">Requests</RouterLink>
        </li>
        <li>
          <RouterLink to="/form-config">Form config</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
