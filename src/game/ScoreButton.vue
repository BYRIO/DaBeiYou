<template>
    <div class="sc">
        <span class="score">{{ score }}</span>
        <a @click="$emit('end')" v-if="showEnd">
            结束
        </a>
        <a @click="$emit('rank')" v-else>
            排行
        </a>
    </div>
</template>

<script>
export default {
    emits: ['end', 'rank'],
    props: {
        score: {
            type: Number,
            default: 0,
        },
        showEnd: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.sc {
    width: 100px;
    background: #fff;
    color: #003298;
    border: 1px solid;
    font-size: 12px;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    border-radius: 12px;
    padding: 0 7px;
    outline: 0;
    box-sizing: border-box;

    .score {
        width: 49px;
        text-align: center;
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
        height: 100%;
        font-family: Consolas, monospace;
    }

    a {
        vertical-align: top;
        height: 100%;
        display: inline-block;
        margin-left: 5px;
        border-left: 1px solid;
        padding-left: 5px;
    }
}
</style>
