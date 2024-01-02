<template>
    <div>
        <V3BoxFlyout></V3BoxFlyout>
        <V3BoxTray></V3BoxTray>
        <div class="ui dimmer fluid very light" :class="boxmaker.openFlyout ? 'active' : ''"></div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useBoxMakerStore } from "@/stores/boxmaker"
// store installation
const boxmaker = useBoxMakerStore();
// fetch on component mount
onMounted(() => {
    boxmaker.fetchApi().then(res => {
        boxmaker.$patch({
            fetching: false
        })
    });
})
</script>

<style>
.ui.dimmer.active {
    position: fixed;
    min-height: 100vh;
    height: 100vh;
    z-index: 5;
    max-width: 100%;
}
</style>