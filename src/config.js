/*
 * 资源配置文件
 * 此版本策略为玩到倒数第二个就算【通关】，玩到倒数第一个不再合成
 * 数量可以任意增减，大小、分数也可任意修改
 * 改图只需要替换图片即可，由于使用了assetLoader图片需要经过webpack打包才能被预加载
 */

import img1 from '@/assets/images/1.png'
import img2 from '@/assets/images/2.png'
import img3 from '@/assets/images/3.png'
import img4 from '@/assets/images/4.png'
import img5 from '@/assets/images/5.png'
import img6 from '@/assets/images/6.png'
import img7 from '@/assets/images/7.png'
import img8 from '@/assets/images/8.png'
import img9 from '@/assets/images/9.png'
import img10 from '@/assets/images/10.png'
import img11 from '@/assets/images/11.png'
import img12 from '@/assets/images/12.png'
export default () => {
    return [
        { size: 52 * 0.56, imgurl: img1, imgwidth: img1.asset.imageObject.width, score: 1 },
        { size: 80 * 0.56, imgurl: img2, imgwidth: img2.asset.imageObject.width, score: 2 },
        { size: 108 * 0.56, imgurl: img3, imgwidth: img3.asset.imageObject.width, score: 4 },
        { size: 119 * 0.56, imgurl: img4, imgwidth: img4.asset.imageObject.width, score: 8 },
        { size: 152 * 0.56, imgurl: img5, imgwidth: img5.asset.imageObject.width, score: 16 },
        { size: 183 * 0.56, imgurl: img6, imgwidth: img6.asset.imageObject.width, score: 32 },
        { size: 193 * 0.56, imgurl: img7, imgwidth: img7.asset.imageObject.width, score: 64 },
        { size: 258 * 0.56, imgurl: img8, imgwidth: img8.asset.imageObject.width, score: 128 },
        { size: 308 * 0.56, imgurl: img9, imgwidth: img9.asset.imageObject.width, score: 256 },
        { size: 358 * 0.56, imgurl: img10, imgwidth: img10.asset.imageObject.width, score: 512 },
        { size: 408 * 0.56, imgurl: img11, imgwidth: img11.asset.imageObject.width, score: 1024 },
        { size: 408 * 0.56, imgurl: img12, imgwidth: img12.asset.imageObject.width, score: 2048 },
    ]
}
