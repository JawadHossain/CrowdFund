import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x9d93798Ab0a2E77400702d8607f0E9F0D76aB64D'
)

export default instance
