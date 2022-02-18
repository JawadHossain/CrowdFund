import React from 'react'
import { Menu } from 'semantic-ui-react'

const Header = () => {
    return (
        <div className="m-t-1">
            <Menu>
                <Menu.Item>CrowdFund</Menu.Item>

                <Menu.Menu position="right">
                    <Menu.Item>Campaigns</Menu.Item>

                    <Menu.Item>+</Menu.Item>
                </Menu.Menu>
            </Menu>
        </div>
    )
}

export default Header
