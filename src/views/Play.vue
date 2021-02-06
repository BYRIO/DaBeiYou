<template>
    <section class="game-box">
        <stage
            :key="stageKey"
            ref="stage"
            :gameEnd="gameEnd"
            :config="config"
            :gravity="gravity"
            :debug="$route.query.debug == 1"
            :cheat="$route.query.cheat == 1"
            :getRandom="getRandom"
            @update:score="score = $event"
            @update:currentMaxObject="currentMaxObject = $event"
            @die="endGame"
        />
        <score-button class="score-btn" :score="score" :showEnd="!faild" @end="endGame" @rank="toRank" />
        <gravity-controller class="gravity-btn" @gravity="gravity = $event" />
        <div class="faild" :class="{ show: showFaild }">
            <div class="content">
                <h1>{{ score }}</h1>
                <div class="desc">失败了...</div>
                <div class="operation" v-show="showOperation">
                    <button @click="reload">再来一次</button>
                    <button @click="toRank">查看排行</button>
                </div>
            </div>
        </div>
        <div class="success" :class="{ show: showSuccess }">
            <div class="content">
                <div class="large">
                    <img :src="config[currentMaxObject].imgurl" />
                </div>
                <h1>{{ score }}</h1>
                <div class="operation" v-show="showOperation">
                    <button @click="reload">再来一次</button>
                    <button @click="toRank">查看排行</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import getConfig from '@/config'

import random from 'lodash/random'
import { Notify, Dialog } from 'vant'

import Stage from '@/game/Stage'
import ScoreButton from '@/game/ScoreButton'
import GravityController from '@/game/GravityController'
export default {
    components: {
        Stage,
        ScoreButton,
        GravityController,
    },
    data() {
        const config = getConfig()
        return {
            config,
            score: 0,
            stageKey: 0,
            currentMaxObject: 0,
            showOperation: false,
            showSuccess: false,
            showFaild: false,
            gameEnd: false,
            gravity: {
                x: 0,
                y: 1,
            },
            successKey: config.length - 2,
        }
    },
    computed: {
        faild() {
            return this.currentMaxObject < this.successKey
        },
    },
    watch: {
        currentMaxObject(value) {
            if (value === this.successKey) {
                Notify({ type: 'success', message: '恭喜通关！继续合成有惊喜哦！' })
            } else if (value > this.successKey) {
                Notify({ type: 'success', message: '恭喜解锁惊喜！你可以继续刷分，也可以在左上角结束游戏' })
            }
        },
    },
    methods: {
        async toRank() {
            if (!this.gameEnd && this.score > 10) {
                try {
                    await Dialog.confirm({
                        title: '是否要离开游戏？',
                        message: '您的分数和进度将会丢失',
                    })
                } catch (e) {
                    return
                }
            }
            this.$router.push({
                name: 'Rank',
            })
        },
        async endGame() {
            this.gameEnd = true
            if (this.faild) {
                this.showFaild = true
            } else {
                this.showSuccess = true
            }
            await this.$refs.stage.addScore(this.faild)
            this.showOperation = true
        },
        async reload() {
            this.stageKey++
            // 重新渲染stage即可达到不加载重新开始的目的
            this.score = 0
            this.gameEnd = false
            this.showFaild = false
            this.showSuccess = false
            this.currentMaxObject = 0
        },
        getRandom() {
            const p = random(100, 200)
            if (p < 130 || this.currentMaxObject == 0) {
                return 0
            }
            if (p < 160 || this.currentMaxObject == 1) {
                return 1
            }
            if (p < 175 || this.currentMaxObject == 2) {
                return 2
            }
            if (p < 190 || this.currentMaxObject == 3) {
                return 3
            }
            return 4
        },
    },
    created() {},
}
</script>

<style lang="scss" scoped>
.gravity-btn {
    position: absolute;
    top: 20px;
    right: 20px;
}
.score-btn {
    position: absolute;
    top: 20px;
    left: 20px;
}

.faild {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: all 0.4s;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &.show {
        opacity: 1;
        pointer-events: all;
    }
    h1 {
        font-size: 30px;
        margin: 10px;
        margin-top: 0;
    }
    .desc {
        margin-bottom: 10px;
    }
}
.success {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: all 0.4s;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &.show {
        opacity: 1;
        pointer-events: all;
    }
    h1 {
        font-size: 30px;
        margin: 10px;
        margin-top: 0;
    }
    .desc {
        margin-bottom: 10px;
    }
    .large img {
        width: 200px;
    }
}

.operation button {
    display: inline-block;
    margin: 10px;
    padding: 10px 20px;
    background: #2458c2;
    color: #fff;
    border: 1px solid #0046d6;
    border-radius: 5px;
    outline: 0;
}
</style>
