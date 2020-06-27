function initChart(ctx, n, dataSet){
    var precision = 1;
    var dataLabel = new Array();
    for(let i=0;i<n;i++){
        dataLabel.push(i);
    }

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataLabel,
            datasets: [{
                label: "Evolution du porte-feuille",
                backgroundColor: 'green',
                borderColor: 'darkgreen',
                data: dataSet,
                steppedLine: true,
            }]
        },
        options: {
            title: {
                text: "Profit après "+n+" tirage(s) sur "+precision+" essai(s)"
            },
            elements: {
                point: {
                    radius: 0,
                    //bagroundColor: 'red'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    return chart;
}

function resetChart(){
    var chart = new Chart();

    return chart;
}