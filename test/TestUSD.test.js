const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TestUSD (ERC-20 with Burn)', function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory('TestUSD');
    token = await Token.deploy();
    await token.deployed();
  });

  it('has correct name, symbol and decimals', async function () {
    expect(await token.name()).to.equal('TestUSD');
    expect(await token.symbol()).to.equal('TUSD');
    expect(await token.decimals()).to.equal(18);
  });

  it('mints initial supply to deployer', async function () {
    const total = await token.totalSupply();
    const balance = await token.balanceOf(owner.address);
    expect(total).to.equal(balance);
    const expected = ethers.parseUnits('20000000', 18);
    expect(total).to.equal(expected);
  });

  it('owner can mint additional tokens', async function () {
    await token.mint(addr1.address, 500); // 500 whole tokens
    const bal = await token.balanceOf(addr1.address);
    expect(bal).to.equal(ethers.parseUnits('500', 18));
  });

  it('non-owner cannot mint', async function () {
    await expect(token.connect(addr1).mint(addr1.address, 1))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('user can burn their own tokens', async function () {
    // First mint some tokens to addr1
    await token.mint(addr1.address, 1000);
    const initialBalance = await token.balanceOf(addr1.address);
    
    // Burn 200 tokens
    await token.connect(addr1).burn(200);
    const finalBalance = await token.balanceOf(addr1.address);
    
    expect(finalBalance).to.equal(initialBalance - ethers.parseUnits('200', 18));
    expect(await token.totalSupply()).to.equal(
      ethers.parseUnits('20000000', 18) + ethers.parseUnits('800', 18) // initial + remaining minted
    );
  });

  it('user can burn tokens with allowance', async function () {
    // Mint to addr1
    await token.mint(addr1.address, 1000);
    
    // addr1 approves addr2 to spend 500 tokens
    await token.connect(addr1).approve(addr2.address, ethers.parseUnits('500', 18));
    
    // addr2 burns 300 tokens from addr1
    await token.connect(addr2).burnFrom(addr1.address, 300);
    
    const remainingBalance = await token.balanceOf(addr1.address);
    expect(remainingBalance).to.equal(ethers.parseUnits('700', 18));
    
    const remainingAllowance = await token.allowance(addr1.address, addr2.address);
    expect(remainingAllowance).to.equal(ethers.parseUnits('200', 18));
  });

  it('cannot burn more than balance', async function () {
    await token.mint(addr1.address, 100);
    await expect(token.connect(addr1).burn(200))
      .to.be.reverted; // ERC20: burn amount exceeds balance
  });

  it('cannot burnFrom without allowance', async function () {
    await token.mint(addr1.address, 100);
    await expect(token.connect(addr2).burnFrom(addr1.address, 50))
      .to.be.reverted; // ERC20: insufficient allowance
  });

  it('emits Burn event', async function () {
    await token.mint(addr1.address, 100);
    await expect(token.connect(addr1).burn(50))
      .to.emit(token, 'Transfer')
      .withArgs(addr1.address, ethers.ZeroAddress, ethers.parseUnits('50', 18));
  });
});
