require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { abi, evm } = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.PROVIDER
)
const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0] })

    console.log('Contract deployed to', result.options.address)
    provider.engine.stop()
}
deploy()

/*  
Contract deployed to 0xCbED81C58f5499143E7d619477371a816FCB2230
*/
