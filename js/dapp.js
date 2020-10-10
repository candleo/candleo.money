let tokenabi, stakeabi, transactionURL;
let tokenadd; //token contract address
let stakeadd; //Stake contract address
let net; //current network
let accounts,stakingFee,UnstakingFee,RedeemFee,
  stakeHolderAc,
  timestring,
  currentAccount,
  STAKINGCONTRACT,
  _maxStatus="enable",
  XFICONTRACT,
  metamask,
  myTokenBalance,
  allowances = 0,
  XFIBalance = 0;

metamaskIntegration = async () => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      if(!currentAccount){
      alertify.notify(
        "Wallet Connected Successfully",
        "success",
        5,
        function () {}
      );}
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
  await web3.eth.getAccounts(function (error, result) {
    if (!error) {
      currentAccount = result[0];
    } else console.error(error);
  });
  net = await web3.eth.net.getNetworkType();
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
    $("#connectwallet").css("border", "2px double var(--text-danger)");

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
  metamaskIntegration()
    .then(() => {
      if (net == "main") {
        tokenadd = "0x05D27CdD23E22ca63e7f9c7C6D1B79ede9C4fCF5";
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
        ];
        stakeabi = [
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "token",
                type: "address",
              },
              {
                internalType: "address",
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
            inputs: [],
            name: "FeesCollectedAll",
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
                internalType: "address",
                name: "_holder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "count",
                type: "uint256",
              },
            ],
            name: "RewardReportList",
            outputs: [
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
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "Staker",
            outputs: [
              {
                internalType: "uint256",
                name: "unclaimedRewards",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lastTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakes",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "claimCount",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "_isStaker",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "_possibleUnstakeTime",
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
            name: "_rewardInterval",
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
                internalType: "bool",
                name: "_status",
                type: "bool",
              },
            ],
            name: "allowStaking",
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
            name: "feesReceiver",
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
                internalType: "address",
                name: "_address",
                type: "address",
              },
            ],
            name: "isStakeholder",
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
            inputs: [],
            name: "redeemRewards",
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
                name: "_stake",
                type: "uint256",
              },
            ],
            name: "removeStake",
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
            name: "rewardFeeRate",
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
                internalType: "address",
                name: "_stakeholder",
                type: "address",
              },
            ],
            name: "rewardOf",
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
            name: "rewardRate",
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
                name: "rewardInterval",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "possibleUnstakeTime",
                type: "uint256",
              },
            ],
            name: "setRewardInterwal",
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
                name: "newRewardRate",
                type: "uint256",
              },
            ],
            name: "setRewardRate",
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
                internalType: "uint256",
                name: "_yfpiToken",
                type: "uint256",
              },
            ],
            name: "stakeNow",
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
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "stakesOf",
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
            name: "stakingFeeRate",
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
                name: "_stakingFeeRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_unstakingFeeRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_rewardFeeRate",
                type: "uint256",
              },
            ],
            name: "stakingFeeRateSet",
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
            name: "stakingStatus",
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
            name: "totalHolders",
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
            name: "totalInvestedFunds",
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
            name: "totalRewardDistributed",
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
            name: "totalStakes",
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
            inputs: [],
            name: "unstakingFeeRate",
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
        ];
        stakeadd = "0x6888a15279d6b6244c8bb24ec2a62a961a919658";
        transactionURL = "https://etherscan.io";

        //Live End
      } else if (net == "ropsten") {
        let networkidname = web3.currentProvider.networkVersion;
        console.log(networkidname);
        //Local Ropsten

        tokenadd = "0x1Ab4C5C48D793F97562334FFb3a2a5EE2442b279";
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
        ];
        stakeabi = [
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "token",
                type: "address",
              },
              {
                internalType: "address",
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
            inputs: [],
            name: "FeesCollectedAll",
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
                internalType: "address",
                name: "_holder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "count",
                type: "uint256",
              },
            ],
            name: "RewardReportList",
            outputs: [
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
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "Staker",
            outputs: [
              {
                internalType: "uint256",
                name: "unclaimedRewards",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lastTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakes",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "claimCount",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "_isStaker",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "_possibleUnstakeTime",
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
                internalType: "bool",
                name: "_status",
                type: "bool",
              },
            ],
            name: "allowStaking",
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
            name: "feesReceiver",
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
                internalType: "address",
                name: "_address",
                type: "address",
              },
            ],
            name: "isStakeholder",
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
            inputs: [],
            name: "redeemRewards",
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
                name: "_stake",
                type: "uint256",
              },
            ],
            name: "removeStake",
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
            name: "rewardFeeRate",
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
                internalType: "address",
                name: "_stakeholder",
                type: "address",
              },
            ],
            name: "rewardOf",
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
            name: "rewardRate",
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
                name: "rewardInterval",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "possibleUnstakeTime",
                type: "uint256",
              },
            ],
            name: "setRewardInterwal",
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
                name: "newRewardRate",
                type: "uint256",
              },
            ],
            name: "setRewardRate",
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
                internalType: "uint256",
                name: "_yfpiToken",
                type: "uint256",
              },
            ],
            name: "stakeNow",
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
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "stakesOf",
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
            name: "stakingFeeRate",
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
                name: "_stakingFeeRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_unstakingFeeRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_rewardFeeRate",
                type: "uint256",
              },
            ],
            name: "stakingFeeRateSet",
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
            name: "stakingStatus",
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
            name: "totalHolders",
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
            name: "totalInvestedFunds",
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
            name: "totalRewardDistributed",
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
            name: "totalStakes",
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
            inputs: [],
            name: "unstakingFeeRate",
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
        ];
        //low
        stakeadd = "0x3119fa5ee7fc11fd19b9af1662367a181f952235";
        transactionURL = "https://ropsten.etherscan.io";
      }
      token = new web3.eth.Contract(tokenabi, tokenadd);
      stake = new web3.eth.Contract(stakeabi, stakeadd);
    })
    .then(() => {
      if (currentAccount) {
        $("#addressValue").text(`Address: ${currentAccount}`);
        $("#connectwallet").html(
          `<i class="fa fa-circle text-safe"></i>Connected`
        );
        $("#connectwallet").css("border", "2px double var(--text-safe)");
      }

      if (net) {
        $("#netwrokID").text(`Network: ${net}`);
      }
    })
    .then(() => {
      //Token Balance
      if (currentAccount) {
        token.methods
          .balanceOf(currentAccount)
          .call()
          .then((balance) => {
            $("#tokenBalance").text(
              "Balance: " + web3.utils.fromWei(balance, "ether") + " LEO"
            );
            myTokenBalance = balance;
          })
          .then(() => {
            //allowance
            token.methods
              .allowance(currentAccount, stakeadd)
              .call()
              .then((approvedAmount) => {
                console.log(approvedAmount);
                console.log(myTokenBalance);
                if (+myTokenBalance == "0") {
                  console.log("mybalance" + myTokenBalance);
                  $("#NewStakerApprove").show();
                  $("#OldStakerApprove").show();
                  $("#NewStakerApprove").prop("disabled", true);
                  $("#NewStakerApprove").css("cursor", "none");
                  $("#OldStakerApprove").prop("disabled", true);
                  $("#NewStakerApprove").text("Cannot Approve");
                  $("#approveNote").hide();
                  $("#approveNoteZeroBalance").show();
                  $("#StakeNote").hide();
                  $("#StakeNote").hide();
                } else if (+approvedAmount >= +myTokenBalance) {
                  $("#NewStakerApprove").hide();
                  $("#OldStakerApprove").hide();
                  $("#inputstake").show();
                  $("#inputstake").css("display", "flex");
                  $("#approveNote").hide();
                  $("#approveNoteZeroBalance").hide();
                  $("#StakeNote").show();
                  $("#NewStakerApprove").text("Approve");
                  $("#NewStakerApprove").prop("disabled", false);
                  $("#NewStakerApprove").css("cursor", "pointer");
                } else {
                  $("#NewStakerApprove").show();
                  $("#OldStakerApprove").show();
                  $("#NewStakerApprove").prop("disabled", false);
                  $("#OldStakerApprove").prop("disabled", false);
                  $("#approveNote").show();
                  $("#approveNoteZeroBalance").hide();
                  $("#StakeNote").hide();
                  $("#NewStakerApprove").text("Approve");
                  $("#NewStakerApprove").prop("disabled", false);
                  $("#NewStakerApprove").css("cursor", "pointer");
                }
              });
          });
        //staked Balance
        stake.methods
          .stakesOf(currentAccount)
          .call()
          .then((stakeBalance) => {
            $("#stakeBalance").text(
              "Staked: " + web3.utils.fromWei(stakeBalance, "ether") + " LEO"
            );
          });

        //pendingRewards
        stake.methods
          .rewardOf(currentAccount)
          .call()
          .then((rewardBalance) => {
            $("#pendingRewards").text(
              "Rewards: " + web3.utils.fromWei(rewardBalance, "ether") + " LEO"
            );
          });

        //lastActionTime
        stake.methods
          .Staker(currentAccount)
          .call()
          .then((stakeholder) => {
            stakeHolderAc = stakeholder;
            //_possibleUnstakeTime
            //pendingRewards
            if (stakeholder["_isStaker"]) {
              $("#alreadyStaker").css("display", "flex");
              $("#newStaker").css("display", "none");
              $("#stakeappdisconnected").css("display", "none");
              $("#stakedapp").css("display", "block");

              stake.methods
                ._possibleUnstakeTime()
                .call()
                .then((ptime) => {
                  $("#lastActionTime").text(
                    "Next Redeem/Unstake Time : " +
                      toDateTime(+stakeholder[1] + +ptime)
                    // "Next Redeem/Unstake Time : " + toDateTime(+stakeholder[1])
                  );
                });
            } else {
              $("#lastActionTime").text(
                "Next Redeem/Unstake Time : Not Applicable"
              );
              $("#alreadyStaker").css("display", "none");
              $("#newStaker").css("display", "flex");
              $("#stakeappdisconnected").css("display", "none");
              $("#stakedapp").css("display", "block");
            }
          });

        //Staking rate
        stake.methods
          .stakingFeeRate()
          .call()
          .then((stakingFeeRate1) => {
            $("#stakingRate").text(
              "Staking Rate: " + stakingFeeRate1 / 100 + " %"
            );
            stakingFee=stakingFeeRate1;
          });

        //Reward Redemption Rate
        stake.methods
          .rewardFeeRate()
          .call()
          .then((rewardFeeRate1) => {
            $("#redemptionRate").text(
              "Redemption Rate: " + rewardFeeRate1 / 100 + " %"
            );
            RedeemFee=rewardFeeRate1;
          });

        //Unstaking Rate
        stake.methods
          .unstakingFeeRate()
          .call()
          .then((unstakingFeeRate1) => {
            $("#unstakingRate").text(
              "Unstaking Rate: " + unstakingFeeRate1 / 100 + " %"
            );
            UnstakingFee=unstakingFeeRate1;
          });
      }
    });
};

$("#NewStakerApprove").click(async () => {
  if (currentAccount) {
    token.methods
    // .approve(stakeadd, "300")
    .approve(stakeadd, "30000000000000000000000")
    .send({ from: currentAccount })
      .on("transactionHash", function (hash) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        alertify.notify(hash, "success", 5, function () {
          // console.log("dismissed");
        });
        $("#transHash").html(`Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
        hash +
        `\">EtherScan</a><img  src="../images/loader.gif" />`);
      })
      .on("error", function (error) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        // console.log(error);
        alertify.notify(error.message, "error", 5, function () {
          // console.log("dismissed");
        });
      }).on("confirmation", function (confirmationNumber, receipt) {
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
      .approve(stakeadd, "30000000000000000000000")
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
      alertify.notify("Can't Stake zero/invalid tokens value", "error", 5, function () {
        // console.log("dismissed");
      });
    } else if (isNaN($("#entered-value-stake").val())) {
      // $("#msgArea").text("Kindly insert a valid token value");
      alertify.notify("Please provide valid stake value", "error", 5, function () {
        // console.log("dismissed");
      });
    }else{
      let gasprice = await web3.eth.getGasPrice();
      console.log(gasprice);
    stake.methods
      .stakeNow(web3.utils.toWei($("#entered-value-stake").val(), "ether"))
      .send({ from: currentAccount , gasPrice: gasprice})
      .on("transactionHash", function (hash) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        $("#transHash").html(`Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
        hash +
        `\">EtherScan</a><img  src="../images/loader.gif" />`);
      })
      .on("error", function (error) {
        // $("#approveBtn").attr("disabled", "");
        // $("#approveBtn").find(".before-click").addClass("d-none");
        // $("#approveBtn").find(".after-click").removeClass("d-none");
        // console.log(error);
        alertify.notify(error.message, "error", 5, function () {
          // console.log("dismissed");
        });
      }).on("confirmation", function (confirmationNumber, receipt) {
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
      $("#entered-value-stake").val() == web3.utils.fromWei(myTokenBalance, "ether")
    ) {
      $("#entered-value-stake").val("");
      $("#maxBalanceToStake").removeClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text(
        (stakingFee * amount) / 10000
      );
    } else {
      $("#entered-value-stake").val(web3.utils.fromWei(myTokenBalance, "ether"));
      $("#maxBalanceToStake").addClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text(
        (stakingFee * amount) / 10000
      );
    }

  }
});

// $("#maxBalanceToUnStake").click(() => {
//   if (_maxStatus == "enable") {
//     if ($("#unstake-value").val() == web3.fromWei(myTokenBalance, "ether")) {
//       $("#unstake-value").val("");
//       $("#maxBalanceToUnStake").removeClass("maxOn");
//       var amount = $("#unstake-value").val();
//       $("#calculatedunstakeFees").text(
//         (UnstakingFee * amount) / 10000
//       );
//     } else {
//       $("#unstake-value").val(web3.fromWei(myTokenBalance, "ether"));
//       $("#maxBalanceToUnStake").addClass("maxOn");
//       var amount = $("#unstake-value").val();
//       $("#calculatedunstakeFees").text(
//         (UnstakingFee * amount) / 10000
//       );
//     }
//   }
// });


$("#entered-value-stake").on("input", () => {
  var amount = $("#entered-value-stake").val();
  $("#calculatedFees").text(
    (stakingFee * amount) / 10000
    // web3.fromWei(myBalance, "ether")
  );
});

// $("#unstake-value").on("input", () => {
//   var amount = $("#unstake-value").val();
//   $("#calculatedunstakeFees").text(
//     (getUnstakingFeeRate * amount) / 10000
//     // web3.fromWei(myBalance, "ether")
//   );
// });



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

$(function () {
  // initContract();
});
