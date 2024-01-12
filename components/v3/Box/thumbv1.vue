<template>
    <div class="image-item-container-v2">
        <!-- <div class="tag" :class="index%2==0?'free':'pro'">{{index%2==0?'FREE':'PRO'}}</div> -->
        <div style="
        display: flex;
        justify-content: center;">
            <div class="image-only-wrap">
                <center>
                    <img style="width:60px;color:rgb(0,78,97);" class="ui image" :src="box.img" />
                </center>

                <!-- <div class="price">
                    <div style="display:flex;justify-content:center;width:normal;bpadding:2px 10px;border-radius:15px;">
                        <div style="margin-right:2px;">
                            <img :src="goldCoin" alt="" style="width:20px;">
                        </div>
                        <div>{{ `${getRandomInt()}` }}</div>
                    </div>
                </div> -->
            </div>
        </div>

        <div class="label"
            style="color:rgb(34, 34, 34);padding:3px;margin:7px;text-align:center;word-break: break-all;word-wrap: break-word;">
            {{ box.name }}</div>
    </div>
</template>
<script setup>
import goldCoin from "@/assets/images/others/gold-coin.svg"
const prop = defineProps(["box"])

const getRandomInt = () => {
  let
    min = 200,
  max = 10,
  result = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  return '10 - ' + result;
}
</script>

<style lang="scss">
.image-item-container-v2 {
    padding: 5px;
    cursor: pointer;
    width: 200px;

    div {
        align-self: center;
    }

    .image-only-wrap {
        display: flex;
        justify-content: center;
        // padding: 10px 20px 30px 20px;
        padding:20px;
        border-radius: 15px;
        border: 2px inset transparent;
        position: relative;

        .price {
            margin-top: 8px;
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 3px;
            margin:0 auto;
            left:0;
            right:0;
        }
    }

    &:hover>div>.image-only-wrap {
        background: #d7d7d7;
        border: 2px inset white;
        box-sizing: border-box;
    }

}</style>