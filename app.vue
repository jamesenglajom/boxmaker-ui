<template>
  <div id="app-body">
    <NuxtPage />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from '@/stores/boxmaker';
const bm = useBoxMakerStore();
const {isLoading} = storeToRefs(bm);
</script>


<style>
@import url("fomantic-ui-css/semantic.min.css");

@media only screen and (min-width: 760px) {
  body {
    background-color: rgb(231, 231, 231);
    width: 760px;
  }
}

.ui.red {
  background-color: #b31228 !important;
}

.ui.red:hover {
  background-color: #830e1d !important;
}

.ui.red.active {
  background-color: #941021 !important;
}
</style>