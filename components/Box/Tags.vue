<template>
    <div style="padding-top:50px;">
        <div class="ui grid" style="margin-bottom:40px;">
            <div class="one column" style="width:100%;">
                <div style="display:flex">
                    <div style="width:100%;position:relative" v-on-click-outside="closeElement">
                        <button class="ui labeled icon basic button" :class="isLoaded?'':'disabled'" data-tooltip="Filter tags" data-inverted=""
                            @click="show_tag_selection = !show_tag_selection">
                            <i class="filter icon" sryle="background-white"></i>
                            <small><b>{{ boxmaker.getTags.length }}</b> TAGS</small>
                        </button>
                        <div id="option-container" style="position:absolute;z-index:9000;background:white;width:100%;">
                            <div class="option-wrapper" :class="show_tag_selection ? '' : 'hide'">
                                <div class="ui grid" style="margin:0px;box-sizing:border-box;">
                                    <template v-for="datum in boxmaker.getTags">
                                        <div @click="handleSelect(datum.id)" class="four wide column"
                                            :class="selected_tags.includes(datum.id) ? 'active' : ''" style="color:gray">
                                            <i :class="selected_tags.includes(datum.id) ? 'visible' : 'invisible'"
                                                class="ui icon thumbtack"></i>{{ datum.name }} <small>({{ datum.no_of_boxes }})</small>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selected-wrapper" :class="show_tag_selection == false ? 'show-height' : 'hide-height'">
                    <div class="selected-inner">
                        <template v-if="selected_tags.length == 0">
                            <div
                                style="background:#B31228;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="ui icon thumbtack"></i>
                                    <b>All</b></small>
                            </div>
                        </template>
                        <template v-for="datum in boxmaker.getTags.filter(i => !selected_tags.includes(i.id) == false)">
                            <div
                                style="background:#B31228;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="ui icon thumbtack"></i>

                                    <b>{{ datum.name.toUpperCase() }}</b></small>
                            </div>
                        </template>
                        <template v-if="selected_tags.length != 0">
                            <div @click="clearTags"
                                style="cursor:pointer;background:#1F1F21;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="undo icon"></i>
                                </small>
                            </div>
                        </template>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,computed} from 'vue'
import { storeToRefs } from 'pinia';
import { vOnClickOutside } from '@vueuse/components'
import { useBoxMakerStore } from '@/stores/boxmaker';
// store
const boxmaker = useBoxMakerStore();
const {isLoaded} = storeToRefs(boxmaker);
// data
const show_tag_selection = ref(false);
const selected_tags = computed(()=> boxmaker.tags)
const all_tags = computed(()=> boxmaker.getTags)
const closeElement = () => {
    show_tag_selection.value = false
}
// functions
function clearTags() {
    boxmaker.$patch({
        tags: []
    });
};
function handleSelect(id) {
    let selected = [];
    if (selected_tags.value.includes(id)) {
        selected = selected_tags.value.filter(i => i != id);
    } else {
        selected = all_tags.value.filter(i => i.id == id)[0];
        selected = [...selected_tags.value, selected.id];
    }
    boxmaker.$patch({
        tags: selected
    });
};

</script>

<style>
.four.wide.column:hover {
    color: #1F1F21 !important;
    cursor: pointer;
}

.four.wide.column.active {
    color: #B31228 !important;
    cursor: pointer;
}

.option-wrapper {
    overflow-y: auto;
    overflow-x: none;
    box-sizing: border-box;
    min-height: 10px;
    max-height: 500px;
    width: calc(100% - 0px);
    border: .5px solid gray;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    transition: min-height ease-in-out .1s, max-height ease-in-out .1s, width ease-in-out .1s;
}

.option-wrapper.hide {
    min-height: 0px;
    max-height: 0px;
    border: none;
}


#selection-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

#selected-container {
    margin-bottom: 30px;
}

#selection-container>div {
    padding: 2px 10px;
    margin: 2px;
    border-radius: 25px;
    cursor: pointer;
}

#selection-container>div:hover {
    background-color: gray;
    color: white;
}

.selected {
    background-color: rgb(65, 65, 65);
    color: white;
    border: 1px inset darkgray;

}

.selected-inner {
    flex-wrap: wrap;
    width: 100%;
    margin-top: 2px;
    display: flex;
}


.selected-wrapper {
    width: 100%;
    display: flex;

}
</style>
