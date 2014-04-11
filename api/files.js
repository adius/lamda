var fs = require('fs')

module.exports = function (path, callback) {

	function getStats(readPath, callback) {

		fs.stat(readPath, function (err, stats) {

			if (err) throw err

			stats.path = path

			callback(stats)
		})
	}

	function readFiles(readPath, callback) {

		var files = []

		fs.readdir(readPath, function (err, item) {

			if (err) throw err


			item.forEach(function (file) {

				var fileInfo = {
					type: '',
					name: file,
					path: (path + '/' + file).replace(/(\/)+/g, '/')
				}

				if(fs.lstatSync(readPath + '/' + file).isDirectory())
					fileInfo.type = 'directory'

				files.push(fileInfo)
			})

			callback(files)
		})
	}


	fs.lstat(baseURL + '/' + path, function (err, stats) {

		if (err) throw err

		if (stats.isDirectory()){

			//if(path.substr(-1) == '/')
				readFiles(baseURL + '/' + path, callback)
			//else
			//	getStats(baseURL + '/' + path, callback)
		}

		else
			getStats(baseURL + '/' + path, callback)

	})
}