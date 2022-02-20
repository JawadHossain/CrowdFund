import React from 'react'
import Link from 'next/link'
import Campaign from '../../../../ethereum/campaign'

import { Button, Header, Table } from 'semantic-ui-react'

import RequestRow from '../../../../components/RequestRow'

import classes from './newRequest.module.css'

const index = (props) => {
    const { Header, Row, HeaderCell, Body } = Table

    const renderRows = () => {
        return props.requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={props.address}
                    approversCount={props.approversCount}
                />
            )
        })
    }

    if (!props.approversCount) {
        return <div className="m-t-1">Invalid Campaign Address.</div>
    }

    return (
        <>
            <h3>Requests</h3>
            <Link href={`/campaigns/${props.address}/requests/new`}>
                <a>
                    <Button
                        primary
                        floated="right"
                        id={classes.addRequestButton}
                    >
                        Add Request
                    </Button>
                </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>{renderRows()}</Body>
            </Table>
            <div>Found {props.requestCount} requests.</div>
        </>
    )
}

export async function getStaticPaths() {
    return {
        fallback: 'blocking',
        paths: ['/campaigns/1/requests']
    }
}

export async function getStaticProps({ params }) {
    const address = params.address
    const campaign = Campaign(address)

    if (!campaign) {
        return { props: {} }
    }

    const requestCount = await campaign.methods.getRequestsCount().call()
    const approversCount = await campaign.methods.approversCount().call()

    // get requests from contract
    const requests = []
    for (let i = 0; i < parseInt(requestCount); i++) {
        const response = await campaign.methods.requests(i).call()
        requests.push({ ...response })
    }

    return {
        props: {
            address,
            requests,
            requestCount,
            approversCount
        }
    }
}

export default index
