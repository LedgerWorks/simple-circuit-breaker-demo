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
    Ready,
    Loser,
    Winner,
    Reconciled
  }

  struct Flip {
    FlipStatus status;
    Side calledSide;
    uint256 wagerAmount;
    uint256 flipFee;
    uint256 payoutAmount;
    Side flipResult;
  }

  struct Player {
    mapping(uint => Flip) flips;
    uint currentFlip;
  }

  // constants
  uint256 private constant _oneEther = 1000000000000000000;
  uint256 public constant minWager = _oneEther / 100;
  uint256 public constant maxWager = _oneEther;
  uint256 public constant feeBasePoints = 350;

  // properties
  address payable owner;
  bool public disabled;
  mapping(address => Player) players;

  // constructor
  constructor() {
    owner = payable(msg.sender);
    disabled = false;
  }

  receive() external payable {}

  // access modifiers
  modifier admin() {
    require(msg.sender == owner, "Unauthorized");
    _;
  }

  modifier enabled() {
    require(!disabled, "The game is currently disabled.");
    _;
  }

  // game functions
  function flip(Side _calledSide, uint _timestamp) public payable enabled {
    uint256 wagerAmount = msg.value;
    require(wagerAmount >= minWager, "Wager amount too small.");
    require(wagerAmount <= maxWager, "Wager amount too large.");
    Player storage player = players[msg.sender];
    Flip storage currentFlip = player.flips[player.currentFlip];
    require(
      currentFlip.status == FlipStatus.Ready,
      "Your current flip status does not allow this action."
    );
    currentFlip.calledSide = _calledSide;
    currentFlip.wagerAmount = wagerAmount;
    currentFlip.flipFee = calculateFee(currentFlip);
    currentFlip.payoutAmount = calculatePayout(currentFlip);
    Side flipResult = doFlip(_timestamp);
    currentFlip.flipResult = flipResult;
    if (currentFlip.calledSide == currentFlip.flipResult) {
      currentFlip.status = FlipStatus.Winner;
    } else {
      currentFlip.status = FlipStatus.Loser;
    }
  }

  function collect() public enabled {
    Player storage player = players[msg.sender];
    Flip storage currentFlip = player.flips[player.currentFlip];
    require(
      currentFlip.status == FlipStatus.Winner,
      "Your current flip status does not allow this action."
    );
    uint256 balance = getBalance();
    require(balance > currentFlip.payoutAmount, "The game has insufficient funds.");
    (bool success, ) = payable(msg.sender).call{value: currentFlip.payoutAmount}("");
    require(success, "Failed to reconcile payout");
    currentFlip.status = FlipStatus.Reconciled;
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
    Player storage player = players[_player];
    return player.flips[player.currentFlip];
  }

  // admin functions
  function withdraw(uint256 _amount) public admin {
    (bool success, ) = owner.call{value: _amount}("");
    require(success, "Failed to transfer");
  }

  function disable() public admin {
    disabled = true;
  }

  function enable() public admin {
    disabled = false;
  }

  function incrementCurrentFlip(address _player) public admin {
    players[_player].currentFlip++;
  }

  // internal functions
  function calculateFee(Flip memory _flip) internal pure returns (uint256) {
    return (_flip.wagerAmount * feeBasePoints) / 10_000;
  }

  function calculatePayout(Flip memory _flip) internal pure returns (uint256) {
    return (_flip.wagerAmount * 2) - _flip.flipFee;
  }

  function doFlip(uint256 _timestamp) internal pure returns (Side) {
    bool isEven = _timestamp % 2 == 0;
    return isEven ? Side.Heads : Side.Tails;
  }
}
