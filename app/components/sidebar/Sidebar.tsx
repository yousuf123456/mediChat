
import React from 'react'
import { DesktopSidebar } from './DesktopSidebar'

import {getCurrentUser} from "../../actions/getCurrentUser"
import { MobileFooter } from './MobileFooter';

async function Sidebar() {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <div className='hidden lg:block'>
        <DesktopSidebar user={currentUser}/>
      </div>

      <div>
        <MobileFooter />
      </div>
    </div>
  )
}

export default Sidebar;