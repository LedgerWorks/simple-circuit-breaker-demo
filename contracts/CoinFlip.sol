// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/*
  This smart contract was intentionally created with an exploit in it,
  for the purpose of demonstrating the use-case of a Ledger Works
  circuit breaker.

  The smart contract loosely mimics a crypto "double or nothing" coin
  flip game. (see https://degencoinflip.com)

  The exploit is found in the "flip" function. It accepts a timestamp
  sent in by the caller. That timestamp is then used to determine
  whether the coin flip result is heads or tails.

  When called from by the frontend of a website, it would do a decent
  job of simulating randomness. However, if someone were to realize
  what was happening under the hood, they could call the smart contract
  sending in a false timestamp to produce the outcome they desired.

  Here's the exploit:
    If the timestamp is an even number, the result will be Heads
    If the timestamp is an odd number, the result will be Tails
*/

contract CoinFlip {
  // types
  enum Side {
    Uninitialized,
    Heads,
    Tails
  }

  enum FlipStatus {
    Uninitialized,
    WagerPlaced,
    Flipped,
    PayoutReconciled,
    Error
  }

  struct Flip {
    FlipStatus status;
    Side calledSide;
    uint256 wagerAmount;
    uint256 flipFee;
    Side flipResult;
  }

  struct Player {
    mapping(uint => Flip) flips;
    uint currentFlip;
    bool banned;
  }

  // constants
  uint256 private constant _oneEther = 1000000000000000000;

  // properties
  address payable owner;
  uint256 minWager;
  uint256 maxWager;
  uint256 feeBasePoints;
  bool public disabled;
  mapping(address => Player) players;

  // constructor
  constructor() {
    owner = payable(msg.sender);
    minWager = _oneEther / 100;
    maxWager = _oneEther;
    feeBasePoints = 350;
    disabled = false;
  }

  receive() external payable {}

  // access modifiers
  modifier onlyOwner() {
    require(msg.sender == owner, "Unauthorized");
    _;
  }

  modifier onlyPlayers(FlipStatus allowedStatus) {
    require(!disabled, "The game is currently disabled.");
    require(!players[msg.sender].banned, "You are currently banned!");
    Player storage player = players[msg.sender];
    Flip storage currentFlip = player.flips[player.currentFlip];
    require(
      currentFlip.status == allowedStatus,
      "Your current flip status does not allow that action."
    );
    _;
  }

  // internal functions
  function calculateFee(uint256 _amount, uint256 _feeBasePoints) internal pure returns (uint256) {
    return (_amount * _feeBasePoints) / 10_000;
  }

  function doFlip(uint256 _timestamp) internal pure returns (Side) {
    bool isEven = _timestamp % 2 == 0;
    return isEven ? Side.Heads : Side.Tails;
  }

  // public getters
  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function getCurrentFlipIndex(address _player) public view returns (uint) {
    return players[_player].currentFlip;
  }

  function getFlip(address _player, uint _flipIndex) public view returns (Flip memory) {
    return players[_player].flips[_flipIndex];
  }

  function getCurrentFlip(address _player) public view returns (Flip memory) {
    Player storage playerState = players[_player];
    return playerState.flips[playerState.currentFlip];
  }

  function isBanned(address _player) public view returns (bool) {
    return players[_player].banned;
  }

  function isWinner(address _player) public view returns (bool) {
    Player storage player = players[_player];
    Flip storage currentFlip = player.flips[player.currentFlip];
    return
      currentFlip.calledSide != Side.Uninitialized &&
      currentFlip.flipResult != Side.Uninitialized &&
      currentFlip.calledSide == currentFlip.flipResult;
  }

  // game functions
  function wager(Side _calledSide) public payable onlyPlayers(FlipStatus.Uninitialized) {
    uint256 wagerAmount = msg.value;
    require(wagerAmount >= minWager, "Wager amount too small.");
    require(wagerAmount <= maxWager, "Wager amount too large.");
    Player storage player = players[msg.sender];
    Flip storage currentFlip = player.flips[player.currentFlip];
    currentFlip.calledSide = _calledSide;
    currentFlip.wagerAmount = wagerAmount;
    currentFlip.flipFee = calculateFee(wagerAmount, feeBasePoints);
    currentFlip.status = FlipStatus.WagerPlaced;
  }

  function flip(uint _timestamp) public onlyPlayers(FlipStatus.WagerPlaced) {
    Player storage player = players[msg.sender];
    Flip storage currentFlip = player.flips[player.currentFlip];
    Side flipResult = doFlip(_timestamp);
    currentFlip.flipResult = flipResult;
    currentFlip.status = FlipStatus.Flipped;
  }

  function collect() public onlyPlayers(FlipStatus.Flipped) {
    Player storage playerState = players[msg.sender];
    Flip storage currentFlip = playerState.flips[playerState.currentFlip];
    require(currentFlip.calledSide == currentFlip.flipResult, "You did not win that coin flip.");
    uint256 payoutAmount = (currentFlip.wagerAmount * 2) - currentFlip.flipFee;
    (bool success, ) = payable(msg.sender).call{value: payoutAmount}("");
    require(success, "Failed to reconcile payout");
    currentFlip.status = FlipStatus.PayoutReconciled;
    playerState.currentFlip++;
  }

  // admin functions
  function withdraw(uint256 _amount) public onlyOwner {
    (bool success, ) = owner.call{value: _amount}("");
    require(success, "Failed to transfer");
  }

  function withdrawAll() public onlyOwner {
    uint256 amount = address(this).balance;
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Failed to transfer");
  }

  function setMinWager(uint256 _minWager) public onlyOwner {
    minWager = _minWager;
  }

  function setMaxWager(uint256 _maxWager) public onlyOwner {
    maxWager = _maxWager;
  }

  function setFeeBasePoints(uint256 _feeBasePoints) public onlyOwner {
    feeBasePoints = _feeBasePoints;
  }

  function disable() public onlyOwner {
    disabled = true;
  }

  function enable() public onlyOwner {
    disabled = false;
  }

  function banPlayer(address _player) public onlyOwner {
    players[_player].banned = true;
  }

  function unbanPlayer(address _player) public onlyOwner {
    players[_player].banned = false;
  }

  function incrementCurrentFlip(address _player) public onlyOwner {
    players[_player].currentFlip++;
  }

  function overrideFlipStatus(address _player, FlipStatus _status) public onlyOwner {
    Player storage playerState = players[_player];
    playerState.flips[playerState.currentFlip].status = _status;
  }
}
