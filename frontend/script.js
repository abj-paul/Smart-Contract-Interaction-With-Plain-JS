import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const greetButton = document.getElementById("greetButton");
const connectButton = document.getElementById("connectButton");
const setGreetingButton = document.getElementById("setGreetingButton");
greetButton.onclick = greet;
connectButton.onclick = connect;
setGreetingButton.onclick = setGreeting;


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
        await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
        console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

async function greet() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.greet();
        console.log(`DEBUG: ${transactionResponse}`);
        document.getElementById("greeting").innerText = transactionResponse;
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}


async function setGreeting() {
    const newGreeting = document.getElementById("newGreeting").value
    console.log(`Funding with ${newGreeting}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.setGreeting(newGreeting);
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}