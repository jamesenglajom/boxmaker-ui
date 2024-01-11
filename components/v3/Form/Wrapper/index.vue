<template>
    <div id="flyout-content-wrapper" class="v3-1">
        <div id="flyout-header">
            <div class="ui button circular icon back-button" @click="closeFlyout">
                <i class="ui arrow left icon"></i>
            </div>
            <div style="margin-left:10px;">
                <span class="ui text">{{ box_name }}</span>
            </div>
        </div>
        <div style="display:flex">
            <div id="representation-wrapper" ref="canvasWrapper">
                <V3Ruler></V3Ruler>
            </div>
            <V3Form @discard="discard"></V3Form>
        </div>

        <div class="ui blurring">
            <div class="ui inverted dimmer" :class="bm.isLoaded ? bm.discard ? 'active':'':''"></div>
        </div>
    </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from "@/stores/boxmaker";
// store
const bm = useBoxMakerStore();
const { getBoxName: box_name }= storeToRefs(bm);
// data
const canvasWrapper = ref();
const toggle_discard = ref(false);
// onMounted
onMounted(() => {
    useResizeObserver(canvasWrapper, (entries) => {
        const entry = entries[0]
        const { width, height } = entry.contentRect
        bm.$patch({ cw_width: width, cw_height: height })
    })
});
// function
const discard = (v) =>{
    toggle_discard.value = v;
} 
const closeFlyout = () => {
    // console.log(toggle_discard.value)
    // console.log("if false close flyout, else.")
    toggle_discard.value = bm.memory ? true: toggle_discard.value;
    if(toggle_discard.value==false){
        bm.$patch({
            box_id: null
        });
    }else{
        // open toast discard on proceed
        bm.$patch({
            discard:true,
        })
    }
}
</script>

<style lang="scss" scoped>
#flyout-content-wrapper.v3-1 {

    width: 100%;
    box-sizing: border-box;
    padding: 0px !important;


    &>#flyout-header {
        background: #f0f0f0;
        border-bottom: #DBDBDB 1px solid;
        padding: 0px;
        width: 100%;
        height: 60px;
        display: flex;

        div {
            align-self: center;
        }

        .back-button {
            background: transparent !important;
            cursor: pointer;
        }

        .back-button:hover {
            background: whitesmoke !important;
        }
    }

    #representation-wrapper {
        box-sizing: border-box;
        min-width: 600px;
        height: calc(100vh - 68px);
        width: calc(100% - 400px);
        background: #cccccc;
        border: #9b9b9b solid 1px;
        padding: 0px;
        position: relative;
    }
}
</style>