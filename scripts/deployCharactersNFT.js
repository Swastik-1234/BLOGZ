const hre = require("hardhat");

async function main() {
  const CharactersNFT = await hre.ethers.getContractFactory("CharactersNFT");
  const charactersNFT = await CharactersNFT.deploy();

  await charactersNFT.deployed();

  console.log("Character deployed to:", charactersNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
