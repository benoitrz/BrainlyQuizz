function requestData(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	function processRequest(e) {
	  if (xhr.readyState == 4 && xhr.status == 200) {
	        var response = JSON.parse(xhr.responseText);
	        callback(response);
	    }
	}
}

function secondsToString(seconds){
    var min = 0;
    var sec = 0;
    if (seconds){
        if (seconds >= 60){
            min = Math.floor(seconds / 60);
            sec = seconds % 60;
        } else sec = seconds;
        if ( min < 10 ){ min = '0'+min; }
        if ( sec < 10 ){ sec = '0'+sec; }
    }
    return min +":"+ sec;
}

var Quizz = {
	questions: [],
	answers: [],
	correct: [],
	score: 0,
	stage: 0,
	
	createQuizz: function(data){
        this.time_seconds = data['time_seconds'];
        var datas = data['questions'];
		for (var i = 0; i < datas.length; i++){
			this.questions.push(datas[i]['question']);
			var possibilities = [];
			for (var j = 0; j < datas[i]['answers'].length; j++){
				possibilities.push(datas[i]['answers'][j]['answer']);
				if (datas[i]['answers'][j]['correct'] == true) this.correct.push(j);
				this.answers.push(possibilities);		
			}
		}
    },

	startTimer: function(){
    	document.getElementById('timer').className += 'sg-header-primary';
    	document.getElementById("timer").innerHTML = secondsToString(Quizz.time_seconds);
    },

	stopTimer: function(){
    	clearInterval(this.timer);
    	document.getElementById("main").innerHTML = "<h2 class='sg-header-primary sg-header-primary--small'>Your score: </h2><h1 class='sg-text-bit'>" + this.score+"</h1>";
		document.getElementById("button").parentNode.removeChild(document.getElementById("button"));
    },

	nextQuestion: function(){
    	if (this.stage < this.questions.length){
		     var form2 = "<h2 class='sg-header-primary sg-header-primary--small'>"+this.questions[this.stage]+"</h2><br>";
		     for (var i = 0; i <= 3; i++){
		     	form2 += "<div class='sg-label sg-label--secondary'>"+
		            "<div class='sg-label__icon'>"+
		                "<div class='sg-radio'>"+
		                    "<input class='sg-radio__element' type='radio'  name='answer' value="+i+" id='radio-3'>"+
		                    "<label class='sg-radio__ghost' for='radio-3'></label>"+
		                "</div>"+
		           "</div>"+
		            "<label class='sg-label__text' for='radio-3'><div class='sg-text sg-text--standout'>"+this.answers[this.stage][i]+"</div></label>"+
		        "</div>";
		     }
			    document.getElementById("main").innerHTML = form2;
		}
    },

    addNextButton: function(){
    	var div = document.createElement('div');
     	div.id = 'button';
     	document.body.appendChild(div);
     	document.getElementById("button").innerHTML = "<button type='button' id='next'><svg class='sg-icon'><use xlink:href='#icon-arrow_right'></use></svg></button>";
     	document.getElementById('next').className += 'sg-button-primary';
     	document.body.appendChild(div);
    },

    noSelectionMade: function(){
    	var feedback = "<div class='sg-flash'>"+
	  	"<div class='sg-flash__message sg-flash__message--error'>"+
	    "<div class='sg-text sg-text--emphasised sg-text--small sg-text--light'>"+
	    "You have to make a choice!"+
	   	"</div>"+
	  	"</div>"+
		"</div>";
   		var div = document.createElement('div');
     	div.id = 'error';
     	document.body.insertBefore(div, document.body.firstChild);
     	document.getElementById("error").innerHTML = feedback;
    },

    showStage: function(){
    	var stage_info = "<div class='stage sg-badge sg-badge--large sg-badge--mint-secondary-light'>"+
      	"<div class='sg-text sg-text--emphasised sg-text--mint'>"+ this.stage+" / "+this.questions.length+"</div>"+
    	"</div>";
    	document.getElementById("stage_info").innerHTML = stage_info;
    }
}

document.getElementById("start").addEventListener("click", function() {
	requestData('https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json', function(data) { 
		Quizz.createQuizz(data);
		Quizz.startTimer();
		Quizz.showStage();
		Quizz.timer = setInterval(function(){ 
    		Quizz.time_seconds -= 1;
    		if (Quizz.time_seconds > 0){
				document.getElementById("timer").innerHTML = secondsToString(Quizz.time_seconds);
			} else { Quizz.stopTimer(); document.getElementById("timer").innerHTML = "Time out!"; }
    	 }, 1000);
		Quizz.nextQuestion();
		Quizz.addNextButton();
		document.getElementById("next").addEventListener("click", function() { 
		if (Quizz.stage < Quizz.questions.length-1){
			var choosen = document.getElementById("main").querySelector('input[name = "answer"]:checked');
			if (choosen){
				if (document.getElementById("error")) document.getElementById("error").parentNode.removeChild(document.getElementById("error"));
				if (choosen.value == Quizz.correct[Quizz.stage]){Quizz.score += 1;}
				Quizz.stage +=1;
				Quizz.showStage();
				Quizz.nextQuestion();
			} else {Quizz.noSelectionMade();}
		} else { Quizz.stage +=1; Quizz.showStage(); Quizz.stopTimer(); }
	}, false);
	 } );
}, false);