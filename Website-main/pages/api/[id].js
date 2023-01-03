import {INFURA_ADDRESS, ADDRESS, ABI} from "../../config.js"
import Web3 from "web3";
//import mongoose from mongoose;

// import the json containing all metadata. not recommended, try to fetch the database from a middleware if possible, I use MONGODB for example
import all_metadata from "../../database/metadata_final.json"




const infuraAddress = INFURA_ADDRESS

const pandaApi = async(req, res) => {

    // SOME WEB3 STUFF TO CONNECT TO SMART CONTRACT
  const provider = new Web3.providers.HttpProvider(infuraAddress)
  const web3infura = new Web3(provider);
  const pandaContract = new web3infura.eth.Contract(ABI, ADDRESS)
  


  // IF YOU ARE USING INSTA REVEAL MODEL, USE THIS TO GET HOW MANY NFTS ARE MINTED
   const totalSupply = await pandaContract.methods.totalSupply().call();
   console.log(totalSupply)
  


// THE ID YOU ASKED IN THE URL
  const query = req.query.id;


  // IF YOU ARE USING INSTA REVEAL MODEL, UNCOMMENT THIS AND COMMENT THE TWO LINES BELOW
  if(parseInt(query) < totalSupply) {




    // IF YOU ARE NOT USING CUSTOM NAMES, JUST USE THIS

    
    
    let metadata = all_metadata[parseInt(query)]
    // const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby 

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    // IF THE REQUESTED TOKEN IS A SIGNATURE, RETURN THIS METADATA
    
    res.statusCode = 200
    res.json(metadata)
  } else {
    res.statuscode = 404
    res.json({error: "The Panda you requested hasn't been minted yet"})

  }




  
}

export default pandaApi