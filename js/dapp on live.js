let net, getRdata, BTCPrice; //current network
let currentAccount,
  _maxStatus = "enable",
  metamask,
  myTokenBalance;

metamaskIntegration = async () => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      if (!currentAccount) {
        alertify.notify(
          "Wallet Connected Successfully",
          "success",
          5,
          function () {}
        );
      }
    } catch (error) {
      alertify.notify(
        error.message + " confirm from metamask/etheruem supported wallets",
        "error",
        5,
        function () {}
      );
      $("#alreadyStaker").css("display", "none");
      $("#newStaker").css("display", "none");
      $("#stakeappdisconnected").css("display", "block");
      $("#stakedapp").css("display", "none");

      // alert("Connect to metamask/ethereum based wallet");
    }
  } else if (window.web3) {
    metaMask = true;
    window.web3 = new Web3(web3.currentProvider);
  } else {
    metaMask = false;
    alertify.notify(
      "You should connect/install MetaMask first",
      "error",
      5,
      function () {}
    );
    // alert("You should connect/install MetaMask first");
    $("#alreadyStaker").css("display", "none");
    $("#newStaker").css("display", "none");
    $("#stakeappdisconnected").css("display", "block");
    $("#stakedapp").css("display", "none");
  }
  // window.ethereum.on("accountsChanged", function (_accounts) {});
  if (window.ethereum) {
    await web3.eth.getAccounts(function (error, result) {
      if (!error) {
        currentAccount = result[0];
      } else console.error(error);
    });
    net = await web3.eth.net.getNetworkType();
  }
};

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
      `<i class="fa fa-circle text-danger"></i>Connect Wallet`
    );
    // $("#connectwallet").css("border", "2px double var(--text-danger)");

    //genrate request for wallet connection

    initContract();
  });
  ethereum.on("chainChanged", (chainId) => {
    // window.location.reload();
    // net = web3.eth.net.getNetworkType();
    // initContract();
  });
}

initContract = () => {
  metamaskIntegration().then(() => {
    if (currentAccount) {
      $("#addressValue").text(`Address: ${currentAccount}`);
      $("#connectwallet").html(
        `<i class="fa fa-circle text-safe"></i>Connected`
      );
      // $("#connectwallet").css("border", "2px double var(--text-safe)");
    }

    if (net) {
      $("#netwrokID").text(`Network: ${net}`);
    }
  });
};

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  let t2 =
    months[t.getMonth()] +
    "/" +
    t.getDate() +
    "/" +
    t.getFullYear() +
    "  " +
    t.getHours() +
    ":" +
    t.getMinutes() +
    ":" +
    t.getSeconds();
  timestring = t;
  // return t;
  return t.toLocaleDateString() + " " + t.toLocaleTimeString() + " UTC";
}

// $(function () {});
