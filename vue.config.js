
module.exports = {
    // configureWebpack: config => {
	// 	config.externals = {
	// 		...config.externals,
	// 		'axios': 'axios',
	// 		'lq-form': 'lq-form',
	// 		'vuetify': 'vuetify',
	// 		'validate.js': 'validate.js',
	// 		'vuex': 'vuex',
	// 		'vuejs-object-helper': 'vuejs-object-helper',
	// 		'vue': 'vue'
	// 	}
	// }
	configureWebpack: {
		resolve: {
			alias: {
				'lq-form': 'lq-form/src/main',
			}
		}
	}
 }