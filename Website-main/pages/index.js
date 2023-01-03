import Head from 'next/head';
import Web3 from "web3";
import { useState, useEffect } from 'react';

import { ABI, ADDRESS } from '../config';

export default function Mint() {

    // FOR WALLET
    const [signedIn, setSignedIn] = useState(false)
  
    const [walletAddress, setWalletAddress] = useState(null)
  
    // FOR MINTING
    const [how_many_pandas, set_how_many_pandas] = useState(1)
  
    const [pandaContract, setpandaContract] = useState(null)
  
    // INFO FROM SMART Contract
  
    const [totalSupply, setTotalSupply] = useState(0)
  
    const [saleStarted, setSaleStarted] = useState(false)
  
    const [pandaPrice, setpandaPrice] = useState(0)
  
    useEffect( async() => { 
  
      signIn()
  
    }, [])
  
    async function signIn() {
      if (typeof window.web3 !== 'undefined') {
        // Use existing gateway
        window.web3 = new Web3(window.ethereum);
       
      } else {
        alert("No Ethereum interface injected into browser. Read-only access");
      }
  
      window.ethereum.enable()
        .then(function (accounts) {
          window.web3.eth.net.getNetworkType()
          // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
          .then((network) => {console.log(network);if(network != "main"){alert("You are on " + network+ " network. Change network to mainnet or you won't be able to do anything here")} });  
          let wallet = accounts[0]
          setWalletAddress(wallet)
          setSignedIn(true)
          callContractData(wallet)
  
    })
    .catch(function (error) {
    // Handle error. Likely the user rejected the login
    console.error(error)
    })
    }
  
  //
  
    async function signOut() {
      setSignedIn(false)
    }
    
    async function callContractData(wallet) {
      // let balance = await web3.eth.getBalance(wallet);
      // setWalletBalance(balance)
      const pandaContract = new window.web3.eth.Contract(ABI, ADDRESS)
      setpandaContract(pandaContract)
  
      const salebool = await pandaContract.methods.dropIsActive().call() 
      // console.log("saleisActive" , salebool)
      setSaleStarted(salebool)
  
      const totalSupply = await pandaContract.methods.totalSupply().call() 
      setTotalSupply(totalSupply)
  
      const pandaPrice = await pandaContract.methods.pandaPrice().call() 
      setpandaPrice(pandaPrice)
     
    }
    
    async function mintpanda(how_many_pandas) {
      if (pandaContract) {
   
        const price = Number(pandaPrice)  * how_many_pandas 
  
        const gasAmount = await pandaContract.methods.mintPoshPanda(how_many_pandas).estimateGas({from: walletAddress, value: price})
        console.log("estimated gas",gasAmount)
  
        console.log({from: walletAddress, value: price})
  
        pandaContract.methods
              .mintPoshPanda(how_many_pandas)
              .send({from: walletAddress, value: price, gas: String(gasAmount)})
              .on('transactionHash', function(hash){
                console.log("transactionHash", hash)
              })
            
      } else {
          console.log("Wallet not connected")
      }
      
    };
  
    
  
  
  
    return (
      <div id="main_page" className="flex flex-col items-center min-h-screen py-2">
        <Head>
          
          <title>Posh Pandas</title>
          <link rel="icon" href="/images/favicon.jpg" />
  
          <meta property="og:title" content="Posh Pandas" key="ogtitle" />
          <meta property="og:description" content="Posh Pandas is a project built on the Ethereum Blockchain containing a collection of 5000 uniquely generated Pandas. Holding a Panda isn't just for the great artwork but it brings you into a community filled with positivity and passion. Everyone wants to be posh, so start your journey with the experienced Posh Pandas! poshpandas.ca" key="ogdesc" />
          <meta property="og:type" content="website" key="ogtype" />
          <meta property="og:url" content="https://www.poshpandas.ca/" key="ogurl"/>
          <meta property="og:site_name" content="https://www.poshpandas.ca/" key="ogsitename" />

        </Head>

                <a href="https://www.poshpandas.ca/" className="mt-10 mb-12 w-96"><img src="images/Posh_Pandas_Sign.png"/></a> 

                <div className="image1"></div>
                <div className="image2"></div>
                <div className="image3"></div>
                <div className="image4"></div>
                <div className="image5"></div>

  
        <div>

            <div className="flex auth font-bold  justify-center items-center vw2 anything">
              {!signedIn ? <button onClick={signIn} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Connect Wallet with Metamask</button>
              :
              <button onClick={signOut} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Wallet Connected: {walletAddress}</button>}
            </div>
          </div>
  
          <div className="md:w-2/3 w-4/5">
         
          
            <div className="mt-6 py-6">
  
              <div className="flex flex-col items-center">
  
                  <p className="flex Title text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none my-4">Total Pandas Minted:<span className="text-blau text-4xl ml-3"> {!signedIn ?  <>-</>  :  <>{totalSupply}</> } / 1472</span></p>
  
                  <div id="mint" className="flex justify-around  mt-8 mx-6">
                    <span className="flex Title text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold"></span>
                    
                    <input 
                                        type="number" 
                                        min="1"
                                        max="15"
                                        value={how_many_pandas}
                                        onChange={ e => set_how_many_pandas(e.target.value) }
                                        name="" 
                                        className="Poppitandfinchsans pl-4 text-4xl  inline bg-grey-lighter  py-2 font-normal rounded text-grey-darkest  font-bold"
                                    />
                    
                    <span className="flex Title text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold">Pandas!</span>
      
                  </div>
                  {saleStarted ? 
                  <button onClick={() => mintpanda(how_many_pandas)} className="mt-4 Title text-4xl border-6 bg-blau  text-white hover:text-black p-2 ">MINT {how_many_pandas} pandas for {(pandaPrice * how_many_pandas) / (10 ** 18)} ETH + GAS</button>        
                    : <button className="mt-4 Title text-3xl border-6 bg-blau  text-white hover:text-black p-2 ">DROP IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>        
              
                }

              </div> 

              </div>
   
            </div> 
            <div className="flex Title text-5x1 text-white uppercase">Max of 15 Pandas per transaction!</div> 
      </div>  
      )
    }
