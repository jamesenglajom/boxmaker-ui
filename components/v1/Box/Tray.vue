<template>
  <div style="background:white; padding:30px;">
    <div class="" style="background:white;">
      <V1BoxTagsv2></V1BoxTagsv2>
      <div style="display:flex;justify-content:space-between">
        <div style="align-self:center">
          <span>{{ isLoaded ? boxmaker.getBoxes.length == boxmaker.getAllBoxCount ? boxmaker.getAllBoxCount + ' models' :
            `${boxmaker.getBoxes.length} of ${boxmaker.getAllBoxCount} models` : 'Loading...' }} </span>
        </div>
        <div style="align-self:center">

          <div class="ui icon buttons" :class="isLoaded ? '' : 'disabled'">
            <button @click="view = 'icon'" :class="view == 'icon' ? 'active' : ''" class="ui button basic"
              data-tooltip="Icon view" data-inverted=""><i class="th icon"></i></button>
            <button @click="view = 'list'" :class="view == 'list' ? 'active' : ''" class="ui button basic"
              data-tooltip="List view" data-inverted=""><i class="th list icon"></i></button>
          </div>
        </div>
      </div>
      <div class="ui divider"></div>

      <!-- icon view -->
      <template v-if="view == 'icon'">
        <template v-if="isLoaded">
          <div class="ui" style="display:flex;flex-wrap:wrap;justify-content: center;text-align: center;border-radius:7px;padding:20px 0px;">
            <template v-for="(datum, index) in boxmaker.getBoxes" :key="datum">
              <V1BoxThumbv1 @click="boxSelect(datum.id)" :box="datum"></V1BoxThumbv1>
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
            <template v-for="(datum, index) in boxmaker.getBoxes" :key="datum">
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
              <template v-if="boxmaker.getBoxes.length - 1 > index">
                <div class="ui divider"></div>
              </template>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="ui items" style="background:white">
            <template v-for="(datum, index) in 7" :key="datum">
              <div class="item">
                <div class="ui tiny image">
                  <div class="ui placeholder">
                    <div class="image"></div>
                  </div>
                </div>
                <div class="content" style="margin-left:20px">
                  <div class=" ui placeholder">
                    <div class="short line"></div>
                  </div>
                  <div class="ui placeholder">
                    <div class="line"></div>
                    <div class="line"></div>
                  </div>
                  <div class="description">
                    <div class="ui placeholder">
                      <div class="line"></div>
                      <div class="line"></div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="boxmaker.getBoxes.length - 1 > index">
                <div class="ui divider"></div>
              </template>
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { storeToRefs } from 'pinia';
import { useBoxMakerStore } from '@/stores/boxmaker';
// store
const boxmaker = useBoxMakerStore();
const { isLoaded } = storeToRefs(boxmaker);
const view = ref('icon')
const images = ref([]);
// function
function boxSelect(id) {
  // mutate on click
  boxmaker.$patch({
    box_id: id
  })
}
</script>

<style>
.image-item-container:hover {
  /* background-color: rgb(255, 212, 59); yellow bg hover */
  background-color: #666666;

}

.image-item-container {
  /* margin:10px; */
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
</style>