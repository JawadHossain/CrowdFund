import web3 from './web3'
import { abi } from './build/Campaign.json'

export default (address) => {
    try {
        return new web3.eth.Contract(abi, address)
    } catch (err) {
        return
    }
}
