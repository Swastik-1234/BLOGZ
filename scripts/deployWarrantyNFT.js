const hre = require("hardhat");

async function main() {
  const WarrantyNFT = await hre.ethers.getContractFactory("WarrantyNFT");
  const warrantyNFT = await WarrantyNFT.deploy();

  await warrantyNFT.deployed();

  console.log("warranty deployed to:", warrantyNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
