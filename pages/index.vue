<template>
    <div class="ui container">
        <ElFlyout :isOpen="flyout" @isClosed="closeFlyout" :box="selected_box"></ElFlyout>
        <div class="ui segment">
            <div class="ui" style="width:100%;text-align:right;">
                <div style="text-align:right;" class="ui labeled button" tabindex="0">
                    <div class="ui yellow button">
                        <i class="coins icon"></i> + Coins
                    </div>
                    <a class="ui basic yellow left pointing label">
                        1,048
                    </a>
                </div>
            </div>
        </div>
        <div class="ui segment">
            <BoxTags @selectedTagsId="handleSelectedTags"></BoxTags>
            <BoxTray :selectedTags="selectedTags" @selected="handleSelectedBox"></BoxTray>
        </div>
        <div class="ui dimmer fluid" :class="flyout ? 'active' : ''"></div>
    </div>
</template>


<script>
import { getBoxbyTags } from '@/composables/boxdata';
export default {
    setup() {
        return {
            getBoxbyTags
        }
    },
    data() {
        return {
            flyout:false,
            selectedTags: [],
            selected_box: null,
        }
    },
    methods: {
        handleSelectedTags(v) {
            this.selectedTags = v;
        },
        handleSelectedBox(v){
            this.selected_box = v;
            this.flyout = true;
        },
        closeFlyout(){
            this.flyout = false;            
        }
    }
}

</script>

<style>
.ui.dimmer.active {
    position: fixed;
    min-height: 100vh;
    height: 100vh;
    z-index: 5;
    max-width:760px;
}
</style>