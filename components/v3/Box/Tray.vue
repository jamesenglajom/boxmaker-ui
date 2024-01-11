<template>
  <div style="background:whitesmoke;height:100vh;">
    <div class="" style="background:whitesmoke;border:#9b9b9b 1px solid;border-bottom:none;">
      <div style="padding:20px;border-bottom:#9b9b9b solid 1px;background:white;">
        <div style="display:flex;justify-content:space-between;margin-top:4px;">
          <div style="align-self:center">
            <span>{{ isLoaded ? bm.getBoxes.length == bm.getAllBoxCount ? bm.getAllBoxCount + ' models'
              :
              `${bm.getBoxes.length} of ${bm.getAllBoxCount} models` : 'Loading...' }} </span>
          </div>
          <div style="align-self:center;display:flex;">
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
            </div>
            <div id="box-preview-options" class="ui icon basic buttons" :class="isLoaded ? '' : 'disabled'">
              <button data-position="bottom right" @click="view = 'icon'" :class="view == 'icon' ? 'active' : ''"
                class="ui button basic" data-tooltip="Icon view" data-inverted=""><i class="th icon"></i></button>
              <button data-position="bottom right" @click="view = 'list'" :class="view == 'list' ? 'active' : ''"
                class="ui button basic" data-tooltip="List view" data-inverted=""><i class="th list icon"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div style="height:100%;">
        <!-- icon view -->
        <template v-if="view == 'icon'">
          <template v-if="isLoaded">
            <div
              style="display:flex;flex-wrap:wrap;justify-content: center;text-align: center;padding:20px 0px;background:transparent;">
              <template v-for="(datum, index) in bm.getBoxes" :key="datum">
                <V3BoxThumbv1 @click="boxSelect(datum.id)" :box="datum"></V3BoxThumbv1>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="ui" style="height:450px;">
              <div class="ui active dimmer">
                <div class="ui indeterminate text loader">Preparing Files</div>
              </div>
            </div>
          </template>
        </template>

        <!-- list view -->
        <template v-else-if="view == 'list'">
          <template v-if="isLoaded">
            <div class="ui items">
              <template v-for="(datum, index) in bm.getBoxes" :key="datum">
                <div class="item h-ccc" @click="boxSelect(datum.id)">
                  <div class="ui tiny image">
                    <img style="width:60px;color:rgb(0,78,97);" class="ui image" :src="datum.img" />
                  </div>
                  <div class="content" style="margin-left:20px">
                    <div class="header">{{ datum.name }}</div>
                    <div class="meta" style="display:flex;flex-wrap:wrap;">
                      <template v-for="tag in datum.tags">
                        <div
                          style="margin-top:2px;padding:4px 10px;border-radius:25px;background-color:#666666;color:white;">
                          {{ tag }}</div>
                      </template>
                    </div>
                    <div class="description">
                      <p style="line-height:2em;">{{ datum.description }}</p>
                    </div>
                  </div>
                </div>
                <template v-if="bm.getBoxes.length - 1 > index">
                  <div class="ui divider"></div>
                </template>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div id="option-container">
      <div class="option-wrapper" :class="show_tag_selection ? '' : 'hide'">
        <div class="ui grid" style="margin:0px;box-sizing:border-box;">
          <template v-for="datum in bm.getTags">
            <div style="padding:20px 30px;padding-left:10px;" class="four wide column" @click="handleTagSelect(datum.id)">
              <div style="position:relative; width:100%;" class="ui medium checkbox">
                <input :name="datum.id" type="checkbox" :checked="tags.includes(datum.id)">
                <label :for="datum.id">{{ `(${datum.no_of_boxes}) ` + datum.name }}</label>
                <div style="position:absolute;right:3px;top:0px;">{{ }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from '@/stores/boxmaker';

// store
const bm = useBoxMakerStore();
const { isLoaded, tags } = storeToRefs(bm);
const view = ref('icon')
const images = ref([]);
// function
function boxSelect(id) {
  // mutate on click
  bm.$patch({
    box_id: id,
    memory:false
  })
}

const search = ref("");
const show_tag_selection = ref(false);
const bmtags = computed(() => bm.tags);

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
  if (bmtags.value.includes(id)) {
    selected.value = bmtags.value.filter(i => i !== id);
  } else {
    selected.value = [...bmtags.value, id]
  }
  bm.$patch({
    tags: selected.value
  })
}
</script>

<style>
#box-preview-options {
  border-radius: 0px !important;
  margin-left: 4px;
}

#box-preview-options>button {
  border-radius: 0px !important;
  padding: 4px !important;
}

x .image-item-container:hover {
  background-color: #666666;
}

.image-item-container {
  width: 100px;
  height: 100px;
  border-radius: 7px;
  background-color: transparent;
  position: relative;
  cursor: pointer;
}

.ui.items>.h-ccc:hover {
  background-color: #cccccc;
  cursor: pointer;
}

.ui.items>.item {
  padding: 15px;
}

.ui.items>.no-item {
  padding: 15px;
}


.ui.action.input {
  border-radius: 0px !important;
}

.ui.action.input>div,
input {
  border-radius: 0px !important;
  padding: 4px !important;
}

.four.wide.column:hover {
  color: #1F1F21 !important;
  cursor: pointer;
}

.four.wide.column.active {
  color: #B31228 !important;
  cursor: pointer;
}

#option-container {
  position: absolute;
  background: white;
  width: 100%;
  top: 73px;
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