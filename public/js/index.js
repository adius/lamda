!function (window, document) {

	Mousetrap.bind('/', function(){
		$('#console').toggle()
	})

	/*files.addEvenetListener('click', function(event){
		event.preventDefault()

		var depth = $(this)
			.parentsUntil('#columns')
			.data('depth')

		console.log(depth)

	})

	$(document)
		.on('click', '#columns a', function (event) {
			event.preventDefault()

			$.getJSON('/api/files/' + this.innerHTML, function (data) {
				console.log(data)
			})
		})
	*/

}(window, document)