import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("IOU", function () {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const IOU = await ethers.getContractFactory("IOU");
    const iou = await IOU.deploy();

    const ProxyIOU = await ethers.getContractFactory("ProxyIOU");
    const proxyIOU = await ProxyIOU.deploy(0x473be604, iou.address);

    return {
      owner,
      IOU,
      iou,
      proxyIOU,
    };
  }
  it("deployment - owner is set once", async () => {
    const { owner, IOU, proxyIOU } = await loadFixture(deployFixture);

    const proxy = IOU.attach(proxyIOU.address);

    const proxyOwner = await proxy.owner();

    await expect(proxy.constructor1()).to.be.revertedWith(
      "You can't initialize again"
    );
    expect(proxyOwner).to.equal(owner.address);
  });
});
