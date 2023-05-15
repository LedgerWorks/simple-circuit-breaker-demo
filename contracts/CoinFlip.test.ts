import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CoinFlip", () => {
  const initialDeposit = ethers.utils.parseEther("5");
  const wagerAmount = ethers.utils.parseEther("0.05");
  const headsTimestamp = 1683038967952;
  const tailsTimestamp = 1683038967953;

  async function deployCoinFlip() {
    const [owner, player, bannedPlayer] = await ethers.getSigners();
    const CoinFlipFactory = await ethers.getContractFactory("CoinFlip");
    const contract = await CoinFlipFactory.deploy();

    await contract.banPlayer(bannedPlayer.address);
    const tx = await owner.sendTransaction({ to: contract.address, value: initialDeposit });
    await tx.wait();

    return { contract, owner, player, bannedPlayer };
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

    describe("withdrawAll", () => {
      it("should transfer entire balance from contract to owner", async () => {
        const { contract, owner } = await loadFixture(deployCoinFlip);
        const preWithdrawOwnerBalance = await owner.getBalance();
        await contract.withdrawAll();
        const postWithdrawOwnerBalance = await owner.getBalance();
        const contractBalance = await contract.getBalance();
        expect(postWithdrawOwnerBalance).to.not.equal(preWithdrawOwnerBalance);
        expect(contractBalance).to.equal(ethers.utils.parseEther("0"));
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).withdrawAll()).to.be.revertedWith("Unauthorized");
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

    describe("banPlayer", () => {
      it("should ban the player", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.banPlayer(player.address);
        const isBanned = await contract.isBanned(player.address);
        expect(isBanned).to.equal(true);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).banPlayer(player.address)).to.be.revertedWith(
          "Unauthorized"
        );
      });
    });

    describe("unbanPlayer", () => {
      it("should unban the player", async () => {
        const { contract, bannedPlayer } = await loadFixture(deployCoinFlip);
        await contract.unbanPlayer(bannedPlayer.address);
        const isBanned = await contract.isBanned(bannedPlayer.address);
        expect(isBanned).to.equal(false);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(player).unbanPlayer(player.address)).to.be.revertedWith(
          "Unauthorized"
        );
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

    describe("overrideFlipStatus", () => {
      it("should override the player's current flip status", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.overrideFlipStatus(player.address, 4);
        const { status } = await contract.getCurrentFlip(player.address);
        expect(status).to.equal(4);
      });

      it("should revert if called by a non-admin", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await expect(
          contract.connect(player).overrideFlipStatus(player.address, 4)
        ).to.be.revertedWith("Unauthorized");
      });
    });
  });

  describe("game functions", () => {
    describe("wager", () => {
      it("should revert if contract is disabled", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.disable();
        await expect(contract.connect(player).wager(1, { value: wagerAmount })).to.be.revertedWith(
          "The game is currently disabled."
        );
      });

      it("should revert if the caller is banned", async () => {
        const { contract, bannedPlayer } = await loadFixture(deployCoinFlip);
        await expect(
          contract.connect(bannedPlayer).wager(1, { value: wagerAmount })
        ).to.be.revertedWith("You are currently banned!");
      });

      [1, 2, 3, 4].forEach((flipStatus) => {
        it(`should revert if the flip status is '${flipStatus}'`, async () => {
          const { contract, player } = await loadFixture(deployCoinFlip);
          await contract.overrideFlipStatus(player.address, flipStatus);
          await expect(
            contract.connect(player).wager(1, { value: wagerAmount })
          ).to.be.revertedWith("Your current flip status does not allow that action.");
        });
      });

      it("should revert if wager amount is too low", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const notEnoughEther = ethers.utils.parseEther("0.005");
        await expect(
          contract.connect(player).wager(1, { value: notEnoughEther })
        ).to.be.revertedWith("Wager amount too small.");
      });

      it("should revert if wager amount is too high", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const tooMuchEther = ethers.utils.parseEther("1.05");
        await expect(contract.connect(player).wager(1, { value: tooMuchEther })).to.be.revertedWith(
          "Wager amount too large."
        );
      });

      it("should set calledSide", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.calledSide).to.equal(1);
      });

      it("should set wagerAmount", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.wagerAmount).to.equal(wagerAmount);
      });

      it("should set flipFee", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        const expectedFlipFee = wagerAmount.mul(350).div(10_000);
        expect(currentFlip.flipFee).to.equal(expectedFlipFee);
      });

      it("should set status to 'WagerPlaced'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.status).to.equal(1);
      });

      it("should withdraw the transferred amount from the player", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const preTransferBalance = await player.getBalance();
        await contract.connect(player).wager(1, { value: wagerAmount });
        const postTransferBalance = await player.getBalance();
        expect(postTransferBalance).to.not.equal(preTransferBalance);
      });

      it("should deposit the transferred amount into the contract", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        const preTransferBalance = await contract.provider.getBalance(contract.address);
        await contract.connect(player).wager(1, { value: wagerAmount });
        const postTransferBalance = await contract.provider.getBalance(contract.address);
        expect(postTransferBalance).to.equal(preTransferBalance.add(wagerAmount));
      });
    });

    describe("flip", () => {
      it("should revert if contract is disabled", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.disable();
        await expect(contract.connect(player).flip(Date.now())).to.be.revertedWith(
          "The game is currently disabled."
        );
      });

      it("should revert if the caller is banned", async () => {
        const { contract, bannedPlayer } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(bannedPlayer).flip(Date.now())).to.be.revertedWith(
          "You are currently banned!"
        );
      });

      [0, 2, 3, 4].forEach((flipStatus) => {
        it(`should revert if the flip status is '${flipStatus}'`, async () => {
          const { contract, player } = await loadFixture(deployCoinFlip);
          await contract.overrideFlipStatus(player.address, flipStatus);
          await expect(contract.connect(player).flip(Date.now())).to.be.revertedWith(
            "Your current flip status does not allow that action."
          );
        });
      });

      it("should set flipResult", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(Date.now());
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.flipResult).to.not.equal(0);
      });

      it("should set status to 'Flipped'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(Date.now());
        const currentFlip = await contract.getCurrentFlip(player.address);
        expect(currentFlip.status).to.equal(2);
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

      it("should revert if the caller is banned", async () => {
        const { contract, bannedPlayer } = await loadFixture(deployCoinFlip);
        await expect(contract.connect(bannedPlayer).collect()).to.be.revertedWith(
          "You are currently banned!"
        );
      });

      [0, 1, 3, 4].forEach((flipStatus) => {
        it(`should revert if the flip status is '${flipStatus}'`, async () => {
          const { contract, player } = await loadFixture(deployCoinFlip);
          await contract.overrideFlipStatus(player.address, flipStatus);
          await expect(contract.connect(player).collect()).to.be.revertedWith(
            "Your current flip status does not allow that action."
          );
        });
      });

      it("should revert if the player did not win", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(tailsTimestamp);
        await expect(contract.connect(player).collect()).to.be.revertedWith(
          "You did not win that coin flip."
        );
      });

      it("should transfer the payout to the player", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(headsTimestamp);
        const prePayoutBalance = await player.getBalance();
        const tx = await contract.connect(player).collect();
        const receipt = await tx.wait();
        const postPayoutBalance = await player.getBalance();
        const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const fee = wagerAmount.mul(350).div(10_000);
        const expectedBalance = prePayoutBalance.add(wagerAmount.mul(2)).sub(fee).sub(gasSpent);
        expect(postPayoutBalance).to.equal(expectedBalance);
      });

      it("should set status to 'PayoutReconciled'", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(headsTimestamp);
        const flipIndex = await contract.getCurrentFlipIndex(player.address);
        await contract.connect(player).collect();
        const flip = await contract.getFlip(player.address, flipIndex);
        expect(flip.status).to.equal(3);
      });

      it("should increment player's currentFlip", async () => {
        const { contract, player } = await loadFixture(deployCoinFlip);
        await contract.connect(player).wager(1, { value: wagerAmount });
        await contract.connect(player).flip(headsTimestamp);
        const before = await contract.getCurrentFlipIndex(player.address);
        await contract.connect(player).collect();
        const after = await contract.getCurrentFlipIndex(player.address);
        expect(after).to.equal(before.add(1));
      });
    });
  });
});
