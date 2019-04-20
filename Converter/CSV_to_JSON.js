function CSVtoJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var row = lines[i],
            queryIdx = 0,
            startValueIdx = 0,
            idx = 0;
        if (row.trim() === '') { continue; }
        while (idx < row.length) {
            /* if we meet a double quote we skip until the next one */
            var c = row[idx];
            if (c === '"') {
                do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
            }
            if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
                let length = idx - startValueIdx;
                if (idx === row.length - 1) {
                    length++;
                }
                /* we've got a value */
                var value = row.substr(startValueIdx, length).trim();
                /* skip first double quote */
                if (value[0] === '"') { value = value.substr(1); }
                /* skip last comma */
                if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
                /* skip last double quote */
                if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }
                var key = headers[queryIdx++];
                obj[key] = value;
                startValueIdx = idx + 1;
            }
            ++idx;
        }
        result.push(obj);
    }
    return result;
}

// Method: Red CSV File
function ReadCSVFile(path, callback) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr);
                }
            }
        };
        xhr.open("GET", path);
        xhr.send();
    });
}

// Action: Read CSV File
ReadCSVFile("sample.csv")
    .then(function (fileData) {
        console.log(fileData);
        console.log(CSVtoJSON(fileData));
    })
    .catch(function (xhr) {
        console.log(xhr.message);
    });
