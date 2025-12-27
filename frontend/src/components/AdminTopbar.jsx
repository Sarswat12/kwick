import React from 'react';
export const AdminTopbar = () => {
    return (<div className="w-full bg-red-600 text-white py-3 px-6 fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="font-semibold">KWICK TEAM</div>
        <div className="text-sm opacity-90">Admin Console</div>
      </div>
    </div>);
};
export default AdminTopbar;
