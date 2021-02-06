<template>
    <section class="page-rank">
        <van-nav-bar fixed placeholder title="排行榜" left-text="返回" left-arrow @click-left="$router.replace('/')" />
        <div class="rank-list">
            <van-cell v-for="(i, a) in list" :key="a">
                <template #icon>
                    <img class="rank-avatar" :src="i.avatar" :alt="i.name" />
                </template>
                <template #title>
                    <div class="rank-title">
                        {{ i.name }}
                    </div>
                </template>
                <template #default>
                    <div class="rank-score" :class="`rank-${a + 1}`">
                        {{ i.score }}
                    </div>
                </template>
            </van-cell>
        </div>
    </section>
</template>

<script>
import { NavBar as VanNavBar, Cell as VanCell } from 'vant'
export default {
    components: {
        VanCell,
        VanNavBar,
    },
    data() {
        return {
            list: [],
        }
    },
    async beforeRouteEnter(to, fr, next) {
        next((vm) => {
            /* 这是一个Demo的排行榜，只需要自己装填用户数据即可 */
            vm.list = [
                {
                    name: '测试用户',
                    score: 100,
                    avatar: 'data:image/png,base64;',
                },
            ]
        })
    },
}
</script>

<style lang="scss" scoped>
.page-rank {
    background: #eee;
    min-height: 100vh;
    .rank-title {
        font-size: 18px;
        padding-top: 9px;
    }
    .rank-avatar {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .rank-score {
        font-size: 30px;
        vertical-align: middle;
        height: 100%;
        display: inline-block;
        padding-top: 9px;
        color: #555;
        &.rank-1 {
            color: #bd0000;
        }

        &.rank-2 {
            color: #a20000;
        }

        &.rank-3 {
            color: #9e0000;
        }
    }
}
</style>
