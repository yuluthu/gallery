var YUL = {
    _areaConversions: {
        SQFT: {
            SQFT: 1,
            SQM: 0.092903,
            acres: 0.000022957
        },
        SQM: {
            SQM: 1,
            SQFT: 10.76391,
            acres: 0.000247105
        },
        acres: {
            acres: 1,
            SQFT: 43560,
            SQM: 4046.86
        }
    },
    _konamiFunctions: [],
    _konami: () => {
        var konamikeys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
            started = false,
            count = 0;

        $(document).keydown((e) => {
            var reset = () => {
                started = false;
                count = 0;
                return;
            };

            key = e.keyCode;

            // Begin watching if first key in sequence was pressed.
            if (!started) {
                if (key == 38) {
                    started = true;
                }
            }

            // If we've started, pay attention to key presses, looking for right sequence.
            if (started) {

                if (konamikeys[count] == key) {
                    count++;
                } else {
                    // Incorrect key, restart.
                    reset();
                }
                if (count == 10) {
                    // Success!
                    YUL._konamiFunctions.forEach((f) => {
                        f.call()
                    })
                    reset();
                }
            } else {
                reset();
            }
        });
    },
    _tables: {},
    _charts: {},
    _numberWithCommas: (x) => {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },
    _id: () => {
        var parts = [];
        var possible = '0123456789ABCDEF';
        for (var i = 8; i--;) parts.push(possible.charAt(Math.floor(Math.random() * 16)));
        return parts.join('');
    },
    _randCol: () => {
        var string = '';

        var r = Math.ceil(Math.random() * 255);
        var g = Math.ceil(Math.random() * 255);
        var b = Math.ceil(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ', 0.4)';
    },
    CreateChart: ($container, settings) => {
        if (settings.chartType === undefined) {
            settings.chartType = 'horizontalBar'
        }

        if (settings.data === undefined) {
            console.error('No data sent to chart!')
        }

        // Required: Import chart.js. URL:
        // 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.js',
        var action = $container.attr('data-action');
        var colour = YUL._randCol()
        var labels = [];
        var labelMap = [];
        var datasets = [];
        if (Object.prototype.toString.call(settings.data) === '[object Array]') {
            datasets.push({
                label: settingsLabel,
                backgroundColor: colour,
                borderColor: colour,
                data: [],
                fill: true,
            });
            settings.data.forEach((v) => {
                labels.push(v[settings.labelColumn]);
                datasets[0].data.push(v[settings.valueColumn]);
            });
        } else {
            var datasets = []
            Object.keys(settings.data).forEach((key) => {
                var source = settings.data[key];
                source.data.forEach((d) => {
                    var found = false
                    labelMap.forEach((v) => {
                        if (v.id == d[settings.labelId]) {
                            found = true;
                        }
                    });
                    if (!found) {
                        labelMap.push({ id: d[settings.labelId], label: d[settings.labelColumn] });
                    }
                })
            });

            labelMap.forEach((v) => {
                labels.push(v.label);
            });

            Object.keys(settings.data).forEach((key)  =>{
                var source = settings.data[key];
                var sourceData = [];
                var colour = YUL._randCol();
                labelMap.forEach((label) => {
                    var found = false;
                    source.data.forEach((data) => {
                        if (data[settings.labelId] == label.id) {
                            sourceData.push(data[settings.valueColumn]);
                            found = true;
                        }
                    })
                    if (!found) {
                        sourceData.push(0);
                    }
                })
                datasets.push({
                    label: source.label,
                    backgroundColor: colour,
                    borderColor: colour,
                    data: sourceData,
                    fill: true,
                })
            })
        }




        var config = {
            type: settings.chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: settings.labels.chart
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: settings.labels.x
                        },
                        ticks: {
                            beginAtZero: true,
                            stepSize: settings.stepSize ? settings.stepSize : 1
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: settings.labels.y
                        },
                    }]
                }
            }
        };
        config.options.tooltips.callbacks = {
            footer: (tooltipItem, data) => {
                var total = 0;
                datasets.forEach((row) => {
                    total += row.data[tooltipItem[0].index] >> 0
                })
                return 'Total: ' + (total + '')
            }
        }
        var context = $container[0].getContext('2d');
        var createdChart = new Chart(context, config);
        YUL._charts[name] = createdChart;
        return createdChart;
    },
    NewAjax: async (url, data, callback) => {
        if (data === undefined) {
            data = {};
        }
        if (Object.keys(data) && data.paramOrder == undefined) {
            var keys = Object.keys(data);
            data.paramOrder = Object.keys(data);
        }
        const request = await fetch('/' + url, {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(response => {
            if (typeof callback === 'function') {
                callback(response)
            }
            return response
        })
        return request;
    },
    Ajax: (url, data, callback, displayAlert, errorCallback) => {
        jQuery.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            success: (response) => {
                if (response instanceof Object) {
                    if (response.error) {
                        if (displayAlert) {
                            window.alert('An error occurred: ' + response.errorMsg);
                        }
                        if (typeof errorCallback === 'function') {
                            errorCallback.call(HAC, response);
                        }
                        throw new Error('Server responded with an error: ' + response.errorMsg);
                    } else if (typeof callback === 'function') {
                        callback.call(HAC, response);
                    }
                } else {
                    if (displayAlert) {
                        window.alert('The server sent back an invalid response.');
                    }
                    throw new Error('Response is not JSON');
                }
            },
            error: (response) => {
                if (response instanceof Object) {
                    if (response.error) {
                        if (displayAlert) {
                            window.alert('An error occurred: ' + response.errorMsg);
                        }
                        if (typeof errorCallback === 'function') {
                            errorCallback.call(HAC, response);
                        }
                    } else if (typeof callback === 'function') {
                        callback.call(HAC, response);
                    }
                } else {
                    if (displayAlert) {
                        window.alert('The server sent back an invalid response.');
                    }
                    throw new Error('Response is not JSON');
                }
            }
        });
        return true;
    },
    Format: (value, precision, currency, noSymbol) => {
        if (noSymbol == undefined) {
            noSymbol = false;
        }
        value = parseFloat(value);
        value = isNaN(value) ? 0 : value;
        value = value.toFixed(precision >> 0);
        value = YUL._numberWithCommas(value);

        var symbol = '';
        var afterSymbol = '';
        if (currency && noSymbol == false) {
            symbol = PACS._symbolTable[currency];
            if (!symbol) {
                symbol = '?';
                console.warn('No symbol for currency "' + currency + '"');
            }
        }
        if (noSymbol == true) {
            afterSymbol = ' (<span class="currencyRefContainer">' + currency + '</span>)';
        }

        return symbol + value + afterSymbol;
    },
    ParseFloat: function(value) {
        value = parseFloat(value);
        return isNaN(value) ? 0 : value;
    },
    ParseInt: function(value) {
        value = parseInt(value);
        return isNaN(value) ? 0 : value;
    },
    ResizeTables: () => {
        Object.keys(YUL._tables).forEach((key) => {
            YUL._tables[key].dataTable.columns.adjust();
        });
    },
    CreateTable(settings) {
        if (typeof settings !== 'object') {
            throw new Error('Settings is not an object');
        }

        if (settings.columns === undefined) {
            throw new Error('No columns defined')
        }
        if (settings.$selector.length === 0 || !settings.$selector.is('table')) {
            throw new Error('Could not locate table')
        }
    },
    AddKonami: (callback) => {
        //konamo codes need testing
        YUL._konamiFunctions.push(callback);
    },
    Typeahead: {
        // typeahead code here
    },
    Fields: {},
    LogError: (error) => {
        // How would we want to log an error?
        // Ideally we're saving some JSON to the server or something to log the error and all the request params and stuff but idk
    },
    toClipboard: ($element) => {
        if (!$element.length) {
            return false;
        }

        $element[0].select();
        $element[0].setSelectionRange(0, 1000000);
        document.execCommand('copy');

        console.log('Copied ' + $element.val() + ' to clipboard');
    },
    Debounce: (func) => {
        var wait = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
        return () => {
            var _this = this;
            var args = [];
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }


            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                func.apply(_this, args);
            }, wait);
        };
    },
    LoadTooltips: () => {
        $('[data-toggle="tooltip"]').each(() => {
            var $this = $(this);
            var $title = $this.find('title');
            console.log($this);
            if (!$this.attr('data-title')) {
                $this.attr('data-title', $title.text());
                $title.remove();
            }
            console.log($this, $this.attr('data-title'));
        })
        if ($('[data-toggle="tooltip"]').length) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    },
}

$(document).ready(() => {
    setTimeout(() => {
        YUL.LoadTooltips();
    }, 1)

    setTimeout(() => {
        YUL.LoadTooltips();
    }, 300)
    YUL._konami();
});