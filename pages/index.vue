<template>
    <div>
        <template v-if="!isLoaded">
            <div class="ui inverted segment" style="height:100vh">
                <div class="ui active massive inverted loader text">
                    Please wait...
                </div>
            </div>
        </template>
        <template v-else>
            <div class="ui container" style="background:#28282a">
                <BoxTagFilter></BoxTagFilter>
                <div style="margin-left: 80px;">
                    <FormWrapper></FormWrapper>
                </div>
                <div class="ui dimmer fluid" :class="flyoutv2 ? 'active' : ''"></div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useBoxMakerStore } from "@/stores/boxmaker"

// store installation
const boxmaker = useBoxMakerStore();
const { flyoutv2, isLoaded,getStoredBox:box } = storeToRefs(boxmaker);
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
    max-width: 760px;
}
</style>