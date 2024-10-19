import React from 'react'
import { AiTwotonePushpin } from "react-icons/ai";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2  cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services = () => {

  return (
    <div className="flex w-full justify-center mt-0 items-center gradient-bg-services  ">
      <div className="cards flex mf: items-center justify-between md: p-20 py-12 px-4  ">
        <div className="flex-1 flex flex-col justify-start items-start">
          <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
            How to register your product?
            <br />
          </h1>
          <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
            Please follow the following steps to get your product warranty along with a fun character card linked your warranty NFT.
          </p>
          
        </div>
        <div className="flex-1 mt-6 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#8945F8]"
          title="For first time users."
          icon={<AiTwotonePushpin fontSize={21} className="text-white" />}
          
          subtitle={"Enter your your Product ID given on the product , the name to which the warranty will be linked , your character name for your character avatar , and finally your account address where the minted NFTs will be sent. "}
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="For existing users"
          icon={<AiTwotonePushpin fontSize={21} className="text-white" />}
          subtitle={`Firstly you have to enter the token ID for your character card that will gain points for your new registration.  You can get this from your character NFT page in openseas.testnet . Scroll down to details section of the NFT and copy the token ID. Then enter the warranty holder name recieving wallet address and finally the product ID. `}
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Click on Mint NFT and Voilà!! NFT Minted!!"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="Congratulations!! You have minted your warranty NFT !! You can check them out on the Openseas.testnet page linked to the recieving wallet address."
        />
      </div>
      </div>
    </div>

  )
}

export default Services