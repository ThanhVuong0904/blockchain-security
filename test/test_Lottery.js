const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Weak Randomness', () => {
    let deployer, attacker, user;
    beforeEach(async function () {
        [deployer, attacker, user] = await ethers.getSigners();
        const Lottery = await ethers.getContractFactory('Lottery', deployer);
        this.lottery = await Lottery.deploy();
    });

    describe('Lottery', () => {
        describe('With bets open', () => {
            it('Should allow a user to place a bet', async function () {
                await this.lottery.placeBet(5, { value: ethers.utils.parseEther('10') });
                expect(await this.lottery.bets(deployer.address)).to.eq(5);
            });
            it('Should revert if a user place more than 1 bet', async function () {
                await this.lottery.placeBet(5, { value: ethers.utils.parseEther('10') });
                await expect(this.lottery.placeBet(10, { value: ethers.utils.parseEther('10') })).to.revertedWith(
                    'Only 1 bet per player',
                );
            });
            it('Should revert if bet is not 10ether', async function () {
                await expect(this.lottery.placeBet(10, { value: ethers.utils.parseEther('5') })).to.revertedWith(
                    'Bet cost: 10ether',
                );
            });
            it('Should revert if bet is < 1', async function () {
                await expect(this.lottery.placeBet(0, { value: ethers.utils.parseEther('10') })).to.revertedWith(
                    'Must be a number from 1 to 255',
                );
            });
        });
    });
});
