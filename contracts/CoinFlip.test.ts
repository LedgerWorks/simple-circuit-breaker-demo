import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CoinFlip", () => {
  const initialDeposit = ethers.utils.parseEther("5");
  const wagerAmount = ethers.utils.parseEther("0.05");
  const heads = 1;
  const headsTimestamp = 1683038967952;
  const tailsTimestamp = 1683038967953;

  async function deployCoinFlip() {
    const [owner, player] = await ethers.getSigners();
    const CoinFlipFactory = await ethers.getContractFactory("CoinFlip");
    const contract = await CoinFlipFactory.deploy();

    const tx = await owner.sendTransaction({ to: contract.address, value: initialDeposit });
    await tx.wait();

    return { contract, owner, player };
  }

  describe("constructor", () => {
    it("should initialize 'disabled' to false", async () => {
      const { contract } = await loadFixture(deployCoinFlip);
      const disabled = await contract.disabled();
      expect(disabled).to.equal(false);
    });
  });

  describe("admin functions", () => {
    describe("withdraw", () => {
      it("should transfer amount from contract to owner", async () => {
        const { contract, owner } = await loadFixture(deployCoinFlip);
        const preWithdrawBalance = await owner.getBalance();
        await contract.withdraw(initialDeposit);
        const postWithdrawBalance = await owner.getBalance();
        expect(postWithdrawBalance).to.not.equal(preWithdrawBalance);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).withdraw(initialDeposit)).to.be.revertedWith(
          "Unauthorized"
        );
      });
    });

    describe("disable", () => {
      it("should set disabled to 'true'", async () => {
        const { contract } = await loadFixture(deployCoinFlip);
        await contract.disable();
        const disabled = await contract.disabled();
        expect(disabled).to.equal(true);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).disable()).to.be.revertedWith("Unauthorized");
      });
    });

    describe("enable", () => {
      it("should set disabled to 'false'", async () => {
        const { contract } = await loadFixture(deployCoinFlip);
        await contract.disable();
        await contract.enable();
        const disabled = await contract.disabled();
        expect(disabled).to.equal(false);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).enable()).to.be.revertedWith("Unauthorized");
      });
    });

    describe("incrementCurrentFlip", () => {
      it("should increment the player's current flip index", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const before = await contract.getCurrentFlipIndex(player.address);
        await contract.incrementCurrentFlip(player.address);
        const after = await contract.getCurrentFlipIndex(player.address);
        expect(after).to.equal(before.add(1));
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(
          contract.connect(player).incrementCurrentFlip(player.address)
        ).to.be.revertedWith("Unauthorized");
      });
    });
  });

  describe("game functions", () => {
    describe("flip", () => {
      it("should revert if contract is disabled", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.disable();
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: wagerAmount })
        ).to.be.revertedWith("The game is currently disabled.");
      });

      it("should revert if the flip status is 'Loser'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, tailsTimestamp, { value: wagerAmount });
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: wagerAmount })
        ).to.be.revertedWith("Your current flip status does not allow this action.");
      });

      it("should revert if the flip status is 'Winner'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: wagerAmount })
        ).to.be.revertedWith("Your current flip status does not allow this action.");
      });

      it("should revert if the flip status is 'Reconciled'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        await contract.connect(player).collect();
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: wagerAmount })
        ).to.be.revertedWith("Your current flip status does not allow this action.");
      });

      it("should revert if wager amount is too low", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const notEnoughEther = ethers.utils.parseEther("0.005");
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: notEnoughEther })
        ).to.be.revertedWith("Wager amount too small.");
      });

      it("should revert if wager amount is too high", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const tooMuchEther = ethers.utils.parseEther("1.05");
        await expect(
          contract.connect(player).flip(heads, Date.now(), { value: tooMuchEther })
        ).to.be.revertedWith("Wager amount too large.");
      });

      it("should withdraw the transferred amount from the player", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const preTransferBalance = await player.getBalance();
        await contract.connect(player).flip(heads, Date.now(), { value: wagerAmount });
        const postTransferBalance = await player.getBalance();
        expect(postTransferBalance).to.not.equal(preTransferBalance);
      });

      it("should deposit the transferred amount into the contract", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const preTransferBalance = await contract.provider.getBalance(contract.address);
        await contract.connect(player).flip(heads, Date.now(), { value: wagerAmount });
        const postTransferBalance = await contract.provider.getBalance(contract.address);
        expect(postTransferBalance).to.equal(preTransferBalance.add(wagerAmount));
      });

      it("should set calledSide", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.calledSide).to.equal(1);
      });

      it("should set wagerAmount", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.wagerAmount).to.equal(wagerAmount);
      });

      it("should set flipFee", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        const expectedFlipFee = wagerAmount.mul(350).div(10_000);
        expect(currentFlip.flipFee).to.equal(expectedFlipFee);
      });

      it("should set flipResult", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.flipResult).to.not.equal(0);
      });

      it("should set status to 'Winner'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.status).to.equal(2);
      });

      it("should set status to 'Loser'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const flipIndex = await contract.getCurrentFlipIndex(player.address);
        await contract.connect(player).flip(heads, tailsTimestamp, { value: wagerAmount });
        const currentFlip = await contract.getFlip(player.address, flipIndex);
        expect(currentFlip.status).to.equal(1);
      });
    });

    describe("collect", () => {
      it("should revert if contract is disabled", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.disable();
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "The game is currently disabled."
        );
      });

      it("should revert if the flip status is 'Ready'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "Your current flip status does not allow this action."
        );
      });

      it("should revert if the flip status is 'Loser'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, tailsTimestamp, { value: wagerAmount });
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "Your current flip status does not allow this action."
        );
      });

      it("should revert if the flip status is 'Reconciled'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        await contract.connect(player).collect();
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "Your current flip status does not allow this action."
        );
      });

      it("should revert if the contract has insufficient funds", async () => {
        const { contract, owner, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const contractBalance = await contract.getBalance();
        await contract.connect(owner).withdraw(contractBalance);
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "The game has insufficient funds."
        );
      });

      it("should transfer the payout to the player", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const prePayoutBalance = await player.getBalance();
        const tx = await contract.connect(player).collect();
        const receipt = await tx.wait();
        const postPayoutBalance = await player.getBalance();
        const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const fee = wagerAmount.mul(350).div(10_000);
        const expectedBalance = prePayoutBalance.add(wagerAmount.mul(2)).sub(fee).sub(gasSpent);
        expect(postPayoutBalance).to.equal(expectedBalance);
      });

      it("should set status to 'Reconciled'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).flip(heads, headsTimestamp, { value: wagerAmount });
        const flipIndex = await contract.getCurrentFlipIndex(player.address);
        await contract.connect(player).collect();
        const flip = await contract.getFlip(player.address, flipIndex);
        expect(flip.status).to.equal(3);
      });
    });
  });
});
