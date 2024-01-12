<template>
    <div>
        <V3BoxFlyout></V3BoxFlyout>
        <V3BoxTray></V3BoxTray>
        <!-- flyout dimmer -->
        <div class="ui dimmer fluid very light" :class="openFlyout ? 'active' : ''"></div>
        <V3Toast :cookie="sc_cookie"></V3Toast>
        <!-- remember template notif dimmer -->
        <div class="ui blurring">
            <div class="ui inverted dimmer" :class="bm.isLoaded ? toggle_remember? 'active':'':''"></div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from "@/stores/boxmaker";
import { useCookie } from "nuxt/app";
// store installation
const bm = useBoxMakerStore();
const { openFlyout } = storeToRefs(bm);
// cookie variable
const sc_cookie = useCookie("SC_BOXMAKER_user123");
const toggle_remember = ref(false);
onMounted(() => {
    // fetch on component mount
    bm.fetchApi().then(res => {
        bm.$patch({
            fetching: false,
            memory: sc_cookie.value ? true: false,
            box_id: sc_cookie.value ? sc_cookie.value.data.MODAL : null,
        });
    });
})

// function rememberResponse(v){
//     if(v == "forget"){
//         sc_cookie.value = null;
//     }
//     toggle_remember.value = false;
// } 
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