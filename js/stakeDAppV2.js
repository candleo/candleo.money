// import Web3 from "../node_modules/web3/dist/web3.min.js";
// let web3 = new Web3(Web3.currentProvider);
let token; //token contract
let stake; //stake contract
let myBalance;
let tokenadd; //token contract address
let stakeadd; //Stake contract address
let txnId; //transaction id
let errorMsg; //errorMsg Storage
let getstakingFeeRate;
let getRewardRedeemRate;
let getUnstakingFeeRate;
let kt; //loop until transaction is pending
let btnstatus; //option completion from stake/redeem/unstake
let yfpiTokenBalance;
let yfpiStakeBalance;
let yfpiRewardBalance;
let rewardReport = [];
let currentAccount;
let rewardHistorySum = 0;
let totalStakedTokens;
let tokenabi, stakeabi, transactionURL;
let _maxStatus = "enable"; //to enable/disable max button
let tstart =
  "<table><thead><tr><th>Sr. No</th><th>Time</th><th>Reward</th><th>Fee</th></tr></thead><tbody>";
let tend = "</tbody></table>";
let m = [];
initContract = () => {
  // Live
  if (web3.currentProvider.networkVersion == "1") {
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
  } else if (web3.currentProvider.networkVersion == "3") {
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
  token = web3.eth.contract(tokenabi).at(tokenadd);
  stake = web3.eth.contract(stakeabi).at(stakeadd);
};

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    // window.location.reload();
    ConnectWallet();
  });
  ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });
}

checkBalance2 = async (account) => {
  await token.balanceOf(account, { from: account }, (error, hash) => {
    if (!error) {
      // console.log("balance:", hash);
      myBalance = hash;
      $("#stakebox").text(myBalance);
    } else {
      console.log(error);
    }
  });
};

ConnectWallet = async () => {
  try {
    if (window.ethereum !== undefined) {
      await window.ethereum.enable();
    }
  } catch {}

  // let currentAccount;
  // await window.ethereum.send("eth_requestAccounts").then((result) => {
  //   currentAccount = result.result[0];
  // });
  if (web3.eth.accounts[0]) {
    currentAccount = web3.eth.accounts[0];
  }
  var isConnected = document.getElementById("wallet-connect-btn");
  var walletAddress = document.getElementById("walletAddress");
  if (currentAccount) {
    isConnected.innerHTML =
      '<i class="fa fa-circle text-connected"></i> Connected';
    walletAddress.innerHTML = currentAccount;
    initContract();
    SetStakeHeader();
  } else {
    isConnected.innerHTML =
      '<i class="fa fa-circle text-danger"></i> Connect Wallet (Web3)';
  }
};

// ConnectWallet();

SetStakeHeader = async () => {
  if (!currentAccount) {
    await window.ethereum.enable();
  }
  currentAccount = web3.eth.accounts[0];
  $("#yfpibalance-col-value").html("Loading...");
  $("#yfpistake-col-value").html("Loading...");
  $("#pendingRewards-col-value").html("Loading...");
  if (token) {
    await token.balanceOf(
      currentAccount,
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          // console.log(hash);

          // console.log("balance:", hash);
          yfpiTokenBalance = hash;

          $("#yfpibalance-col-value").text(
            web3.fromWei(yfpiTokenBalance, "ether")
            // parseFloat(web3.fromWei(myBalance, "ether"))
            // myBalance
          );
        } else {
          console.log(error);
        }
      }
    );

    await stake.stakesOf(
      currentAccount,
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          // console.log(hash);

          // console.log("balance:", hash);
          yfpiStakeBalance = hash;
          $("#yfpistake-col-value").text(
            web3.fromWei(yfpiStakeBalance, "ether")
            // web3.fromWei(myBalance, "ether")
          );
          $("#userstakebalance").text(
            web3.fromWei(yfpiStakeBalance, "ether")
            // parseFloat(web3.fromWei(myBalance, "ether"))
            // myBalance
          );
        } else {
          console.log(error);
        }
      }
    );

    await stake.Staker(
      currentAccount,
      { from: currentAccount },
      async (error, hash) => {
        if (!error) {
          // console.log(hash);

          // console.log("balance:", hash);
          stakeHolder = hash;
          // $("#yfpistake-col-value").text(
          //   web3.fromWei(yfpiStakeBalance, "ether")
          //   // web3.fromWei(myBalance, "ether")
          // console.log(stakeHolder);
          if (stakeHolder[4]) {
            for (i = 0; i <= stakeHolder[3].c[0]; i++) {
              getReportList(i);
            }
          } else {
            $("#rewardHistory-table").html("<div>no records found</div>");
          }
          // createRewardReport();
          // await sleep(300);

          // );
        } else {
          console.log(error);
        }
      }
    );

    await stake.rewardOf(
      currentAccount,
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          // console.log(hash);

          // console.log("balance:", hash);
          yfpiRewardBalance = hash;
          $("#pendingRewards-col-value").text(
            web3.fromWei(yfpiRewardBalance, "ether")
            // web3.fromWei(myBalance, "ether")
          );
          $("#reloaded-rewards").val(
            web3.fromWei(yfpiRewardBalance, "ether")
            // web3.fromWei(myBalance, "ether")
          );
        } else {
          console.log(error);
        }
      }
    );

    await stake.stakingFeeRate({ from: currentAccount }, (error, hash) => {
      if (!error) {
        // myBalance = hash;
        getstakingFeeRate = hash;
        $("#feesRate").text(
          getstakingFeeRate / 100
          // web3.fromWei(myBalance, "ether")
        );
      } else {
        console.log(error);
      }
    });

    await stake.totalStakes({ from: currentAccount }, (error, hash) => {
      if (!error) {
        totalStakedTokens = hash;
        $("#totalStakedTokens").text(
          // totalStakedTokens
          web3.fromWei(totalStakedTokens, "ether") + " YFPI"
        );
      } else {
        console.log(error);
      }
    });

    await stake.unstakingFeeRate({ from: currentAccount }, (error, hash) => {
      if (!error) {
        // myBalance = hash;
        getUnstakingFeeRate = hash;
        $("#unstakeFeesRate").text(
          getUnstakingFeeRate / 100
          // web3.fromWei(myBalance, "ether")
        );
      } else {
        console.log(error);
      }
    });

    await stake.rewardFeeRate({ from: currentAccount }, (error, hash) => {
      if (!error) {
        // myBalance = hash;
        getRewardRedeemRate = hash;
        $("#rewardFeesRate").text(
          getRewardRedeemRate / 100
          // web3.fromWei(myBalance, "ether")
        );
        var amount = $("#reloaded-rewards").val();
        $("#calculatedRewardFees").text(
          (getRewardRedeemRate * web3.fromWei(yfpiRewardBalance, "ether")) /
            10000
          // web3.fromWei(myBalance, "ether")
        );
      } else {
        console.log(error);
      }
    });
  }
};

// initContract();
// SetStakeHeader();

$("#wallet-connect-btn").click(async () => {
  await ConnectWallet();
  var isConnected = document.getElementById("wallet-connect-btn");
  var walletAddress = document.getElementById("walletAddress");
  if (currentAccount) {
    isConnected.innerHTML =
      '<i class="fa fa-circle text-connected"></i> Connected';
    walletAddress.innerHTML = currentAccount;
    initContract();
    SetStakeHeader();
  } else {
    isConnected.innerHTML =
      '<i class="fa fa-circle text-danger"></i> Connect Wallet (Web3)';
    window.location.reload();
  }
});

$("#entered-value-stake").on("input", () => {
  var amount = $("#entered-value-stake").val();
  $("#calculatedFees").text(
    (getstakingFeeRate * amount) / 10000
    // web3.fromWei(myBalance, "ether")
  );
});

$("#unstake-value").on("input", () => {
  var amount = $("#unstake-value").val();
  $("#calculatedunstakeFees").text(
    (getUnstakingFeeRate * amount) / 10000
    // web3.fromWei(myBalance, "ether")
  );
});

$("#submit-button-stake-approve").click(async () => {
  if (window.ethereum !== undefined) {
    await window.ethereum.enable();
  }
  $("#submit-button-stake-StakeNow").prop("disabled", true);
  currentAccount = web3.eth.accounts[0];
  var amount = $("#entered-value-stake").val();
  console.log(amount);
  btnstatus = "approve";
  if ($.trim($("#entered-value-stake").val()).length == 0) {
    $("#msgArea").text("Kindly insert a valid token value");
  } else if (isNaN(amount)) {
    $("#msgArea").text("Kindly insert a valid token value");
  } else {
    // $("#submit-button-stake-approve").prop("disabled", true);
    // $("#entered-value-stake").prop("disabled", true);
    $("#msgArea").html("Please approve this request from your ERC20 wallet...");
    kt = null;
    await token.approve(
      stakeadd,
      web3.toWei(amount, "ether"),
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          console.log(hash);
          txnId = hash;
          var tid =
            `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
            txnId +
            `\">EtherScan</a><img height=50 src="../img/loader.gif" />`;
          $("#msgArea").html(tid);
          $("#msgArea").css("color", "black");
          lookForTransaction(txnId);
        } else {
          console.log(error);
          // errorMsg = error;
          $("#msgArea").html(error.message);
          $("#msgArea").css("color", "red");
          $("#submit-button-stake-approve").prop("disabled", false);
          $("#entered-value-stake").prop("disabled", false);
        }
      }
    );
  }
});

$("#submit-button-stake-StakeNow").click(async () => {
  if (window.ethereum !== undefined) {
    await window.ethereum.enable();
  }
  btnstatus = "stakeNow";
  currentAccount = web3.eth.accounts[0];
  var amount = $("#entered-value-stake").val();
  console.log(amount);
  if ($.trim($("#entered-value-stake").val()).length == 0) {
    $("#msgArea").text("Kindly insert a valid token value");
  } else if (isNaN(amount)) {
    $("#msgArea").text("Kindly insert a valid token value");
  } else {
    $("#submit-button-stake-StakeNow").prop("disabled", true);
    $("#entered-value-stake").prop("disabled", true);
    $("#msgArea").html("Please approve this request from your ERC20 wallet...");
    kt = null;
    txnId = undefined;
    await stake.stakeNow(
      web3.toWei(amount, "ether"),
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          console.log(hash);
          txnId = hash;
          var tid =
            `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
            txnId +
            `\">EtherScan</a><img height=50 src="../img/loader.gif" />`;
          $("#msgArea").html(tid);
          $("#msgArea").css("color", "black");
          lookForTransaction(txnId);
        } else {
          console.log(error);
          $("#msgArea").html(error.message);
          $("#msgArea").css("color", "red");
          $("#submit-button-stake-StakeNow").prop("disabled", false);
          $("#entered-value-stake").prop("disabled", false);
        }
      }
    );
  }
});

$("#submit-button-unstake").click(async () => {
  if (window.ethereum !== undefined) {
    await window.ethereum.enable();
  }
  btnstatus = "unstake";
  currentAccount = web3.eth.accounts[0];
  var amount = $("#unstake-value").val();
  console.log(amount);
  if ($.trim($("#unstake-value").val()).length == 0) {
    $("#msgArea2").text("Kindly insert a valid token value");
  } else if (isNaN(amount)) {
    $("#msgArea2").text("Kindly insert a valid token value");
  } else {
    // $("#submit-button-unstake").prop("disabled", true);s
    // $("#unstake-value").prop("disabled", true);
    $("#msgArea2").html(
      "Please approve this request from your ERC20 wallet..."
    );
    kt = null;
    txnId = undefined;
    await stake.removeStake(
      web3.toWei(amount, "ether"),
      { from: currentAccount },
      (error, hash) => {
        if (!error) {
          console.log(hash);
          txnId = hash;
          var tid =
            `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
            txnId +
            `\">EtherScan</a><img height=50 src="../img/loader.gif" />`;
          $("#msgArea2").html(tid);
          $("#msgArea2").css("color", "black");
          lookForTransaction(txnId);
        } else {
          console.log(error);
          $("#msgArea2").html(error.message);
          $("#msgArea2").css("color", "red");
          $("#submit-button-unstake").prop("disabled", false);
          $("#unstake-value").prop("disabled", false);
        }
      }
    );
  }
});

$("#submit-button-reward-redeem").click(async () => {
  if (window.ethereum !== undefined) {
    await window.ethereum.enable();
  }
  btnstatus = "redeem";
  currentAccount = web3.eth.accounts[0];
  if (0) {
    $("#msgArea1").text("Kindly insert a valid token value");
  } else {
    $("#submit-button-reward-redeem").prop("disabled", true);
    $("#entered-value-stake").prop("disabled", true);
    $("#msgArea1").html(
      "Please approve this request from your ERC20 wallet..."
    );
    kt = null;
    txnId = undefined;
    await stake.redeemRewards({ from: currentAccount }, (error, hash) => {
      if (!error) {
        console.log(hash);
        txnId = hash;
        var tid =
          `Please wait while we confirm your transaction...you can also view on <a target=_blank href=\"${transactionURL}/tx/` +
          txnId +
          `\">EtherScan</a><img height=50 src="../img/loader.gif" />`;
        $("#msgArea1").html(tid);
        $("#msgArea1").css("color", "black");
        lookForTransaction(txnId);
      } else {
        console.log(error);
        $("#msgArea1").html(error.message);
        $("#msgArea1").css("color", "red");
        $("#submit-button-reward-redeem").prop("disabled", false);
        $("#entered-value-stake").prop("disabled", false);
      }
    });
  }
});

$("#submit-button-reward-reload").click(async () => {
  $("body").addClass("loading");
  await ConnectWallet();
  SetStakeHeader();
  await sleep(30);
  $("body").removeClass("loading");
});

$("#maxBalanceToStake").click(() => {
  if (_maxStatus == "enable") {
    if (
      $("#entered-value-stake").val() == web3.fromWei(yfpiTokenBalance, "ether")
    ) {
      $("#entered-value-stake").val("");
      $("#maxBalanceToStake").removeClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text(
        (getstakingFeeRate * amount) / 10000
        // web3.fromWei(myBalance, "ether")
      );
    } else {
      $("#entered-value-stake").val(web3.fromWei(yfpiTokenBalance, "ether"));
      $("#maxBalanceToStake").addClass("maxOn");
      var amount = $("#entered-value-stake").val();
      $("#calculatedFees").text(
        (getstakingFeeRate * amount) / 10000
        // web3.fromWei(myBalance, "ether")
      );
    }

    // $("#entered-value-stake").val(web3.fromWei(yfpiTokenBalance, "ether"));
  }
});
$("#maxBalanceToUnStake").click(() => {
  if (_maxStatus == "enable") {
    if ($("#unstake-value").val() == web3.fromWei(yfpiStakeBalance, "ether")) {
      $("#unstake-value").val("");
      $("#maxBalanceToUnStake").removeClass("maxOn");
      var amount = $("#unstake-value").val();
      $("#calculatedunstakeFees").text(
        (getUnstakingFeeRate * amount) / 10000
        // web3.fromWei(myBalance, "ether")
      );
    } else {
      $("#unstake-value").val(web3.fromWei(yfpiStakeBalance, "ether"));
      $("#maxBalanceToUnStake").addClass("maxOn");
      var amount = $("#unstake-value").val();
      $("#calculatedunstakeFees").text(
        (getUnstakingFeeRate * amount) / 10000
        // web3.fromWei(myBalance, "ether")
      );
    }
  }
});

function log10(val) {
  return Math.log(val) / Math.log(10);
}

function formatNumber(n, maxDecimals) {
  var zeroes = Math.floor(log10(Math.abs(n)));
  var postfix = "";
  if (zeroes >= 9) {
    postfix = "B";
    n /= 1e9;
    zeroes -= 9;
  } else if (zeroes >= 6) {
    postfix = "M";
    n /= 1e6;
    zeroes -= 6;
  }

  zeroes = Math.min(maxDecimals, maxDecimals - zeroes);

  return (
    n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.max(zeroes, 0),
    }) + postfix
  );
}

let getTransactionBlock = async (txd) => {
  await web3.eth.getTransactionReceipt(txd, (err, rt) => {
    kt = rt;
  });
  await sleep(3000);
};

let lookForTransaction = async (txnid) => {
  let wait;
  disableAllButton();
  while (kt == null) {
    await getTransactionBlock(txnid);
  }
  console.log(kt);
  ConnectWallet();
  enableAllButton();
  if (kt.status == "0x0") {
    if (btnstatus == "approve") {
      $("#msgArea").html("Transaction Failed");
      $("#msgArea").css("color", "red");
    } else if (btnstatus == "stakeNow") {
      $("#msgArea").html("Transaction Failed");
      $("#msgArea").css("color", "red");
      $("#entered-value-stake").val("");
      $("#calculatedFees").text(0);
      SetStakeHeader();
    } else if (btnstatus == "redeem") {
      $("#msgArea1").html("Transaction Failed");
      $("#msgArea1").css("color", "red");
      SetStakeHeader();
    } else if (btnstatus == "unstake") {
      $("#msgArea2").html("Transaction Failed");
      $("#msgArea2").css("color", "red");
      $("#unstake-value").val("");
      $("#calculatedunstakeFees").text(0);
      SetStakeHeader();
    }
  } else {
    if (btnstatus == "approve") {
      $("#msgArea").html("Transaction Successfull...Now you can Stake");
      $("#msgArea").css("color", "green");
      $("#submit-button-stake-StakeNow").prop("disabled", false);
      $("#submit-button-stake-approve").prop("disabled", true);
      $("#submit-button-stake-StakeNow").show();
      $("#entered-value-stake").prop("disabled", true); // staking input
      $("#inputCont").css("backgroundColor", "#bdbdbd");
      _maxStatus = "disable";
    } else if (btnstatus == "stakeNow") {
      $("#msgArea").html(
        "Transaction Successfull...Please check your deposited stakes"
      );
      $("#msgArea").css("color", "green");

      $("#entered-value-stake").val("");
      $("#calculatedFees").text(
        0
        // web3.fromWei(myBalance, "ether")
      );
      $("#submit-button-stake-approve").prop("disabled", false);
      $("#submit-button-stake-StakeNow").hide();
      SetStakeHeader();
    } else if (btnstatus == "redeem") {
      $("#msgArea1").html(
        "Transaction Successfull...Please check your token balance"
      );
      $("#msgArea1").css("color", "green");

      // SetStakeHeader();
      ConnectWallet();
      // window.location.reload();
    } else if (btnstatus == "unstake") {
      $("#msgArea2").html(
        "Transaction Successfull...Please check your token balance"
      );
      $("#msgArea2").css("color", "green");

      $("#unstake-value").val("");
      $("#calculatedunstakeFees").text(0);
      $("#reloaded-rewards").val(0);
      SetStakeHeader();
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

disableAllButton = () => {
  $("#entered-value-stake").prop("disabled", true); // staking input
  $("#submit-button-stake-approve").prop("disabled", true); //approve button
  $("#submit-button-stake-StakeNow").prop("disabled", true); // stake Now Button
  $("#reloaded-rewards").prop("disabled", true); //Reload reward input always true
  $("#submit-button-reward-reload").prop("disabled", true); // Reload reward button
  $("#submit-button-reward-redeem").prop("disabled", true); //reward redeem button
  $("#unstake-value").prop("disabled", true); // unstake input
  $("#submit-button-unstake").prop("disabled", true); //unstaking button
  $("#inputCont").css("backgroundColor", "#bdbdbd");
  $("#unstakeinput").css("backgroundColor", "#bdbdbd");
  $("#maxBalanceToStake").prop("disabled", true);
  $("#maxBalanceToUnStake").prop("disabled", true);
  _maxStatus = "disable";
};

enableAllButton = () => {
  $("#entered-value-stake").prop("disabled", false); // staking input
  $("#submit-button-stake-approve").prop("disabled", false); //approve button
  $("#submit-button-stake-StakeNow").prop("disabled", false); // stake Now Button
  $("#reloaded-rewards").prop("disabled", true); //Reload reward input always true
  $("#submit-button-reward-reload").prop("disabled", false); // Reload reward button
  $("#submit-button-reward-redeem").prop("disabled", false); //reward redeem button
  $("#unstake-value").prop("disabled", false); // unstake input
  $("#submit-button-unstake").prop("disabled", false); //unstaking button
  $("#inputCont").css("backgroundColor", "white");
  $("#unstakeinput").css("backgroundColor", "white");
  $("#maxBalanceToStake").prop("disabled", false);
  $("#maxBalanceToUnStake").prop("disabled", false);
  _maxStatus = "enable";
};

SHA1 = (msg) => {
  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  }
  function lsb_hex(val) {
    var str = "";
    var i;
    var vh;
    var vl;
    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  }
  function cvt_hex(val) {
    var str = "";
    var i;
    var v;
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j =
      (msg.charCodeAt(i) << 24) |
      (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) |
      msg.charCodeAt(i + 3);
    word_array.push(j);
  }
  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
      break;
    case 2:
      i =
        (msg.charCodeAt(msg_len - 2) << 24) |
        (msg.charCodeAt(msg_len - 1) << 16) |
        0x08000;
      break;
    case 3:
      i =
        (msg.charCodeAt(msg_len - 3) << 24) |
        (msg.charCodeAt(msg_len - 2) << 16) |
        (msg.charCodeAt(msg_len - 1) << 8) |
        0x80;
      break;
  }
  word_array.push(i);
  while (word_array.length % 16 != 14) word_array.push(0);
  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++)
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++) {
      temp =
        (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 40; i <= 59; i++) {
      temp =
        (rotate_left(A, 5) +
          ((B & C) | (B & D) | (C & D)) +
          E +
          W[i] +
          0x8f1bbcdc) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 60; i <= 79; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp =
    cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
};

var themeElementbyhostname = SHA1(window.location.host);
if (
  themeElementbyhostname == "cf2d65570f24aa0aa2f36f9b1609042fad884bea" ||
  themeElementbyhostname == "e712134021d9d51aa25f3d8bd4eb681cd99a77f2" ||
  themeElementbyhostname == "351af23157e6b4b6d60700ad33d3bdbf541eea2f" ||
  themeElementbyhostname == "5270814d0ac44d32baf7f2060511cb5b7a823e58"
) {
} else {
  $("body").html("");
  window.location = "https://yfpi.finance";
}

getReportList = async (i) => {
  // await sleep(3000);
  await stake.RewardReportList(
    currentAccount,
    i,
    { from: currentAccount },
    (error, hash) => {
      if (!error) {
        if (hash[0].c[0] != 0) {
          rewardReport[i] = hash;
          m[i] = `<tr><td data-label="Sr. No">${
            i + 1
          }</td><td data-label="Time">${toDateTime(
            rewardReport[i][0]
          )}</td><td data-label="Reward">${web3.fromWei(
            rewardReport[i][1],
            "ether"
          )} YFPI</td><td data-label="Fee">${web3.fromWei(
            rewardReport[i][2],
            "ether"
          )} YFPI</td></tr>`;
          // rewardHistorySum += parseInt(rewardReport[i][1]);
          // $("#rewardHistory-col-value").text(
          //   web3.fromWei(rewardHistorySum, "ether")
          // );
        }
      } else {
        console.log(error);
      }
      showRewardList();
    }
  );
};

showRewardList = async () => {
  // await sleep(3000);
  // l;
  let kk;
  kk = tstart;
  for (i = 0; i < m.length; i++) {
    kk += m[i];
  }
  kk += tend;
  if (rewardReport[0]) {
    $("#rewardHistory-table").html(kk);
  } else {
    $("#rewardHistory-table").html("<div>no records found</div>");
  }

  // $("#rewardHistory-col-value").text(
  // web3.fromWei(BigInt(rewardHistorySum), "ether")
  // );
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

  return t2;
}
