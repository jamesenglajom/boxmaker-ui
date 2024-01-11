<template>
    <div style="display: flex;width:100%;position:relative;">
        <div class="ui action input" style="width:100%;">
            <input type="text" placeholder="Search..." v-model="search">
            <div class="ui button icon" style="position:relative" @click="show_tag_selection = !show_tag_selection">
                <i class="filter icon">
                </i>
                <div
                    style="position:absolute;background:red;border-radius:10px;padding:1px 7px;color:white;top:-7px;right:-10px;">
                    <small>{{ search != "" ? tags.length + 1 : tags.length }}</small>
                </div>
            </div>
            <div class="ui button icon" @click="clearFilter">
                <i class="redo alternate icon"></i>
            </div>
        </div>
        <div id="option-container" style="position:absolute;z-index:9000;background:white;width:100%;top:39px;">
            <div class="option-wrapper" :class="show_tag_selection ? '' : 'hide'">
                <div class="ui grid" style="margin:0px;box-sizing:border-box;">
                    <template v-for="datum in bm.getTags">
                        <div style="padding:20px 30px;padding-left:10px;" class="four wide column" @click="handleTagSelect(datum.id)">
                                <div style="position:relative; width:100%;" class="ui medium checkbox"
                                    >
                                    <input :name="datum.id" type="checkbox" :checked="tags.includes(datum.id)">
                                    <label :for="datum.id">{{ `(${datum.no_of_boxes}) `+datum.name }}</label>
                                    <div style="position:absolute;right:3px;top:0px;">{{  }}</div>
                                </div>
                            </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useBoxMakerStore } from '@/stores/boxmaker';
const bm = useBoxMakerStore();
const { tags } = storeToRefs(bm);

const search = ref("");
const show_tag_selection = ref(false);
const bmtags = computed(()=>bm.tags);

watch(() => search.value, (v) => {
    bm.$patch({
        search: v
    });
});

const clearFilter = () => {
    search.value = "";
    bm.$patch({
        tags: []
    })
}

const handleTagSelect = (id) => {
    const selected = [];
    if(bmtags.value.includes(id)){
        selected.value = bmtags.value.filter(i=> i !== id);
    }else{
        selected.value = [...bmtags.value,id]
    }
    bm.$patch({
        tags: selected.value
    })
}
</script>

<style>
.ui.action.input{
  border-radius:0px !important;
}
.ui.action.input > div,input{
  border-radius:0px !important;
  padding:4px !important;
}

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


.selected-inner {
    flex-wrap: wrap;
    width: 100%;
    margin-top: 2px;
    display: flex;
}


.selected-wrapper {
    width: 100%;
    display: flex;

}</style>