import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x1a600FDB0d1588925cf77AEe29CAa69d26c3d64a'
)

export default instance
