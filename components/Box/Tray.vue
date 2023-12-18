<template>
  <div>
    <div style="display:flex;justify-content:space-between">
      <div style="align-self:center">
        <h3>{{ getBoxbyTags(selectedTags).length == boxes().length ? boxes().length : `${getBoxbyTags(selectedTags).length} of ${boxes().length}` }} Models</h3>
      </div>
      <div style="align-self:center">

        <div class="ui icon buttons">
          <button @click="view = 'icon'" :class="view == 'icon' ? 'active' : ''" class="ui button basic"
            data-tooltip="Icon view" data-inverted=""><i class="th icon"></i></button>
          <button @click="view = 'list'" :class="view == 'list' ? 'active' : ''" class="ui button basic"
            data-tooltip="List view" data-inverted=""><i class="th list icon"></i></button>
        </div>
      </div>
    </div>
    <div class="ui divider"></div>
    <div class="ui segment secondary">




      <!-- icon view -->
      <template v-if="view == 'icon'">
        <div class="ui" style="display:flex;flex-wrap:wrap;">
          <template v-for="(datum, index) in getBoxbyTags(selectedTags)" :key="datum">
            <div class="image-item-container" @click="boxSelect(datum.id)" :data-tooltip="datum.name" data-inverted="">
              <!-- <div class="tag" :class="index%2==0?'free':'pro'">{{index%2==0?'FREE':'PRO'}}</div> -->
              <div style="display:flex;justify-content:center;height:100px;">

                <div style="align-self:center;justify-content:center;text-align:center;">
                  <center>
                    <NuxtPicture style="width:60px;color:rgb(0,78,97);" class="ui image"
                      :src="`/assets/images/box_icons/${datum.img}`" />
                  </center>
                  <!-- <div class="label"
                    style="color:rgb(0,78,97);padding:3px;margin-top:7px;font-size:.85em;text-align:center;">
                    {{ datum.name }}</div> -->
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>

      <!-- list view -->
      <template v-else-if="view == 'list'">
        <div class="ui items">
          <template v-for="(datum, index) in getBoxbyTags(selectedTags)" :key="datum">
            <div class="item" @click="boxSelect(datum.id)">
              <div class="ui tiny image">
                    <NuxtPicture style="width:60px;color:rgb(0,78,97);" class="ui image"
                      :src="`/assets/images/box_icons/${datum.img}`" />
              </div>
              <div class="content" style="margin-left:20px">
                <div class="header">{{ datum.name }}</div>
                <div class="meta" style="display:flex;flex-wrap:wrap;">
                  <template v-for="tag in datum.tags">
                    <div style="margin-top:2px;padding:4px 10px;border-radius:25px;background-color:#666666;color:white;">
                      {{ tag }}</div>
                  </template>
                </div>
                <div class="description">
                  <p>{{ datum.description }}</p>
                </div>
              </div>
            </div>
            <template v-if="getBoxbyTags(selectedTags).length - 1 > index">
              <div class="ui divider"></div>
            </template>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getBoxbyTags, getBoxById, boxes } from '@/composables/boxdata';
export default {
  props: ["selectedTags"],
  methods: {
    boxSelect(v) {
      this.$emit("selected", getBoxById(v))
    }
  },
  data() {
    return {
      view: "icon"
    }
  }
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

.ui.items>.item:hover {
  background-color: #cccccc;
  cursor: pointer;
}

.ui.items>.item {
  padding: 15px;
}
</style>