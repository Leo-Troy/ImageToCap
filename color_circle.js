let points = []
let RENDER_STATE = 0

function setup() {
    createCanvas(600, 600);
    background(255);
    let radius = min(width, height) / 2;
    let centerX = width / 2;
    let centerY = height / 2;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let dx = x - centerX;
            let dy = y - centerY;
            let distance = sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                let angle = atan2(dy, dx);
                let hue = degrees(angle) + 180;
                let saturation = map(distance, 0, radius, 0, 100);
                let color = colorFromHue(hue);
                let r = red(color) * (saturation / 100);
                let g = green(color) * (saturation / 100);
                let b = blue(color) * (saturation / 100);
                // stroke(r, g, b);
                // point(x, y);
                points.push({
                    "x": x,
                    "y": y,
                    "r": r,
                    "g": g,
                    "b": b
                })
            }
        }
    }

    background(255)
    points.forEach((p) => {
        stroke(p.r, p.g, p.b);
        point(p.x, p.y);
    })

    for (let i = 0; i < caps.length; i++) {
		caps[i].generate_color()
	}

    caps.forEach((cap) => {
        let min_score = 1000000
        let x = 0
        let y = 0
        points.forEach((p) => {
            // let rDiff = abs(p.r - cap.red)
            // let gDiff = abs(p.g - cap.green)
            // let bDiff = abs(p.b - cap.blue)
            
            // let score = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

            let score = compareColors([p.r, p.g, p.b], [cap.red, cap.green, cap.blue])
            if (min_score > score) {
                min_score = score
                x = p.x
                y = p.y
            }
        })
        fill(cap.red, cap.green, cap.blue)
        stroke(cap.red, cap.green, cap.blue)
        cap.x = x
        cap.y = y
        circle(x, y, cap.max_nb, 100)
    })
}

function change_render_state(render_state) {
    RENDER_STATE = render_state
    if (RENDER_STATE == 0) {
        background(255)
        points.forEach((p) => {
            stroke(p.r, p.g, p.b);
            point(p.x, p.y);
        })

        caps.forEach((cap) => {
            fill(cap.red, cap.green, cap.blue)
            stroke(cap.red, cap.green, cap.blue)
            circle(cap.x, cap.y, cap.max_nb)
        })

    } else if (RENDER_STATE == 1) {
        background(255)
        caps.forEach((cap) => {
            fill(cap.red, cap.green, cap.blue, 150)
            stroke(cap.red, cap.green, cap.blue)
            circle(cap.x, cap.y, cap.max_nb)
        })
    }
}

function draw() {
    
}

function colorFromHue(hue) {
    hue = (hue + 360) % 360;

    if (hue < 60) {
        return lerpColor(color(255, 0, 0), color(255, 255, 0), hue / 60);
    } else if (hue < 120) {
        return lerpColor(color(255, 255, 0), color(0, 255, 0), (hue - 60) / 60);
    } else if (hue < 180) {
        return lerpColor(color(0, 255, 0), color(0, 255, 255), (hue - 120) / 60);
    } else if (hue < 240) {
        return lerpColor(color(0, 255, 255), color(0, 0, 255), (hue - 180) / 60);
    } else if (hue < 300) {
        return lerpColor(color(0, 0, 255), color(255, 0, 255), (hue - 240) / 60);
    } else {
        return lerpColor(color(255, 0, 255), color(255, 0, 0), (hue - 300) / 60);
    }
}
