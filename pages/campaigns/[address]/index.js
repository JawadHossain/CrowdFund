import React from 'react'
import { useRouter } from 'next/router'

const ViewCampaign = () => {
    const router = useRouter()
    console.log(router.query.address)
    return <div>campaign address page</div>
}

export default ViewCampaign
