
/*PHP：Getterで読み込む*/
const videos_ = [
	{name:"1-1",url:"sample.mp4"}
];
var video_index_ = 0;

/*初期化*/
window.onload = function(){
	setVideo(videos_, "video-area");
}

/*ビデオプレイヤーのセット（video_url: 映像のURL, element_id: 映像をセットする場所のid）*/
function setVideo(videos, element_id){

	video_url = videos[0].url;
	video_name = videos[0].name;

	let main = document.body;
	if(element_id)
		main = document.getElementById(element_id);

	let table = document.createElement("table");
	let tbody = document.createElement("tbody");
	

	/**************************Mid*************************/
	//ビデオ
	let video_tr = document.createElement("tr");
	let video_td = document.createElement("td");
	let video = document.createElement("video");

	video_td.colSpan = 3;
	video_td.style.padding = "10px 10px 0px 10px";

	video.id = "video";
	video.type = "video/mp4";
	video.style.width = "100%";
	video.src = video_url;
	video.load();

	video_td.appendChild(video);
	video_tr.appendChild(video_td);
	tbody.appendChild(video_tr);



	/**************************Mid*************************/
	//シークバー
	let seekbar_tr = document.createElement("tr");
	let seekbar_td = document.createElement("td");
	let seekbar = document.createElement("input"); 

	seekbar_td.colSpan = 3;
	seekbar_td.style.padding = "0px 10px";

	seekbar.id = "video-seekbar";
	seekbar.type = "range";
	seekbar.style.width = "100%";
	seekbar.min = 0;
	seekbar.value = 0;
	seekbar.classList.add("input-range");

	seekbar.addEventListener("input", function(){
		video.currentTime=seekbar.value;
		let time = toHms(Math.floor(video.currentTime)).slice(3);
		document.getElementById("video-timecode").innerHTML = time;
	},false);

	video.addEventListener("timeupdate",function(){
		seekbar.value = video.currentTime;
		let time = toHms(Math.floor(video.currentTime)).slice(3);
		document.getElementById("video-timecode").innerHTML = time;
		document.title = videos_[video_index_].name + "[" + time + "]";
	},false);

	seekbar_td.appendChild(seekbar);
	seekbar_tr.appendChild(seekbar_td);
	tbody.appendChild(seekbar_tr);


	/**************************Left*************************/
	let attribute_tr = document.createElement("tr");
	let attribute_left_td = document.createElement("td");
	attribute_left_td.style.textAlign = "left";

	//再生
	let button_play = document.createElement("button"); 
	let icon_play = document.createElement("i");
	let span_time = document.createElement("button"); 

	attribute_left_td.style.padding = "10px";

	button_play.id = "video-play";
	button_play.classList.add("btn");
	button_play.classList.add("btn-dark");
	button_play.style.margin = "0px 10px 0px 0px";

	icon_play.id = "video-play-icon";
	icon_play.classList.add("fas");
	icon_play.classList.add("fa-play");

	button_play.appendChild(icon_play);
	button_play.addEventListener("pointerdown",function(){
		let icon_play = document.getElementById("video-play-icon");
		if (video.paused) {
			video.play();
			if(icon_play.classList.contains("fa-play"))
				icon_play.classList.remove("fa-play");
			icon_play.classList.add("fa-pause");
		} else {
			video.pause();
			if(icon_play.classList.contains("fa-pause"))
				icon_play.classList.remove("fa-pause");
			icon_play.classList.add("fa-play");
		}

	});

	attribute_left_td.appendChild(button_play);


	//再生速度変更
	let span_speed = document.createElement("span");
	let speed = document.createElement("input"); 

	speed.style.margin = "0px 10px";

	speed.id = "video-speed"; 
	speed.type = "range"; 
	speed.classList.add("input-range");
	speed.value = 1; 
	speed.min = 1; 
	speed.max = 2; 
	speed.step = 0.1;
	speed.title = "再生速度を変更する 您可以更改播放速度 You can change the playback speed";

	speed.addEventListener("change",function(){
		video.playbackRate = speed.value;
	},false);

	let speed_down_icon = document.createElement("i");
	speed_down_icon.classList.add("fa");
	speed_down_icon.classList.add("fa-fast-backward");

	let speed_up_icon = document.createElement("i");
	speed_up_icon.classList.add("fa");
	speed_up_icon.classList.add("fa-fast-forward");

	span_speed.append(speed_down_icon);
	span_speed.append(speed);
	span_speed.append(speed_up_icon);

	attribute_left_td.appendChild(span_speed);


	/**************************Center*************************/
	let attribute_center_td = document.createElement("td");
	attribute_center_td.style.textAlign = "center";
	attribute_center_td.style.padding = "10px";

	//前の映像に戻る
	let button_back = document.createElement("button"); 
	let icon_back = document.createElement("i");

	button_back.id = "video-next";
	button_back.classList.add("btn");
	button_back.classList.add("btn-dark");
	button_back.style.margin = "0px 10px";
	button_back.title = "前の映像に戻る 您可以在此视频之前看到播放的视频 You can see the video played before this video";

	icon_back.id = "video-play-icon";
	icon_back.classList.add("fas");
	icon_back.classList.add("fa-step-backward");

	button_back.appendChild(icon_back);
	button_back.addEventListener("pointerdown",function(){
		if(video_index_>0){
			video_index_--;
			changeVideo(videos_[video_index_].url);
		}
	});

	attribute_center_td.appendChild(button_back);


	//映像の時間を表示
	let span_timecode = document.createElement("span"); 

	span_timecode.id = "video-timecode";
	span_timecode.style.margin = "0px 10px";
	span_timecode.innerHTML = toHms(0).slice(3);

	attribute_center_td.appendChild(span_timecode);


	let slash = document.createElement("span");
	slash.innerHTML = "/";
	attribute_center_td.appendChild(slash);


	let span_endtime = document.createElement("span"); 
	span_endtime.id = "video-endtime";
	span_endtime.style.margin = "0px 10px";
	video.addEventListener('loadedmetadata', function() {
		let duration = video.duration;
		span_endtime.innerHTML = toHms(Math.floor(duration)).slice(3);
		seekbar.max = duration;
	});

	attribute_center_td.appendChild(span_endtime);


	//次の映像に進む
	let button_next = document.createElement("button"); 
	let icon_next = document.createElement("i");

	button_next.id = "video-next";
	button_next.classList.add("btn");
	button_next.classList.add("btn-dark");
	button_next.style.margin = "0px 10px";

	icon_next.id = "video-play-icon";
	icon_next.classList.add("fas");
	icon_next.classList.add("fa-step-forward");

	button_next.appendChild(icon_next);
	button_next.addEventListener("pointerdown",function(){
		if(video_index_<videos_.length-1){
			video_index_++;
			changeVideo(videos_[video_index_].url);
		}
	});
	button_next.title = "次の映像へ進む  转到播放列表中的下一个视频 You can go to the next video";

	attribute_center_td.appendChild(button_next);

	
	/**************************Right*************************/
	let attribute_right_td = document.createElement("td");
	attribute_right_td.style.textAlign = "right";
	attribute_right_td.style.padding = "10px";


	//音量調整
	let span_sound = document.createElement("span"); 
	let sound = document.createElement("input"); 

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

	sound.addEventListener("input",function(){
		video.volume = sound.value;
	},false);

	let volume_down_icon = document.createElement("i");
	volume_down_icon.classList.add("fa");
	volume_down_icon.classList.add("fa-volume-down");

	let volume_up_icon = document.createElement("i");
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

/*映像をURLに入れ替え*/
function changeVideo(video_url){
	let video = document.getElementById("video");
	video.src = video_url;
	video.load();
	video.addEventListener('durationchange', function() {
		let duration = video.duration;
		document.getElementById("video-endtime").innerHTML = toHms(Math.floor(duration)).slice(3);
		document.getElementById("video-sound").max = duration;
	});
}


/*秒を時分秒に修正*/
function toHms(t) {
	var hms = "";
	var h = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;

	if (h != 0) 
		hms = padZero(h) + "：" + padZero(m) + "：" + padZero(s);
	else if (m != 0)
		hms = "00：" + padZero(m) + "：" + padZero(s);
	else 
		hms = "00：00：" + padZero(s);

	return hms;

	function padZero(v) {
		if (v < 10) 
			return "0" + v;
		else 
			return v;
	}
}
