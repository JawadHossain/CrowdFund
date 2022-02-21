import React from 'react'
import { Card, Grid, Button } from 'semantic-ui-react'
import web3 from '../../../ethereum/web3'
import Link from 'next/link'
import ContributeForm from '../../../components/ContributeForm'
import Campaign from '../../../ethereum/campaign'

const ViewCampaign = (props) => {
    const renderCards = () => {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = props

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description:
                    'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:
                    'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description:
                    'A request tries to withdraw money from the contract. Requests must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description:
                    'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description:
                    'The balance is how much money this campaign has left to spend.'
            }
        ]

        return <Card.Group items={items} />
    }

    if (!props.balance) {
        return <div className="m-t-1">Invalid Campaign Address.</div>
    }

    return (
        <>
            <h3>Campaign Show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>{renderCards()}</Grid.Column>

                    <Grid.Column width={6}>
                        <ContributeForm address={props.address} />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaigns/${props.address}/requests`}>
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}

export async function getStaticPaths() {
    return {
        fallback: 'blocking',
        paths: ['/campaigns/1']
    }
}

export async function getStaticProps({ params }) {
    const address = params.address
    const campaign = Campaign(address)

    if (!campaign) {
        return { props: {} }
    }

    let summary
    try {
        // fetch campaign details
        summary = await campaign.methods.getSummary().call()
    } catch (err) {
        return { props: {} }
    }

    return {
        props: {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address
        }
    }
}

export default ViewCampaign
