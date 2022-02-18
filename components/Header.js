import Link from 'next/link'
import React from 'react'
import { Menu } from 'semantic-ui-react'

const Header = () => {
    return (
        <div className="m-t-1">
            <Menu>
                <Link href="/">
                    <a className="item">CrowdFund</a>
                </Link>

                <Menu.Menu position="right">
                    <Link href="/">
                        <a className="item">Campaigns</a>
                    </Link>

                    <Link href="/campaigns/new">
                        <a className="item">+</a>
                    </Link>
                </Menu.Menu>
            </Menu>
        </div>
    )
}

export default Header
