import React, { useState } from 'react'
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import Campaign from '../ethereum/campaign'
import { useRouter } from 'next/router'

const RequestRow = (props) => {
    const [pendingApproval, setPendingApproval] = useState(false)
    const [pendingFinalize, setPendingFinalize] = useState(false)

    const { Row, Cell } = Table
    const { id, request, approversCount } = props
    const readyToFinalize = request.approvalCount > approversCount / 2

    const campaign = props.address ? Campaign(props.address) : null
    const router = useRouter()

    const onApprove = async () => {
        setPendingApproval(true)
        try {
            const accounts = await web3.eth.getAccounts()

            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            })
        } catch (err) {}

        setPendingApproval(false)

        router.replace(`/campaigns/${props.address}/requests`)
    }

    const onFinalize = async () => {
        setPendingFinalize(true)

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.finalizeRequest(props.id).send({
                from: accounts[0]
            })
        } catch (err) {}

        setPendingFinalize(false)

        router.replace(`/campaigns/${props.address}/requests`)
    }

    return (
        <Row
            disabled={request.complete}
            positive={readyToFinalize && !request.complete}
        >
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.complete
                    ? 'Approved'
                    : `${request.approvalCount}/${approversCount}`}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button
                        color="green"
                        basic
                        loading={pendingApproval}
                        onClick={onApprove}
                    >
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                {request.complete || !readyToFinalize ? null : (
                    <Button
                        color="teal"
                        basic
                        loading={pendingFinalize}
                        onClick={onFinalize}
                    >
                        Finalize
                    </Button>
                )}
            </Cell>
        </Row>
    )
}

export default RequestRow
