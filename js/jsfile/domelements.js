if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (currentAccount) {
    // window.location.reload();
    // ConnectWallet();
    //Hide stake panel
    $("#alreadyStaker").css("display", "none");
    $("#newStaker").css("display", "none");
    $("#stakeappdisconnected").css("display", "block");
    $("#stakedapp").css("display", "none");

    //disconnect wallet
    $("#addressValue").text(`Address: Please connect your wallet first.`);
    $("#connectwallet").html(
      `<i class="fa fa-circle text-danger"></i>Connect Your Wallet`
    );
    // $("#connectwallet").css("border", "2px double var(--text-danger)");

    //genrate request for wallet connection
    var themeElementbyHash = window.location.hash;
    GameSlot = [];
    initpriceContract(); // topFunction();
    // if (themeElementbyHash == "#pricepredict") {
    //   GameSlot = [];
    //   initpriceContract(); // topFunction();
    // } else if (themeElementbyHash == "#stake") {
    //   initContract();
    //   // topFunction();
    // } else {
    //   initContract();
    //   // topFunction();
    // }
    // initContract();
    if (net == "main") {
      // $("#home").html("<h1>Please Switch to Ropsten Networt</h1>");
    } else if (net == "ropsten") {
    }
  });
  ethereum.on("chainChanged", (chainId) => {
    // window.location.reload();
    // net = web3.eth.net.getNetworkType();
    // initContract();
  });
}

$("#NewStakerApprove").click(async () => {
  if (currentAccount) {
    token.methods
      // .approve(stakeadd, "300")
      .approve(stakeadd, "340000000000000000000000")
      .send({ from: currentAccount })
      .on("transactionHash", function (hash) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        alertify.notify(hash, "success", 5, function () {
          // console.log("dismissed");
        });
        $("#transHash").html(
          `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
            hash +
            `\">${transactionURL}/tx/${hash}</a><div class="lds-dual-ring-small"></div>`
        );
      })
      .on("error", function (error) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        // console.log(error);
        alertify.notify(error.message, "error", 5, function () {
          // console.log("dismissed");
        });
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        // $("#approveBtn").removeAttr("disabled");
        // $("#approveBtn").find(".after-click").addClass("d-none");
        // $("#approveBtn").find(".before-click").removeClass("d-none");
        // $("#successModal").modal("show");
        alertify.notify(confirmationNumber, "success", 5, function () {
          // console.log("dismissed");
        });
        initContract();
        $("#transHash").html(` `);
        setTimeout(function () {
          // $("#successModal").modal("hide");
          // $("#btnStake").removeAttr("disabled");
          // $("#approval-section").addClass("d-none");
        }, 2000);
      });
  }
});

$("#OldStakerApprove").click(async () => {
  if (currentAccount) {
    token.methods
      .approve(stakeadd, "340000000000000000000000")
      .send({ from: currentAccount, gasLimit: 50000, gasPrice: 150000000000 })
      .on("transactionHash", function (hash) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
      })
      .on("error", function (error) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        // console.log(error);
        alertify.notify(error.message, "error", 5, function () {
          // console.log("dismissed");
        });
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        // $("#approveBtn").removeAttr("disabled");
        // $("#approveBtn").find(".after-click").addClass("d-none");
        // $("#approveBtn").find(".before-click").removeClass("d-none");
        // $("#successModal").modal("show");
        console.log(receipt);
        alertify.notify(receipt, "success", 5, function () {
          // console.log("dismissed");
        });
        setTimeout(function () {
          // $("#successModal").modal("hide");
          // $("#btnStake").removeAttr("disabled");
          // $("#approval-section").addClass("d-none");
        }, 2000);
      });
  }
});

$("#NewStakerNow").click(async () => {
  if (currentAccount) {
    if ($.trim($("#entered-value-stake").val()).length == 0) {
      // $("#msgArea").text("Kindly insert a valid token value");
      alertify.notify(
        "Can't Stake zero/invalid tokens value",
        "error",
        5,
        function () {
          // console.log("dismissed");
        }
      );
    } else if (isNaN($("#entered-value-stake").val())) {
      // $("#msgArea").text("Kindly insert a valid token value");
      alertify.notify(
        "Please provide valid stake value",
        "error",
        5,
        function () {
          // console.log("dismissed");
        }
      );
    } else {
      let gasprice = await web3.eth.getGasPrice();
      console.log(gasprice);
      stake.methods
        .stakeNow(web3.utils.toWei($("#entered-value-stake").val(), "ether"))
        .send({ from: currentAccount, gasPrice: gasprice })
        .on("transactionHash", function (hash) {
          // $("#approveBtn").attr("disabled", "");
          // $("#approveBtn").find(".before-click").addClass("d-none");
          // $("#approveBtn").find(".after-click").removeClass("d-none");
          $("#transHash").html(
            `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
              hash +
              `\">${transactionURL}/tx/${hash}</a><div class="lds-dual-ring-small"></div>`
          );
        })
        .on("error", function (error) {
          // $("#approveBtn").attr("disabled", "");
          // $("#approveBtn").find(".before-click").addClass("d-none");
          // $("#approveBtn").find(".after-click").removeClass("d-none");
          // console.log(error);
          alertify.notify(error.message, "error", 5, function () {
            // console.log("dismissed");
          });
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          // $("#approveBtn").removeAttr("disabled");
          // $("#approveBtn").find(".after-click").addClass("d-none");
          // $("#approveBtn").find(".before-click").removeClass("d-none");
          // $("#successModal").modal("show");
          initContract();
          $("#transHash").html(` `);
          setTimeout(function () {
            // $("#successModal").modal("hide");
            // $("#btnStake").removeAttr("disabled");
            // $("#approval-section").addClass("d-none");
          }, 2000);
        });
    }
  }
});

$("#maxBalanceToStake").click(() => {
  if (_maxStatus == "enable") {
    if (
      $("#entered-value-stake").val() ==
      web3.utils.fromWei(myTokenBalance, "ether")
    ) {
      $("#entered-value-stake").val("");
      $("#maxBalanceToStake").removeClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text((stakingFee * amount) / 10000);
    } else {
      $("#entered-value-stake").val(
        web3.utils.fromWei(myTokenBalance, "ether")
      );
      $("#maxBalanceToStake").addClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text((stakingFee * amount) / 10000);
    }
  }
});

$("#createNewGame").click(async () => {
  let _amount = $("#gameSlot_amount").val();
  let _PlayerLimit = $("#gameSlot_PlayerLimit").val();
  let _playdate = new Date($("#gameSlot_playdate").val()).getTime() / 1000;
  let _minPlayerCount = $("#gameSlot_minPlayerCount").val();
  let _bidBefore = new Date($("#gameSlot_bidBefore").val()).getTime() / 1000;
  $("#createNewGame").prop("disabled", true);

  if (currentAccount) {
    console.log(currentAccount + " " + priceOwner);
    if (currentAccount == priceOwner) {
      //Create Game

      pricepredict.methods
        .createGameSlot(
          web3.utils.toWei(_amount, "ether"),
          _PlayerLimit,
          _playdate,
          _minPlayerCount,
          _bidBefore
        )
        .send({ from: currentAccount })
        .on("transactionHash", function (hash) {
          // $("#approveBtn").attr("disabled", "");
          // $("#approveBtn").find(".before-click").addClass("d-none");
          // $("#approveBtn").find(".after-click").removeClass("d-none");
          $("#createGameMsg").html(
            `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
              hash +
              `\">${transactionURL}/tx/${hash}</a><div class="lds-dual-ring-small"></div>`
          );
        })
        .on("error", function (error) {
          alertify.notify(error.message, "error", 5, function () {});
          $("#createNewGame").prop("disabled", false);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          $("#createNewGame").prop("disabled", false);
          $("#createGameMsg").html(`Game Created Successfully`);
          initpriceContract();
          setTimeout(function () {}, 2000);
        });
    }

    // //Owner  priceOwner
    // pricepredict.methods
    //   .gamefee()
    //   .call()
    //   .then((_priceOwner) => {
    //     $("#PricePredictOwner").css("display", "flex");
    //     priceOwner = _priceOwner;
    //   });
  }
});

//Dashboard for Owner
$(".createGameID").click(() => {
  // css
  $(".createGameID").css("background-color", "inherit");
  $(".selectWinnerID").css("background-color", "var(--bg2)");
  $(".refundID").css("background-color", "var(--bg2)");

  $(".creategamepanel").show();
  $(".selectWinnerpanel").hide();
  $(".refundpanel").hide();
});
$(".selectWinnerID").click(() => {
  // css
  $(".selectWinnerID").css("background-color", "inherit");
  $(".createGameID").css("background-color", "var(--bg2)");
  $(".refundID").css("background-color", "var(--bg2)");

  $(".creategamepanel").hide();
  $(".selectWinnerpanel").show();
  $(".refundpanel").hide();
});
$(".refundID").click(() => {
  // css
  $(".refundID").css("background-color", "inherit");
  $(".createGameID").css("background-color", "var(--bg2)");
  $(".selectWinnerID").css("background-color", "var(--bg2)");

  $(".creategamepanel").hide();
  $(".selectWinnerpanel").hide();
  $(".refundpanel").show();
});

$("#maxBalanceToUnStake").click(() => {
  // if (_maxStatus == "enable") {
  //   if ($("#unstake-value").val() == web3.fromWei(myTokenBalance, "ether")) {
  //     $("#unstake-value").val("");
  //     $("#maxBalanceToUnStake").removeClass("maxOn");
  //     var amount = $("#unstake-value").val();
  //     $("#calculatedunstakeFees").text(
  //       (UnstakingFee * amount) / 10000
  //     );
  //   } else {
  //     $("#unstake-value").val(web3.fromWei(myTokenBalance, "ether"));
  //     $("#maxBalanceToUnStake").addClass("maxOn");
  //     var amount = $("#unstake-value").val();
  //     $("#calculatedunstakeFees").text(
  //       (UnstakingFee * amount) / 10000
  //     );
  //   }
  // }
});

$("#entered-value-stake").on("input", () => {
  var amount = $("#entered-value-stake").val();
  $("#calculatedFees").text(
    (stakingFee * amount) / 10000
    // web3.fromWei(myBalance, "ether")
  );
});

$("#unstake-value").on("input", () => {
  // var amount = $("#unstake-value").val();
  // $("#calculatedunstakeFees").text(
  //   (getUnstakingFeeRate * amount) / 10000
  //   // web3.fromWei(myBalance, "ether")
  // );
});

$("#gameSlot_SelectDate").change(searchSelectedDateSlot);
$(".DateSearchID").click(searchSelectedDateSlot);

$("#gameSlot_HistoryDate").change(searchPlayersGameHistory);
$(".DateHistoryID").click(searchPlayersGameHistory);

$(document).keyup(function (e) {
  if (e.key === "Escape") {
    // escape key maps to keycode `27`
    // <DO YOUR WORK HERE>
    $("body").removeClass("loading");
  }
});

$(document).on("keydown", "input[pattern]", function (e) {
  var input = $(this);
  var oldVal = input.val();
  var regex = new RegExp(input.attr("pattern"), "g");

  setTimeout(function () {
    var newVal = input.val();
    if (!regex.test(newVal)) {
      input.val(oldVal);
    }
  }, 0);
});

$("#gameSlot_HistoryAllDate").change(searchPlayersGameHistoryAll);
$(".DateHistoryAllID").click(searchPlayersGameHistoryAll);

$(function () {
  // initContract();
  $(".creategamepanel").hide();
  $(".selectWinnerpanel").hide();
  $(".refundpanel").hide();
  refreshPrice();

  var $body = $("body");

  // $(window).load(function () {
  $body.addClass("page-loaded");
  // });
});
