
<template>
    <div id="flyout-element">
        <div class="ui flyout left" :class="bm.openFlyout ? 'overlay visible' : ''" tab-index="-1">
            <div class="content">
                <v3FormWrapper></v3FormWrapper>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBoxMakerStore } from '@/stores/boxmaker';
const bm = useBoxMakerStore();
</script>
<style lang="scss" scoped>
.ui.flyout.overlay {
    background: white;
    width: 95% !important;
    z-index: 999;
    overflow: hidden;
    max-width: 100%;
    height:100vh;
    padding:0px !important;
    .content{
        width:100%;
        padding:0px;
    }
}
</style>