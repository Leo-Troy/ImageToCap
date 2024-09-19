
class ResultImage {

	constructor(path) {
		this.img = loadImage(path)
	}

	resize() {
		w = windowWidth * 0.5 * 0.9
		h = windowHeight * 0.9
		let incr = 0.9

		do {
			w = windowWidth * 0.5 * incr
			let delta = w / this.img.width
			h = this.img.height * delta
			incr -= 0.01
		} while (w >= windowWidth * 0.5 * 0.9 || h >= windowHeight * 0.9)

		// let delta = this.img.height / HEIGHT
		// this.img.resize(this.img.width / delta, HEIGHT)
	}

	generate_mozaique() {
		this.mozaique = []
		let rows = Math.floor(this.img.height / CAP_SIZE);
		let cols = Math.floor(this.img.width / CAP_SIZE);
		
		this.img.loadPixels();
		
		for (let y = 0; y < rows; y++) {
			this.mozaique[y] = [];
			for (let x = 0; x < cols; x++) {
				this.mozaique[y][x] = this.getAverageColor(x * CAP_SIZE, y * CAP_SIZE);
			}
		}
	}

	getAverageColor(start_x, start_y) {
		let r = 0, g = 0, b = 0, count = 0;
		for (let y = start_y; y < start_y + CAP_SIZE; y++) {
		  	for (let x = start_x; x < start_x + CAP_SIZE; x++) {
				let index = (y * this.img.width + x) * 4;
				r += this.img.pixels[index];
				g += this.img.pixels[index + 1];
				b += this.img.pixels[index + 2];
				count++;
		  	}
		}
		return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
	}

	generate_caps() {
		this.caps = []
		for (let i = 0; i < this.mozaique.length; i++) {
			this.caps[i] = [];
			for (let j = 0; j < this.mozaique[i].length; j++) {
				this.caps[i][j] = this.color_to_cap(this.mozaique[i][j]);
			}
		}
	}

	color_to_cap(color) {
		let max_score = 10000
		let cap = null
		for (let i = 0; i < cap_colors.length; i++) {
			let rDiff = abs(color[0] - cap_colors[i].red)
			let gDiff = abs(color[1] - cap_colors[i].green)
			let bDiff = abs(color[2] - cap_colors[i].blue)
			
			let score = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
			if (max_score > score) {
				cap = cap_colors[i]
				max_score = score
			} 
		}
		return [cap.red, cap.green, cap.blue]
	}

	generate_counter_caps() {
		this.counter_caps = []
		for (let i = 0; i < this.mozaique.length; i++) {
			this.counter_caps[i] = [];
			for (let j = 0; j < this.mozaique[i].length; j++) {
				this.counter_caps[i][j] = [0, 0, 0];
			}
		}

		for (let k = 0; k < 800; k+=10) {
			for (let c = 0; c < cap_colors.length; c++) {
				for (let i = 0; i < this.mozaique.length; i++) {
					for (let j = 0; j < this.mozaique[i].length; j++) {
						if (cap_colors[c].max_nb > 0) {
							if (this.counter_caps[i][j][0] == 0 && this.counter_caps[i][j][1] == 0 && this.counter_caps[i][j][2] == 0) {
								let rDiff = abs(this.mozaique[i][j][0] - cap_colors[c].red)
								let gDiff = abs(this.mozaique[i][j][1] - cap_colors[c].green)
								let bDiff = abs(this.mozaique[i][j][2] - cap_colors[c].blue)
								
								let score = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
								if (score < k) {
									this.counter_caps[i][j] = [cap_colors[c].red, cap_colors[c].green, cap_colors[c].blue];
									// cap_colors[c].max_nb -= 1
								}
							}
						}
					}
				}
			}
		}
	}

	generate_real_caps() {
		this.real_caps = []
		for (let i = 0; i < this.mozaique.length; i++) {
			this.real_caps[i] = [];
			for (let j = 0; j < this.mozaique[i].length; j++) {
				this.real_caps[i][j] = [0, 0, 0];
			}
		}
		for (let k = 0; k < 2000; k+=1) {
			for (let c = 0; c < caps.length; c++) {
				for (let i = 0; i < this.mozaique.length; i++) {
					for (let j = 0; j < this.mozaique[i].length; j++) {
						// if (caps[c].max_nb > 0) {
							if (this.real_caps[i][j][0] == 0 && this.real_caps[i][j][1] == 0 && this.real_caps[i][j][2] == 0) {
								let rDiff = abs(this.mozaique[i][j][0] - caps[c].red)
								let gDiff = abs(this.mozaique[i][j][1] - caps[c].green)
								let bDiff = abs(this.mozaique[i][j][2] - caps[c].blue)

								// let score = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
                                let score = compareColors([this.mozaique[i][j][0], this.mozaique[i][j][1], this.mozaique[i][j][2]], [caps[c].red, caps[c].green, caps[c].blue])
								if (score < k) {
									this.real_caps[i][j] = [caps[c].red, caps[c].green, caps[c].blue, caps[c].img, score];
									caps[c].max_nb -= 1
								}
							}
						// }
					}
				}
			}
		}

		// let probas = []

		// for (let i = 0; i < this.mozaique.length; i++) {
		// 	probas[i] = []
		// 	for (let j = 0; j < this.mozaique[i].length; j++) {
		// 		probas[i][j] = []
		// 		for (let c = 0; c < caps.length; c++) {
        //             let score = compareColors([this.mozaique[i][j][0], this.mozaique[i][j][1], this.mozaique[i][j][2]], [caps[c].red, caps[c].green, caps[c].blue])
		// 			probas[i][j].push({ "path": caps[c].path, "score": score })
		// 		}
		// 		probas[i][j].sort((a, b) => a.score - b.score);
		// 	}
		// }


		// for (let i = 0; i < this.mozaique.length; i++) {
		// 	for (let j = 0; j < this.mozaique[i].length; j++) {
		// 		if (probas[i][j][0].score < 20) {
		// 			let cap = get_cap_by_path(probas[i][j][0].path)
		// 			// if (cap.max_nb > 0) {
		// 				cap.max_nb -= 1
		// 		}
		// 	}
		// }

	}


	render() {
		if (SHOW_STATE == 0) {
			image(this.img, windowWidth / 4 - w / 2 , windowHeight / 2 - h / 2, w, h)

			let shape = createGraphics(CAP_SIZE, CAP_SIZE)
			shape.ellipse(CAP_SIZE/2, CAP_SIZE/2, CAP_SIZE, CAP_SIZE)
			let dec = 1
			for (let i = 0; i < this.real_caps.length; i++) {
				for (let j = 0; j < this.real_caps[i].length; j++) {
					this.real_caps[i][j][3].mask(shape)
					let nw = 3 * windowWidth / 4 - w / 2
					let nh = windowHeight / 2 - h / 2
					image(this.real_caps[i][j][3], nw + j / this.real_caps.length * h, nh + i / this.real_caps[i].length * w, 
						h / this.real_caps.length, w / this.real_caps[i].length
					)
				}
			} 
		}
		else if (SHOW_STATE == 1) {

			for (let i = 0; i < this.mozaique.length; i++) {
				for (let j = 0; j < this.mozaique[i].length; j++) {
					stroke(this.mozaique[i][j][0], this.mozaique[i][j][1], this.mozaique[i][j][2])
					fill(this.mozaique[i][j][0], this.mozaique[i][j][1], this.mozaique[i][j][2])
					rect(j * CAP_SIZE, i * CAP_SIZE, CAP_SIZE, CAP_SIZE)
				}
			}
		}
		else if (SHOW_STATE == 2) {

			for (let i = 0; i < this.caps.length; i++) {
				for (let j = 0; j < this.caps[i].length; j++) {
					stroke(this.caps[i][j][0], this.caps[i][j][1], this.caps[i][j][2])
					fill(this.caps[i][j][0], this.caps[i][j][1], this.caps[i][j][2])
					rect(j * CAP_SIZE, i * CAP_SIZE, CAP_SIZE, CAP_SIZE)
				}
			} 
		}

		else if (SHOW_STATE == 3) {

			for (let i = 0; i < this.counter_caps.length; i++) {
				for (let j = 0; j < this.counter_caps[i].length; j++) {
					stroke(this.counter_caps[i][j][0], this.counter_caps[i][j][1], this.counter_caps[i][j][2])
					fill(this.counter_caps[i][j][0], this.counter_caps[i][j][1], this.counter_caps[i][j][2])
					rect(j * CAP_SIZE, i * CAP_SIZE, CAP_SIZE, CAP_SIZE)
				}
			} 
		}

		else if (SHOW_STATE == 4) {

			for (let i = 0; i < this.real_caps.length; i++) {
				for (let j = 0; j < this.real_caps[i].length; j++) {
					stroke(this.real_caps[i][j][0], this.real_caps[i][j][1], this.real_caps[i][j][2])
					fill(this.real_caps[i][j][0], this.real_caps[i][j][1], this.real_caps[i][j][2])
					rect(j * CAP_SIZE, i * CAP_SIZE, CAP_SIZE, CAP_SIZE)
				}
			} 
		}
		else if (SHOW_STATE == 5) {
			let shape = createGraphics(CAP_SIZE, CAP_SIZE)
			shape.ellipse(CAP_SIZE/2, CAP_SIZE/2, CAP_SIZE, CAP_SIZE)
			let dec = 0.75

			for (let i = 0; i < this.real_caps.length; i++) {
				for (let j = 0; j < this.real_caps[i].length; j++) {
					this.real_caps[i][j][3].mask(shape)
					image(this.real_caps[i][j][3], j * CAP_SIZE * dec, i * CAP_SIZE * dec)
				}
			} 
		}

		else if (SHOW_STATE == 6) {

			for (let i = 0; i < this.real_caps.length; i++) {
				for (let j = 0; j < this.real_caps[i].length; j++) {
					stroke(this.real_caps[i][j][4] * 5)
					fill(this.real_caps[i][j][4] * 5)
					rect(j * CAP_SIZE, i * CAP_SIZE, CAP_SIZE, CAP_SIZE)
				}
			} 
		}
	}
}


class CapColor {

	constructor(red, green, blue, max_nb) {
		this.red = red
		this.green = green
		this.blue = blue
		this.max_nb = max_nb
	}

}

class Cap {
	constructor(path, max_nb) {
		this.path = path
		this.max_nb = max_nb
		this.img = loadImage(path)
	}

	generate_color() {
		this.img.loadPixels();
		this.red = 0
		this.green = 0
		this.blue = 0
		for (var y = 0; y < this.img.height; y++) {
			for (var x = 0; x < this.img.width; x++) {
				var index = (x + y * this.img.width)*4;
				this.red += this.img.pixels[index+0]
				this.green += this.img.pixels[index+1]
				this.blue += this.img.pixels[index+2]
			}
		}
		this.red /= this.img.width * this.img.height
		this.green /= this.img.width * this.img.height
		this.blue /= this.img.width * this.img.height

		// let colorHistogram = {};
        // let maxCount = 0;
        // let dominantColor = [0, 0, 0];

        // for (let x = 0; x < this.img.width; x++) {
        //   for (let y = 0; y < this.img.height; y++) {
        //     let index = (x + y * this.img.width) * 4;
        //     let r = this.img.pixels[index];
        //     let g = this.img.pixels[index + 1];
        //     let b = this.img.pixels[index + 2];

        //     let colorKey = `${r},${g},${b}`;

        //     if (colorHistogram[colorKey]) {
        //       colorHistogram[colorKey]++;
        //     } else {
        //       colorHistogram[colorKey] = 1;
        //     }

        //     if (colorHistogram[colorKey] > maxCount) {
        //       maxCount = colorHistogram[colorKey];
        //       dominantColor = [r, g, b];
        //     }
        //   }
        // }
		// this.red = dominantColor[0]
		// this.green = dominantColor[1]
		// this.blue = dominantColor[2]

		// this.img.resize(CAP_SIZE, CAP_SIZE)
	}
}


function rgbToLab(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

    let l = (116 * y) - 16;
    let a = 500 * (x - y);
    let b2 = 200 * (y - z);

    return [l, a, b2];
}

function deltaE(lab1, lab2) {
    let deltaL = lab1[0] - lab2[0];
    let deltaA = lab1[1] - lab2[1];
    let deltaB = lab1[2] - lab2[2];
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

function compareColors(color1, color2) {
    let lab1 = rgbToLab(color1);
    let lab2 = rgbToLab(color2);
    return deltaE(lab1, lab2);

	// let rDiff = abs(color1[0] - color2[0])
	// let gDiff = abs(color1[1] - color2[1])
	// let bDiff = abs(color1[2] - color2[2])
	
	// return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}