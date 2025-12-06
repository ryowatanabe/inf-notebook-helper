// 「最近」として表示する履歴の範囲 (単位:時間)
const timeWindow = 12;

// 更新のあるリザルトのみに表示を絞るか
const showUpdatedOnly = true;

function loadJson() {
    var getjson = $.ajax({
        url: '../records/recent.json',
        type: 'GET',
        dataType: 'json',
        cache: false
    });

    getjson.done(function(json){
        var out = "<div class='header'>Music</div><div class='header'>Lamp</div><div class='header'>Score</div><div class='header'>BP</div>";
        var timestamps = json["timestamps"];

        // 履歴の足切り日時の文字列を yyyymmdd-hhmmss 形式で取得
        var now = new Date();
        var threshold = new Date(now.getTime() - timeWindow * 60 * 60 * 1000);
        var yyyy = threshold.getFullYear().toString();
        var mm = (threshold.getMonth() + 1).toString().padStart(2, '0');
        var dd = threshold.getDate().toString().padStart(2, '0');
        var hh = threshold.getHours().toString().padStart(2, '0');
        var min = threshold.getMinutes().toString().padStart(2, '0');
        var ss = threshold.getSeconds().toString().padStart(2, '0');
        var timestamp_threshold = yyyy + mm + dd + '-' + hh + min + ss;

        timestamps.filter(ts => ts > timestamp_threshold).sort((a, b) => b.localeCompare(a)).forEach(function(ts){
            var entry = json["results"][ts];

            if (showUpdatedOnly && !entry["update_clear_type"] && !entry["update_dj_level"] && !entry["update_score"] && !entry["update_miss_count"]) {
                return;
            }

            var difficulty = entry["difficulty"];
            var playtype = entry["playtype"];
            var title = entry["music"];
            var playspeed = entry["playspeed"];
            var lamp = entry["update_clear_type"];
            var score = entry["update_score"];
            var bp = entry["update_miss_count"];
            var options = entry["option"];
            
            // DB系のプレイオプションを反映
            var db_options = "";
            if (playtype === "DP BATTLE") {
                playtype = 'DP'
                if (options.indexOf("A-SCR")<0){
                    db_options = "皿あり";
                }
                if ((options.indexOf("MIR/OFF")>=0) || (options.indexOf("OFF/MIR")>=0)){
                    db_options += 'DBM'
                }
                else if (options.indexOf("OFF/OFF")>=0){
                    db_options += 'DB'
                }
                else if (options.indexOf("RAN/RAN")>=0){
                    db_options += 'DBR'
                }
                else if (options.indexOf("S-RAN/S-RAN")>=0){
                    db_options += 'DBSR'
                }
                else if (options.indexOf("H-RAN/H-RAN")>=0){
                    db_options += 'DBHR'
                }
            }

            title = `${title} (${playtype + difficulty.slice(0,1)})`
            if (playspeed !== null) {
                title = `<span class="plain">(x${playspeed})</span> ${title}` 
            }
            if (db_options != ""){
                title = `<span class="plain">(${db_options})</span> ${title}`;
            }


            //out += '<div class="level"></div>'
            out += `<div class="title ${difficulty}">${title}</div>`
            out += `<div class="lamp ${lamp}">${lamp === null ? '' : lamp}</div>`
            out += `<div class="score">${score === null ? '' : "+" + score}</div>`;
            out += `<div class="miss_count">${bp === null ? '' : bp}</div>`;
        });
        $('#result').html(out);
    });

    getjson.fail(function(err) {
        // alert('failed');
    });
}

window.addEventListener('DOMContentLoaded', function() {
    var roopTimer = setInterval(loadJson, 1000);
});