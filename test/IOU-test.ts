// import { upgrades, ethers } from "hardhat";
// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import Voucher from "../scripts/Voucher";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("IOU", function () {
  async function deployLockFixture() {
    const [owner] = await ethers.getSigners();
    const IOU = await ethers.getContractFactory("IOU");
    const iou = await IOU.deploy();

    const ProxyIOU = await ethers.getContractFactory("ProxyIOU");
    const iouProxy = await ProxyIOU.deploy(0x473be604, iou.address);

    return {
      owner,
      IOU,
      iou,
      iouProxy,
    };
  }
  it("deployment - owner is set once", async () => {
    const { owner, IOU, iouProxy } = await loadFixture(deployLockFixture);

    const proxy = IOU.attach(iouProxy.address);
    const proxyOwner = await proxy.owner();

    await expect(proxy.constructor1()).to.be.revertedWith(
      "You can't initialize again"
    );
    expect(proxyOwner).to.equal(owner.address);
  });
});
