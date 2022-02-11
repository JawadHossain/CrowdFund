const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

const MIN_CONTRIBUTION_AMT = '100'
let accounts
let factory
let campaignAddress
let campaign

/**
 * Deploy CampaignFactory contract
 * Create test Campaign
 */
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    await factory.methods.createCampaign(MIN_CONTRIBUTION_AMT).send({
        from: accounts[0],
        gas: '1000000'
    })

    const campaigns = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = campaigns[0] // extract first campaign from list
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call()

        assert.equal(accounts[0], manager)
    })

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: MIN_CONTRIBUTION_AMT + '1'
        })

        const isContributor = await campaign.methods
            .approvers(accounts[1])
            .call()

        assert(isContributor)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '5'
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({ from: accounts[0], gas: '1000000' })

        const request = await campaign.methods.requests(0).call()

        assert.equal('Buy batteries', request.description)
        assert.equal('100', request.value)
        assert.equal(accounts[1], request.recipient)
    })

    // E2E test
    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let initialBalance = await web3.eth.getBalance(accounts[1])
        initialBalance = web3.utils.fromWei(initialBalance, 'ether')
        initialBalance = parseFloat(initialBalance)

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let finalBalance = await web3.eth.getBalance(accounts[1])
        finalBalance = web3.utils.fromWei(finalBalance, 'ether')
        finalBalance = parseFloat(finalBalance)

        // compare balance difference
        const difference = finalBalance - initialBalance
        assert(difference === 5)
    })
})
