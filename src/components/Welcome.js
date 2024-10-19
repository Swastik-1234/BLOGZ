import React from 'react'
// import { AiFillAlipayCircle } from 'react-icons/ai';
import { ethers } from 'ethers';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import CharactersNFT from '../CharactersNFT.json';
import WarrantyNFT from '../WarrantyNFT.json';

import { Loader } from './';

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const warrantyAddress = '0x2ce7540f52087103646f8A88Ef734E8EFC7Eb14f';
const charactersAddress = '0x7ddF8CaF5c7D0b10Dc236b2b4Bc980898f15E480';


const privateKey = process.env.REACT_APP_PRIVATE_KEY;

let provider;

if(window.ethereum){
 provider = new ethers.providers.Web3Provider(window.ethereum);
}
else{
   provider = null;
}

const warrantyAddressABI = WarrantyNFT.abi;
const CharactersNFTABI = CharactersNFT.abi;

const WcontractInstance = new ethers.Contract(warrantyAddress, warrantyAddressABI, provider)
const CcontractInstance = new ethers.Contract(charactersAddress, CharactersNFTABI, provider)

async function getGasPrice() {
  let feeData = await provider.getFeeData()
  return feeData.gasPrice
}

async function getWallet(privateKey) {
  const wallet = await new ethers.Wallet(privateKey, provider)
  return wallet
}



async function getNonce(signer) {
  return (await signer).getTransactionCount()
}


const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e) => handleChange(e, name)}
    required
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);



const Welcome = ({ accounts, setAccounts, isConnected, setIsConnected }) => {

  const [isLoading, setIsLoading] = React.useState(false);
  let txHash;
  let blockNo;

  const mintWarranty = async () => {
    if( recieverAccountAddress && characterTokenId){
    const date = new Date(); 
    const today = date.getDate() + " / " + date.getMonth()+ " / " +  date.getFullYear();
    setIsLoading(true);
    try {

      const wallet = getWallet(privateKey)
      const nonce = await getNonce(wallet)
      const gasFee = await getGasPrice()
      let rawTxn = await WcontractInstance.populateTransaction.mintWarrantyNFT(productId, warrantyHolderName,today ,recieverAccountAddress ,{
        gasPrice: gasFee,
        nonce: nonce
      })
      
      console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
      let signedTxn = (await wallet).sendTransaction(rawTxn)

      let reciept = (await signedTxn).wait()

      if (reciept) {
        txHash = (await signedTxn).hash;
        blockNo = (await reciept).blockNumber;
        console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", txHash + '\n' + "Block Number:" + blockNo + '\n')
        
        alert("Your Warranty NFT has been minted. Please check your Openseas.Testnet account after sometime.Please wait while your character is being updated.")
      } else {
        console.log("Error submitting transaction")
        setIsLoading(false)
      }

    } catch (e) {
      console.log("Error Caught in Catch Statement2: ", e)
      setIsLoading(false)
    }
    try {

      const wallet = getWallet(privateKey)
      const nonce = await getNonce(wallet)
      const gasFee = await getGasPrice()
    
      let rawTxn2 = await CcontractInstance.populateTransaction.updateTokenUri(characterTokenId,{
        gasPrice: gasFee,
        nonce: nonce
      })
      console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
      
      let signedTxn2 = (await wallet).sendTransaction(rawTxn2)

      let reciept2 = (await signedTxn2).wait()

      if (reciept2) {
        txHash = (await signedTxn2).hash;
        blockNo = (await reciept2).blockNumber;
        console.log("Character update is successful!!!" + '\n' + "Transaction Hash:", txHash + '\n' + "Block Number:" + blockNo + '\n')
        setIsLoading(false);
       alert("Your character has been has been upgraded. Please check your Openseas.Testnet account after sometime.")
        setCharacterName('');
        setWarrantyHolderName('');
        setCharacterTokenId('');
        setProductId('');
      } else {
        alert("Error submitting transaction")
      }

    } catch (e) {
      console.log("Error Caught in Catch Statement2: ", e)
      alert("Error")
    }
  }
  else {
    alert('Enter valid data inputs.')
  }
  
  }

  const mintBoth = async () => {
    if( recieverAccountAddress && characterName){
    const date = new Date(); 
    const today = date.getDate() + " / " + date.getMonth()+ " / " +  date.getFullYear();
    setIsLoading(true);
    try {
      const wallet = getWallet(privateKey)
      const nonce = await getNonce(wallet)
      const gasFee = await getGasPrice()
      let rawTxn = await CcontractInstance.populateTransaction.makeCharacterNFT(characterName, warrantyHolderName,recieverAccountAddress, {
        gasPrice: gasFee,
        nonce: nonce
      })
      console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
      let signedTxn = (await wallet).sendTransaction(rawTxn)
      let reciept = (await signedTxn).wait()
      if (reciept) {
        txHash = (await signedTxn).hash;
        blockNo = (await reciept).blockNumber;
        console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", txHash + '\n' + "Block Number:" + blockNo + '\n')
        
        alert("Your Character NFT card has been minted. Please check your Openseas.Testnet account after sometime.")
      } else {
        console.log("Error submitting transaction")
        return;
      }
      
    } catch (e) {
      console.log("Error Caught in Catch Statement: ", e)
      return ;
    }
    
    try {

      const wallet = getWallet(privateKey)
      const nonce = await getNonce(wallet)
      const gasFee = await getGasPrice()
      let rawTxn = await WcontractInstance.populateTransaction.mintWarrantyNFT(productId, warrantyHolderName,today ,recieverAccountAddress ,{
        gasPrice: gasFee,
        nonce: nonce
      })
      console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
      let signedTxn = (await wallet).sendTransaction(rawTxn)
      let reciept = (await signedTxn).wait()
      if (reciept) {
        txHash = (await signedTxn).hash;
        blockNo = (await reciept).blockNumber;
        console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", txHash + '\n' + "Block Number:" + blockNo + '\n')
        setIsLoading(false);
        alert("Your warranty NFT has been minted. Please check your Openseas.Testnet account after sometime.")
        setCharacterName('');
        setWarrantyHolderName('');
        setCharacterTokenId('');
        setProductId('');
      } else {
        console.log("Error submitting transaction")
        alert("Error submitting transaction")
      }

    } catch (e) {
      console.log("Error Caught in Catch Statement2: ", e)
      setIsLoading(false)
    }
  }
  else {
    alert('Enter valid data inputs.')
  }
  }


  const [isNewUser, setIsNewUser] = React.useState(true);
  const [characterName, setCharacterName] = React.useState('');
  const [recieverAccountAddress, setRecieverAccountAddress] = React.useState("");
  const [productId, setProductId] = React.useState("");
  const [warrantyHolderName, setWarrantyHolderName] = React.useState('');
  const [characterTokenId, setCharacterTokenId] = React.useState('');


  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      setIsConnected(true);
      setRecieverAccountAddress(accounts[0]);
    }
    else{
      alert("Please use a metamask compatible browser")
    }
  }

  const handleChange = (event, name) => {
    if (name === 'characterName') setCharacterName(event.target.value);
    if (name === 'recieverAccountAddress') setRecieverAccountAddress(event.target.value);
    if (name === 'productId') setProductId(event.target.value);
    if (name === 'warrantyHolderName') setWarrantyHolderName(event.target.value);
    if (name === 'characterToken') setCharacterTokenId(event.target.value);

  }


  return (
    <div className='flex w-full justify-center items-center  '>
      <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
        <div className='flex flex-1 justify-start flex-col mf:mr-10'>
          <h1 className='text-3xl sm:text-5xl text-white text-gradient py-1 '>
            Mint your  <br /> digital warranty NFT.
          </h1>
          <p className='text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base'>
            Register your product to get your warranty NFT and your character card. <br /> Gain level points and get amazing offers.
            <br/>Please note that as this is a test webpage , your NFT will decay after 24 hours.
          </p>
          {isConnected ? <div

            className='flex flex-row justify-center items-center my-5 bg-[#2546bd] p-3 rounded-full  opacity-50 disabled'
          >
            <p className='text-white text-base font-semibold '>Wallet Connected</p>
          </div> : <button
            type='button'
            onClick={connectWallet}
            className='flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]'
          >
            <p className='text-white text-base font-semibold '>Connect Wallet</p>
          </button>}
          <div className='grid sm:grid-cols-3 grid-cols-2 w-full mt-10'>
            <div className={`rounded-tl-2xl ${commonStyles}`}>
              Reliability
            </div>
            <div className={commonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${commonStyles}`}>
              Ethereum
            </div>
            <div className={`sm:rounded-bl-2xl ${commonStyles}`}>
              Web 3.0
            </div>
            <div className={commonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${commonStyles}`}>
              Blockchain
            </div>
          </div>
          {/* <h2 className='text-2xl sm:text-2xl mt-12 text-center  text-white  py-1 '>
            Scroll Down to learn more.
          </h2> */}
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {characterName ?characterName : "Your_character_name"}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Product Warranty
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <div className='flex w-full mb-2'>
              <button
                type="button"
                onClick={() => setIsNewUser(true)}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#70FACB] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                New User
              </button>
              <button
                type="button"
                onClick={() => setIsNewUser(false)}
                className="text-white w-full ml-4 mt-2 border-[1px] p-2 border-[#70FACB] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Existing User
              </button>
            </div>


            {isNewUser ?
              <div>
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                <p className=" bg-transparent text-white font-semibold text-lg mt-1  ">New User :</p>
                <Input placeholder="Product Id" value={productId} name="productId" type="text" handleChange={handleChange} />
                <Input placeholder="Warranty Holder Name" value={warrantyHolderName} name="warrantyHolderName" type="text" handleChange={handleChange} />
                <Input placeholder="Character Name" value={characterName} name="characterName" type="text" handleChange={handleChange} />
                <Input placeholder="Reciever account address" value={recieverAccountAddress} name="recieverAccountAddress" type="text" handleChange={handleChange} />
              </div> :
              <div>
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                <p className=" bg-transparent text-white font-semibold text-lg mt-1  ">Existing User :</p>
                <Input placeholder="Your character NFT token Id" value={characterTokenId} name="characterToken" type="text" handleChange={handleChange} />
                <Input placeholder="Warranty Holder Name" value={warrantyHolderName} name="warrantyHolderName" type="text" handleChange={handleChange} />
                <Input placeholder="Reciever account address" value={recieverAccountAddress} name="recieverAccountAddress" type="text" handleChange={handleChange} />
                <Input placeholder="Product Id" value={productId} name="productId" type="text" handleChange={handleChange} />
              </div>}

            <div className="h-[1px] w-full bg-gray-400 my-2" />
            <p className="text-white font-semibold text-lg mt-1"></p>
            {isLoading
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={isNewUser ? mintBoth : mintWarranty}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Mint Warranty NFT
                </button>
              )}

          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Welcome
