// ---LINES---//

function populateLinePanels(attributes) {

	// ---LINE FIXED COLOR---//

	var lineFixedColorSelect = document.getElementById("lineFixedColor");
	var scale = alternatingColorScale().domain(fixedColors).range(fixedColors);

	for (var i = 0; i < fixedColors.length; i++) {

		option = fixedColors[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		lineFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	lineFixedColorSelect.selectedIndex = lineDefaultColorIndex;

	colorlegend("#lineFixedColorLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// line fixed color listener
	d3
			.select(lineFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = lineFixedColorSelect.options[lineFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						linesLayer.selectAll(".line") //
						.transition() //
						.ease("linear") //
						.attr("stroke", color);

					});

	// ---LINE COLOR ATTRIBUTE---//

	// start color
	$('.lineStartColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				displayColorCode : true,
				colors : pairedSimpleColors,

				onSelect : function(hex, element) {

					lineStartColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}

			});
	$('.lineStartColor').setColor(lineStartColor);

	// end color
	$('.lineEndColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				colors : pairedSimpleColors,
				displayColorCode : true,
				onSelect : function(hex, element) {

					lineEndColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}
			});
	$('.lineEndColor').setColor(lineEndColor);

	// attribute
	lineColorAttributeSelect = document.getElementById("lineColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		lineColorAttributeSelect.appendChild(element);

	}// END: i loop

	// line color attribute listener
	d3
			.select(lineColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = lineColorAttributeSelect.options[lineColorAttributeSelect.selectedIndex].text;
						var attribute = getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#lineColorLegend').html('');

						if (attribute.scale == ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.category20().domain(data);

							colorlegend("#lineColorLegend", scale, "ordinal", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						} else {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ lineStartColor, lineEndColor ]);

							colorlegend("#lineColorLegend", scale, "linear", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						}

						linesLayer.selectAll(".line") //
						.transition() //
						.ease("linear") //
						.attr("stroke", function() {

							var line = d3.select(this);
							var attributeValue = line.attr(colorAttribute);
							var color = scale(attributeValue);

							return (color);
						});

					});

	// ---LINE CURVATURE---//

	var maxCurvatureSlider = d3.slider().axis(d3.svg.axis().orient("top")).min(
			0.0).max(1.0).step(0.1).value(MAX_BEND);
	d3.select('#maxCurvatureSlider').call(maxCurvatureSlider);

	// line curvature listener
	maxCurvatureSlider.on("slide", function(evt, value) {

		MAX_BEND = value;
		var scale = d3.scale.linear().domain(
				[ sliderStartValue, sliderEndValue ]).range(
				[ MIN_BEND, MAX_BEND ]);

		linesLayer.selectAll(".line").transition().ease("linear") //
		.attr(
				"d",
				function(d) {

					var line = d;

					var curvature = scale(Date.parse(line.startTime));

					var westofsource = line.westofsource;
					var targetX = line.targetX;
					var targetY = line.targetY;
					var sourceX = line.sourceX;
					var sourceY = line.sourceY;

					var dx = targetX - sourceX;
					var dy = targetY - sourceY;
					var dr = Math.sqrt(dx * dx + dy * dy) * curvature;

					var bearing;
					if (westofsource) {
						bearing = "M" + targetX + "," + targetY + "A" + dr
								+ "," + dr + " 0 0,1 " + sourceX + ","
								+ sourceY;

					} else {

						bearing = "M" + sourceX + "," + sourceY + "A" + dr
								+ "," + dr + " 0 0,1 " + targetX + ","
								+ targetY;

					}

					return (bearing);

				}) //
		.attr("stroke-dasharray", function(d) {

			var totalLength = d3.select(this).node().getTotalLength();
			return (totalLength + " " + totalLength);

		});

	});

	// ---LINE WIDTH---//

	// TODO
	var lineWidthSlider = d3.slider().axis(d3.svg.axis().orient("top"))
			.min(0.5).max(5.0).step(0.5).value(lineWidth);

	d3.select('#lineWidthSlider').call(lineWidthSlider);

	// line width listener
	lineWidthSlider.on("slide", function(evt, value) {

		lineWidth = value;

		linesLayer.selectAll(".line").transition().ease("linear") //
		.attr("stroke-width", lineWidth + "px");

	});

}// END: populateLinePanels

// ---POINTS---//

function populatePointPanels(attributes) {

	// ---POINT FIXED COLOR---//

	var pointFixedColorSelect = document.getElementById("pointFixedColor");
	var scale = alternatingColorScale().domain(fixedColors).range(fixedColors);

	for (var i = 0; i < fixedColors.length; i++) {

		option = fixedColors[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	pointFixedColorSelect.selectedIndex = pointDefaultColorIndex;

	colorlegend("#pointFixedColorLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// point fixed color listener
	d3
			.select(pointFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = pointFixedColorSelect.options[pointFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						pointsLayer.selectAll(".point") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

					});

	// ---POINT COLOR ATTRIBUTE---//

	// start color
	$('.pointStartColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				displayColorCode : true,
				colors : pairedSimpleColors,

				onSelect : function(hex, element) {

					pointStartColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}

			});
	$('.pointStartColor').setColor(pointStartColor);

	// end color
	$('.pointEndColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				colors : pairedSimpleColors,
				displayColorCode : true,
				onSelect : function(hex, element) {

					pointEndColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}
			});
	$('.pointEndColor').setColor(pointEndColor);

	// attribute
	pointColorAttributeSelect = document.getElementById("pointColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		// skip points with count attribute
		if (option == COUNT) {
			continue;
		}

		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointColorAttributeSelect.appendChild(element);

	}// END: i loop

	// point color attribute listener
	d3
			.select(pointColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = pointColorAttributeSelect.options[pointColorAttributeSelect.selectedIndex].text;

						var attribute = getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#pointColorLegend').html('');

						if (attribute.scale == ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.category20().domain(data);

							colorlegend("#pointColorLegend", scale, "ordinal",
									{
										title : "",
										boxHeight : 20,
										boxWidth : 6,
										vertical : true
									});

						} else {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ pointStartColor, pointEndColor ]);

							colorlegend("#pointColorLegend", scale, "linear", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						}

						pointsLayer.selectAll(".point").transition() //
						.ease("linear") //
						.attr("fill", function() {

							var point = d3.select(this);
							var attributeValue = point.attr(colorAttribute);
							var color = scale(attributeValue);

							return (color);
						});

					});

	// ---AREA---//

	pointAreaSelect = document.getElementById("pointarea");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		// skip points with count attribute
		if (option == COUNT) {
			continue;
		}

		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointAreaSelect.appendChild(element);

	}// END: i loop

	// point area listener
	d3
			.select(pointAreaSelect)
			.on(
					'change',
					function() {

						var min_area = 10;
						var max_area = 100;

						var areaAttribute = pointAreaSelect.options[pointAreaSelect.selectedIndex].text;

						var scale;
						var attribute = getObject(attributes, "id",
								areaAttribute);
						if (attribute.scale == ORDINAL) {

							scale = d3.scale.category20().domain(
									attribute.domain);

						} else {

							scale = d3.scale.linear().domain(attribute.range)
									.range([ min_area, max_area ]);

						}

						pointsLayer.selectAll(".point") //
						.transition() //
						.ease("linear") //
						.attr("r", function(d) {

							var attributeValue = d.attributes[areaAttribute];

							// TODO: the null's (for the lulz :) )
							var area = scale(attributeValue);
							var radius = Math.sqrt(area / Math.PI);

							return (radius);
						});
					});

}// END: populatePointPanels

// ---AREAS---//

function populateAreaPanels(attributes) {

	// ---AREA FIXED COLOR---//

	var areaFixedColorSelect = document.getElementById("areaFixedColor");
	var scale = alternatingColorScale().domain(fixedColors).range(fixedColors);

	for (var i = 0; i < fixedColors.length; i++) {

		option = fixedColors[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		areaFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	areaFixedColorSelect.selectedIndex = areaDefaultColorIndex;

	colorlegend("#areaFixedColorLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// area fixed color listener
	d3
			.select(areaFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = areaFixedColorSelect.options[areaFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						areasLayer.selectAll(".area") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

					});

	// ---AREA COLOR ATTRIBUTE---//

	// start color
	$('.areaStartColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				displayColorCode : true,
				colors : pairedSimpleColors,

				onSelect : function(hex, element) {

					areaStartColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}

			});
	$('.areaStartColor').setColor(areaStartColor);

	// end color
	$('.areaEndColor').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				colors : pairedSimpleColors,
				displayColorCode : true,
				onSelect : function(hex, element) {

					areaEndColor = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}
			});
	$('.areaEndColor').setColor(areaEndColor);

	// attribute
	areaColorAttributeSelect = document.getElementById("areaColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		// skip points with count attribute
		if (option == COUNT) {
			continue;
		}

		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		areaColorAttributeSelect.appendChild(element);

	}// END: i loop

	// area color listener
	d3
			.select(areaColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = areaColorAttributeSelect.options[areaColorAttributeSelect.selectedIndex].text;

						var attribute = getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#areaColorLegend').html('');

						if (attribute.scale == ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.category20().domain(data);

							colorlegend("#areaColorLegend", scale, "ordinal", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						} else {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ areaStartColor, areaEndColor ]);

							colorlegend("#areaColorLegend", scale, "linear", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						}

						areasLayer.selectAll(".area").transition() //
						.ease("linear") //
						.attr("fill", function() {

							var area = d3.select(this);
							var attributeValue = area.attr(colorAttribute);
							var color = scale(attributeValue);

							return (color);
						});

					});

}// END: populateAreaPanels

// ---MAP---//

function populateMapBackground() {

	// --- MAP BACKGROUND---//

	mapBackgroundSelect = document.getElementById("mapbackground");

	var domain = [ "white", "black", "grey", "light blue" ];
	var scale = alternatingColorScale().domain(domain).range(
			[ "#ffffff", "#000000", "#ddd", "#8cc5ff" ]);

	for (var i = 0; i < domain.length; i++) {

		option = domain[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapBackgroundSelect.appendChild(element);

	}// END: i loop

	colorlegend("#mapBackgroundLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// map background listener
	d3
			.select(mapBackgroundSelect)
			.on(
					'change',
					function() {

						var colorSelect = mapBackgroundSelect.options[mapBackgroundSelect.selectedIndex].text;
						var color = scale(colorSelect);
						d3.select('#container').style("background", color);

					});

}// END: populateMapBackground

function populateMapPanels(attributes) {

	populateMapBackground();

	// --- MAP FIXED FILL---//

	var mapFixedFillSelect = document.getElementById("mapFixedFill");
	var scale = alternatingColorScale().domain(fixedColors).range(fixedColors);

	for (var i = 0; i < fixedColors.length; i++) {

		option = fixedColors[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapFixedFill.appendChild(element);

	}// END: i loop

	// select the default
	mapFixedFillSelect.selectedIndex = mapDefaultColorIndex;

	colorlegend("#mapFixedFillLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// line fixed color listener
	d3
			.select(mapFixedFillSelect)
			.on(
					'change',
					function() {

						var colorSelect = mapFixedFillSelect.options[mapFixedFillSelect.selectedIndex].text;
						var color = scale(colorSelect);

						d3.selectAll(".topo") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

					});

	// ---MAP FILL ATTRIBUTE---//

	// start color
	$('.mapStartFill').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				displayColorCode : true,
				colors : pairedSimpleColors,

				onSelect : function(hex, element) {

					mapStartFill = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}

			});
	$('.mapStartFill').setColor(mapStartFill);

	// end color
	$('.mapEndFill').simpleColor(
			{
				cellWidth : 13,
				cellHeight : 13,
				columns : 4,
				colors : pairedSimpleColors,
				displayColorCode : true,
				onSelect : function(hex, element) {

					mapEndFill = "#" + hex;
					console.log(hex + " selected" + " for input "
							+ element.attr('class'));
				}
			});
	$('.mapEndFill').setColor(mapEndFill);

	// attribute
	mapFillAttributeSelect = document.getElementById("mapFillAttribute");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapFillAttributeSelect.appendChild(element);

	}// END: i loop

	// map color listener
	d3
			.select(mapFillAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = mapFillAttributeSelect.options[mapFillAttributeSelect.selectedIndex].text;

						var attribute = getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#mapFillLegend').html('');

						if (attribute.scale == ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.category20().domain(data);

							colorlegend("#mapFillLegend", scale, "ordinal", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						} else {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ mapStartFill, mapEndFill ]);

							colorlegend("#mapFillLegend", scale, "linear", {
								title : "",
								boxHeight : 20,
								boxWidth : 6,
								vertical : true
							});

						}

						d3.selectAll(".topo") //
						.transition() //
						.ease("linear") //
						.attr("fill", function() {

							var topo = d3.select(this);
							var attributeValue = topo.attr(colorAttribute);
							var color = scale(attributeValue);

							return (color);
						});

					});

}// END: populateMapPanels

function populateExportPanel() {

	saveSVGButton = document.getElementById("saveSVG");
	d3
			.select(saveSVGButton)
			.on(
					'click',
					function() {

						var tmp = document.getElementById("container");
						var svg = tmp.getElementsByTagName("svg")[0];

						// Extract the data as SVG text string
						var svg_xml = (new XMLSerializer)
								.serializeToString(svg);

						window.open().document.write(svg_xml);

						var html = d3.select("svg").attr("title", "test2")
								.attr("version", 1.1).attr("xmlns",
										"http://www.w3.org/2000/svg").node().parentNode.innerHTML;

						d3
								.select("body")
								.append("div")
								.attr("id", "download")
								// .style("top", event.clientY+20+"px")
								// .style("left", event.clientX+"px")
								.html(
										"Right-click on this preview and choose Save as<br />Left-Click to dismiss<br />")
								.append("img").attr(
										"src",
										"data:image/svg+xml;base64,"
												+ btoa(html));

						d3.select("#download").on(
								"click",
								function() {
									if (event.button == 0) {
										d3.select(this).transition().style(
												"opacity", 0).remove();
									}
								}).transition().duration(500).style("opacity",
								1);

						// var form = document.getElementById("svgform");
						//						
						// form['output_format'].value = "svg";
						// form['data'].value = svg_xml ;
						// form.submit();

					});

}// END: populateExportPanel

function populateLocationPanels() {

	// --- LABEL COLOR---//

	labelColorSelect = document.getElementById("labelcolor");

	var domain = [ "black", "white" ];
	var scale = alternatingColorScale().domain(domain).range(
			[ "#000000", "#ffffff" ]);

	for (var i = 0; i < domain.length; i++) {

		option = domain[i];
		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		labelColorSelect.appendChild(element);

	}// END: i loop

	colorlegend("#labelColorLegend", scale, "ordinal", {
		title : "",
		boxHeight : 20,
		boxWidth : 6,
		vertical : true
	});

	// label color listener
	d3
			.select(labelColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = labelColorSelect.options[labelColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						d3.selectAll(".label") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

					});

}// END: populateLabelPanels

