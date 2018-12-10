let width = 1000
let height = 1000

let tooltip = d3.select('#tooltip')

let offset = {
	'top': -7,
	'left': 20,
}

let margins = {
	'top' : 40,
	'right' : 40,
	'bottom' : 80,
	'left' : 80,
}

let xScale = d3.scaleLinear()
	.domain([-10000,85000])
	.range([0,width-margins.left-margins.right])

let yScale = d3.scaleLinear()
	.domain([100,-20])
	.range([0,height-margins.top-margins.bottom])

let rScale = d3.scaleSqrt()
	.domain([0,10000])
	.range([1,10])
	.exponent(0.1)

let colorScale = d3.scaleOrdinal ()
	.domain(['Europe','Asia','Africa','NorthAmerica','SouthAmerica','CentralAmerica','Oceania'])
	.range(['blue','red','green','pink','yellow','purple','gray'])

let svg = d3.select('#chart').append('svg')
	.attr('width',width)
	.attr('height',height)

let inner = svg.append('g')
	.attr('transform','translate('+margins.left+','+margins.top+')')

let axisShell = inner.append('g')

let xAxis = d3.axisBottom(xScale)
	.tickSize(-height+margins.top+margins.bottom)

let yAxis = d3.axisLeft()
	.scale(yScale)
	.tickSize(-width+margins.left+margins.right)
	
axisShell.append('g').call(yAxis)

axisShell.append('g')
	.attr('transform',`translate(0,${height-margins.top-margins.bottom})`)
	.call(xAxis)

let marks = inner.append('g')

d3.csv('data.csv').then((data) => {
	console.log(data)

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

			let html = '${d.Country}<br/>${d.Displaced} people'

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


