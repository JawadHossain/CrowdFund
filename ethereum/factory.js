import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x6b8c3f943CA8F769eafCf56e8dD16C0a0c9fCd60'
)

export default instance;