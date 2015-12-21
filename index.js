var fs = require('fs'),
	path = require('path'),

	express = require('express'),
	stylus = require('stylus'),
	lilyware = require('lilyware'),

	sheetmusic = require('./routes/sheetmusic'),
	playlists = require('./routes/playlists'),

	app = express(),
	basePath = path.join(global.baseURL, 'sheetmusic', 'songs')


app.use(lilyware(basePath))
app.use(express.static(basePath))
if (!module.parent) {
	app.use(serveFavicon(
		path.join(__dirname, 'public', 'images', 'favicon.ico')
	))
}

app.set('views', __dirname + '/views')

app.get('/', sheetmusic.songs)

app.get('/playlists', playlists.all)
app.get('/playlist/:id', playlists.one)

app.get('/:name', sheetmusic.song)
app.get('/raw/:name', sheetmusic.raw)


if (!module.parent) {
	app.listen(3000)
	console.log('Express started on port 3000')
}
else {
	module.exports = app
}
