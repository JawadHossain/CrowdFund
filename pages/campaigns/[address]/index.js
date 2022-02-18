import React from 'react'
import Campaign from '../../../ethereum/campaign'

const ViewCampaign = (props) => {
    return <div>campaign address page{props.address}</div>
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

    // fetch campaign details
    const summary = await campaign.methods.getSummary().call()
    console.log(summary)
    return {
        props: {
            address
        }
    }
}

export default ViewCampaign
