const gitInfo = require('git-repo-info')()
process.env.VUE_APP_TIMESTAMP = Date.now()
process.env.VUE_APP_GIT_SHA = (gitInfo.abbreviatedSha || '').substring(0, 8)
module.exports = {
    lintOnSave: true,
    assetsDir: 'static',
    publicPath: './',
    productionSourceMap: false,
    transpileDependencies: ['@xytoki/asset-loader'],
    chainWebpack: (config) => {
        config.output.jsonpFunction('define')

        config.plugins.delete('prefetch')
        config.plugins.delete('preload')

        /* inject assetLoader */
        config.module
            .rule('svg')
            .use('asset-loader')
            .loader('@xytoki/asset-loader/loader')
            .before('file-loader')
        config.module
            .rule('svg')
            .use('file-loader')
            .tap((options) => {
                options.name = options.name.replace('[name].[hash:8]', '[contenthash]')
                return options
            })
        config.module
            .rule('fonts')
            .use('url-loader')
            .tap((options) => {
                options.fallback.options.name = options.fallback.options.name.replace(
                    '[name].[hash:8]',
                    '[contenthash]',
                )
                return options
            })
        for (let m of ['images', 'media']) {
            config.module
                .rule(m)
                .use('asset-loader')
                .loader('@xytoki/asset-loader/loader')
                .before('url-loader')
            config.module
                .rule(m)
                .use('url-loader')
                .tap((options) => {
                    options.fallback.options.name = options.fallback.options.name.replace(
                        '[name].[hash:8]',
                        '[contenthash]',
                    )
                    return options
                })
        }
    },
}
