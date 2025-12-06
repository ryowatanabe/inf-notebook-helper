// 「最近」として表示する履歴の範囲 (単位:時間)
const timeWindow = 24;

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
        var out = "<div class='header'>Music</div><div class='header'></div><div class='header'>Lamp</div><div class='header'>Score</div><div class='header'>BP</div>";
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
            var lamp = entry["update_clear_type"];
            var score = entry["update_score"];
            var bp = entry["update_miss_count"];
            var opt = entry["option"];

            //out += '<div class="level"></div>'
            out += '<div class="title">'+title+'</div>'
            out += '<div class="difficulty ' + difficulty + '">' + playtype + difficulty.slice(0,1) + '</div>';
            out += '<div class="lamp ' + lamp + '">' + (lamp === null ? '' : lamp) + '</div>'
            out += '<div class="score">'+ (score === null ? '' : "+" + score) + '</div>';
            out += '<div class="miss_count">'+ (bp === null ? '' : bp) + '</div>';

            // テーブルに追加
            /*
            if (opt.indexOf("BATTLE") >= 0){ // DBx系オプションの場合、スコアの所にbp250のようにミスカンを入れておく
                var with_scratch = "";
                if (opt.indexOf("A-SCR")<0){
                    with_scratch = "皿あり"; // 皿あり表記を無効にする場合はこの行を消せばOK
                }
                if ((opt.indexOf("MIR / OFF")>=0) || (opt.indexOf("OFF / MIR")>=0)){
                    title = '('+with_scratch+'DBM) ' + title
                }
                else if (opt.indexOf("OFF / OFF")>=0){
                    title = '('+with_scratch+'DB) ' + title
                }
                else if (opt.indexOf("RAN / RAN")>=0){
                    title = '('+with_scratch+'DBR) ' + title
                }
                else if (opt.indexOf("S-RAN / S-RAN")>=0){
                    title = '('+with_scratch+'DBSR) ' + title
                }
                else if (opt.indexOf("H-RAN / H-RAN")>=0){
                    title = '('+with_scratch+'DBHR) ' + title
                }
                out +='<div class="level">☆'+lv+'</div><div class="title">'+title+'</div><div>'+difficulty+'</div><div>'+lamp+'</div><div>bp'+bp+'</div>';
            } else{
            */
            //if (index == 39){ // 直近の30曲だけ表示としている。曲数はここから変更可能。
            //    return false;
            //}
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