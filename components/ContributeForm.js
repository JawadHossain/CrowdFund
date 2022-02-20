import React, { useState } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { useRouter } from 'next/router'

const ContributeForm = (props) => {
    const [contribution, setContribution] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const onSubmit = async (event) => {
        event.preventDefault()

        const campaign = Campaign(props.address)

        setLoading(true)
        setErrorMessage('')

        // send contribution
        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, 'ether')
            })
        } catch (err) {
            setErrorMessage(err.message)
        }

        setLoading(false)
        setContribution('')

        router.replace(`/campaigns/${props.address}`)
    }
    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={contribution}
                    onChange={(event) => setContribution(event.target.value)}
                    label="ether"
                    labelPosition="right"
                />
            </Form.Field>

            <Message error header="Error Encountered" content={errorMessage} />
            <Button primary loading={loading}>
                Contribute!
            </Button>
        </Form>
    )
}
export default ContributeForm
