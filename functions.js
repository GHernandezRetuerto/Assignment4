csv_url = false ? "category-brands.csv" : "https://raw.githubusercontent.com/bernardo-dauria/2021-02-10-example/main/category-brands.csv";

    d3.csv(csv_url).then(tidying)

    function updateTable(d) {
        d3.select("table tbody")
            .selectAll("tr")
            .data(d)
            .join("tr")
            .selectAll("td")
            .data(e => columns.map(x => e[x]))
            .join("td")
            .text(x => x);
    }

    function makeHeader(d) {
        // remove current table
        d3.select("table thead").selectAll("tr").remove()
        // new table
        d3.select("table thead")
            .append("tr")
            .selectAll("th")
            .data(columns)
            .join("th").text(e => e)
    }

    var data, columns, maxValue;
    function tidying(d) {
        data = d;
        columns = d.columns;
        maxValue = d3.reduce(d, (p, v) => Math.max(p,v.value) , 0)
        dates = Array.from(new Set(d.map(e => e.date)));
        dateSelector(dates);
        updateSelect()
    }

    function dateSelector(d) {
        d.sort((a,b) => d3.ascending(a.date, b.date));
        htmlNode = d3.select("#dateSelector");
        htmlNode.append("label")
        .attr("for", "dates")
        .text("Choose a date: ");
        htmlNode.append("select")
        .attr("id", "dates")
        .on("change", d => updateSelect(d))
        .selectAll("option")
        .data(d).enter()
        .append("option")
        .attr("value", e => e)
        .text(e => e.slice(0,4));
    }

    function updateSelect(e) {
        val = d3.select("select").node().value
        fdata = d3.filter(data, d => d.date == val)
        updateTable(fdata)
        updateChart(fdata)
        updateChart(fdata)
    }

    function updateChart(data) {
        svg = d3.select("#Canvas");
        w = svg.node().width.baseVal.value;
        h = svg.node().height.baseVal.value;
        x = d3.scaleLinear([0, data.length], [0, w])
        y = d3.scaleLinear([0, maxValue], [0,h])
        cat = new Set(d3.map(data, d => d.category))
        color = d3.scaleOrdinal(cat, d3.schemeTableau10)

        svgBind = svg.text("")
            .selectAll("rect")
            .data(data)

        svgBind.enter()
            .append('rect')
            .attr('x', (d , i) => x(i))
            .attr('y', d => y(maxValue - d.value))
            .attr('height', d => y(d.value))
            .attr('width', x(1)*0.95)
            .attr('fill', d => color(d.category))

        svgBind.enter()
            .append("text")
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform',
                  (d , i) => 'translate(' + x(i+0.5) +
                    ',' + y(maxValue - d.value - 5000)+'),'
                    + 'rotate(-90)')
            .text(d => d.name);
    }
