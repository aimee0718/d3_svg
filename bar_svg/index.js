(function () {
    let n_index = 0;
    createChart(n_index);
    const rbc = document.getElementById('chart_good');
    const rbd = document.getElementById('chart_bad');
    const inputs = document.querySelectorAll('.chart_fruit input');
    rbc.addEventListener('click', function (){
        createChart(n_index)
    });
    rbd.addEventListener('click', function (){
        createChart(n_index)
    });
    for(let i = 0; i<inputs.length; i++){
        inputs[i].setAttribute('data-index', i)
    }
    for(let i = 0; i<inputs.length; i++){
        inputs[i].onclick = function (){
            n_index = this.getAttribute('data-index')
            createChart(n_index)
        }
    }
    // const infoContainer = document.getElementById('infos');
    const fruit = ['watermelon', 'apple', 'lemon'];

    async function createChart(n_index) {
        const res = await d3.json(
            "../data/fruit.json"
        );
        // read data
        let data;
        if (rbc.checked) {
            data = res.good
        } else {
            data = res.bad
        }
        const padding = {top: 30, right: 20, bottom: 20, left: 50};
        let width = document.querySelector('.chart_chart').clientWidth;
        let height = document.querySelector('.chart_chart').clientHeight;
        const innerWidth = width - padding.left - padding.right;
        const innerHeight = height - padding.top - padding.bottom;

        d3.select(".chart_chart").select("svg").remove();

        let date = [];
        let watermelon = [];
        let apple = [];
        let lemon = [];
        const format = d3.timeParse("%d/%m/%Y");
        for (let i = 0; i < data.length; i++) {
            date.push(format(data[i].date));
            watermelon.push(data[i].watermelon);
            apple.push(data[i].apple);
            lemon.push(data[i].lemon);
        }

        const data_lists = [watermelon, apple, lemon];
        const svg = d3.select(".chart_chart").append("svg").attr("width", width).attr("height", height);
        const xScale = d3.scaleTime().domain(d3.extent(date)).range([0, innerWidth + 50]);
        const yScale = d3.scaleLinear().domain([0,
            d3.max(data_lists[n_index])]).range([innerHeight, 0]);

        const g = svg.append("g").attr("transform", `translate(${padding.left},${padding.top + -20})`);

        g.append("g").call(d3.axisLeft(yScale));
        g.append("g").call(d3.axisBottom(xScale)).attr("transform", `translate(0, ${innerHeight})`);

        d3.select(".chart_chart").select("div").remove();
        const tooltip = d3.select(".chart_chart").append("div").attr("id", "tooltip-chart");
        tooltip.append("div").attr("class", "tooltip-chart-date");
        tooltip.append("div").attr("class", "tooltip-chart-text");

        // construct svg

        const colors = ['orange', '#2f71ce', '#4daa90'];

        let bars = g.selectAll('.rect').data(data_lists[n_index]).enter().append('g');
        bars.append('rect').attr('x', function (d, i) {
            return xScale(date[i]);
        }).attr('y', function (d, i) {
            let min = yScale.domain()[0];
            return yScale(min);
        }).attr("width", innerWidth / (data.length)).attr('height', function () {
            return 0;
        }).attr('fill', colors[n_index]).attr('cursor', 'pointer').on('mouseover', function (d, i) {
            d3.select(this).attr('fill', '#dee1e6');
            tooltip.select(".tooltip-chart-date").html(`Date: ${data[i].date}`);
            tooltip.select(".tooltip-chart-text").html(`
                    ${fruit[n_index]} - ${data_lists[n_index][i]} <br />
                `);
            tooltip.style("display", "block");
        }).on('mouseout', function (d, i) {
            tooltip.style("display", "none");
            d3.select(this).attr('fill', colors[n_index]);
        }).transition().duration(100).delay(function (d, i) {
            return i * 10;
        }).attr("y", function (d, i) {
            return yScale(d);
        }).attr("height", function (d, i) {
            return innerHeight - yScale(d);
        }).attr('opacity', '.8');

    }

    createChart(n_index);
})();
