import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("IOU", function () {
  async function deployFixture() {
    const [owner, address1] = await ethers.getSigners();
    const VerifyVoucher = await ethers.getContractFactory("VerifyVoucher");
    const verifyVoucher = await upgrades.deployProxy(VerifyVoucher, []);

    const TheToken = await ethers.getContractFactory("TheToken");
    const token = await upgrades.deployProxy(TheToken, [verifyVoucher.address]);

    return {
      owner,
      address1,
      TheToken,
      token,
    };
  }
  it("Should deploy the token", async () => {
    const { owner, token } = await loadFixture(deployFixture);
    expect(await token.owner()).to.equal(owner.address);
  });

  it("should create a IOU", async () => {
    const { owner, address1, token } = await loadFixture(deployFixture);

    const IOU = await ethers.getContractFactory("IOU");
    const iou = IOU.attach(token.address);
    const iouOwner = await iou.owner();
    expect(iouOwner).to.equal(owner.address);
  });
});
