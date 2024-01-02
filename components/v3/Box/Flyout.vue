
<template>
    <div id="flyout-element">
        <div class="ui flyout left" :class="boxmaker.openFlyout ? 'overlay visible' : ''" tab-index="-1">
            <div class="content">
                <v3FormWrapper></v3FormWrapper>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from '@/stores/boxmaker';
const boxmaker = useBoxMakerStore();
const { getStoredBox: box, box_id:storedBox } = storeToRefs(boxmaker);
// function
function closeFlyout() {
    boxmaker.$patch({
        box_id: null
    })
}
</script>
<style>
.ui.flyout.overlay {
    background: white;
    width: 95% !important;
    z-index: 999;
    overflow: hidden;
    max-width: 100%;
    height:100vh;
    padding:0px !important;
}

.ui.flyout.visible>.ui.header {
    background: white;
    border: none !important;
}

</style>