

function setup() {
	result_image.resize()
	result_image.generate_mozaique()
	for (let i = 0; i < caps.length; i++) {
		caps[i].generate_color()
	}


	cap_colors = [
		new CapColor(255, 0, 0, 120),
		new CapColor(255, 255, 0, 120),
		new CapColor(255, 127, 0, 120),
		new CapColor(127, 127, 0, 120),
		new CapColor(0, 255, 0, 120),
		new CapColor(0, 0, 255, 120),
		new CapColor(0, 0, 127, 120),
		new CapColor(0, 255, 127, 120),
		new CapColor(0, 255, 255, 120),
		new CapColor(0, 127, 255, 120),
		new CapColor(255, 255, 255, 120),
	]


	let cap_count = caps.map((cap_color) => cap_color.max_nb).reduce((acc, current) => acc + current, 0)
	result_image.generate_caps()
	result_image.generate_counter_caps()
	result_image.generate_real_caps()

	createCanvas(windowWidth, windowHeight)
	fill(0, 0, 0)
	rect(0, 0, windowWidth / 2, windowHeight)
	fill(20, 20, 20)
	rect(windowWidth / 2, 0, windowWidth / 2, windowHeight)
	result_image.render()


	console.log("Image cap nb : " + ((result_image.img.width / CAP_SIZE) * (result_image.img.height / CAP_SIZE)))
	console.log("Cap count : " + cap_count)
	for (let i = 0; i < caps.length; i++) {
		console.log("Cap : " + caps[i].path + " ... MAX " + caps[i].max_nb)
	}

	console.log("Width : " + (result_image.img.width / CAP_SIZE * 3.2 * 0.75) + " cm" + " /// " + result_image.img.width / CAP_SIZE)	
	console.log("Height : " + (result_image.img.height / CAP_SIZE * 3.2 * 0.75) + " cm" + " /// " + result_image.img.height / CAP_SIZE)	
}

function change_state(new_state) {
	SHOW_STATE = new_state
	result_image.render()
}