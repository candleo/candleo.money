//Wallet and transactions
let net,
  transactionURL,
  currentAccount,
  _maxStatus = "enable",
  metamask,
  blockNo,
  blockHash,
  blocktimeStamp,
  currentDate,
  candletime,
  lockTime,
  nowtime,
  test,
  bscsoon = 0;
nextDay = 86400;

//Candleo Token
let tokenabi, tokenadd, token;

//Staking contract
let stakingFee,
  UnstakingFee,
  RedeemFee,
  stakeHolderAc,
  stakeabi,
  stakeadd,
  stake;

//PricePredict

//contract
let pricepredictabi, pricepredict, pricepredictadd;

//owner function
let GameFee, priceOwner;

//gameslot details
// date for current game slot
// no of slots available
// available game slot data
let selectedDateForGameSlot,
  availableGameSlot,
  GameSlot = [];

//user game history
//date for user played game slot
//no of slots played by user
//count of total slot played on selected date
let selectedDateForGameHistory, availableGameSlotforHistory, playerslotcount;
//player info of {slot,position}
let PlayerInfoCount = [];
let GameSlotHistory = [];
let PlayerBidderHistory = [];

//All users game slot history
let selectedDateForGameHistoryAll, availableGameSlotforHistoryAll;
let GameSlotHistoryAll = [];
let PlayerBidderHistoryAll = [];

//user details
let myTokenBalance, approvedAmount;
