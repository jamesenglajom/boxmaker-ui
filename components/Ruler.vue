<template>
    <div id="custom-ruler">
        <div id="ruler-x" class="rulers">
            <div class="label">
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
        <div id="ruler-y" class="rulers">
            <div class="label">
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";

const ruler_color = ref("#ccc"); 




const rulerClass = () => {
    // return style
}

</script>

<style>
#custom-ruler{
    height:100vh;
    width:100%;
    background-color:lightgray;
    position:relative;
}


.rulers{
    background:white;
    color:gray;
    position:absolute;
    top: 0px;
    left:0px;
}
#ruler-x{
    width:100%;
    height:25px;
    margin-left:50px;

    --ruler-num-c: #888;
  --ruler-num-fz: 10px;
  --ruler-num-pi: 0.75ch;
  --ruler-unit: 1px;
  --ruler-x: 1;
  --ruler-y: 1;

  --ruler1-bdw: 1px;
  --ruler1-c:  #BBB;
  --ruler1-h: 8px;
  --ruler1-space: 5;

  --ruler2-bdw: 1px;
  --ruler2-c:  #BBB;
  --ruler2-h: 20px;
  --ruler2-space: 50;

  background-attachment: fixed;
  background-image:
    linear-gradient(90deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(90deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0);
    /* linear-gradient(0deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(0deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0); */
  background-repeat: repeat-x, repeat-x;
  background-size:
    calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-x)) var(--ruler1-h),
    calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-x)) var(--ruler2-h),
    var(--ruler1-h) calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-y)),
    var(--ruler2-h) calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-y));
}



#ruler-y{
    background:whitesmoke;
    color:gray;
    height:100%;
    width: 25px;
    margin-top:50px;

    --ruler-num-c: #888;
  --ruler-num-fz: 10px;
  --ruler-num-pi: 0.75ch;
  --ruler-unit: 1px;
  --ruler-x: 1;
  --ruler-y: 1;

  --ruler1-bdw: 1px;
  --ruler1-c:  #BBB;
  --ruler1-h: 8px;
  --ruler1-space: 5;

  --ruler2-bdw: 1px;
  --ruler2-c:  #BBB;
  --ruler2-h: 20px;
  --ruler2-space: 50;

  background-attachment: fixed;
  background-image:
    linear-gradient(90deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(90deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0),
    linear-gradient(0deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(0deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0);
  background-repeat: repeat-y, repeat-y;
  background-size:
    calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-x)) var(--ruler1-h),
    calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-x)) var(--ruler2-h),
    var(--ruler1-h) calc(var(--ruler-unit) * var(--ruler1-space) * var(--ruler-y)),
    var(--ruler2-h) calc(var(--ruler-unit) * var(--ruler2-space) * var(--ruler-y));
}


</style>

