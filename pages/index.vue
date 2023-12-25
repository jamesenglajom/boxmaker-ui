<template>
    <div class="ui container">
        <BoxFlyout></BoxFlyout>
        <div class="ui segment">
            <!-- <div style="text-align:right">
                <div class="ui invisible checkbox">
                    <input type="checkbox" id="cb121" checked="checked">
                    <label for="cb121" class="image visible"><i class="ui large moon icon"></i></label>
                </div>
            </div> -->
            <BoxTags></BoxTags>
            <BoxTray></BoxTray>
        </div>
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
    max-width: 760px;
}
</style>