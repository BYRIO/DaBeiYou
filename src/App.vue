<script>
export default {}
</script>

<template>
    <router-view />
    <div class="copyright">
        &copy;2021 BYR Team - xyToki
    </div>
</template>
<style lang="scss">
html {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overscroll-behavior: none;
    background: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
}
.copyright {
    position: fixed;
    pointer-events: none;
    bottom: 0;
    left: 0;
    right: 0;
    color: #888;
    font-size: 12px;
    text-align: center;
    font-family: Consolas, monospace;
}
body {
    background: #fff;
    max-width: 450px;
    max-height: 800px;
    margin: 0;
    padding: 0;
    overscroll-behavior: none;
    height: 100%;
    width: 100%;
    position: relative;
}
</style>
