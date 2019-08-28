'use strict';

/**
 * TODO bootstrapとfontawesomeは禁止
 */

// 配信がダウンロード形式の場合はDL防止
// document.oncontextmenu = () => { return false; };

// videoの表示名とURLのリスト
var _videoObjectList = [
    { name: "ようこそ-ホログラム-ビジネス-24829", url: "video-src/Welcome-24829.mp4" },
    { name: "川-山-ブリッジ-自然-水", url: "video-src/River-14205.mp4" }
];
// TODO サーバ側で設定
// TODO ファイルリストの表示（どこに表示するか）


// 現在表示されているビデオのインデックス
var _nowVideoIndex = 0;


/**
 * 初期化
 */
window.onload = function() {
    SetVideo(_videoObjectList[0].url, "video-area");
    SetNote("note-area");
    SetDropVideo();
}



/****************************ビデオ************************************
 * ビデオプレイヤーのセット
 * @param {Object} videoLocation 映像のURL
 * @param {String} videoElmId 映像をセットする要素のid
 */
function SetVideo(videoLocation, videoElmId) {

    const main = videoElmId ? document.getElementById(videoElmId) : document.body;

    const table = document.createElement("table");
    table.classList.add("video-table");
    const tbody = document.createElement("tbody");
    tbody.id = "video-tbody";

    /**************************ビデオ表示の設定*************************/
    const video_tr = document.createElement("tr");
    const video_td = document.createElement("td");
    const video = document.createElement("video");

    video_td.colSpan = 3;
    video_td.style.padding = "10px 10px 0px 10px";

    video.id = "video";
    video.type = "video/mp4";
    video.style.width = "100%";
    video.src = videoLocation;
    video.load();

    video_td.appendChild(video);
    video_tr.appendChild(video_td);
    tbody.appendChild(video_tr);
    /**************************ビデオ表示の設定*************************/


    /**************************シークバーの設定*************************/
    const seekbar_tr = document.createElement("tr");
    const seekbar_td = document.createElement("td");
    const seekbar = document.createElement("input");

    seekbar_td.colSpan = 3;
    seekbar_td.style.padding = "0px 10px";

    seekbar.id = "video-seekbar";
    seekbar.type = "range";
    seekbar.style.width = "100%";
    seekbar.min = 0;
    seekbar.value = 0;
    seekbar.classList.add("input-range");

    seekbar.oninput = () => {
        video.currentTime = seekbar.value;
        const timeCode = Timecode2HMS(Math.floor(video.currentTime)).slice(3);
        document.getElementById("video-timecode").innerHTML = timeCode;
        // TODO スコープ外で定義した変数をイベントのスコープ内で呼べるのが地味に謎
        // オブジェクトだと参照してる扱いになるから？
    };

    video.ontimeupdate = () => {
        const time = video.currentTime;
        seekbar.value = time;
        const timeCode = Timecode2HMS(Math.floor(time)).slice(3);
        const time_code = document.getElementById("video-timecode");
        time_code.innerHTML = timeCode;
        time_code.value = time;
        document.title = _videoObjectList[_nowVideoIndex].name.slice(0, 4) + "[" + timeCode + "]";
    };

    seekbar_td.appendChild(seekbar);
    seekbar_tr.appendChild(seekbar_td);
    tbody.appendChild(seekbar_tr);
    /**************************シークバーの設定*************************/


    /**************************再生制御の設定*************************/

    /**************************再生停止*/
    const attribute_tr = document.createElement("tr");
    const attribute_left_td = document.createElement("td");
    attribute_left_td.style.textAlign = "left";

    const button_play = document.createElement("button");
    const icon_play = document.createElement("i");
    const span_time = document.createElement("button");

    attribute_left_td.style.padding = "10px";

    button_play.id = "video-play";
    button_play.classList.add("btn");
    button_play.classList.add("btn-dark");
    button_play.style.margin = "0px 10px 0px 0px";

    icon_play.id = "video-play-icon";
    icon_play.classList.add("fas");
    icon_play.classList.add("fa-play");

    button_play.appendChild(icon_play);
    button_play.onpointerdown = () => {
        const icon_play = document.getElementById("video-play-icon");
        if (video.paused) {
            video.play();
            if (icon_play.classList.contains("fa-play"))
                icon_play.classList.remove("fa-play");
            icon_play.classList.add("fa-pause");
        } else {
            video.pause();
            if (icon_play.classList.contains("fa-pause"))
                icon_play.classList.remove("fa-pause");
            icon_play.classList.add("fa-play");
        }

    };

    attribute_left_td.appendChild(button_play);

    video.onended = () => {
        if (icon_play.classList.contains("fa-pause"))
            icon_play.classList.remove("fa-pause");
        icon_play.classList.add("fa-play");
    };
    // video.onended = PlayIconChange(); は無理

    /**************************再生停止*/

    /**************************再生速度の変更*/
    const span_speed = document.createElement("span");
    const speed = document.createElement("input");

    speed.style.margin = "0px 10px";

    speed.id = "video-speed";
    speed.type = "range";
    speed.classList.add("input-range");
    speed.min = 0.5;
    speed.max = 1.5;
    speed.step = 0.5;
    speed.value = 1;
    speed.title = "再生速度を変更する";

    speed.onchange = () => {
        video.playbackRate = speed.value;
    };

    const speed_down_icon = document.createElement("i");
    speed_down_icon.classList.add("fa");
    speed_down_icon.classList.add("fa-fast-backward");

    const speed_up_icon = document.createElement("i");
    speed_up_icon.classList.add("fa");
    speed_up_icon.classList.add("fa-fast-forward");

    span_speed.append(speed_down_icon);
    span_speed.append(speed);
    span_speed.append(speed_up_icon);

    attribute_left_td.appendChild(span_speed);
    /**************************再生速度の変更*/

    /**************************前の映像に戻る*/
    const attribute_center_td = document.createElement("td");
    attribute_center_td.style.textAlign = "center";
    attribute_center_td.style.padding = "10px";

    const back_button = document.createElement("button");
    const back_buttonIcon = document.createElement("i");

    back_button.id = "video-next";
    back_button.classList.add("btn");
    back_button.classList.add("btn-dark");
    back_button.style.margin = "0px 10px";
    back_button.title = "前の映像に戻る";

    back_buttonIcon.id = "video-play-icon";
    back_buttonIcon.classList.add("fas");
    back_buttonIcon.classList.add("fa-step-backward");

    back_button.appendChild(back_buttonIcon);
    back_button.onpointerdown = () => {
        if (_nowVideoIndex > 0) {
            _nowVideoIndex--;
            ChangeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    };

    attribute_center_td.appendChild(back_button);
    // TODO １０秒戻るなどにしたほうがよかった
    /**************************前の映像に戻る*/

    /**************************映像の時間を表示*/
    const span_timecode = document.createElement("span");

    span_timecode.id = "video-timecode";
    span_timecode.style.margin = "0px 10px";
    span_timecode.innerHTML = Timecode2HMS(0).slice(3);

    attribute_center_td.appendChild(span_timecode);


    const slash = document.createElement("span");
    slash.innerHTML = "/";
    attribute_center_td.appendChild(slash);


    const span_endtime = document.createElement("span");
    span_endtime.id = "video-endtime";
    span_endtime.style.margin = "0px 10px";
    video.onloadedmetadata = () => {
        const duration = video.duration;
        span_endtime.innerHTML = Timecode2HMS(Math.floor(duration)).slice(3);
        seekbar.max = duration;
    };

    attribute_center_td.appendChild(span_endtime);
    /**************************映像の時間を表示*/

    /**************************次の映像に進む*/
    const next_button = document.createElement("button");
    const next_buttonIcon = document.createElement("i");

    next_button.id = "video-next";
    next_button.classList.add("btn");
    next_button.classList.add("btn-dark");
    next_button.style.margin = "0px 10px";

    next_buttonIcon.id = "video-play-icon";
    next_buttonIcon.classList.add("fas");
    next_buttonIcon.classList.add("fa-step-forward");

    next_button.appendChild(next_buttonIcon);
    next_button.onpointerdown = () => {
        if (_nowVideoIndex < _videoObjectList.length - 1) {
            _nowVideoIndex++;
            ChangeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    };
    next_button.title = "次の映像へ進む";

    attribute_center_td.appendChild(next_button);
    /**************************次の映像に進む*/

    /**************************音量の調整*/
    const attribute_right_td = document.createElement("td");
    attribute_right_td.style.textAlign = "right";
    attribute_right_td.style.padding = "10px";

    const span_sound = document.createElement("span");
    const sound = document.createElement("input");

    span_sound.style.margin = "0px 10px";

    sound.id = "video-sound";
    sound.type = "range";
    sound.classList.add("input-range");
    sound.value = 0;
    sound.min = 0;
    sound.max = 1;
    sound.step = 0.01;
    sound.style.margin = "0px 10px";
    video.volume = 0.01;

    sound.oninput = () => {
        video.volume = sound.value;
    };

    const volume_down_icon = document.createElement("i");
    volume_down_icon.classList.add("fa");
    volume_down_icon.classList.add("fa-volume-down");
    volume_down_icon.style.cursor = "pointer";
    volume_down_icon.onpointerdown = () => {
        video.volume = 0;
    };

    const volume_up_icon = document.createElement("i");
    volume_up_icon.classList.add("fa");
    volume_up_icon.classList.add("fa-volume-up");
    volume_up_icon.style.cursor = "pointer";
    volume_up_icon.onpointerdown = () => {
        video.volume = sound.value;
    };

    span_sound.appendChild(volume_down_icon);
    span_sound.appendChild(sound);
    span_sound.appendChild(volume_up_icon);
    attribute_right_td.appendChild(span_sound);
    /**************************音量の調整*/

    /**************************再生制御の設定*************************/


    attribute_tr.appendChild(attribute_left_td);
    attribute_tr.appendChild(attribute_center_td);
    attribute_tr.appendChild(attribute_right_td);
    tbody.appendChild(attribute_tr);

    table.appendChild(tbody);
    main.appendChild(table);

    return table;

}


/**
 * 映像をURLに入れ替え
 * @param {String} videoLocation 映像のURL
 */
function ChangeVideo(videoLocation) {
    const video = document.getElementById("video");
    video.src = videoLocation;
    video.load();
    video.ondurationchange = () => {
        const duration = video.duration;
        document.getElementById("video-endtime").innerHTML = Timecode2HMS(Math.floor(duration)).slice(3);
        document.getElementById("video-sound").max = duration;

        // TODO ローカルファイルを読み込むとなぜかmax音量が1を超えるため後に調査
        document.getElementById("video-sound").max = 1;
        document.getElementById("video-play").onpointerdown();
    };
}

/**
 * 秒を時分秒に修正
 * @param {float} t 映像のタイムコード
 */
function Timecode2HMS(timeCode) {
    let hms = "";
    const h = timeCode / 3600 | 0;
    const m = timeCode % 3600 / 60 | 0;
    const s = parseInt(timeCode) % 60;

    if (h != 0)
        hms = ZeroPadding(h) + "：" + ZeroPadding(m) + "：" + ZeroPadding(s);
    else if (m != 0)
        hms = "00：" + ZeroPadding(m) + "：" + ZeroPadding(s);
    else
        hms = "00：00：" + ZeroPadding(s);
    return hms;
}

/**
 * タイムコードの0埋め
 * @param {int} timeCode 
 */
function ZeroPadding(timeCode) {
    if (timeCode < 10) return "0" + timeCode;
    else return timeCode;
}
//****************************ビデオ************************************


/****************************ノート************************************
 * ノートをセット
 * @param {String} noteElmId 
 */
function SetNote(noteElmId) {

    const main = noteElmId ? document.getElementById(noteElmId) : document.body

    const table = document.createElement("table");
    table.classList.add("note-table");
    const tbody = document.createElement("tbody");
    tbody.id = "note-tbody";

    table.appendChild(tbody);
    main.appendChild(table);

    const video = document.getElementById("video");
    video.title = "クリック＆ドラッグで領域を保存";
    video.style.cursor = "pointer";
    video.onpointerdown = (event) => {
        const video = document.getElementById("video");
        const x = Math.round(event.offsetX * video.videoWidth / video.clientWidth);
        const y = Math.round(event.offsetY * video.videoHeight / video.clientHeight);
        video.style.cursor = "se-resize";
        video.setAttribute("x", x);
        video.setAttribute("y", y);
        // TODO 矩形を描画する
    };
    video.addEventListener('pointerup', TakeNote);
}

/**
 * ノートを書く
 * @param {event} event
 * TODO 秘密掲示板
 * TODO 画面的に右にコメントリストつけた方がよかった
 * TODO リスト形式にして機械学習に対応
 */
function TakeNote(event) {

    document.getElementById("video").style.cursor = "pointer";

    const video = document.getElementById("video");

    var today = new Date();
    const nowTime = today.getTime()

    const note_tr = document.createElement("tr");
    note_tr.id = nowTime + "-tr";
    note_tr.classList.add("fade-in");
    note_tr.setAttribute("name", "note-tr");
    note_tr.setAttribute("video-name", _videoObjectList[_nowVideoIndex].name);
    note_tr.setAttribute("video-timecode", video.currentTime);

    /**************************映像から画像を抽出*************************/
    const image_td = document.createElement("td");

    const lx = Math.round(event.offsetX * this.videoWidth / this.clientWidth);
    const ly = Math.round(event.offsetY * this.videoHeight / this.clientHeight);
    const sx = Number(this.getAttribute("x"));
    const sy = Number(this.getAttribute("y"));

	const imageLangth = Math.max(Math.abs(lx - sx), Math.abs(ly - sy));

    if (imageLangth > 10) {

        image_td.colSpan = 1;
        image_td.id = nowTime + "-image";
        image_td.style.textAlign = "center";

        const cvs = document.createElement("canvas");
        const ctx = cvs.getContext("2d");
        cvs.width = Math.abs(lx - sx);
        cvs.height = Math.abs(ly - sy);
        ctx.drawImage(
            this,
            Math.min(sx, lx),
            Math.min(sy, ly),
            cvs.width,
            cvs.height,
            0,
            0,
            cvs.width,
            cvs.height
        );

        cvs.style.width = (document.getElementById("video-tbody").clientWidth / 3 - 10) + "px";

        image_td.appendChild(cvs);
        note_tr.appendChild(image_td);
    }

    /**************************映像から画像を抽出*************************/


    /**************************テキスト投稿欄の表示*************************/
    const text_td = document.createElement("td");
    text_td.colSpan = imageLangth > 10 ? 2 : 3;
    text_td.style.padding = "0px 10px";

    const text_card = document.createElement("div");


    /**************************メモヘッダ*/
    const text_card_header = document.createElement("div");
    text_card_header.innerHTML = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds() + "   " + _videoObjectList[_nowVideoIndex].name;
    text_td.appendChild(text_card_header);
    /**************************メモヘッダ*/

    /**************************コメント欄表示*/
    const text_card_body = document.createElement("div");
    const text_area = document.createElement("input");
    text_area.id = nowTime + "-text";
    text_area.type = "text";
    text_area.placeholder = "コメントを入力できます";
    text_area.classList.add("form-control");
    text_card_body.appendChild(text_area);
    text_td.appendChild(text_card_body);
    /**************************コメント欄表示*/

    const text_card_hooter = document.createElement("div");
    // text_card_hooter.classList.add("text-right");
    text_card_hooter.style.textAlign = "right";

    /**************************タイムコードを表示*/
    const video_timecode = document.getElementById("video-timecode")
    const note_timecode = document.createElement("span");
    note_timecode.title = "この動画のタイムラインに戻る";
    note_timecode.classList.add("note-timecode");
    note_timecode.id = "note-timecode";
    note_timecode.innerHTML = video_timecode.innerHTML;
    note_timecode.value = video_timecode.value; // TODO attributeに変更
    note_timecode.name = _nowVideoIndex; // TODO attributeに変更

    // クリックでメモをとった時点に戻る
    note_timecode.onpointerdown = (event) => {
        ChangeVideo(_videoObjectList[parseInt(event.path[0].name)].url);
        const video = document.getElementById("video");
        video.currentTime = event.path[0].value;
    };
    note_timecode.style.margin = "5px";
    text_card_hooter.appendChild(note_timecode);
    /**************************タイムコードを表示*/

    /**************************メモの保存（本来はサーバ 現在はTweet）*/
    const save_button = document.createElement("button");
    save_button.title = "動画をつぶやく";
    save_button.id = nowTime + "-save_button";
    save_button.classList.add("card-button");
    save_button.classList.add("btn");
    save_button.classList.add("btn-primary");
    save_button.onpointerdown = (event) => {
        const id = event.path[0].id.split("-")[0];
        const comment = document.getElementById(id + "-text").value;
        const timeCode = document.getElementById(id + "-tr").getAttribute("video-timecode");
        const videoName = document.getElementById(id + "-tr").getAttribute("video-name");
        const text = "「" + videoName + "」の " + Timecode2HMS(timeCode) + (comment.length === 0 ? (" までを視聴しました") : (" で 「" + comment + "」 とコメントしました"));
        const url = "http://twitter.com/share?url=" + escape(document.location.href) + "&text=" + encodeURIComponent(text);
        window.open(url, "_blank", "width=600,height=300");
        // TODO 画像を投稿できるようにする
        // TODO タイムラインをGETとして保存した再生時間で再生できるようにする
        // GetterでURLからパラメタを読み込ませたほうがよかったような気がした
        // TODO 
    };

    const save_icom = document.createElement("i");
    save_icom.id = nowTime + "-save_icon";
    save_icom.classList.add("fab");
    save_icom.classList.add("fa-twitter");
    save_button.onpointerdown = save_button.onpointerdown;

    save_button.appendChild(save_icom);
    text_card_hooter.appendChild(save_button);
    /**************************メモの保存（本来はサーバ 現在はTweet）*/


    /**************************メモの削除*/
    const delete_button = document.createElement("button");
    delete_button.title = "このメモを削除する";
    delete_button.classList.add("card-button");
    delete_button.classList.add("btn");
    delete_button.classList.add("btn-danger");
    delete_button.onpointerdown = (event) => {
        event.path[3].classList.add("fade-out");
        setTimeout(()=>{RemoveElement(event.path[3])},500);
    };

    const delete_icom = document.createElement("i");
    delete_icom.classList.add("fas");
    delete_icom.classList.add("fa-trash-alt");
    delete_icom.onpointerdown = delete_button.onpointerdown;
    delete_icom.onpointerdown = (event) => {
        event.path[4].classList.add("fade-out");
        setTimeout(()=>{RemoveElement(event.path[4])},500);
    };
    delete_button.appendChild(delete_icom);

    text_card_hooter.appendChild(delete_button);
    /**************************メモの削除*/


    /**************************テキスト投稿欄の表示*************************/

    text_td.appendChild(text_card_hooter);
    note_tr.appendChild(text_td);

    this.removeAttribute("x");
    this.removeAttribute("y");

    document.getElementById("note-tbody").appendChild(note_tr);
}

/**
 * 全ノート削除
 * document.getElementsByName("note-tr")で全要素を取得できないため
 * 見つけ次第削除
 * TODO 修正
 */
function RemoveAllNote() {
    let allNotes;
    while (allNotes = document.getElementsByName("note-tr")[0])
        RemoveElement(allNotes);
}
//****************************ノート************************************


/******************************ローカルファイルの読み込み************************************
 * ドラッグ＆ドロップでビデオを読み込む
 * snowlt23さんのjsvisuより
 * https://progedu.github.io/web-contests/move-webcontest2017-summer/results/snowlt23/
 * TODO サーバと繋がったら削除
 */
function SetDropVideo() {
    document.ondragover = handleDragOver;
    document.ondrop = VideoDrop;
}

/**
 * ブラウザでの再生を停止
 * @param {イベント} event 
 */
function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

/**
 * ビデオファイルリストのドロップ
 * @param {イベント} event 
 */
function VideoDrop(event) {

    event.stopPropagation();
    event.preventDefault();

    //ローカルファイル再生時はDL防止解除
    document.oncontextmenu = () => { return true; };

    // 既存のビデオはすべて削除
    for (let i = 0; i < _videoObjectList.length; i++) {
        window.URL.revokeObjectURL(_videoObjectList[i].url);
    }
    _videoObjectList = [];

    var files = event.dataTransfer.files;
    var output = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === "video/mp4")
            _videoObjectList.unshift({
                name: file.name,
                url: window.URL.createObjectURL(file)
            });
    }
    _nowVideoIndex = 0;
    ChangeVideo(_videoObjectList[_nowVideoIndex].url);

    // ノートを全て削除
    RemoveAllNote();
}
//****************************ローカルファイルの読み込み************************************


/**
 * 要素を削除
 * @param {HTMLElement} element HTMLの要素
 */
function RemoveElement(element) {
    element.parentNode.removeChild(element);
}



/** 
 * アッパー：関数
 * キャメル：JavaScriptの変数
 * スネーク：HTML要素
 * 先頭アンダー：グローバル
 */

/** TODO
 * メモリが無駄
 * テストできない
 * 関数を分ける
 */

/** TODO
 * 古い端末での描画
 * HTMLテンプレート版
 */