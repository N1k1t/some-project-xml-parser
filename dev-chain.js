const chain = require('some-dev-chain');

chain.init({
	'js': {
		watch: { minmatch: 'src/scripts/*.js' },
		chain: [
			{ name: 'getWatchedFile' },
			// { name: 'babel', type: 'insert-polifils' },
			{ name: 'browserify' },
			{ name: 'babel' },
			{ name: 'browserify' },
			// { name: 'minify' },
			{ name: 'writeFiles', dir: 'public/scripts/' },
			{ name: 'livereload', type: 'reload' }
		]
	},
	'scss': {
		watch: { minmatch: 'src/scss/*.scss' },
		chain: [
			{ name: 'getWatchedFile' },
			{ name: 'sass' },
			{ name: 'minify' },
			{ name: 'writeFiles', dir: 'public/css/', ext: '.css', ignoreRemoveFiles: /./ },
			{ name: 'livereload', type: 'changed' }
		]
	}
});