import { ensure } from '@xytoki/asset-loader'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'Play',
        component: () => import(/* webpackChunkName: "play" */ '../views/Play.vue'),
        meta: {
            load: true,
        },
    },
    {
        path: '/rank',
        name: 'Rank',
        component: () => import(/* webpackChunkName: "rank" */ '../views/Rank.vue'),
        meta: {
            load: true,
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
router.beforeEach(async (to) => {
    if (to.meta && to.meta.load) {
        document.getElementById('vueload').className = ''
        document.getElementById('tokibt').innerText = `加载中 精彩在路上`
    }
})
router.beforeResolve(async () => {
    await ensure((pg, total) => {
        document.getElementById('tokibs').style.visibility = 'visible'
        document.getElementById('tokibw').style.width = (pg / total) * 100 + '%'
        document.getElementById('tokibt').innerText = `加载素材 ${pg}/${total}`
    })
    document.getElementById('vueload').className = 'hide'
})
export default router
