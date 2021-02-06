<template>
    <button @click="switchGravity">重力感应：{{ enabled ? '开' : '关' }}</button>
</template>

<script>
import { Notify } from 'vant'
export default {
    emits: ['gravity'],
    data() {
        return {
            needPermission:
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function',
            enabled: false,
            requested: false,
        }
    },
    methods: {
        async switchGravity() {
            if (this.needPermission && !this.requested) {
                try {
                    const res = await DeviceOrientationEvent.requestPermission()
                    if (res === 'granted') {
                        this.listenGravity()
                        this.enabled = true
                    } else {
                        Notify({ type: 'warning', message: '无法启用重力感应，可能是您未授权或设备不支持：' + res })
                    }
                } catch (e) {
                    Notify({ type: 'warning', message: '无法启用重力感应，可能是您未授权或设备不支持：' + e.message })
                    // do nothing
                }
            } else {
                this.enabled = !this.enabled
            }
        },
        listenGravity() {
            window.addEventListener('deviceorientation', this._listener, false)
            this.requested = true
            this.enabled = true
        },
    },
    mounted() {
        this._listener = (event) => {
            let x, y
            if (event.beta && this.enabled) {
                x = Math.sin((event.gamma * Math.PI) / 180) * 1.1
                y = Math.sin(Math.PI / 4 + (event.beta * Math.PI) / 180) * 1.1
            } else {
                x = 0
                y = 1
            }
            this.$emit('gravity', { x, y })
        }
        if (!this.needPermission) {
            this.listenGravity()
        }
    },
    unmounted() {
        window.removeEventListener('deviceorientation', this._listener)
    },
}
</script>

<style lang="scss" scoped>
button {
    width: 100px;
    background: #fff;
    color: #003298;
    border: 1px solid;
    font-size: 12px;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    border-radius: 12px;
    padding: 0 10px;
    outline: 0;
}
</style>
