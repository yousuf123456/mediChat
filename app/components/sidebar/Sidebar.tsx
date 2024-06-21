import React from "react";
import { DesktopSidebar } from "./DesktopSidebar";

import { MobileFooter } from "./MobileFooter";

async function Sidebar() {
  return (
    <div>
      <div className="hidden lg:block">
        {/* <DesktopSidebar user={currentUser}/> */}
      </div>

      <div>
        <MobileFooter />
      </div>
    </div>
  );
}

export default Sidebar;
