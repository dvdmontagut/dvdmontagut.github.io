function crearGrafica(d) {
    // código que se ejecuta cuando se pulsa un botón
    console.log(d);

    var datosGrafico = [
        { atributo: "HP", valor: d.HP },
        { atributo: "Atk", valor: d.Attack },
        { atributo: "Def", valor: d.Defense },
        { atributo: "Sp.Atk", valor: d["Sp. Atk"] },
        { atributo: "Sp.Def", valor: d["Sp. Def"] },
        { atributo: "Spe", valor: d.Speed }
    ];

    var width = 500;
    var height = 300;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};


    var canvas = d3.select("#canvas");

    var card = canvas.append("div")
        .attr("class", "card my-2");

    var cardHeader = card.append("div")
        .attr("class", "card-header")
        .append("div")
        .attr("class", "container")
        .append("div")
        .attr("class", "row");

    let nombre;
    if(d.Form){
        nombre = d.Name + " ("+d.Form + ")";
    }else{
        nombre = d.Name;
    }

    let link = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/" + d.ID.toString().padStart(4, '0') + "/Normal.png";


    cardHeader.append("div")
        .attr("class", "col")
        .append("img")
        .attr("src", function (d) {
            return link;
        })
        .attr("alt", "?");

    cardHeader.append("div")
        .attr("class", "col")
        .append("p")
        .attr("class", "fs-3")
        .text(nombre);

    cardHeader.append("div")
        .attr("class", "col text-end")
        .append("button")
        .attr("class", "btn-close justify-content-end")
        .on("click",function(){
            card.remove();
        });

    var cardBody = card.append("div")
        .attr("class", "card-body");

    var svg = cardBody.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(datosGrafico.map(function(d) { return d.atributo; }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(datosGrafico, function(d) { return d.valor; })]);


    var colores = d3.scaleLinear()
        .domain([0, 50, 80, 100,300])
        .range(["red","red", "yellow", "green","green"]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));


    svg.selectAll(".barra")
        .data(datosGrafico)
        .enter().append("rect")
        .attr("class", "barra")
        .attr("x", function(d) { return x(d.atributo); })
        .attr("y", function(d) { return y(0); })
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(2000)
        .attr("height", function(d) { return y(0) - y(d.valor); })
        .attr("y", function(d) { return y(d.valor); })
        .attr("fill", function(d) { return colores(d.valor); });


    svg.selectAll(".valor")
        .data(datosGrafico)
        .enter().append("text")
        .attr("class", "valor")
        .attr("x", function(d) { return x(d.atributo) + x.bandwidth() / 2; })
        .attr("y", function(d) { return y(d.valor) - 5; })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(function(d) { return d.valor; })
        .transition()
        .duration(2000)
        .delay(2000);


    var cardFooter = card.append("div")
        .attr("class", "card-footer")
        .append("p")
        .attr("class","fs-3")
        .text("Total:"+d.Total);


}

function listado(datosFiltrados){
    const botones = d3.select("#listado")
        .selectAll("button")
        .data(datosFiltrados, function (d) {
            return d.ID;
        });

    // Agregar los nuevos botones si es necesario
    const nuevoBoton = botones.enter()
        .append("button")
        .attr("class", "list-group-item");

    nuevoBoton.append("div")
        .attr("class", "row")
        .append("div")
        .attr("class", "col")
        .append("img")
        .attr("src", function (d) {
            return "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/" + d.ID.toString().padStart(4, '0') + "/Normal.png";
        })
        .attr("alt", "?");

    nuevoBoton.select(".row")
        .append("div")
        .attr("class", "col fs-5")
        .append("p")
        .text(function (d) {
            if (d.Form) {
                return d.Name + " (" + d.Form + ")";
            } else {
                return d.Name;
            }
        }).on("click", function(e,d){
        crearGrafica(d);
    });


    // Eliminar los botones que ya no se necesitan
    botones.exit().remove();
}