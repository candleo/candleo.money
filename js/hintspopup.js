window.addEventListener("load", function () {
  $(".trigger_popup_fricc").click(function () {
    $(".hover_bkgr_fricc").show();
  });
  $(".hover_bkgr_fricc").click(function () {
    $(".hover_bkgr_fricc").hide();
  });
  $(".popupCloseButton").click(function () {
    $(".hover_bkgr_fricc").hide();
  });
});

setmsghint = (msgno) => {
  if (msgno == 1) {
    msgInHTML =
      "<h3>How To Play</h3><p>Price Prediction: The model is pretty simple, the opening price of 4 hour candle at 4PM UTC daily will decide the winner. The Players who wants to participate have to place their entry and amount to particiapte 6 hours before. Players need to predict what will be the opening price of candle at that time. The player who predicts closest price will win the game. If there are more than 1 individual whose predictions are correct then there will be a random selection of winner among them with the help of bot.</p>";
  }
  $("#popupMsg").html(msgInHTML);
};
