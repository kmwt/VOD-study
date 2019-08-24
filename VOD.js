'use strict';

/*PHP：Getterで読み込む*/
const _videoObjectList = [
    { name: "1-1", url: "video-src/sample.mp4" }
];
var _nowVideoIndex = 0;

/**
 * 初期化
 */
window.onload = function() {
    SetVideo(_videoObjectList, "video-area");
}

/**
 * ビデオプレイヤーのセット
 * @param {Object} videoObjectList 映像のURL
 * @param {String} videoElmId 映像をセットする要素のid
 */
function SetVideo(videoObjectList, videoElmId) {

    const videoLocation = videoObjectList[0].url;

    let main = document.body;
    if (videoElmId)
        main = document.getElementById(videoElmId);

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    /**************************Mid*************************/
    //ビデオ
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



    /**************************Mid*************************/
    //シークバー
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

    seekbar.addEventListener("input", function() {
        video.currentTime = seekbar.value;
        const timeCode = toHms(Math.floor(video.currentTime)).slice(3);
        document.getElementById("video-timecode").innerHTML = timeCode;
    }, false);

    video.addEventListener("timeupdate", function() {
        seekbar.value = video.currentTime;
        const timeCode = toHms(Math.floor(video.currentTime)).slice(3);
        document.getElementById("video-timecode").innerHTML = timeCode;
        document.title = _videoObjectList[_nowVideoIndex].name + "[" + timeCode + "]";
    }, false);

    seekbar_td.appendChild(seekbar);
    seekbar_tr.appendChild(seekbar_td);
    tbody.appendChild(seekbar_tr);


    /**************************Left*************************/
    const attribute_tr = document.createElement("tr");
    const attribute_left_td = document.createElement("td");
    attribute_left_td.style.textAlign = "left";

    //再生
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
    button_play.addEventListener("pointerdown", function() {
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

    });

    attribute_left_td.appendChild(button_play);


    //再生速度変更
    const span_speed = document.createElement("span");
    const speed = document.createElement("input");

    speed.style.margin = "0px 10px";

    speed.id = "video-speed";
    speed.type = "range";
    speed.classList.add("input-range");
    speed.value = 1;
    speed.min = 1;
    speed.max = 2;
    speed.step = 0.1;
    speed.title = "再生速度を変更する 您可以更改播放速度 You can change the playback speed";

    speed.addEventListener("change", function() {
        video.playbackRate = speed.value;
    }, false);

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


    /**************************Center*************************/
    const attribute_center_td = document.createElement("td");
    attribute_center_td.style.textAlign = "center";
    attribute_center_td.style.padding = "10px";

    //前の映像に戻る
    const backButton = document.createElement("button");
    const backButtonIcon = document.createElement("i");

    backButton.id = "video-next";
    backButton.classList.add("btn");
    backButton.classList.add("btn-dark");
    backButton.style.margin = "0px 10px";
    backButton.title = "前の映像に戻る 您可以在此视频之前看到播放的视频 You can see the video played before this video";

    backButtonIcon.id = "video-play-icon";
    backButtonIcon.classList.add("fas");
    backButtonIcon.classList.add("fa-step-backward");

    backButton.appendChild(backButtonIcon);
    backButton.addEventListener("pointerdown", function() {
        if (_nowVideoIndex > 0) {
            _nowVideoIndex--;
            changeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    });

    attribute_center_td.appendChild(backButton);


    //映像の時間を表示
    const span_timecode = document.createElement("span");

    span_timecode.id = "video-timecode";
    span_timecode.style.margin = "0px 10px";
    span_timecode.innerHTML = toHms(0).slice(3);

    attribute_center_td.appendChild(span_timecode);


    const slash = document.createElement("span");
    slash.innerHTML = "/";
    attribute_center_td.appendChild(slash);


    const span_endtime = document.createElement("span");
    span_endtime.id = "video-endtime";
    span_endtime.style.margin = "0px 10px";
    video.addEventListener('loadedmetadata', function() {
        const duration = video.duration;
        span_endtime.innerHTML = toHms(Math.floor(duration)).slice(3);
        seekbar.max = duration;
    });

    attribute_center_td.appendChild(span_endtime);


    //次の映像に進む
    const nextButton = document.createElement("button");
    const nextButtonIcon = document.createElement("i");

    nextButton.id = "video-next";
    nextButton.classList.add("btn");
    nextButton.classList.add("btn-dark");
    nextButton.style.margin = "0px 10px";

    nextButtonIcon.id = "video-play-icon";
    nextButtonIcon.classList.add("fas");
    nextButtonIcon.classList.add("fa-step-forward");

    nextButton.appendChild(nextButtonIcon);
    nextButton.addEventListener("pointerdown", function() {
        if (_nowVideoIndex < _videoObjectList.length - 1) {
            _nowVideoIndex++;
            changeVideo(_videoObjectList[_nowVideoIndex].url);
        }
    });
    nextButton.title = "次の映像へ進む  转到播放列表中的下一个视频 You can go to the next video";

    attribute_center_td.appendChild(nextButton);


    /**************************Right*************************/
    const attribute_right_td = document.createElement("td");
    attribute_right_td.style.textAlign = "right";
    attribute_right_td.style.padding = "10px";


    //音量調整
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

    sound.addEventListener("input", function() {
        video.volume = sound.value;
    }, false);

    const volume_down_icon = document.createElement("i");
    volume_down_icon.classList.add("fa");
    volume_down_icon.classList.add("fa-volume-down");

    const volume_up_icon = document.createElement("i");
    volume_up_icon.classList.add("fa");
    volume_up_icon.classList.add("fa-volume-up");

    span_sound.appendChild(volume_down_icon);
    span_sound.appendChild(sound);
    span_sound.appendChild(volume_up_icon);
    attribute_right_td.appendChild(span_sound);


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
function changeVideo(videoLocation) {
    const video = document.getElementById("video");
    video.src = videoLocation;
    video.load();
    video.addEventListener('durationchange', function() {
        const duration = video.duration;
        document.getElementById("video-endtime").innerHTML = toHms(Math.floor(duration)).slice(3);
        document.getElementById("video-sound").max = duration;
    });
}


/**
 * 秒を時分秒に修正
 * @param {float} t 映像のタイムコード
 */
function toHms(timeCode) {
    let hms = "";
    const h = timeCode / 3600 | 0;
    const m = timeCode % 3600 / 60 | 0;
    const s = timeCode % 60;

    if (h != 0)
        hms = padZero(h) + "：" + padZero(m) + "：" + padZero(s);
    else if (m != 0)
        hms = "00：" + padZero(m) + "：" + padZero(s);
    else
        hms = "00：00：" + padZero(s);
    return hms;
}

/**
 * タイムコードの0埋め
 * @param {int} timeCode 
 */
function padZero(timeCode) {
    if (timeCode < 10) return "0" + timeCode;
    else return timeCode;
}