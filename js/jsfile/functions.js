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
  if (window.ethereum) {
    await web3.eth.getAccounts(function (error, result) {
      if (!error) {
        currentAccount = result[0];
      } else console.error(error);
    });
    net = await web3.eth.net.getNetworkType();
  }
};

getBlockNoAndDetails = async () => {
  await web3.eth.getBlockNumber(async (error, bkNo) => {
    if (!error) {
      blockNo = bkNo;
      web3.eth.getBlock(blockNo, false, (err, blockHashR) => {
        if (!err) {
          blockHash = blockHashR;
          blocktimeStamp = blockHash.timestamp;
          currentDate = blocktimeStamp - (blocktimeStamp % nextDay);
          lockTime = currentDate + 36000;
          candletime = currentDate + 57600;
          defaultDateSelection();
        } else console.error(err);
      });
    } else console.error(error);
  });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  //   timestring = t;
  // return t;
  return t.toLocaleDateString() + " " + t.toLocaleTimeString() + " UTC";
}

BTCLiveRate = () => {
  getRequest("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT").then(
    () => {
      // console.log(getRdata);
      BTCPrice = getRdata.price;
      $(".BTCPrice").text(BTCPrice);
    }
  );
};

getRequest = async (url) => {
  let kt;
  // urllink = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
  var jqxhr = await $.get(url, function (data) {
    // console.log("success");
    getRdata = data;
  })
    .done(function () {
      // console.log("second success");
    })
    .fail(function () {
      // console.log("error");
    })
    .always(function () {
      // console.log("finished");
      // return kt;
    });
};

refreshPrice = async () => {
  while (1) {
    BTCLiveRate();
    await sleep(1000);
  }
};

function Create2DArray(rows) {
  var arr = [];

  for (var icd = 0; icd < rows; icd++) {
    arr[icd] = [];
  }

  return arr;
}

initContract = () => {
  metamaskIntegration().then(() => {
    if (currentAccount) {
      $("#addressValue").text(`Address: ${currentAccount}`);
      $("#connectwallet").html(
        `<i class="fa fa-circle text-safe"></i>Connected`
      );
      // $("#connectwallet").css("border", "2px double var(--text-safe)");
      web3.eth.getBalance(currentAccount).then((data) => {
        $("#tokenBalance").text(
          "Balance: " + web3.utils.fromWei(data, "ether") + " ETH"
        );
      });
    }

    if (net) {
      $("#netwrokID").text(`Network: ${net}`);
    }
  });
};

initpriceContract = () => {
  metamaskIntegration()
    .then(() => {
      if (net == "main") {
        tokenadd = "0x56f7c2a441ccac31bd9e2ee232677d9265be390f";
        tokenabi = [
          {
            inputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
              },
            ],
            name: "decreaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "addedValue",
                type: "uint256",
              },
            ],
            name: "increaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "contract IERC20",
                name: "_token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenAmount",
                type: "uint256",
              },
            ],
            name: "withdrawStuckToken",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        pricepredictabi = [];
        pricepredictadd = "";
        transactionURL = "https://etherscan.io";
        if (net == "main") {
          $("#home").html("<h1>Please Switch to Ropsten Networt</h1>");
        } else if (net == "ropsten") {
        }
        //Live End
      } else if (net == "ropsten") {
        $("body").addClass("loading");
        let networkidname = web3.currentProvider.networkVersion;
        // console.log(networkidname);
        //Local Ropsten
        //candle token
        tokenadd = "0x0da354f07461de88785ad27f68cde7c527f82ea0";
        tokenabi = [
          {
            inputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
              },
            ],
            name: "decreaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "addedValue",
                type: "uint256",
              },
            ],
            name: "increaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "contract IERC20",
                name: "_token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenAmount",
                type: "uint256",
              },
            ],
            name: "withdrawStuckToken",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        // pricepredictadd = "0xBcBD34386aDC968ec3b24fCd7dDe817B26D7CCF5";
        // pricepredictadd = "0xa7bc3B4A284e5a521F3c7B6d00D0655Cf4EBA1EE";
        pricepredictadd = "0xD07E0E702242782EcA8221Aaec9C5f72039560e2";

        pricepredictabi = [
          {
            inputs: [
              {
                internalType: "bool",
                name: "_status",
                type: "bool",
              },
            ],
            name: "allowBidding",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_date",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_bid",
                type: "uint256",
              },
            ],
            name: "bidBTCPay",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_PlayerLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_playdate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_minPlayerCount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_bidBefore",
                type: "uint256",
              },
            ],
            name: "createGameSlot",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_date",
                type: "uint256",
              },
            ],
            name: "refundAll",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_gameFee",
                type: "uint256",
              },
            ],
            name: "setGameFee",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address payable",
                name: "_feesReceiver",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "_tokenAddr",
                type: "address",
              },
              {
                internalType: "address payable",
                name: "_feesReceiver",
                type: "address",
              },
            ],
            name: "setTokenAddresses",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "_tokenAddr",
                type: "address",
              },
              {
                internalType: "address",
                name: "_to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "transferAnyERC20Tokens",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address payable",
                name: "_winner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_winningBid",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_actualAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_date",
                type: "uint256",
              },
            ],
            name: "winnerSelection",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "withdrawAnyEther",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "_token",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_slotDate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_position",
                type: "uint256",
              },
            ],
            name: "BiddersAll",
            outputs: [
              {
                internalType: "address",
                name: "player",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bid",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "bidTime",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_slotDate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_position",
                type: "uint256",
              },
            ],
            name: "BiddersUser",
            outputs: [
              {
                internalType: "address",
                name: "player",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bid",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "bidTime",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "biddingStatus",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "gamefee",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "GamePlay",
            outputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minPlayer",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "PlayerLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "DateSlot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "playersCounts",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "winningBid",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "actualAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "bidBefore",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "winner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountWon",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isRefunded",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "GamePlaySlot",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_slotDate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_slot",
                type: "uint256",
              },
            ],
            name: "playerinfoUser",
            outputs: [
              {
                internalType: "uint256",
                name: "slot",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "position",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_slotDate",
                type: "uint256",
              },
            ],
            name: "playerSlotCountUser",
            outputs: [
              {
                internalType: "uint256",
                name: "noOfSlot",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];

        transactionURL = "https://ropsten.etherscan.io";
      }
      token = new web3.eth.Contract(tokenabi, tokenadd);
      pricepredict = new web3.eth.Contract(pricepredictabi, pricepredictadd);
    })
    .then(() => {
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
    })
    .then(getBlockNoAndDetails())
    .then(() => {
      // console.log(currentDate);
      //Token Balance
      if (currentAccount) {
        web3.eth.getBalance(currentAccount).then((data) => {
          $("#tokenBalance").text(
            "Balance: " + web3.utils.fromWei(data, "ether") + " ETH"
          );
        });
        token.methods
          .balanceOf(currentAccount)
          .call()
          .then((balance) => {
            // $("#tokenBalance").text(
            //   "Balance: " + web3.utils.fromWei(balance, "ether") + " LEO"
            // );
            myTokenBalance = balance;
          })
          .then(() => {
            //allowance
            token.methods
              .allowance(currentAccount, pricepredictadd)
              .call()
              .then((_approvedAmount) => {
                approvedAmount = _approvedAmount;
                // console.log(approvedAmount);
                // console.log(myTokenBalance);
                if (+approvedAmount >= +myTokenBalance) {
                  //write condition for start playing
                  $(".isTransApproved").hide();
                  $(".TransApproved").show();
                } else {
                  //need to approve first to start playing isTransApproved
                  $(".isTransApproved").show();
                  $(".TransApproved").hide();
                }
              });
          });

        //GameFee //GameFee,
        pricepredict.methods
          .gamefee()
          .call()
          .then((_gameFee) => {
            // $("#unstakingRate").text(
            //   "Unstaking Rate: " + _gameFee / 100 + " %"
            // );
            GameFee = _gameFee;
          });

        //Owner  priceOwner
        pricepredict.methods
          .owner()
          .call()
          .then((_priceOwner) => {
            if (currentAccount == _priceOwner) {
              $("#PricePredictOwner").css("display", "flex");
            }
            priceOwner = _priceOwner;
          });

        //let availableGameSlot;
        if (!selectedDateForGameSlot) {
          selectedDateForGameSlot = currentDate;
        }
        if (!selectedDateForGameHistory) {
          selectedDateForGameHistory = currentDate;
        }
        if (!selectedDateForGameHistoryAll) {
          selectedDateForGameHistoryAll = currentDate;
        }
        if (!currentDate) {
          nowtime = new Date();
          nowtime = nowtime.getTime() / 1000;
          nowtime -= nowtime % nextDay;
          selectedDateForGameSlot = nowtime;
          selectedDateForGameHistory = nowtime;
          selectedDateForGameHistoryAll = nowtime;
        } else {
        }
        if (!GameSlot[0]) {
          pricepredict.methods
            .GamePlaySlot(selectedDateForGameSlot)
            .call()
            .then((_availableGameSlot) => {
              availableGameSlot = _availableGameSlot;
            })
            .then(async () => {
              for (i = 0; i < availableGameSlot; i++) {
                await pricepredict.methods
                  .GamePlay(selectedDateForGameSlot, i)
                  .call()
                  .then((_slotDetail) => {
                    GameSlot[i] = _slotDetail;
                  });
              }

              defaultSlotSelection();
              // searchPlayersGameHistory();
            });
        } else {
          // console.log(GameSlot[0]);
          $("body").removeClass("loading");
        }

        if (!GameSlotHistory[0]) {
          pricepredict.methods
            .GamePlaySlot(selectedDateForGameHistory)
            .call()
            .then((_availableGameSlot) => {
              availableGameSlotforHistory = _availableGameSlot;
            })
            .then(async () => {
              for (ii = 0; ii < availableGameSlotforHistory; ii++) {
                await pricepredict.methods
                  .GamePlay(selectedDateForGameHistory, ii)
                  .call()
                  .then((_slotDetail) => {
                    GameSlotHistory[ii] = _slotDetail;
                  });
              }

              // defaultSlotSelection();
              searchPlayersGameHistory();
            });
        } else {
          // console.log(GameSlot[0]);
          $("body").removeClass("loading");
        }
        if (!GameSlotHistoryAll[0]) {
          pricepredict.methods
            .GamePlaySlot(selectedDateForGameHistoryAll)
            .call()
            .then((_availableGameSlot) => {
              availableGameSlotforHistoryAll = _availableGameSlot;
            })
            .then(async () => {
              for (iii = 0; iii < availableGameSlotforHistoryAll; iii++) {
                await pricepredict.methods
                  .GamePlay(selectedDateForGameHistory, iii)
                  .call()
                  .then((_slotDetail) => {
                    GameSlotHistoryAll[iii] = _slotDetail;
                  });
              }

              // defaultSlotSelection();
              // searchPlayersGameHistoryAll();
              searchPlayersGameHistoryAll();
            });
        } else {
          // console.log(GameSlot[0]);
          $("body").removeClass("loading");
        }
      }
    });
};

defaultDateSelection = () => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(currentDate);
  var today = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  if (!$("#gameSlot_SelectDate").val()) {
    $("#gameSlot_SelectDate").val(today);
  }
  if (!$("#gameSlot_HistoryDate").val()) {
    $("#gameSlot_HistoryDate").val(today);
  }
  if (!$("#gameSlot_HistoryAllDate").val()) {
    $("#gameSlot_HistoryAllDate").val(today);
  }
};

defaultSlotSelection = () => {
  // let slotdata = '<option value="-1">Select Slot</option>';
  let slotoptiongrid = `<div class="slotheader">
    <div class="slotno slotheaderchild">
      Slot No.
    </div>
    <div class="pamount slotheaderchild">
      Participation Amount <br />
      (in ETH)
    </div>
    <div class="minplayer slotheaderchild">Min Players Required</div>
    <div class="maxplayer slotheaderchild">Max Players Limit</div>
    <div class="playerregistered slotheaderchild">
      Players Registered
    </div>
    <div class="lastbidtime slotheaderchild">Closing Time</div>
    <div class="participate slotheaderchild"></div>
  </div>`;
  for (i = 0; i < availableGameSlot; i++) {
    //slot option grid Creation
    slotoptiongrid =
      slotoptiongrid +
      `<div class="slotbody">
        <div class="slotno slotbodychild">Slot No. ${i + 1}</div>
          <div class="pamount slotbodychild">${web3.utils.fromWei(
            GameSlot[i]["amount"],
            "ether"
          )} ETH</div>
          <div class="minplayer slotbodychild">${GameSlot[i]["minPlayer"]}</div>
          <div class="maxplayer slotbodychild">${
            GameSlot[i]["PlayerLimit"]
          }</div>
          <div class="playerregistered slotbodychild">
          ${GameSlot[i]["playersCounts"]}
          </div>
          <div class="lastbidtime slotbodychild">${toDateTime(
            GameSlot[i]["bidBefore"]
          )}</div>
          <div class="participate slotbodychild participatebtn" id="slotid${i}" onclick="participategetByID(${i})">Participate</div>
          </div>
          <div class="slotselectionToparticipate slotid${i}"></div>`;
  }
  if (availableGameSlot == 0) {
    slotoptiongrid = `<div class="slotselectionToparticipate">No slots available for given date</div>`;
  }
  // $("#availableGameSlot").html(slotdata);
  $(".slotcontainer").html(slotoptiongrid);
  for (i = 0; i < availableGameSlot; i++) {
    if (GameSlot[i]["PlayerLimit"] == GameSlot[i]["playersCounts"]) {
      $(`#slotid${i}`).html("Slot is Full");
      $(`#slotid${i}`).prop("disabled", true);
    }
  }
  // $("#availableGameSlot").show();
  $("body").removeClass("loading");
};

searchSelectedDateSlot = async () => {
  $("body").addClass("loading");
  selectedDateForGameSlot =
    new Date($("#gameSlot_SelectDate").val()).getTime() / 1000;

  if (!selectedDateForGameSlot) {
    selectedDateForGameSlot = currentDate;
  }
  if (!currentDate) {
    nowtime = new Date();
    nowtime = nowtime.getTime() / 1000;
    nowtime -= nowtime % nextDay;
    selectedDateForGameSlot = nowtime;
  } else {
  }
  pricepredict.methods
    .GamePlaySlot(selectedDateForGameSlot)
    .call()
    .then((_availableGameSlot) => {
      availableGameSlot = _availableGameSlot;
    })
    .then(async () => {
      for (il = 0; il < availableGameSlot; il++) {
        await pricepredict.methods
          .GamePlay(selectedDateForGameSlot, il)
          .call()
          .then((_slotDetail) => {
            GameSlot[il] = _slotDetail;
          });
      }
      defaultSlotSelection();
    });
};

participategetByID = async (_slot) => {
  // console.log(_slot, "date", selectedDateForGameSlot);
  //for show
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(selectedDateForGameSlot);
  var today = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  if (GameSlot[_slot]["PlayerLimit"] != GameSlot[_slot]["playersCounts"]) {
    if ($(`.slotid${_slot}`).html() == "") {
      $(`.slotid${_slot}`).html(`
      <div class="participatepanel">
                  <div class="createParticipateForm">
                    <div class="rowContainerParticipate">
                      <div class="inputStyle">
                        <div class="inputLabel">Selected Date:</div>
                        <div id="gameSlot_SelectedDate">${today}</div>
                      </div>
                      <div class="inputStyle">
                        <div class="inputLabel">Slot No.:</div>
                        <div id="gameSlot_SelectedSlot">${_slot + 1}</div>
                      </div>
  
                      <div class="inputStyle">
                        <div class="inputLabel">Prediction Fee (ETH):</div>
  
                        <div id="gameSlot_SelectedAmount">${web3.utils.fromWei(
                          GameSlot[_slot]["amount"],
                          "ether"
                        )} ETH</div>
                      </div>
                    </div>
                    <div class="rowContainerParticipate">
                      <div class="inputStyle">
                        <div class="inputLabel">
                          Place Prediction Price(upto 2 decimal):
                        </div>
                        <input
                          type="number"
                          autocomplete="off"
                          min="0"
                          step="0.01"
                          pattern="^\\d*(\\.\\d{0,2})?$"
                          id="gameSlot_amountPrediction${_slot}"
                          class="theme-color-btn-input"
                          placeholder="BTC predicting price"
                        />
                      </div>
                      <div class="inputStyle currentBTCPrice">
                        <div class="inputLabel BTCname">BTC/USDT:</div>
                        <div class="BTCPrice pricePredictedbyUser${_slot}">${BTCPrice}</div>
                      </div>
                    </div>
                    <div class="rowContainerParticipate">
                      <div class="Transbtn isTransApproved participateApprovebtn${_slot}" onclick="ApprovePricePredictContact(${_slot})">Approve</div>
                      <div class="Transbtn TransApproved btcpredictpriceSubmit${_slot}" onclick="BTCPricePredictContact(${_slot})">
                        Submit
                      </div>
                    </div>
                    <div class="rowContainerParticipate">
                      <div class="msgFooter" id="btcpredictpricemsg${_slot}">To book your prediction you need to approve owr contract first, then Submit button will popup. Press it to register/book your prediction</div>
                    </div>
                  </div>
                </div>
      `);
      // if (+approvedAmount == "0") {
      //   $(".isTransApproved").show();
      //   $(".TransApproved").hide();
      // } else if (+approvedAmount >= +myTokenBalance) {
      //write condition for start playing
      $(".isTransApproved").hide();
      $(".TransApproved").show();
      $(`#btcpredictpricemsg${_slot}`).html(
        "Almost there! Your are just one step away, Click on Submit Button to place your Predicted Price"
      );
      // } else {
      //   //need to approve first to start playing isTransApproved
      //   $(".isTransApproved").show();
      //   $(".TransApproved").hide();
      // }
    }
    //for hide
    else {
      $(`.slotid${_slot}`).html("");
    }
  }
};

ApprovePricePredictContact = async (_slot) => {
  if (currentAccount) {
    token.methods
      // .approve(stakeadd, "300")
      .approve(pricepredictadd, "340000000000000000000000")
      .send({ from: currentAccount })
      .on("transactionHash", function (hash) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        alertify.notify(hash, "success", 5, function () {
          // console.log("dismissed");
        });
        $(`#btcpredictpricemsg${_slot}`).html(
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
        initpriceContract();
        $(`#btcpredictpricemsg${_slot}`).html(
          `Almost there! Your are just one step away, Click on Submit Button to place your Predicted Price`
        );
        setTimeout(function () {
          // $("#successModal").modal("hide");
          // $("#btnStake").removeAttr("disabled");
          // $("#approval-section").addClass("d-none");
        }, 2000);
      });
  }
};

BTCPricePredictContact = async (_slot) => {
  if (currentAccount) {
    if ($.trim($(`#gameSlot_amountPrediction${_slot}`).val()).length == 0) {
      // $("#msgArea").text("Kindly insert a valid token value");
      alertify.notify(
        "Can't predict zero/invalid amount",
        "error",
        5,
        function () {
          // console.log("dismissed");
        }
      );
    } else if (isNaN($(`#gameSlot_amountPrediction${_slot}`).val())) {
      // $("#msgArea").text("Kindly insert a valid token value");
      alertify.notify(
        "Please provide valid price value",
        "error",
        5,
        function () {
          // console.log("dismissed");
        }
      );
    } else {
      let gasprice = await web3.eth.getGasPrice();
      // console.log(gasprice);
      // console.log($(`#gameSlot_amountPrediction${_slot}`).val() * 10000);
      try {
        pricepredict.methods
          .bidBTCPay(
            selectedDateForGameSlot,
            _slot,
            parseInt($(`#gameSlot_amountPrediction${_slot}`).val() * 10000)
          )
          .send({
            from: currentAccount,
            gasPrice: gasprice,
            value: GameSlot[_slot].amount,
          })
          .on("transactionHash", function (hash) {
            // $("#approveBtn").attr("disabled", "");
            // $("#approveBtn").find(".before-click").addClass("d-none");
            // $("#approveBtn").find(".after-click").removeClass("d-none");
            $(`#btcpredictpricemsg${_slot}`).html(
              `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/${hash}\">${transactionURL}/tx/${hash}</a><div class="lds-dual-ring-small"></div>`
            );
          })
          .on("error", function (error) {
            // $("#approveBtn").attr("disabled", "");
            // $("#approveBtn").find(".before-click").addClass("d-none");
            // $("#approveBtn").find(".after-click").removeClass("d-none");
            // console.log(error);
            $(`#btcpredictpricemsg${_slot}`).html(error.message);
            alertify.notify(error.message, "error", 5, function () {
              // console.log("dismissed");
            });
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            // $("#approveBtn").removeAttr("disabled");
            // $("#approveBtn").find(".after-click").addClass("d-none");
            // $("#approveBtn").find(".before-click").removeClass("d-none");
            // $("#successModal").modal("show");
            initpriceContract();
            $(`#btcpredictpricemsg${_slot}`).html(
              `Transaction Successfull, Best of luck for the result`
            );
            setTimeout(function () {
              // $("#successModal").modal("hide");
              // $("#btnStake").removeAttr("disabled");
              // $("#approval-section").addClass("d-none");
            }, 2000);
          });
      } catch (err) {
        console.log(err);
        $(`#btcpredictpricemsg${_slot}`).html(err);
        alertify.notify(err, "error", 5, function () {
          // console.log("dismissed");
        });
      }
    }
  }
};

GameHistorygetByID = async (_slot) => {
  let gammerHistorySlot = `<div class="Historypanel">
  <div class="HistorycontainerGrid">
    <div class="slothistoryheader">
    <div class="historyheadercol yourPosition">
        Reg. No
      </div>
      <div class="historyheadercol yourPrediction">
        Your Prediction
      </div>
      <div class="historyheadercol predictionTime">
        Prediction Time
      </div>
      <div class="historyheadercol slotStatus">Slot Status</div>
      <div class="historyheadercol winningPrediction">
        Winner Predicted Value
      </div>
      <div class="historyheadercol actualValue">Exact Value</div>
    </div>`;
  for (ih = 0; ih < PlayerInfoCount.length; ih++) {
    if (PlayerInfoCount[ih]["slot"] == _slot) {
      // console.log(PlayerInfoCount[ih]["position"]);

      let StolStatus = "";
      let winnerPredictedValue = "";
      let ExactValue = "";
      if (GameSlotHistory[_slot]["isRefunded"] == true) {
        StolStatus = "Cancelled  and Refunded";
        winnerPredictedValue = "Not Available";
        ExactValue = "Not Available";
        // console.log(StolStatus);
      } else if (GameSlotHistory[_slot]["isActive"] == true) {
        StolStatus = "Pending";
        winnerPredictedValue = "Not Available";
        ExactValue = "Not Available";
      } else if (GameSlotHistory[_slot]["isActive"] == false) {
        StolStatus = "Closed";
        winnerPredictedValue = GameSlotHistory[_slot]["winningBid"] / 10000;
        ExactValue = GameSlotHistory[_slot]["actualAmount"] / 10000;
      }

      gammerHistorySlot =
        gammerHistorySlot +
        `<div class="slothistorybody">
          <div class="historybodycol yourPosition">
            ${+PlayerInfoCount[ih]["position"] + 1}
          </div>
          <div class="historybodycol yourPrediction">
            ${PlayerBidderHistory[_slot][ih]["bid"] / 10000}
          </div>
          <div class="historybodycol predictionTime">
          ${toDateTime(PlayerBidderHistory[_slot][ih]["bidTime"])}
          </div>
          <div class="historybodycol slotStatus">${StolStatus}</div>
          <div class="historybodycol winningPrediction">
            ${winnerPredictedValue}
          </div>
          <div class="historybodycol actualValue">${ExactValue}</div>
        </div>`;
    }
  }

  gammerHistorySlot = gammerHistorySlot + `</div></div>`;

  if ($(`.historyslotid${_slot}`).html() == "") {
    $(`.historyslotid${_slot}`).html(gammerHistorySlot);
  } else {
    $(`.historyslotid${_slot}`).html("");
  }
};

HistorySlotSelection = () => {
  let slotoptiongrid = `<div class="slotheader">
    <div class="slotno slotheaderchild">
      Slot No.
    </div>
    <div class="pamount slotheaderchild">
      Participation Amount <br />
      (in ETH)
    </div>
    <div class="minplayer slotheaderchild">Min Players Required</div>
    <div class="maxplayer slotheaderchild">Max Players Limit</div>
    <div class="playerregistered slotheaderchild">
      Players Registered
    </div>
    <div class="lastbidtime slotheaderchild">Closing Time</div>
    <div class="participate slotheaderchild"></div>
  </div>`;
  for (i = 0; i < availableGameSlotforHistory; i++) {
    if (PlayerBidderHistory[i].length != 0) {
      slotoptiongrid =
        slotoptiongrid +
        `<div class="slotbody">
        <div class="slotno slotbodychild">Slot No. ${i + 1}</div>
          <div class="pamount slotbodychild">${web3.utils.fromWei(
            GameSlotHistory[i]["amount"],
            "ether"
          )} ETH</div>
          <div class="minplayer slotbodychild">${
            GameSlotHistory[i]["minPlayer"]
          }</div>
          <div class="maxplayer slotbodychild">${
            GameSlotHistory[i]["PlayerLimit"]
          }</div>
          <div class="playerregistered slotbodychild">
          ${GameSlotHistory[i]["playersCounts"]}
          </div>
          <div class="lastbidtime slotbodychild">${toDateTime(
            GameSlotHistory[i]["bidBefore"]
          )}</div>
          <div class="participate slotbodychild participatebtn" id="historyslotid${i}" onclick="GameHistorygetByID(${i})">View</div>
          </div>
          <div class="slotselectionforHistory historyslotid${i}"></div>`;
    }
  }
  if (playerslotcount == 0) {
    slotoptiongrid = `<div class="slotselectionforHistory">No slots available for given date</div>`;
  }
  // $("#availableGameSlot").html(slotdata);
  $(".slotHistorycontainer").html(slotoptiongrid);
  // for (i = 0; i < availableGameSlotforHistory; i++) {
  //   if (
  //     GameSlotHistory[i]["PlayerLimit"] == GameSlotHistory[i]["playersCounts"]
  //   ) {
  //     $(`#historyslotid${i}`).html("Slot is Full");
  //     $(`#historyslotid${i}`).prop("disabled", true);
  //   }
  // }
  // $("#availableGameSlot").show();
  $("body").removeClass("loading");
};

searchPlayersGameHistory = async () => {
  $("body").addClass("loading");
  selectedDateForGameHistory =
    new Date($("#gameSlot_HistoryDate").val()).getTime() / 1000;

  if (!selectedDateForGameHistory) {
    selectedDateForGameHistory = currentDate;
  }
  if (!currentDate) {
    nowtime = new Date();
    nowtime = nowtime.getTime() / 1000;
    nowtime -= nowtime % nextDay;
    selectedDateForGameHistory = nowtime;
  } else {
  }

  pricepredict.methods
    .GamePlaySlot(selectedDateForGameHistory)
    .call()
    .then((_availableGameSlotforHistory) => {
      availableGameSlotforHistory = _availableGameSlotforHistory;
      // PlayerBidderHistory = Create2DArray(availableGameSlotforHistory);
    })
    .then(async () => {
      for (ip = 0; ip < availableGameSlotforHistory; ip++) {
        await pricepredict.methods
          .GamePlay(selectedDateForGameHistory, ip)
          .call()
          .then((_slotDetail) => {
            GameSlotHistory[ip] = _slotDetail;
            PlayerBidderHistory[ip] = [];
          });
      }
    })
    .then(() => {
      pricepredict.methods
        .playerSlotCountUser(selectedDateForGameHistory)
        .call({ from: currentAccount })
        .then((_playerslotcount) => {
          playerslotcount = _playerslotcount;
        })
        .then(async () => {
          // console.log(playerslotcount);
          for (ipn = 0; ipn < playerslotcount; ipn++) {
            await pricepredict.methods
              .playerinfoUser(selectedDateForGameHistory, ipn)
              .call({ from: currentAccount })
              .then((_playerposition) => {
                PlayerInfoCount[ipn] = _playerposition;

                // console.log(_playerposition);
              });
          }
          // defaultSlotSelection();
          // $("body").removeClass("loading");
        })
        .then(async () => {
          if (playerslotcount != 0) {
            for (ipnn = 0; ipnn < playerslotcount; ipnn++) {
              await pricepredict.methods
                .BiddersUser(
                  selectedDateForGameHistory,
                  PlayerInfoCount[ipnn]["slot"],
                  PlayerInfoCount[ipnn]["position"]
                )
                .call({ from: currentAccount })
                .then((_BidderDetail) => {
                  PlayerBidderHistory[PlayerInfoCount[ipnn]["slot"]][
                    ipnn
                  ] = _BidderDetail;
                });
            }

            HistorySlotSelection();
          } else {
            PlayerBidderHistory = [];
          }
          $("body").removeClass("loading");
        });
    });
};

GameHistoryAllgetByID = async (_slot) => {
  let gammerHistorySlot = `<div class="Historypanel">
  <div class="HistorycontainerGridAll">
    <div class="slothistoryheader">
    <div class="historyheadercol yourPosition">Reg. No</div>
      <div class="historyheadercol playersAddress">Player Address</div>
      <div class="historyheadercol yourPrediction">Player's Prediction</div>
      <div class="historyheadercol predictionTime">Prediction Time</div>
      <div class="historyheadercol winningPrediction">Winner Predicted Value</div>
      <div class="historyheadercol actualValue">Exact Value</div>
    </div>`;
  let winnercontainerstart = ``;
  let winnercontainerData = ``;
  let winnercontainerend = ``;
  let StolStatus = "";
  let winnerPredictedValue = "";
  let ExactValue = "";
  let Showwinner = false;
  if (GameSlotHistoryAll[_slot]["isRefunded"] == true) {
    StolStatus = "Cancelled  and Refunded";
    winnerPredictedValue = "Not Available";
    ExactValue = "Not Available";
    // console.log(StolStatus);
  } else if (GameSlotHistoryAll[_slot]["isActive"] == true) {
    StolStatus = "Pending";
    winnerPredictedValue = "Not Available";
    ExactValue = "Not Available";
  } else if (GameSlotHistoryAll[_slot]["isActive"] == false) {
    StolStatus = "Closed";
    winnerPredictedValue = GameSlotHistoryAll[_slot]["winningBid"] / 10000;
    ExactValue = GameSlotHistoryAll[_slot]["actualAmount"] / 10000;
    Showwinner = true;
    winnercontainerstart = `<div class="slotselectionforWinner">`;
    winnercontainerData = `<div class="winnerContainer">
      <div class="winnerheader"><h3>Winner Details</h3></div>
      <div class="playerdetails">
        <div class="playerAddress">
          <div class="playerAddresschild playerAddressTitle">
            Winner Address:
          </div>
          <div class="playerAddressChild playerAddressValue">
           ${GameSlotHistoryAll[_slot]["winner"]}
          </div>
        </div>
        <div class="playerAddress">
          <div class="playerValuechild playerTitle">
            Tokens Won:
          </div>
          <div class="playerValueChild playerValue">${web3.utils.fromWei(
            GameSlotHistoryAll[_slot]["amountWon"],
            "ether"
          )} ETH</div>
        </div>
      </div>
      <div class="playerdetails">
        <div class="playerAddress">
          <div class="playerValuechild playerTitle">
            Predicted Price:
          </div>
          <div class="playerValueChild playerValue">${winnerPredictedValue}</div>
        </div>
        <div class="playerAddress">
          <div class="playerValuechild playerTitle">
            Actual Price:
          </div>
          <div class="playerValueChild playerValue">${ExactValue}</div>
        </div>
      </div>
    </div>`;
    winnercontainerend = `</div>`;
  }

  for (ih = 0; ih < PlayerBidderHistoryAll[_slot].length; ih++) {
    // if (PlayerInfoCount[ih]["slot"] == _slot) {
    // console.log(PlayerInfoCount[ih]["position"]);

    console.log(ih);
    gammerHistorySlot =
      gammerHistorySlot +
      `<div class="slothistorybody">
          <div class="historybodycol yourPosition">
            ${ih + 1}
          </div>
          <div class="historybodycol playersAddress">
          ${PlayerBidderHistoryAll[_slot][ih]["player"]}
        </div>
          <div class="historybodycol yourPrediction">
            ${PlayerBidderHistoryAll[_slot][ih]["bid"] / 10000}
          </div>
          <div class="historybodycol predictionTime">
          ${toDateTime(PlayerBidderHistoryAll[_slot][ih]["bidTime"])}
          </div>
          <div class="historybodycol winningPrediction">
            ${winnerPredictedValue}
          </div>
          <div class="historybodycol actualValue">${ExactValue}</div>
        </div>`;
  }

  gammerHistorySlot =
    gammerHistorySlot +
    winnercontainerstart +
    winnercontainerData +
    winnercontainerend +
    `</div></div>`;

  if ($(`.historyslotidAll${_slot}`).html() == "") {
    $(`.historyslotidAll${_slot}`).html(gammerHistorySlot);
  } else {
    $(`.historyslotidAll${_slot}`).html("");
  }
};

HistorySlotSelectionAll = () => {
  let slotoptiongrid = `<div class="slotheader">
    <div class="slotno slotheaderchild">
      Slot No.
    </div>
    <div class="pamount slotheaderchild">
      Participation Amount <br />
      (in ETH)
    </div>
    <div class="minplayer slotheaderchild">Min Players Required</div>
    <div class="maxplayer slotheaderchild">Max Players Limit</div>
    <div class="playerregistered slotheaderchild">
      Players Registered
    </div>
    <div class="SlotStatus slotheaderchild">Slot Status</div>
    <div class="lastbidtime slotheaderchild">Closing Time</div>
    <div class="participate slotheaderchild"></div>
  </div>`;
  for (ihs = 0; ihs < availableGameSlotforHistoryAll; ihs++) {
    if (PlayerBidderHistoryAll[ihs].length != 0) {
      let StolStatus = "";
      // let winnerPredictedValue = "";
      // let ExactValue = "";
      if (GameSlotHistoryAll[ihs]["isRefunded"] == true) {
        StolStatus = "Cancelled  and Refunded";
        // winnerPredictedValue = "Not Available";
        // ExactValue = "Not Available";
        // console.log(StolStatus);
      } else if (GameSlotHistoryAll[ihs]["isActive"] == true) {
        StolStatus = "Pending";
        // winnerPredictedValue = "Not Available";
        // ExactValue = "Not Available";
      } else if (GameSlotHistoryAll[ihs]["isActive"] == false) {
        StolStatus = "Winner Selected";
        // winnerPredictedValue = GameSlotHistoryAll[i]["winningBid"] / 10000;
        // ExactValue = GameSlotHistoryAll[i]["actualAmount"] / 10000;
      }

      slotoptiongrid =
        slotoptiongrid +
        `<div class="slotbody">
        <div class="slotno slotbodychild">Slot No. ${ihs + 1}</div>
          <div class="pamount slotbodychild">${web3.utils.fromWei(
            GameSlotHistoryAll[ihs]["amount"],
            "ether"
          )} ETH</div>
          <div class="minplayer slotbodychild">${
            GameSlotHistoryAll[ihs]["minPlayer"]
          }</div>
          <div class="maxplayer slotbodychild">${
            GameSlotHistoryAll[ihs]["PlayerLimit"]
          }</div>
          <div class="playerregistered slotbodychild">
          ${GameSlotHistoryAll[ihs]["playersCounts"]}
          </div>
          <div class="SlotStatus slotbodychild">${StolStatus}</div>
          <div class="lastbidtime slotbodychild">${toDateTime(
            GameSlotHistoryAll[ihs]["bidBefore"]
          )}</div>
          <div class="participate slotbodychild participatebtn" id="historyslotidAll${ihs}" onclick="GameHistoryAllgetByID(${ihs})">View</div>
          </div>
          <div class="slotselectionforHistoryAll historyslotidAll${ihs}"></div>`;
    }
  }
  if (availableGameSlotforHistoryAll == 0) {
    slotoptiongrid = `<div class="slotselectionforHistoryAll">No slots available for given date</div>`;
  }
  // $("#availableGameSlot").html(slotdata);
  $(".slotHistoryAllcontainer").html(slotoptiongrid);
  // for (i = 0; i < availableGameSlotforHistory; i++) {
  //   if (
  //     GameSlotHistory[i]["PlayerLimit"] == GameSlotHistory[i]["playersCounts"]
  //   ) {
  //     $(`#historyslotid${i}`).html("Slot is Full");
  //     $(`#historyslotid${i}`).prop("disabled", true);
  //   }
  // }
  // $("#availableGameSlot").show();
  $("body").removeClass("loading");
};

searchPlayersGameHistoryAll = async () => {
  getBlockNoAndDetails().then(() => {
    $("body").addClass("loading");
    selectedDateForGameHistoryAll =
      new Date($("#gameSlot_HistoryAllDate").val()).getTime() / 1000;

    if (!selectedDateForGameHistoryAll) {
      selectedDateForGameHistoryAll = currentDate;
    }
    if (!currentDate) {
      nowtime = new Date();
      nowtime = nowtime.getTime() / 1000;
      nowtime -= nowtime % nextDay;
      selectedDateForGameHistoryAll = nowtime;
    } else {
    }

    pricepredict.methods
      .GamePlaySlot(selectedDateForGameHistoryAll)
      .call()
      .then((_availableGameSlotforHistoryAll) => {
        availableGameSlotforHistoryAll = _availableGameSlotforHistoryAll;
        // PlayerBidderHistoryAll = Create2DArray(availableGameSlotforHistoryAll);
      })
      .then(async () => {
        for (ig = 0; ig < availableGameSlotforHistoryAll; ig++) {
          await pricepredict.methods
            .GamePlay(selectedDateForGameHistoryAll, ig)
            .call()
            .then((_slotDetailAll) => {
              GameSlotHistoryAll[ig] = _slotDetailAll;
              PlayerBidderHistoryAll[ig] = [];
            });
        }
      })
      .then(async () => {
        if (availableGameSlotforHistoryAll != 0) {
          for (ik = 0; ik < availableGameSlotforHistoryAll; ik++) {
            if (+GameSlotHistoryAll[ik]["bidBefore"] < +blockHash.timestamp)
              for (jk = 0; jk < GameSlotHistoryAll[ik]["playersCounts"]; jk++) {
                await pricepredict.methods
                  .BiddersAll(selectedDateForGameHistoryAll, ik, jk)
                  .call()
                  .then((_BidderDetailkk) => {
                    PlayerBidderHistoryAll[ik][jk] = _BidderDetailkk;
                  });
              }
          }

          HistorySlotSelectionAll();
        } else {
          PlayerBidderHistoryAll = [];
        }
        $("body").removeClass("loading");
      });
  });
};
