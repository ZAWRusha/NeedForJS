'use strict'

const MAX_ENEMY = 8

const currentScore = document.querySelector('.current-score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	youScoreBox = document.querySelector('.you-score-box')
console.log(start)

const audioMainTheme = document.createElement('embed') // embed - добавляем видео + аудио
// const audioMainTheme = document.createElement('audio')

audioMainTheme.src = '../sound/main_theme.mp3'
audioMainTheme.type = 'audio/mpeg'
audioMainTheme.style.cssText = `position: absolute; top: 0px;`

car.classList.add('car')

start.addEventListener('click', startGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const SETTING = {
	start: false,
	currentScore: 0,
	speed: 9,
	dodge: 5,
	traffic: 3
}

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
}

function getQuantityElements(heightElement) { //функция вычисляет, сколько объектов определенной высоты войдет на экран.
	return document.documentElement.clientHeight / heightElement + 1 //document.documentElement.clientHeight - Вычисляем высоту страницы
}
console.log(getQuantityElements(120));

function startGame() {
	start.classList.add('hide')
	gameArea.innerHTML = ''
	youScoreBox.classList.remove('hide')


	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement('div')
		line.classList.add('line')
		line.style.top = (i * 100) + 'px'
		line.y = i * 100
		gameArea.append(line)
	}

	for (let i = 0; i < getQuantityElements(157 * SETTING.traffic); i++) {
		const enemy = document.createElement('div')
		const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1
		console.log('randomEnemy: ', randomEnemy);
		enemy.classList.add('enemy')
		enemy.y = -120 * SETTING.traffic * (i + 1)
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
		enemy.style.top = enemy.y + 'px'
		enemy.style.background = `transparent url(../img/enemy${randomEnemy}.png) center / cover no-repeat`
		gameArea.append(enemy)
	}

	SETTING.currentScore = 0
	SETTING.start = true
	gameArea.append(car)
	car.style.left = (gameArea.offsetWidth - car.offsetWidth) / 2;
	car.style.top = "auto";
	car.style.bottom = "10px";
	// document.body.append(audioMainTheme) //Добавляем видео и аудио на страницу
	SETTING.x = car.offsetLeft //offsetLeft - начальное значение автомобиля - берется из стиля css, класса .car
	SETTING.y = car.offsetTop //offsetTop - начальное значение автомобиля - берется из стиля css, класса .car
	requestAnimationFrame(playGame)
}

function playGame() {
	if (SETTING.start) {
		currentScore.innerHTML = `${SETTING.currentScore}`

		moveRoad()
		moveEnemy()

		if (keys.ArrowLeft && SETTING.x > 0) {
			SETTING.x -= SETTING.dodge
		}
		if (keys.ArrowRight && SETTING.x < gameArea.offsetWidth - car.offsetWidth) {
			SETTING.x += SETTING.dodge
		}
		if (keys.ArrowUp && SETTING.y > 0) {
			SETTING.y -= SETTING.speed
		}
		if (keys.ArrowDown && SETTING.y < gameArea.offsetHeight - car.offsetHeight) {
			SETTING.y += SETTING.speed
		}

		car.style.left = SETTING.x + 'px'
		car.style.top = SETTING.y + 'px'
		requestAnimationFrame(playGame) // Recursion - the function starts itself
	}
}

function startRun(event) {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault()
		keys[event.key] = true
	}
}

function stopRun(event) {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault()
		keys[event.key] = false
	}
}

function moveRoad() {
	let lines = document.querySelectorAll('.line')
	lines.forEach(function(line) {
		line.y += SETTING.speed
		line.style.top = line.y + 'px'

		if (line.y >= document.documentElement.clientHeight) { // document.documentElement.clientHeight - Получаем высоту страницы
			line.y = -100
		}
	})
}

function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy')
	enemy.forEach(function(item) {
		let carRect = car.getBoundingClientRect() // getBoundingClientRect - определяем координаты объекта (car - игрок) top, bottom, left, right x, y
		let enemyRect = item.getBoundingClientRect() // getBoundingClientRect - определяем координаты объекта(item - enemy) top, bottom, left, right x, y

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
			SETTING.start = false
			console.warn('ДТП')
			start.classList.remove('hide')

		}

		item.y += SETTING.speed / 1.5
		item.style.top = item.y + 'px'

		if (item.y >= document.documentElement.clientHeight) { // document.documentElement.clientHeight - Получаем высоту страницы
			item.y = -157 * SETTING.traffic
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 52.5)) + 'px'
			let newRandomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1

			if (SETTING.speed == 9) {
				SETTING.currentScore += 1
			}
			if (SETTING.speed == 12) {
				SETTING.currentScore += 2
			}
			if (SETTING.speed == 15) {
				SETTING.currentScore += 3
			}
			item.style.background = `transparent url(../img/enemy${newRandomEnemy}.png) center / cover no-repeat`
		}
	})
}