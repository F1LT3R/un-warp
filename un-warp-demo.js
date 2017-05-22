const cardImagePath = 'charlie-card.jpg'
const cardWidth = 318
const cardRatio = 0.630563798
const cardHeight = parseInt(cardWidth * cardRatio, 10)

const controlPointSize = 20
const controlPointFill = 'rgba(255, 0, 255, 0.5)'
const controlPointStroke = 'rgba(255, 0, 255, 1)'
const controlPointFillGrabbed = 'rgba(255, 255, 0, 0.5)'
const controlPointStrokeGrabbed = 'rgba(255, 255, 0, 1)'

const dist = (x1, y1, x2, y2) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

input.width = cardWidth
input.height = cardHeight
const ctx = input.getContext('2d')

input2.width = cardWidth
input2.height = cardHeight
const ctxi2 = input2.getContext('2d')

output.width = cardWidth
output.height = cardHeight
const ctx2 = output.getContext('2d')

const img = new Image()
img.onload = function () {
	ctx.drawImage(img, 0, 0, cardWidth, cardHeight)
	ctxi2.drawImage(img, 0, 0, cardWidth, cardHeight)
}
img.src = cardImagePath

let controlPointGrabbed = false
let controlPointMoved = false
let x1 = 50
let y1 = 50
let x2 = input.width - 50
let y2 = 50
let x3 = input.width - 50
let y3 = input.height - 50
let x4 = 50
let y4 = input.height - 50

input.addEventListener('mousemove', event => {
	const mouseX = event.x - input.getBoundingClientRect().left
	const mouseY = event.y - input.getBoundingClientRect().top

	if (controlPointGrabbed === 1) {
		x1 = mouseX
		y1 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 2) {
		x2 = mouseX
		y2 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 3) {
		x3 = mouseX
		y3 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 4) {
		x4 = mouseX
		y4 = mouseY
		controlPointMoved = true
	}
})

input.addEventListener('touchmove', event => {
	if (!event.targetTouches.length === 1) {
		return
	}

	const touch = event.targetTouches[0]

	const mouseX = touch.pageX - input.getBoundingClientRect().left
	const mouseY = touch.pageY - input.getBoundingClientRect().top

	if (controlPointGrabbed === 1) {
		x1 = mouseX
		y1 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 2) {
		x2 = mouseX
		y2 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 3) {
		x3 = mouseX
		y3 = mouseY
		controlPointMoved = true
	}

	if (controlPointGrabbed === 4) {
		x4 = mouseX
		y4 = mouseY
		controlPointMoved = true
	}

	event.preventDefault()
})

input.addEventListener('mousedown', event => {
	const mouseX = event.x - input.getBoundingClientRect().left
	const mouseY = event.y - input.getBoundingClientRect().top

	controlPointMoved = false

	if (dist(mouseX, mouseY, x1, y1) <= controlPointSize) {
		controlPointGrabbed = 1
		return
	}

	if (dist(mouseX, mouseY, x2, y2) <= controlPointSize) {
		controlPointGrabbed = 2
		return
	}

	if (dist(mouseX, mouseY, x3, y3) <= controlPointSize) {
		controlPointGrabbed = 3
		return
	}

	if (dist(mouseX, mouseY, x4, y4) <= controlPointSize) {
		controlPointGrabbed = 4
		return
	}

	controlPointGrabbed = false
})

input.addEventListener('touchstart', event => {
	if (!event.targetTouches.length === 1) {
		return
	}

	const touch = event.targetTouches[0]

	const mouseX = touch.pageX - input.getBoundingClientRect().left
	const mouseY = touch.pageY - input.getBoundingClientRect().top

	controlPointMoved = false

	if (dist(mouseX, mouseY, x1, y1) <= controlPointSize) {
		controlPointGrabbed = 1
		return
	}

	if (dist(mouseX, mouseY, x2, y2) <= controlPointSize) {
		controlPointGrabbed = 2
		return
	}

	if (dist(mouseX, mouseY, x3, y3) <= controlPointSize) {
		controlPointGrabbed = 3
		return
	}

	if (dist(mouseX, mouseY, x4, y4) <= controlPointSize) {
		controlPointGrabbed = 4
		return
	}

	controlPointGrabbed = false
	event.preventDefault()
})

const drawControlPoint = (x, y, grabbed) => {
	ctx.lineWidth = 1

	if (grabbed) {
		ctx.fillStyle = controlPointFillGrabbed
		ctx.strokeStyle = controlPointStrokeGrabbed
	} else {
		ctx.fillStyle = controlPointFill
		ctx.strokeStyle = controlPointStroke
	}

	ctx.beginPath()
	ctx.arc(x, y, controlPointSize, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	if (grabbed) {
		ctx.fillStyle = controlPointStrokeGrabbed
	} else {
		ctx.fillStyle = controlPointStroke
	}

	ctx.beginPath()
	ctx.arc(x, y, 2, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
}

function getPixelRGB(x, y) {
	const pixel = ctxi2.getImageData(x, y, 1, 1).data
	return [pixel[0], pixel[1], pixel[2]]
}

const vectXY = (vx2, vx1, vy2, vy1, pos, max) => {
	const da = Math.atan2(vy2 - vy1, vx2 - vx1)
	const ds = dist(vx1, vy1, vx2, vy2)
	const dv = ds / max * pos

	const dx = vx1 + (Math.cos(da) * dv)
	const dy = vy1 + (Math.sin(da) * dv)

	return {
		x: dx,
		y: dy
	}
}

let y = 0
let x = 0
let n = 8

const draw2 = () => {
	if (y > output.height) {
		y = 0
		x = 0
	}
	if (x > output.width) {
		x = 0
		y += n
	}
	x += n

	const v1 = vectXY(x4, x1, y4, y1, y, output.height)
	const v2 = vectXY(x3, x2, y3, y2, y, output.height)
    const v3 = vectXY(v2.x, v1.x, v2.y, v1.y, x, output.width)

	const color = getPixelRGB(v3.x, v3.y)
	// ctx.drawImage(img, 0, 0, cardWidth, cardHeight)

	ctx2.strokeStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'
	ctx2.strokeRect(v3.x - 0.5, v3.y - 0.5, n / 4, n / 4)

	ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
	ctx.strokeStyle = 'rgba(0, 255, 0, 1)'

	ctx.beginPath()
	ctx.arc(v1.x, v1.y, 8, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'
	ctx.strokeStyle = 'rgba(0, 255, 255, 1)'

	ctx.beginPath()
	ctx.arc(v2.x, v2.y, 8, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'
	ctx.strokeStyle = 'rgba(255, 255, 0, 1)'

	ctx.beginPath()
	ctx.arc(v3.x, v3.y, 5, 0, Math.PI * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// for (let y = 0; y < output.height; y += 1) {

	// 	for (let x = 0; x < output.width; x += 1) {
	// 		const color = getPixelRGB(v3.x, v3.y)
	// 	}
	// }
}

const interval2 = setInterval(draw2, 10)

const flatten = () => {
	ctxi2.drawImage(img, 0, 0, cardWidth, cardHeight)
	ctx.drawImage(img, 0, 0, cardWidth, cardHeight)
	ctx2.clearRect(0, 0, output.width, output.height)
	x = 0
	y = 0

	// ctx.drawImage(img, 0, 0, cardWidth, cardHeight)
	// ctx2.fillRect(0, 0, output.width, output.height)
	// const outputImgData = ctx2.createImageData(output.width, output.height)

	// for (let y = 0; y < output.height; y += 1) {
	// 	const v1 = vectXY(x4, x1, y4, y1, y, output.height)
	// 	const v2 = vectXY(x3, x2, y3, y2, y, output.height)

	// 	for (let x = 0; x < output.width; x += 1) {
	// 	    v3 = vectXY(v2.x, v1.x, v2.y, v1.y, x, output.width)
	// 		const color = getPixelRGB(v3.x, v3.y)

	// 		// const idx = ((output.width * y) + x) * 4
	// 		// outputImgData.data[idx + 0] = color[0]
	// 		// outputImgData.data[idx + 1] = color[1]
	// 		// outputImgData.data[idx + 2] = color[2]
	// 		// outputImgData.data[idx + 3] = 255


	// 		// ctx2.putImageData(outputImgData, 0, 0)
	// 	}
	// }

	// ctx2.putImageData(outputImgData, 0, 0)
}

input.addEventListener('mouseup', event => {
	controlPointGrabbed = 0

	if (controlPointMoved) {
		flatten()
	}

	event.preventDefault()
})

input.addEventListener('touchend', event => {
	controlPointGrabbed = 0

	if (controlPointMoved) {
		flatten()
	}

	event.preventDefault()
})

const draw = () => {
	ctx.clearRect(0, 0, input.width, input.height)
	// ctx.drawImage(img, 0, 0, cardWidth, cardHeight)

	drawControlPoint(x1, y1, controlPointGrabbed === 1)
	drawControlPoint(x2, y2, controlPointGrabbed === 2)
	drawControlPoint(x3, y3, controlPointGrabbed === 3)
	drawControlPoint(x4, y4, controlPointGrabbed === 4)

	ctx.lineWidth = 2
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.lineTo(x3, y3)
	ctx.lineTo(x4, y4)
	ctx.closePath()
	ctx.stroke()
}

draw()

const interval = setInterval(draw, 60)

