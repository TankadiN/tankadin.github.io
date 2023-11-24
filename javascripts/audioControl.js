function muteAudio(id) {
    var x = document.getElementById(id);
    const elements = document.getElementsByClassName('audioImage');
    if(x.muted == true) {
        x.muted = false;
        for (let i=0; i< elements.length; i ++) {
            elements[i].src =  "../../images/audio.png";
         }
    } else {
        x.muted = true;
        for (let i=0; i< elements.length; i ++) {
            elements[i].src = "../../images/audio_m.png";
         }
    }
}