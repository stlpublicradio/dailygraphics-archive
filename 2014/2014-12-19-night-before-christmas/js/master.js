// Put all your page JS here

$(function () {
    $('#slickQuiz').slickQuiz({
    	skipStartButton: true,
		perQuestionResponseMessaging: false,
		completionResponseMessaging: true,
		displayQuestionNumber: false,
		disableRanking: true,
        animationCallbacks: { // only for the methods that have jQuery animations offering callback
            setupQuiz: function () {    pymChild.sendHeight();
},
            startQuiz: function () {    pymChild.sendHeight();
},
            resetQuiz: function () {    pymChild.sendHeight();
},
            checkAnswer: function () {    pymChild.sendHeight();
},
            nextQuestion: function () {    pymChild.sendHeight();
},
            backToQuestion: function () {    pymChild.sendHeight();
},
            completeQuiz: function () {    pymChild.sendHeight();
}
        },
    });
});
