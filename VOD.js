'use strict';

//実用
//document.oncontextmenu = () => { return false; };



// videoの表示名とURLのリスト
var _videoObjectList = [
    { name: "サンプル：川-山-ブリッジ-自然-水", url: "video-src/River-14205.mp4" },
    { name: "サンプル：ようこそ-ホログラム-ビジネス-24829", url: "video-src/Welcome-24829.mp4" }
];

// 現在表示されているビデオのインデックス
var _nowVideoIndex = 0;


/****************************ビデオ************************************
 * ビデオプレイヤーの生成
 * @param {Object} videoLocation 映像のURL
 * @return {string} ビデオと再生制御を含むテーブルエレメント
 */
function CreateVideoDisplayer(videoLocation) {

    const video = CreateVideo(videoLocation);

    const table = document.createElement("table");
    table.classList.add("video-table");
    table.style.width = "800px";
    const tbody = document.createElement("tbody");
    tbody.id = "video-tbody";


    /**************************ビデオ表示の設定*************************/
    const video_tr = document.createElement("tr");
    const video_td = document.createElement("td");

    video_td.colSpan = 3;

    video_td.appendChild(video);
    video_tr.appendChild(video_td);
    tbody.appendChild(video_tr);
    /**************************ビデオ表示の設定*************************/



    /**************************シークバーの設定*************************/
    const seekbar_tr = document.createElement("tr");
    const seekbar_td = document.createElement("td");
    seekbar_td.colSpan = 3;

    const seekbar = CreateSeekBar(video);

    seekbar_td.appendChild(seekbar);
    seekbar_tr.appendChild(seekbar_td);
    tbody.appendChild(seekbar_tr);
    /**************************シークバーの設定*************************/



    /**************************再生制御の設定*************************/
    const attribute_tr = document.createElement("tr");
    const attribute_left_td = document.createElement("td");
    const attribute_center_td = document.createElement("td");
    const attribute_right_td = document.createElement("td");


    /**************************再生ボタン*/
    attribute_left_td.appendChild(CreatePlayButton(video));

    /**************************再生速度バー*/
    attribute_left_td.appendChild(CreateSpeedBar());


    /**************************バックボタン*/
    attribute_center_td.appendChild(CreateBackButton());

    /**************************映像時間*/
    attribute_center_td.appendChild(CreateTimeDisplay(video));

    /**************************ネクストボタン*/
    attribute_center_td.appendChild(CreateNextButton());


    /**************************音量バー*/
    video.volume = 0.01;
    attribute_right_td.appendChild(CreateVolumeBar(video));


    attribute_tr.appendChild(attribute_left_td);
    attribute_tr.appendChild(attribute_center_td);
    attribute_tr.appendChild(attribute_right_td);
    tbody.appendChild(attribute_tr);
    /**************************再生制御の設定*************************/

    table.appendChild(tbody);
    return table;

}


/**
 * ビデオ要素の生成
 * @param {String} videoSrc ビデオのbrogかhref
 * @return {video} ビデオ要素 
 */
function CreateVideo(videoSrc) {
    const video = document.createElement("video");
    video.id = "video";
    video.type = "video/mp4";
    video.style.width = "100%";
    video.src = videoSrc;
    video.load();
    return video;
}

/**
 * シークバーの生成
 * @param {video} video 
 * @return {input[range]} 
 */
function CreateSeekBar(video) {
    const seekbar = document.createElement("input");

    seekbar.id = "video-seekbar";
    seekbar.type = "range";
    seekbar.style.width = "100%";
    seekbar.min = 0;
    seekbar.value = 0;
    seekbar.classList.add("input-range");

    video.addEventListener("loadedmetadata", () => {
        seekbar.max = video.duration;
    });

    seekbar.oninput = () => {
        const seekbarValue = document.getElementById("video-seekbar").value;
        document.getElementById("video").currentTime = seekbarValue;
        document.getElementById("currentTime-displayer").innerHTML = Timecode2HMS(Math.floor(seekbarValue)).slice(3);
    };
    return seekbar;
}

/**
 * 再生ボタン生成
 * @param {video} video 
 */
function CreatePlayButton(video) {
    const button = document.createElement("button");
    const icon = document.createElement("i");

    button.id = "video-play";
    button.classList.add("btn");
    button.classList.add("btn-dark");
    button.style.marginRight = "10px";

    icon.id = "video-play-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-play");

    button.appendChild(icon);
    button.onpointerdown = () => {
        const video = document.getElementById("video");
        const icon = document.getElementById("video-play-icon");
        if (video.paused) {
            video.play();
            if (icon.classList.contains("fa-play"))
                icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        } else {
            video.pause();
            if (icon.classList.contains("fa-pause"))
                icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
        }
    };

    video.onended = () => {
        const button = document.getElementById("video-play");
        button.onpointerdown();
        button.onpointerdown();
    };

    return button;
}

/**
 * 時間表示部分の生成
 * @param {video} video 
 * @return {div}
 */
function CreateTimeDisplay(video) {

    const area = document.createElement("div");
    area.style.display = "inline-block";

    const currentTime_displayer = document.createElement("div");
    currentTime_displayer.style.display = "inline-block";
    currentTime_displayer.id = "currentTime-displayer";
    currentTime_displayer.innerHTML = Timecode2HMS(0).slice(3);

    const tmp = document.createElement("span");
    tmp.innerHTML = "/";


    const endTime_displayer = document.createElement("span");
    endTime_displayer.id = "endTime-displayer";

    video.addEventListener("loadedmetadata", () => {
        const videoDuration = video.duration;
        endTime_displayer.innerHTML = Timecode2HMS(Math.floor(videoDuration)).slice(3);
    });

    video.ontimeupdate = () => {
        const currentTime = video.currentTime;
        const videoTimeHMS = Timecode2HMS(Math.floor(currentTime)).slice(3);
        const currentTime_displayer = document.getElementById("currentTime-displayer");

        document.getElementById("video-seekbar").value = currentTime;
        currentTime_displayer.innerHTML = videoTimeHMS;
        currentTime_displayer.value = currentTime;
        if (document.hasFocus())
            document.title = "VideoNote";
        else // 非フォーカス時はタイトルを動画情報に変更
            document.title = _videoObjectList[_nowVideoIndex].name.slice(0, 4) + "[" + videoTimeHMS + "]";
    };

    area.appendChild(currentTime_displayer);
    area.appendChild(tmp);
    area.appendChild(endTime_displayer);

    return area;
}

/**
 * ボリュームバーの生成
 * @return {div}
 */
function CreateVolumeBar() {
    const area = document.createElement("div");
    area.style.display = "inline-block";

    const soundbar = document.createElement("input");

    soundbar.id = "sound-controller";
    soundbar.type = "range";
    soundbar.classList.add("input-range");
    soundbar.value = 0.01;
    soundbar.min = 0;
    soundbar.max = 1;
    soundbar.step = 0.01;

    soundbar.oninput = () => {
        document.getElementById("video").volume = document.getElementById("sound-controller").value;
    };

    const volumedown_icon = document.createElement("i");
    volumedown_icon.classList.add("fa");
    volumedown_icon.classList.add("fa-volume-down");
    volumedown_icon.style.cursor = "pointer";
    volumedown_icon.onpointerdown = () => {
        document.getElementById("video").volume = 0;
    };

    const volumeup_icon = document.createElement("i");
    volumeup_icon.classList.add("fa");
    volumeup_icon.classList.add("fa-volume-up");
    volumeup_icon.style.cursor = "pointer";
    volumeup_icon.onpointerdown = () => {
        document.getElementById("video").volume = document.getElementById("sound-controller").value;
    };

    area.appendChild(volumedown_icon);
    area.appendChild(soundbar);
    area.appendChild(volumeup_icon);

    return area;
}

/**
 * 再生速度調節バーの生成
 * @return {div}
 */
function CreateSpeedBar() {
    const area = document.createElement("div");
    area.style.display = "inline-block";

    const speed_controller = document.createElement("input");

    speed_controller.style.margin = "0px 10px";

    speed_controller.id = "speed-controller";
    speed_controller.type = "range";
    speed_controller.classList.add("input-range");
    speed_controller.min = 0.5;
    speed_controller.max = 1.5;
    speed_controller.step = 0.5;
    speed_controller.value = 1;
    speed_controller.title = "再生速度を変更する";

    speed_controller.onchange = () => {
        document.getElementById("video").playbackRate = document.getElementById("speed-controller").value;
    };

    const speedDown_icon = document.createElement("i");
    speedDown_icon.classList.add("fa");
    speedDown_icon.classList.add("fa-fast-backward");
    speedDown_icon.title = "再生速度を変更する";

    const speedUp_icon = document.createElement("i");
    speedUp_icon.classList.add("fa");
    speedUp_icon.classList.add("fa-fast-forward");
    speedUp_icon.title = "再生速度を変更する";

    area.append(speedDown_icon);
    area.append(speed_controller);
    area.append(speedUp_icon);

    return area;
}

/**
 * 前のビデオに戻るボタンの生成
 * @return {button}
 */
function CreateBackButton() {
    const button = document.createElement("button");
    const icon = document.createElement("i");

    button.id = "video-next";
    button.classList.add("btn");
    button.classList.add("btn-dark");
    button.title = "前の映像に戻る";

    icon.id = "video-play-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-step-backward");

    button.appendChild(icon);
    button.onpointerdown = () => {
        if (_nowVideoIndex > 0) {
            _nowVideoIndex--;
            ChangeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    };
    return button;
}

/**
 * 次のビデオを見るボタンの生成
 * @return {button}
 */
function CreateNextButton() {
    const button = document.createElement("button");
    const icon = document.createElement("i");

    button.id = "video-next";
    button.classList.add("btn");
    button.classList.add("btn-dark");
    button.title = "次の映像へ進む";

    icon.id = "video-play-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-step-forward");

    button.appendChild(icon);
    button.onpointerdown = () => {
        if (_nowVideoIndex < _videoObjectList.length - 1) {
            _nowVideoIndex++;
            ChangeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    };
    return button;
}


/**
 * 動画選択欄
 * @param {list} videoObjectList 映像の名前とURLが格納されたリスト
 * @return {table} ビデオリストの表要素
 */
function CreateVideoListDisplayer(videoObjectList) {

    if (document.getElementById("video-list-table"))
        RemoveElement(document.getElementById("video-list-table"))

    const table = document.createElement("table");
    table.id = "video-list-table";
    table.classList.add("video-lists-table");
    table.style.width = "100%";
    const tbody = document.createElement("tbody");

    for (let i = 0; i < videoObjectList.length; i++) {
        const videoObject = videoObjectList[i];
        const url = videoObject.url;
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.classList.add("video-list");
        if (i === 0) td.classList.add("video-list-active");

        td.setAttribute("name", "video-names");

        td.innerHTML = videoObject.name;

        tr.appendChild(td);
        tr.style.cursor = "pointer";
        tr.onpointerdown = () => {
            const video_names = document.getElementsByName("video-names");
            for (let i = 0; i < video_names.length; i++) {
                video_names[i].classList.remove("video-list-active");
            }
            td.classList.add("video-list-active");
            if (_nowVideoIndex === i)
                return;
            ChangeVideo(url);
            _nowVideoIndex = i;
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    return table;
}


/**
 * 映像をURLに入れ替え
 * @param {String} videoSrc 映像のURL
 */
function ChangeVideo(videoSrc) {
    const video = document.getElementById("video");
    video.src = videoSrc;
    video.load();
    video.ondurationchange = () => {
        const duration = video.duration;
        document.getElementById("endTime-displayer").innerHTML = Timecode2HMS(Math.floor(duration)).slice(3);
        document.getElementById("sound-controller").max = duration;

        document.getElementById("sound-controller").max = 1;
        document.getElementById("speed-controller").value = 1;
        document.getElementById("video-play").onpointerdown();

        const video_names = document.getElementsByName("video-names");
        if (video_names.length > 0) {
            // video_names.forEach(elm => {
            //     elm.classList.remove("video-list-active");
            // }); Edge対応
            for (let i = 0; i < video_names.length; i++) {
                video_names.classList.remove("video-list-active");
            }
            video_names[_nowVideoIndex].classList.add("video-list-active");
        }
    };
}
// なぜシークバーの最大値が更新される？


/**
 * 秒を時分秒に修正
 * @param {String} 時分秒の文字列 
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
 * 映像時間の0埋め
 * @param {String} timeCode 
 */
function ZeroPadding(timeCode) {
    if (timeCode < 10) return "0" + timeCode;
    else return timeCode;
}
//****************************ビデオ************************************


/****************************ノート************************************
 * 呟き欄のセット
 * @return {string} ビデオリストのテーブルエレメント
 */
function CreateNoteDisplayer() {

    const table = document.createElement("table");
    table.classList.add("note-table");
    const tbody = document.createElement("tbody");
    tbody.id = "note-tbody";

    table.appendChild(tbody);

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
    video.onpointerup = TakeNote;

    return table;
}

/**
 * ノートを書く
 * @param {event} event
 * @return {String} メモのID
 */
function TakeNote(event) {

    let image = false;

    const video = document.getElementById("video");

    var today = new Date();
    const memoID = today.getTime()


    /**************************映像から画像を抽出*************************/
    const image_td = document.createElement("td");

    const lx = Math.round(event.offsetX * video.videoWidth / video.clientWidth);
    const ly = Math.round(event.offsetY * video.videoHeight / video.clientHeight);
    const sx = Number(video.getAttribute("x"));
    const sy = Number(video.getAttribute("y"));

    this.removeAttribute("x");
    this.removeAttribute("y");

    // 画像からドラッグ箇所を切り出し
    const imageLangth = Math.max(Math.abs(lx - sx), Math.abs(ly - sy));

    if (imageLangth > 10) {

        image_td.colSpan = 1;
        image_td.id = memoID + "-image";
        image_td.style.textAlign = "center";

        const trimmed_canvas = TrimmingImage(video, lx, ly, sx, sy);
        trimmed_canvas.id = memoID + "-img";

        trimmed_canvas.style.width = (document.getElementById("video-tbody").clientWidth / 3 - 10) + "px";
        image = trimmed_canvas;
    }
    /**************************映像から画像を抽出*************************/

    return AddMemo(false, image);
}

/**
 * 
 * @param {Image} image 
 * @param {int} lx トリミングの左座標
 * @param {int} ly トリミングの上座標
 * @param {int} sx トリミングの右座標
 * @param {int} sy トリミングの下座標
 * @return {canvas} 切り取り箇所
 */
function TrimmingImage(image, lx, ly, sx, sy) {

    const cvs = document.createElement("canvas");
    const ctx = cvs.getContext("2d");
    cvs.width = Math.abs(lx - sx);
    cvs.height = Math.abs(ly - sy);
    ctx.drawImage(
        image,
        Math.min(sx, lx),
        Math.min(sy, ly),
        cvs.width,
        cvs.height,
        0,
        0,
        cvs.width,
        cvs.height
    );
    return cvs;
}

/**
 * メモ追加
 * @param {String} commentStr 
 * @param {Image} imageCanvas 
 * @return {String} メモのID
 */
function AddMemo(commentStr, imageCanvas) {

    document.getElementById("video").style.cursor = "pointer";

    const video = document.getElementById("video");

    var today = new Date();
    const memoID = today.getTime()

    const note_tr = document.createElement("tr");
    note_tr.id = memoID + "-tr";
    note_tr.classList.add("fade-in");
    note_tr.setAttribute("name", "note-tr");
    note_tr.setAttribute("video-name", _videoObjectList[_nowVideoIndex].name);
    note_tr.setAttribute("saveTime", video.currentTime);

    /**************************映像から画像を抽出*************************/
    const image_td = document.createElement("td");

    if (imageCanvas) {

        image_td.colSpan = 1;
        image_td.id = memoID + "-image";
        image_td.style.textAlign = "center";

        const cvs = imageCanvas;
        cvs.id = memoID + "-img";
        cvs.style.width = (document.getElementById("video-tbody").clientWidth / 3 - 10) + "px";

        image_td.appendChild(cvs);
        note_tr.appendChild(image_td);
    }

    /**************************映像から画像を抽出*************************/


    /**************************テキスト投稿欄の表示*************************/
    const text_td = document.createElement("td");
    text_td.colSpan = imageCanvas ? 2 : 3;

    const text_card = document.createElement("div");

    const text_card_header = document.createElement("div");
    const text_card_footer = document.createElement("div");
    text_card_footer.style.textAlign = "right";


    /**************************メモヘッダ*/
    text_card_header.innerHTML = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds() + "   " + _videoObjectList[_nowVideoIndex].name;
    text_td.appendChild(text_card_header);


    /**************************コメント欄表示*/
    const text_card_body = document.createElement("div");
    const text_area = document.createElement("input");
    text_area.id = memoID + "-text";
    text_area.type = "text";
    text_area.placeholder = "コメントを入力できます";
    if (commentStr) text_area.value = commentStr;
    text_area.classList.add("form-control");
    text_card_body.appendChild(text_area);
    text_td.appendChild(text_card_body);


    /**************************タイムコードを表示*/
    const video_timecode = document.getElementById("currentTime-displayer")
    const note_timecode = document.createElement("span");
    note_timecode.title = "この動画のタイムラインに戻る";
    note_timecode.classList.add("note-timecode");
    note_timecode.id = memoID + "note-timecode";
    note_timecode.innerHTML = video_timecode.innerHTML;
    note_timecode.value = video_timecode.value;
    note_timecode.name = _nowVideoIndex;
    // クリックでメモをとった時点に戻る
    note_timecode.onpointerdown = (event) => {
        ChangeVideo(_videoObjectList[parseInt(event.path[0].name)].url);
        const video = document.getElementById("video");
        video.currentTime = event.path[0].value;
    };
    note_timecode.style.margin = "5px";
    text_card_footer.appendChild(note_timecode);


    /**************************メモのサーバ保存*/
    text_card_footer.appendChild(CreateMemoSaveButton_server(memoID));


    /**************************メモのローカル保存*/
    let memo_save_button_local;
    if (!imageCanvas) {
        memo_save_button_local = document.createElement("button");
        memo_save_button_local.disabled = true;
        memo_save_button_local.style.opacity = 0;
    } else {
        memo_save_button_local = CreateMemoSaveButton_local(memoID);
    }
    text_card_footer.appendChild(memo_save_button_local);



    /**************************メモの削除*/
    text_card_footer.appendChild(CreateMemoDeleteButton(memoID));


    /**************************テキスト投稿欄の表示*************************/

    text_td.appendChild(text_card_footer);
    note_tr.appendChild(text_td);

    document.getElementById("note-tbody").appendChild(note_tr);

    return memoID;
}

/**
 * メモを保存するボタンの生成（サーバ用）
 * @param {String} memoID 
 * @return {button}
 * 発表用
 * TODO: onpointerdownを変更
 */
function CreateMemoSaveButton_server(memoID) {
    const button = document.createElement("button");
    button.title = "つぶやく";
    button.id = memoID + "-save-button";
    button.classList.add("card-button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.onpointerdown = () => {
        const memoID = button.id.split("-")[0];
        const comment = document.getElementById(memoID + "-text").value;
        const timeCode = document.getElementById(memoID + "-tr").getAttribute("saveTime");
        const videoName = document.getElementById(memoID + "-tr").getAttribute("video-name");

        // tweet
        const text = "「" + videoName + "」の " + Timecode2HMS(timeCode) + (comment.length === 0 ? (" までを視聴しました") : (" で 「" + comment + "」 とコメントしました"));
        const url = "http://twitter.com/share?url=" + escape(document.location.href) + "&text=" + encodeURIComponent(text);
        window.open(url, "_blank", "width=600,height=300");
    };

    const icon = document.createElement("i");
    icon.id = memoID + "-save-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-twitter");

    button.appendChild(icon);
    return button;
}

/**
 * メモを保存するボタンの生成（ローカル用）
 * @param {String} memoID 
 * @return {button}
 * 発表用
 * TODO: 削除
 */
function CreateMemoSaveButton_local(memoID) {
    const button = document.createElement("button");
    button.title = "画像を保存する";
    button.id = memoID + "-local-save-button";
    button.classList.add("card-button");
    button.classList.add("btn");

    button.onpointerdown = () => {
        const memoID = button.id.split("-")[0];
        const comment = document.getElementById(memoID + "-text").value;
        const timeCode = document.getElementById(memoID + "-tr").getAttribute("saveTime");
        const videoName = document.getElementById(memoID + "-tr").getAttribute("video-name");
        const imageBlob = document.getElementById(memoID + "-img").toDataURL("image/png");

        // 画像に名前を付けて保存
        const a = document.createElement("a");
        a.download = videoName + "-" + Math.round(timeCode) + "-" + (comment.length > 0 ? comment : "nocomment") + ".png";
        a.href = imageBlob;
        a.target = "_blank";
        a.click();
    };

    const icon = document.createElement("i");
    icon.id = memoID + "-local-save-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-save");

    button.appendChild(icon);
    return button;
}

/**
 * メモ削除ボタンの生成
 * @param {String} memoID 
 * @return {button}
 */
function CreateMemoDeleteButton(memoID) {
    const button = document.createElement("button");
    button.id = memoID + "-delete-button";
    button.title = "このメモを削除する";
    button.classList.add("card-button");
    button.classList.add("btn");
    button.classList.add("btn-danger");
    button.onpointerdown = (event) => {
        const memoID = button.id.split("-")[0];
        RemoveMemo(memoID);
    };

    const icon = document.createElement("i");
    icon.id = memoID + "-delete-icon";
    icon.classList.add("fas");
    icon.classList.add("fa-trash-alt");

    button.appendChild(icon);
    return button;
}

/**
 * メモの削除
 * @param {String} id 
 */
function RemoveMemo(id) {
    const memo = document.getElementById(id + "-tr");
    memo.classList.add("fade-out");
    memo.addEventListener("animationend", () => {
        RemoveElement(memo);
    });
}

/**
 * 全ノート削除
 */
function ClearNote() {
    let memo;
    while (memo = document.getElementsByName("note-tr")[0])
        RemoveElement(memo);
}

//****************************ノート************************************


/******************************ローカルファイルの読み込み************************************
 * ドラッグ＆ドロップでビデオを読み込む
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
 * 発表用
 * TODO: 削除
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

    if (document.getElementById("video-list-table")) {
        const video_list_area = CreateVideoListDisplayer(_videoObjectList);
        document.getElementById("video-area").appendChild(video_list_area);
    }

    // ノートを全て削除
    ClearNote();
}
//****************************ローカルファイルの読み込み************************************


/**
 * 要素を削除
 * @param {HTMLElement} element HTMLの要素
 */
function RemoveElement(element) {
    if (element) element.parentNode.removeChild(element);
}



/** 
 * アッパー：関数
 * キャメル：JavaScriptの変数
 * スネーク：HTML要素
 * 先頭アンダー：グローバル
 */



//****************************表示と説明************************************
/**
 * 発表用
 * TODO: 予想外に動いた部分を学習
 */
window.onload = function() {

    const area = document.getElementById("area");

    const video_player = CreateVideoDisplayer(_videoObjectList[0].url);
    const video_area = document.createElement("div");
    video_area.id = "video-area";
    video_area.classList.add("col");
    video_area.appendChild(video_player);

    area.appendChild(video_area);

    const video_list = CreateVideoListDisplayer(_videoObjectList);
    const list_area = document.createElement("div");
    list_area.id = "list-area";
    list_area.classList.add("col");
    list_area.appendChild(video_list);

    const video_note = CreateNoteDisplayer();
    const note_area = document.createElement("div");
    note_area.id = "note-area";
    note_area.classList.add("col");
    note_area.appendChild(video_note);

    SetDropVideo();

    //
    if (document.body.clientWidth > 1000) {
        area.appendChild(note_area);
        area.appendChild(list_area);
    } else {
        area.appendChild(list_area);
        area.appendChild(note_area);
    }

    //ヤバそう
    window.onresize = () => {
        if (document.body.clientWidth > 1000) {
            const video = document.getElementById("video-area");
            const list = document.getElementById("list-area");
            const note = document.getElementById("note-area");
            document.getElementById("area").innerHTML = "";
            document.getElementById("area").appendChild(video);
            document.getElementById("area").appendChild(note);
            document.getElementById("area").appendChild(list);
        } else {
            const video = document.getElementById("video-area");
            const list = document.getElementById("list-area");
            const note = document.getElementById("note-area");
            document.getElementById("area").innerHTML = "";
            document.getElementById("area").appendChild(video);
            document.getElementById("area").appendChild(list);
            document.getElementById("area").appendChild(note);
        }
    }


    const btn = document.createElement("button");
    btn.innerHTML = "説明書";
    btn.style.fontSize = "32px";
    btn.onclick = () => {
        Exprain();
        RemoveElement(btn);
    };
    document.body.appendChild(btn);
    const id = setTimeout(() => { RemoveElement(btn) }, 5000);
}

/**
 * 発表用
 */
function Exprain() {

    const video = document.getElementById("video");

    if (document.body.clientWidth < 1000) {
        setTimeout(() => {
            let id = AddMemo("画面をクリックするとtweetできます");
            setTimeout(() => {
                RemoveMemo(id);
            }, 5000);
        }, 1000);

        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');

        setTimeout(() => {
            let id = AddMemo("動画上でドラッグ＆ドロップするとトリミングできます", TrimmingImage(video, video.videoWidth / 4, video.videoHeight / 4, video.videoWidth * 3 / 4, video.videoHeight * 3 / 4));
            setTimeout(() => { RemoveMemo(id) }, 5000);
        }, 7000);

        setTimeout(() => {
            let id = AddMemo("ローカルmp4ファイルを動画上にドロップすると再生できます");
            setTimeout(() => {
                RemoveMemo(id);
            }, 5000);
        }, 14000);
    } else {
        setTimeout(() => {
            let id = AddMemo("画面をクリックするとtweetできます");
            // setTimeout(() => {
            //     RemoveMemo(id);
            // }, 5000);
        }, 200);

        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');

        setTimeout(() => {
            let id = AddMemo("動画上でドラッグ＆ドロップするとトリミングできます", TrimmingImage(video, video.videoWidth / 4, video.videoHeight / 4, video.videoWidth * 3 / 4, video.videoHeight * 3 / 4));
            // setTimeout(() => { RemoveMemo(id) }, 5000);
        }, 400);

        setTimeout(() => {
            let id = AddMemo("ローカルmp4ファイルを動画上にドロップすると再生できます");
            // setTimeout(() => {
            //     RemoveMemo(id);
            // }, 5000);
        }, 600);
    }

}

/**
 * 0831：メモ
 * メイン関数より動くWebページ要素のある下二つの方が重要だったような
 * 動くWebページ要素ここしかないし
 */