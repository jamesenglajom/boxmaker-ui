
<style>
#tag-filter-flyout.expanded>.ui.flyout.overlay {
    background: #1F1F21;
    width: 330px !important;
    z-index: 999;
    overflow: hidden;
    max-width: 720px;
}

#tag-filter-flyout.minimized>.ui.flyout.overlay {
    background: #1F1F21;
    width: 80px !important;
    z-index: 999;
    overflow: hidden;
    max-width: 720px;
}

#box-result-label.expanded {
    font-weight: bold;
    margin-bottom: 12px;
    padding: 10px 30px;
}

#box-result-label.minimized {
    display: none;
}

#filter-container.expanded {
    padding: 20px 10px 0px 30px;
}

#filter-container.minimized {
    display: none;
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
    background-color: #B31228;
    color: white;
}


#box-result-container.minimized {
    padding-bottom:20px;
}

.box-item.expanded {
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    padding-left: 50px;

}

.box-item.minimized {
    padding: 2px 2px;
}

#box-result-container.minimized>.box-item>.details {
    display: none;
}

#box-result-container.minimized>.box-item>.details {
    display: none;
}

.box-item>div {
    align-self: center;
}

.box-item:hover {
    cursor: pointer;
    background: #666666;
}

.box-item.expanded>.img {
    width: 50px !important;
    height: 50px !important;
}

.box-item.minimized>.img {
    background:#252529;
    border-radius: 4px;
    padding:10px 5px;
}

.box-item.expanded>.details {
    width: calc(100% - 70px) !important;
}

.box-item>.img>img {
    height: 100%;
    width: 100%;
}

.ui.button.circular {
    background: #1F1F21;
    color: gray;
}

.ui.button.circular:hover {
    background: #666666;
    color: whitesmoke;

}

#tag-filter-flyout>.ui.flyout.visible>.ui.header {
    background: #1F1F21;
    border: none !important;

}

#tag-filter-flyout>.ui.flyout.visible>.content {
    -webkit-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    -moz-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    background: #1F1F21;
    overflow-y: scroll;
    max-height: calc(100vh - 65px);
    display: relative;
    padding: 0px;
    color: white;
}

#tag-filter-flyout>.content>#selection-container {}
</style>

<template>
    <div id="tag-filter-flyout" :class="mode">
        <div class="ui flyout left" :class="true ? 'overlay visible' : ''" tab-index="-1">
            <div class="ui header" style="display:flex;justify-content:space-between">
                <div style="display:flex;align-self:center">
                    <div>
                        <template v-if="mode == 'expanded'">
                            <button @click="mode = 'minimized'" class="ui button circular icon close-flyout-button">
                                <i class="arrow left icon"></i>
                            </button>
                        </template>
                        <template v-else-if="mode == 'minimized'">
                            <button @click="mode = 'expanded'" class="ui button circular icon close-flyout-button">
                                <i class="arrow right icon"></i>
                            </button>
                        </template>
                    </div>
                    <div class="content" style="align-self:center;margin-left:10px; color:#fff">
                        {{ mode == 'expanded' ? 'Filter' : '' }}
                    </div>
                </div>
            </div>
            <div class="content">
                <div v-if="mode == 'expanded'" style="padding:10px 30px; padding-bottom:0px;">
                    <div class="ui input" style="width:100%">
                        <input  type="text" placeholder="Search...">
                    </div>
                </div>
                <div v-if="mode == 'minimized'"
                    style="margin:20px 0px;display:flex; justify-content:center;margin-top:10px">
                    <div v-tooltip="Filter" class="ui label" style="background:#28282b;color:white;">
                        <i class="filter icon"></i> {{ selected_tags.length }}
                    </div>
                </div>
                <div id="filter-container" :class="mode">
                    <span style="font-weight:bold;margin-bottom:12px;" class="ui medium text">Select from {{
                        tags.length }} available tags:</span>
                    <div id="select-container" style="padding:10px;">
                        <template v-for="datum in tags">
                            <!-- <div @click="handleTagSelect(datum.id)"
                                :class="selected_tags.includes(datum.id) ? 'selected' : ''">
                                {{ datum.name }}</div> -->
                            <div style="padding:3px 10px;">
                                <div style="position:relative; width:100%;" class="ui medium checkbox"
                                    @click="handleTagSelect(datum.id)">
                                    <input :name="datum.id" type="checkbox" :checked="selected_tags.includes(datum.id)">
                                    <label :for="datum.id" style="color:white">{{ datum.name }}</label>
                                    <div style="position:absolute;right:3px;top:0px;">{{ datum.no_of_boxes }}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="box-container" :class="mode">
                    <div id="box-result-label" :class="mode">Results ({{ boxes.length }}):</div>
                    <div id="box-result-container" :class="mode">
                        <template v-for="datum in boxes">
                            <div @click="selectBox(datum.id)" v-tooltip.right="mode == 'minimized' ? datum.name : null" class="box-item" :class="mode">
                                <div class="img">
                                    <img :src="datum.img" alt="">
                                </div>
                                <div class="details">
                                    <div class="name">
                                        {{ datum.name }}
                                    </div>
                                    <!-- <div class="description">
                                        {{ datum.description }}
                                    </div> -->
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { watch } from "vue";
import { useBoxMakerStore } from "@/stores/boxmaker";
import { storeToRefs } from "pinia";

const bm = useBoxMakerStore();
const { getTags: tags, getBoxes: boxes, tags: selected_tags } = storeToRefs(bm);

const mode = ref('minimized')
const handleTagSelect = (tag) => {
    let selected = [];
    if (selected_tags.value.filter(i => i == tag).length > 0) {
        selected = selected_tags.value.filter(i => i != tag);
    } else {
        selected = [...selected_tags.value, tag];
    }
    bm.$patch({
        tags: selected,
    })
}
watch(() => mode, (v)=>{
    bm.$patch({
        
    });
});
const selectBox = (id) => {
    bm.$patch({
        box_id: id
    });
}
</script>