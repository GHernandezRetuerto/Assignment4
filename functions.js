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
        d3.select("table thead").selectAll("tr").remove()

        d3.select("table thead")
            .append("tr")
            .selectAll("th")
            .data(columns)
            .join("th").text(e => e)
    }

    var data, columns;
    function tidying(d) {
        data = d;
        columns = d.columns;

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
    }