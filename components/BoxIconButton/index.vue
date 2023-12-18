<template>
    <div class="btn-icon-div">
        <img height="60" :src="`/assets/images/box_icons/${imgsrc}`" alt="">
    </div>
</template>
<script>
export default {
    props:["imgsrc"],
    name:"BoxIconButton",

}
</script>
<style lang="css">
    .btn-icon-div{
        min-width: 50px;cursor:pointer
    }
    .btn-icon-div:hover{
        background-color:lightgrey;
    }
    .btn-icon-div .active{
        background-color:darkgrey;
    }
</style>