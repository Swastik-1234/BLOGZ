//SPDX-License-Identifier: MIT

// NFT for gamified profiles of users(To be used in loyalaty programs etc).

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharactersNFT is ERC721Enumerable, ERC721URIStorage,Ownable {
    
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
    struct Profiles{
        string userName ;
        string characterName ;
        uint256 productsRegistered;
    }
    Profiles[] profiles ;


  constructor() ERC721 ("characterNFT", "CHARN") {
      
  }

   // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

   
    function encodeBaseSVG(string memory _characterName,string memory user) public pure returns  ( string memory) {
    
        uint baseProductNumber =1 ;

        string memory base_svg =string ( abi.encodePacked('<svg width="479.99999999999994" height="479.99999999999994" xmlns="http://www.w3.org/2000/svg">',
                                            '<path transform="rotate(90 240.828 45.9752)" id="svg_8" d="m241.49152,-194.25005l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>',
                                            '<path id="svg_9" d="m41.08263,-1.80443l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>',
                                            '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_1" y="71.19218" x="45.06426" stroke-width="0" stroke="#000" fill="#000000">',_characterName,'</text>',
                                            '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_3" y="137.1888" x="45.06426" stroke-width="0" stroke="#000" fill="#000000">Warranty Holder Name:' ,user, '</text>',
                                            '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_6" y="170.02286" x="45.00661" stroke-width="0" stroke="#000" fill="#000000">Products_registered:', Strings.toString(baseProductNumber),'</text>'
                                            ));
            return base_svg;    
    }

    function appendCharacterLevel (uint256 charLevel, string memory _baseSvg) public pure   returns  ( string memory){
        string memory final_svg = string(abi.encodePacked(_baseSvg ,
                                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_2" y="104.37246" x="45.00147" stroke-width="0" stroke="#000" fill="#000000">Character Level:' ,Strings.toString(charLevel), '</text>' ,
                                                        '</svg>'));
        return final_svg;
    }

                                            
                                            

    function updateLevelSvg(uint256 _tokenId) private view returns (string memory) {
        uint level = profiles[_tokenId].productsRegistered /2 ;
        string memory updated_svg =string ( abi.encodePacked('<svg width="479.99999999999994" height="479.99999999999994" xmlns="http://www.w3.org/2000/svg">',
                                        '<path transform="rotate(90 240.828 45.9752)" id="svg_8" d="m241.49152,-194.25005l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>',
                                        '<path id="svg_9" d="m41.08263,-1.80443l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_1" y="71.19218" x="45.06426" stroke-width="0" stroke="#000" fill="#000000">',profiles[_tokenId].characterName,'</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_3" y="137.1888" x="45.06426" stroke-width="0" stroke="#000" fill="#000000">Warranty holder name:' ,profiles[_tokenId].userName, '</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_6" y="170.02286" x="45.00661" stroke-width="0" stroke="#000" fill="#000000">Products_registered:', Strings.toString(profiles[_tokenId].productsRegistered),'</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_2" y="104.37246" x="45.00147" stroke-width="0" stroke="#000" fill="#000000">Level:' ,Strings.toString(level), '</text>',
                                        '</svg>'
                                         ));
        return updated_svg;    
    }
        
    function encodeJson(string memory _svg, string memory _contractName ) public pure returns (string memory){
        string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    
                    _contractName,
                    '", "description": "Your own character NFT" , "image": "data:image/svg+xml;base64,',
                    
                    Base64.encode(bytes(_svg)),
                    '"}'
                )
            )
        )
    );
    return json ;
    }

    function updateTokenUri( uint _tokenId  ) public {
        profiles[_tokenId].productsRegistered = profiles[_tokenId].productsRegistered +1 ;
        string memory svg =updateLevelSvg( _tokenId);
        string memory json = encodeJson(svg , profiles[_tokenId].userName);
        string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
        );
        _setTokenURI(_tokenId, finalTokenUri);
    }



    function del(uint _tokenId) public  {
        _burn(_tokenId);
    }
 

  function makeCharacterNFT(string memory _characterName,string memory user , address reciever ) public {
      //require(balanceOf(msg.sender) == 0,"error");
      profiles.push(Profiles(_characterName , user , 1));
    uint256 newItemId = _tokenIds.current();


        string memory baseSvg = encodeBaseSVG(_characterName , user);
        string memory finalSvg = appendCharacterLevel(0,baseSvg);
        string memory contractName = string(abi.encodePacked(user ,"'s Character Card"));
        string memory json = encodeJson(finalSvg , contractName);

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(reciever, newItemId);

    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
   
  }
}