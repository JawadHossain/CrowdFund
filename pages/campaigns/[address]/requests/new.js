import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import web3 from '../../../../ethereum/web3'
import Campaign from '../../../../ethereum/campaign'

import { Form, Button, Message, Input } from 'semantic-ui-react'
import campaign from '../../../../ethereum/campaign'

const NewRequest = (props) => {
    const [value, setValue] = useState('')
    const [description, setDescription] = useState('')
    const [recipient, setRecipient] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter()

    const onSubmit = async (event) => {
        event.preventDefault()

        const campaign = Campaign(props.address)

        setLoading(true)
        setErrorMessage('')

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    recipient
                )
                .send({ from: accounts[0] })

            router.push(`/campaigns/${props.address}/requests`)
        } catch (err) {
            setErrorMessage(err.message)
        }

        setLoading(false)
    }

    if (!props.address) {
        return <div className="m-t-1">Invalid Campaign Address.</div>
    }

    return (
        <>
            <br />
            <Link href={`/campaigns/${props.address}/requests`}>
                <a>Back</a>
            </Link>

            <h3>Create a Request</h3>

            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={(event) => setRecipient(event.target.value)}
                    />
                </Form.Field>

                <Message
                    error
                    header="Error Encountered"
                    content={errorMessage}
                />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </>
    )
}

export async function getStaticPaths() {
    return {
        fallback: 'blocking',
        paths: ['/campaigns/1/requests/new']
    }
}

export async function getStaticProps({ params }) {
    const address = params.address
    const campaign = Campaign(address)

    if (!campaign) {
        return { props: {} }
    }

    return {
        props: { address }
    }
}

export default NewRequest
