var fs = require('fs'),
	path = require('path'),

	yaml = require('js-yaml'),
	gm = require('gm'),

	util = require('../../../util'),
	imageResizer = require('./imageResizer'),

	thingsDir = path.join(global.baseURL, 'things'),
	thumbsDirectory = path.join(global.projectURL, 'thumbs')


fs.mkdir(path.join(thumbsDirectory, 'things'), function (error) {

	if (error && error.code !== 'EEXIST')
		throw new Error(error)
})


function callRenderer (res, things, view) {

	res.render('index', {
		page: 'things',
		things: things.sort(function (a, b) {
			a = a.dateOfPurchase || 0
			b = b.dateOfPurchase || 0

			return b - a
		}),
		view: view,
		fortune: things
			.map(function (element) {
				return element.price
			})
			.reduce(function (previous, current) {


				if (previous) {
					if (typeof previous === 'string')
						previous = Number(previous.slice(0, -1))
				}
				else
					previous = 0

				if (current) {
					if (typeof current === 'string')
						current = Number(current.slice(0, -1))
				}
				else
					current = 0

				current = previous + current

				return current
			})
			.toFixed(2)
	})
}


module.exports = function (req, response) {

	var view = (req.query.view === 'wide') ? 'wide' : 'standard',
		defaultNames = ['front', 'overview', 'index', 'top'],
		things = []


	function loadThings (callback) {

		fs.readdir(thingsDir, function (error, thingDirs) {

			var numberOfThings = thingDirs.length

			if (error) {
				callback(error)
				return
			}

			thingDirs.forEach(function (thingDir) {

				var thing = {}


				function loadFiles (callback) {

					var images = [],
						indexData

					fs.readdir(
						path.join(thingsDir, thingDir),
						function (error, files) {

							var numberOfFiles = files.length

							if (error) {
								console.error(error)
								return
							}

							files.forEach(function (file) {

								function checkImagesLoadStatus () {
									if (images.length === numberOfFiles)
										callback(null, images, indexData)
								}

								if (file === 'index.yaml') {
									fs.readFile(
										path.join(thingsDir, thingDir, 'index.yaml'),
										{encoding: 'utf-8'},
										function (error, fileContent) {

											if (error) {
												console.error(error)
												return
											}

											numberOfFiles--

											indexData = yaml.safeLoad(fileContent)

											checkImagesLoadStatus()
										}
									)
								}
								else if (util.isImage(file))
									images.push(file)

								else
									numberOfFiles--


								checkImagesLoadStatus()
							})
						}
					)
				}


				if (thingDir[0] === '.') {
					numberOfThings--
					return
				}

				loadFiles(function (error, images, indexData) {

					var imagePath = path.join(thingDir, (images[0] || '')),
						imageThumbnailPath = path.join(
							'thumbs',
							'things',
							imagePath
						)


					if (error) {
						callback(error)
						return
					}

					thing = indexData || thing

					thing.name = thingDir.replace(/_/g, ' ')

					fs.exists(imageThumbnailPath, function (exists) {

						if (exists) return

						fs.mkdir(
							path.join(thumbsDirectory, 'things', thingDir),
							function (error) {

								if (error && error.code !== 'EEXIST') {
									console.error(error)
									return
								}

								imageResizer.addToQueue({
									absPath: path.join(
										thingsDir, imagePath
									),
									absThumbnailPath: path.join(
										global.projectURL, imageThumbnailPath
									)
								})
							}
						)

					})


					thing.image = path.join('/', imageThumbnailPath)
					thing.rawImage = path.join('/things', imagePath)
					things.push(thing)

					if (things.length === numberOfThings)
						callback(null, things)
				})
			})
		})
	}


	loadThings(function (error, things) {

		if (error)
			throw new Error(error)

		callRenderer(response, things, view)
	})
}
