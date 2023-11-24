function checkPlayer() {
	const player = !!document.getElementById("player");

	const elements = document.getElementsByClassName("audioButton");

	if(!player) {
		if(elements.length !== 0) {
			for (let i=0; i< elements.length; i++) {
	            elements[i].className += " hidden"
				
    	    }
			clearInterval(audio);
		}
	}
	else if(player) {
		clearInterval(audio);
	}
}

var audio = setInterval(()=>{this.checkPlayer()}, 100);
