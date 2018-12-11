let width = 800
let height = 600

let tooltip = d3.select('#tooltip')

let offset = {
	'top': -7,
	'left': 20,
}

let margins = {
	'top' : 10,
	'right' : 10,
	'bottom' : 50,
	'left' : 40,
}

let xScale = d3.scalePow()
	.domain([0,85000])
	.range([0,width-margins.left-margins.right])
	.exponent(.5)

let yScale = d3.scaleLinear()
	.domain([100,30])
	.range([0,height-margins.top-margins.bottom])

let rScale = d3.scaleSqrt()
	.domain([0,10000])
	.range([1,10])
	.exponent(0.1)

let colorScale = d3.scaleOrdinal ()
	.domain(['Europe','Asia','Africa','NorthAmerica','SouthAmerica','CentralAmerica','Oceania'])
	.range(['blue','red','green','pink','yellow','purple','gray'])

let svg = d3.select('#chart-2').append('svg')
	.attr('width',width)
	.attr('height',height)

let inner = svg.append('g')
	.attr('transform','translate('+margins.left+','+margins.top+')')

let axisShell = inner.append('g')
let labelShell = inner.append('g')

let xAxis = d3.axisBottom(xScale)
	.tickSize(-height+margins.top+margins.bottom)

let yAxis = d3.axisLeft()
	.scale(yScale)
	.tickSize(-width+margins.left+margins.right)
	
axisShell.append('g').call(yAxis)

axisShell.append('g')
	.attr('transform',`translate(0,${height-margins.top-margins.bottom})`)
	.call(xAxis)

labelShell.append('text')
	.attr('x', xScale(20000))
	.attr('y', height-margins.top-margins.bottom + 40 )
	.text('⬳ GDP per capita ⟿')
	.attr('class', 'axis-label')

labelShell.append('text')
	.attr('x', -25)
	.attr('y', yScale(65) )
	.attr('transform','rotate(-90 -25 '+yScale(65)+')')
	.text('⬳ Human development index ⟿')
	.attr('class', 'axis-label')

let marks = inner.append('g')

d3.csv('Data.csv').then((data) => {
	// console.log(data)

	marks.selectAll('circle')
		.data(data)
		.enter().append('circle')
		.attr('r', (d) => {
			return rScale(d.Displaced)
		})
		.attr('cx', (d) => {
			console.log(d)
			return xScale(d.GDPperCapita)
		})
		.attr('cy', (d) => {
			console.log(d) 
			return yScale(d.HumanDevelopmentIndex)
		})
		.attr('fill', (d) => {
			return colorScale(d.Continent)
		})
		.attr('fill-opacity',0.5)
		.attr('class','mark')
		.on('mouseover',(d)=> {
			let left = d3.event.pageX + offset.left
			let top = d3.event.pageY + offset.top

			console.log(d)

			let html = d['Country Name']+'<br/>'+d['Displaced']+' people'

			tooltip.html(html)
				.style('left',left + 'px')
				.style('top',top + 'px')
				.style('display','block')

		})
		.on('mouseleave',(d) => {
			tooltip.html('')
				.style('display','none')
		})
})


