const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Access Control', () => {
    let deployer, attacker, user;
    beforeEach(async function () {
        [deployer, attacker, user] = await ethers.getSigners();
        const MyPets = await ethers.getContractFactory('MyPets', deployer);
        this.myPets = await MyPets.deploy('Lu');
        // console.log([deployer.address]);
        // console.log([user.address]);
        // console.log([attacker.address]);
    });
    describe('My Pets', () => {
        it('Should set dog name at deployment', async function () {
            expect(await this.myPets.MyDog()).to.eq('Lu');
        });

        it('Should set the deployer account as owner', async function () {
            expect(await this.myPets.Owner()).to.eq(deployer.address);
        });

        it('Should NOT be able to change the dog name if not the owner', async function () {
            await expect(this.myPets.connect(attacker).updateDog('kiki')).to.be.revertedWith('Authorized user only');
        });

        it('Should be possible for owner transfer ownership', async function () {
            await this.myPets.changeOwner(user.address);
            expect(await this.myPets.Owner()).to.eq(user.address);
        });

        it('Should be possible for the new owner update the dog name', async function () {
            await this.myPets.changeOwner(user.address);
            await this.myPets.connect(user).updateDog('Kaka');
            expect(await this.myPets.MyDog()).to.eq('Kaka');
        });

        it('Should NOT be possible for the others to transfer ownership', async function () {
            await expect(this.myPets.connect(attacker).changeOwner(attacker.address)).to.be.revertedWith(
                'Authorized user only',
            );
        });
    });
});
