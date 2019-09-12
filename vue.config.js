
module.exports = {
    configureWebpack: config => {
		const externalPackages = {
			'axios': 'axios',
			'lq-form': 'lq-form',
			'vuetify': 'vuetify',
			'validate.js': 'validate.js',
			'vuex': 'vuex',
			'vuejs-object-helper': 'vuejs-object-helper',
			'vue': 'vue'
		}
		config.externals = {
			...config.externals,
			...(process.env.NODE_ENV === 'production' ? externalPackages : {})
		}
	}
	// configureWebpack: {
	// 	resolve: {
	// 		alias: {
	// 			'lq-form': 'lq-form/src/main',
	// 		}
	// 	}
	// }
 }