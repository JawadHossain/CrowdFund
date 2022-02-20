import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xCbED81C58f5499143E7d619477371a816FCB2230'
)

export default instance
