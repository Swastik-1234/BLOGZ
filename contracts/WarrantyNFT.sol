//SPDX-License-Identifier: MIT

//Actual product warranty .
pragma solidity ^0.8.1;


import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract WarrantyNFT is ERC721URIStorage  {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 public interval;
  uint256 public validity ;
  uint256 [] public timestamps;

  

  constructor() ERC721 ("WarrantyTest", "WRNTY") {
    interval = 86400 ;
    validity = interval / 86400;
  }  

    
    function encodeBaseImage(string memory productId,string memory user , string memory dateRegistered   ) public view  returns  ( string memory) {
    
    string memory base_svg =string ( abi.encodePacked('<svg width="479.99999999999994" height="479.99999999999994" xmlns="http://www.w3.org/2000/svg">',
                                        '<g>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_3" y="174.1888" x="45.00000" stroke-width="0" stroke="#000" fill="#000000">Warranty Holder Name:',user, '</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_4" y="390.00" x="45.00000" stroke-width="0" stroke="#000" fill="#000000">Product ID:', productId ,'</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_6" y="420.00" x="45.00000" stroke-width="0" stroke="#000" fill="#000000">Warranty Period:',Strings.toString(validity) ,'Days','</text>',
                                        '<text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_5" y="450.00" x="45.00000" stroke-width="0" stroke="#000" fill="#000000">Date Registered:',dateRegistered,'</text>',
                                        '<path transform="rotate(90 240.828 45.9752)" id="svg_8" d="m241.49152,-194.25005l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>',
                                        '<path id="svg_9" d="m41.08263,-1.80443l-1.32721,480.45044" opacity="undefined" stroke="#000" fill="none"/>', 
                                        '</g>',
                                        '</svg>'
                                         ));
        return base_svg;    
    }

    function encodeJson(string memory _svg, string memory _contractName ) public pure returns (string memory){
        string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    
                    _contractName,
                    '", "description": "Your NFT warranty card" , "image": "data:image/svg+xml;base64,',
                    
                    Base64.encode(bytes(_svg)),                 
                    '"}'
                )
            )
        )
    );
    return json ;
    }

function expireNFT() public {
    for(uint i = 0 ; i< timestamps.length;i++){
        if(timestamps[i]==0) continue;
        uint256 temp =block.timestamp - timestamps[i];
        if( temp > interval){
            timestamps[i]=0;
            del(i);
        }
    }
}
function setInterval(uint256 timeInSeconds) public {
    interval = timeInSeconds;
    validity = interval / 86400; 
}

    function del(uint _tokenId) private  {
        _burn(_tokenId);
    }


  function mintWarrantyNFT( string memory productId,string memory user, string memory _date ,address reciever ) public {

    uint256 newItemId = _tokenIds.current();
    timestamps.push(block.timestamp);
    

    string memory finalSvg = encodeBaseImage(productId, user , _date );
    string memory contractName = string(abi.encodePacked(user ,"'s warranty"));
    string memory json = encodeJson(finalSvg , contractName);

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(reciever, newItemId);

    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
   
  }
}