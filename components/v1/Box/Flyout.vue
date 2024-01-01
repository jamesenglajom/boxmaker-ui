
<template>
    <div id="flyout-element">
        <div class="ui flyout left" :class="boxmaker.openFlyout ? 'overlay visible' : ''" tab-index="-1">
            <!-- <div class="ui header" style="display:flex;justify-content:space-between">
                <div style="display:flex;align-self:center">
                    <div @click="closeFlyout"
                        style="background-color:lightgrey;cursor:pointer;padding:5px 10px;border-radius:4px;">
                        <i class="arrow left icon"></i>
                    </div>
                    <div style="align-self:center;width:30px;margin-left:15px;">
                        <img height="100px" width="100px" :src="storedBox ? box.img : ''" class="ui image" />
                    </div>
                    <div class="content" style="align-self:center;margin-left:10px">
                        <div class="box_name">
                            {{ boxmaker.getStoredBox ? boxmaker.getStoredBox.name : '' }}
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="content">
                <v1FormWrapper></v1FormWrapper>
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