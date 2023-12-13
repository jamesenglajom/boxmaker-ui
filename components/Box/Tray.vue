<template>
  <div>
    <p><span class="ui large text">{{ getBoxbyTags(selectedTags).length }} Models</span></p>
    <div class="ui divider"></div>
    <div class="ui segment secondary">

      <div class="ui" style="display:flex;flex-wrap:wrap;">
        <template v-for="(datum, index) in getBoxbyTags(selectedTags)" :key="datum">

          <div class="image-item-container" @click="boxSelect(datum.id)">
            <!-- <div class="tag" :class="index%2==0?'free':'pro'">{{index%2==0?'FREE':'PRO'}}</div> -->
            <div style="display:flex;justify-content:center;height:130px;">

              <div style="margin-top:15px;justify-content:center;text-align:center;">
                <center>
                  <NuxtPicture style="width:60px;color:rgb(0,78,97);" class="ui image"
                    :src="`_nuxt/assets/images/box_icons/${datum.img}`" />
                </center>
                <div class="label"
                  style="color:rgb(0,78,97);padding:3px;margin-top:7px;font-size:.85em;text-align:center;">
                  {{ datum.name }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getBoxbyTags } from '@/composables/boxdata';
export default {
  props: ["selectedTags"],
  methods:{
    boxSelect(v){
      this.$emit("selected",getBoxBySlugName(v))
    }
  }
}

</script>

<style>
.image-item-container:hover {
  background-color: rgb(255, 212, 59);
}

.image-item-container {
  /* margin:10px; */
  width: 130px;
  height: 130px;
  border-radius: 7px;
  background-color: transparent;
  position: relative;
  cursor: pointer;
}
</style>