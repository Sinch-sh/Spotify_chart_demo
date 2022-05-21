let mainData = {};
fetch(
    "https://raw.githubusercontent.com/NidarshN/Datasets/master/spotify_dataset/Spotify%202010%20-%202019%20Top%20100.csv",
    { method: "GET", mode: "cors" }
)
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        let dataJson = csvToSeries(text);
        return dataJson;
    })
    .then(function (dataJson) {
        let series = barCharData(dataJson);
        renderChart(series);
    })
    .then(function (data) {
        tableData();
    })
    .catch(function (error) {
        //Something went wrong
        console.log(error);
    });

function csvToSeries(text) {
    const title = "title";
    const yearReleased = "year released";
    const artist = "artist";
    const artistType = "artist type";
    const yearCount = {};

    let dataAsJson = JSC.csv2Json(text);
    let year = [];

    dataAsJson.forEach(function (row) {
        year.push({
            count: row[yearReleased],
            artistType: row[artistType],
            title: row[title],
            artist: row[artist],
        });
    });

    for (const element of year) {
        if (yearCount[element.count]) {
            yearCount[element.count].count += 1;
            element.artistType == "Solo"
                ? (yearCount[element.count].soloCount += 1)
                : (yearCount[element.count].groupCount += 1);
            yearCount[element.count].titles.push({
                title: element.title,
                artist: element.artist,
            });
        } else {
            let soloCount = 0;
            let groupCount = 0;
            let titleArr = [];
            titleArr.push({ title: element.title, artist: element.artist });
            element.artistType === "Solo"
                ? (soloCount += 1)
                : (groupCount += 1);
            yearCount[element.count] = {
                count: 1,
                soloCount: soloCount,
                groupCount: groupCount,
                titles: titleArr,
            };
        }
    }
    mainData = yearCount;
    return yearCount;
}

function barCharData(jsonData) {
    let yearData = [];
    delete jsonData[1975];
    uniqueYears = Object.keys(jsonData);
    for (key of Object.keys(jsonData)) {
        yearData.push({ x: key, y: jsonData[key].count });
    }
    return [{ name: "Year", points: yearData }];
}

function renderChart(series) {
    JSC.Chart("ChartDiv", {
        title_label_text:
            "<b>Count of Top Songs over the duration 2009 - 2021</b>",
        annotations: [
            {
                label_text: "Source: Spotify Top 100 Songs of 2010-2019",
                position: "bottom left",
            },
        ],
        legend_visible: false,
        xAxis_crosshair_enabled: true,
        defaultSeries_firstPoint_label_text: "<b>%seriesName</b>",
        defaultPoint_tooltip: "<b>%yValue</b> Songs",
        series: series,
    });
}

function tableData() {
    let rowLimit = 3;
    const ele = document.getElementById("yearInput");

    const table = document.getElementById("tableId");
    const dataTable = mainData[ele.value].titles;
    table.innerHTML = "";
    const headerRow = document.createElement("tr");
    const idHeader = document.createElement("th");
    idHeader.innerText = "Index";
    const titleHeader = document.createElement("th");
    titleHeader.innerText = "Title";
    const artistHeader = document.createElement("th");
    artistHeader.innerText = "Artist";
    headerRow.appendChild(idHeader);
    headerRow.appendChild(titleHeader);
    headerRow.appendChild(artistHeader);
    table.appendChild(headerRow);

    for (row of Object.keys(dataTable)) {
        let newRow = document.createElement("tr");
        console.log(row, dataTable[row].title, dataTable[row].artist);
        let indexCell = document.createElement("td");
        if (parseInt(row) + 1 > rowLimit) {
            break;
        }
        indexCell.innerText = parseInt(row) + 1;
        newRow.appendChild(indexCell);
        for (val in dataTable[row]) {
            let cell = document.createElement("td");
            cell.innerText = dataTable[row][val];
            console.log();
            newRow.appendChild(cell);
        }
        table.appendChild(newRow);
    }
}
