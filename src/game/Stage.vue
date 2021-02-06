<template>
    <section
        class="game"
        :style="{ width: `${width}px`, height: `${height}px` }"
        @touchmove.prevent.stop="processMove"
        @mousemove="processMove"
        @mouseup="processClick"
        @touchend="processClick"
    >
        <div class="warn" :class="{ show: showWarn }"></div>
        <section class="stage" ref="stage" :style="{ width: `${width}px`, height: `${height}px` }"></section>
    </section>
</template>

<script>
function sleep(s) {
    return new Promise((r) => setTimeout(r, s))
}
import debounce from 'lodash/debounce'
import { Mouse, MouseConstraint, Engine, World, Body, Bodies, Render, Events, Runner } from 'matter-js'
export default {
    emits: ['die', 'update:currentMaxObject', 'update:score'],
    props: {
        width: {
            type: Number,
            default: document.body.offsetWidth,
        },
        height: {
            type: Number,
            default: document.body.offsetHeight,
        },
        config: {
            type: Array,
            default: () => [],
        },
        gameEnd: {
            type: Boolean,
            default: false,
        },
        createDelay: {
            type: Number,
            default: 500,
        },
        cheat: {
            type: Boolean,
            default: false,
        },
        debug: {
            type: Boolean,
            default: false,
        },
        groundColor: {
            type: String,
            default: '#003298',
        },
        gravity: {
            type: Object,
            default: () => {
                return { x: 0, y: 1 }
            },
        },
        getRandom: {
            type: Function,
            default: () => {
                return 0
            },
        },
    },
    data() {
        return {
            score: 0,
            showWarn: false,
            latast: 0,
            dyingCounter: 0,
            currentMaxObject: 0,
        }
    },
    computed: {
        renderWidth() {
            return this.width * 2
        },
        renderHeight() {
            return this.height * 2
        },
    },
    watch: {
        dyingCounter(val) {
            if (val > 50) {
                this.$emit('die')
            }
        },
        gravity: {
            handler(val) {
                this._engine.world.gravity.x = val.x || 0
                this._engine.world.gravity.y = val.y || 1
            },
            deep: true,
        },
    },
    methods: {
        processMove($event) {
            if (this.gameEnd) return false
            if (this._mouseConstraint) {
                const dragTop = this._mouseConstraint.body ? this._mouseConstraint.body.isStatic : true
                if (!dragTop) return
            }
            const lobj = this._objects[this.latest]
            const size = this.config[lobj.label].size
            let x = $event.touches ? $event.touches[0].offsetX || $event.touches[0].pageX : $event.offsetX
            if (x < size / 2) {
                x = size / 2
            } else if (this.width - x < size / 2) {
                x = this.width - size / 2
            }
            Body.setPosition(lobj, {
                x: x * 2,
                y: this._objects[this.latest].position.y,
            })
        },
        async processClick() {
            if (this.gameEnd) return false
            if (this._mouseConstraint) {
                const dragTop = this._mouseConstraint.body ? this._mouseConstraint.body.isStatic : true
                if (!dragTop) return
            }
            if (this.sleep) return
            this.addFalling(this.latest)
            this.sleep = true
            await sleep(this.createDelay)
            this.addObject(this.getRandom())
            this.sleep = false
        },
        async addScore(bomb) {
            await sleep(300)
            for (let i of this._objects) {
                if (!i.__destroyed) {
                    this.score += this.config[i.label].score
                    this.$emit('update:score', this.score)
                    if (bomb) {
                        World.remove(this._engine.world, i)
                        await sleep(100)
                    }
                }
            }
            return this.score
        },
        addGround() {
            const Nground = Bodies.rectangle(this.renderWidth / 2 - 2.5, 0, this.renderWidth + 10, 1, {
                isStatic: true,
                render: {
                    fillStyle: this.groundColor,
                },
                label: 'GROUND',
            })
            const ground = Bodies.rectangle(
                this.renderWidth / 2 - 2.5,
                this.renderHeight - 60,
                this.renderWidth + 10,
                120,
                {
                    isStatic: true,
                    render: {
                        fillStyle: this.groundColor,
                    },
                    label: 'GROUND',
                },
            )
            const Lground = Bodies.rectangle(0, this.renderHeight / 2, 1, this.renderHeight, {
                isStatic: true,
                label: 'GROUND',
            })
            const Rground = Bodies.rectangle(this.renderWidth, this.renderHeight / 2, 1, this.renderHeight, {
                isStatic: true,
                label: 'GROUND',
            })
            const Tground = Bodies.rectangle(this.renderWidth / 2 - 2.5, 70, this.renderWidth + 10, 140, {
                isStatic: true,
                label: 'TOP',
                isSensor: true,
                render: {
                    opacity: 0,
                },
            })
            const Wground = Bodies.rectangle(this.renderWidth / 2 - 2.5, 240, this.renderWidth + 10, 2, {
                isStatic: true,
                render: {
                    opacity: 0,
                },
                label: 'WARN',
                isSensor: true,
            })
            World.add(this._engine.world, [Lground, Rground, Tground, ground, Wground, Nground])
        },
        addCheat() {
            const mouse = Mouse.create(this._render.canvas),
                mouseConstraint = MouseConstraint.create(this._engine, {
                    mouse: mouse,
                    constraint: {
                        stiffness: 0.1,
                        render: {
                            visible: true,
                        },
                    },
                })
            World.add(this._engine.world, mouseConstraint)
            this._mouseConstraint = mouseConstraint
        },
        getRender(key) {
            const c = this.config[key]
            return {
                sprite: {
                    texture: c.imgurl,
                    xScale: (c.size * 2) / c.imgwidth,
                    yScale: (c.size * 2) / c.imgwidth,
                },
            }
        },
        addToWorld(obj) {
            World.add(this._engine.world, [obj])
            return this._objects.push(obj) - 1
        },
        addObject(key, position) {
            const c = this.config[key]
            if (!c) return
            const obj = Bodies.circle(this.renderWidth / 2, 40 + c.size / 2, c.size, {
                isStatic: typeof position === 'undefined',
                restitution: 0.1,
                density: 0.03,
                label: key,
                render: this.getRender(key),
                position: position || {},
            })
            const t = this.addToWorld(obj)
            if (typeof position === 'undefined') {
                this.latest = t
            }
            return t
        },
        addFalling(objId) {
            Body.setStatic(this._objects[objId], false)
        },
        processCollision(ev) {
            if (this.gameEnd) return
            for (let i of ev.pairs) {
                if (i.bodyA.label == 'TOP' || i.bodyB.label == 'TOP') {
                    if (i.bodyA.isStatic != true || i.bodyB.isStatic != true) {
                        const objx = i.bodyA.label == 'TOP' ? i.bodyB : i.bodyA
                        if (objx.speed < 0.5) {
                            // 不会立刻死亡
                            this.dyingCounter++
                        }
                    }
                }
                if (i.bodyA.label == 'WARN' || i.bodyB.label == 'WARN') {
                    if (i.bodyA.isStatic != true || i.bodyB.isStatic != true) {
                        const objx = i.bodyA.label == 'WARN' ? i.bodyB : i.bodyA
                        if (objx.speed < 0.5) {
                            this.showWarn = true
                            this._hideWarn()
                        }
                    }
                }
                if (i.bodyA.label !== i.bodyB.label) continue
                if (i.bodyA.__destroyed || i.bodyB.__destroyed) continue
                const newX = (i.bodyA.position.x + i.bodyB.position.x) / 2
                const newY = (i.bodyA.position.y + i.bodyB.position.y) / 2
                const newC = i.bodyA.label + 1
                const c = this.config[newC]
                this.currentMaxObject = Math.max(newC, this.currentMaxObject)
                const totalObjects = this.config.length
                if (newC == totalObjects) {
                    // 没有可以合并的了
                    return
                }
                this.addObject(newC, { x: newX, y: newY })
                World.remove(this._engine.world, i.bodyA)
                World.remove(this._engine.world, i.bodyB)
                i.bodyA.__destroyed = true
                i.bodyB.__destroyed = true

                this.score += c.score
                this.$emit('update:currentMaxObject', this.currentMaxObject)
                this.$emit('update:score', this.score)
            }
        },
        hideWarn() {
            this.showWarn = false
        },
    },
    mounted() {
        this._hideWarn = debounce(this.hideWarn.bind(this), 2000)
        const engine = Engine.create()
        const render = Render.create({
            element: this.$refs.stage,
            engine: engine,
            options: {
                showAngleIndicator: this.debug,
                wireframes: this.debug,
                width: this.renderWidth,
                height: this.renderHeight,
                background: 'transparent',
            },
        })
        this._engine = engine
        this._render = render

        this.addGround()
        if (this.cheat || this.debug) {
            this.addCheat()
        }
        Events.on(engine, 'collisionActive', this.processCollision.bind(this))
        this._objects = []
        Engine.run(this._engine)
        Render.run(this._render)
        this.addObject(0)
    },
    unmounted() {
        Runner.stop(this._engine)
        Render.stop(this._render)
    },
}
</script>

<style lang="scss" scoped>
.game {
    position: relative;
    .stage {
        &::v-deep canvas {
            width: 100%;
            height: 100%;
        }
    }
    .warn {
        position: absolute;
        top: 95px;
        left: 0;
        right: 0;
        border: 2px dashed #f00;
        opacity: 0;
        transition: all 0.2s;
        pointer-events: none;
        &.show {
            opacity: 1;
        }
    }
}
</style>
