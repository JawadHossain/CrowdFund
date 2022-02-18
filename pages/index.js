import React, { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'
import Link from 'next/link'
import factory from '../ethereum/factory'

const CampaignIndex = (props) => {
    const renderCampaigns = () => {
        const items = props.campaigns.map((address) => {
            return {
                header: address,
                description: (
                    <Link href={`/campaigns/${address}`}>View Campaign</Link>
                ),
                fluid: true
            }
        })

        return <Card.Group items={items} />
    }
    return (
        <>
            <h3>Open Campaigns</h3>

            <Link href="/campaigns/new">
                <a>
                    <Button
                        content="Create Campaign"
                        icon="add circle"
                        floated="right"
                        primary
                    />
                </a>
            </Link>

            {renderCampaigns()}
        </>
    )
}

export async function getStaticProps() {
    // fetch campaigns from Contract
    const campaigns = await factory.methods.getDeployedCampaigns().call()

    return {
        props: {
            campaigns
        },
        revalidate: 1
    }
}
export default CampaignIndex
