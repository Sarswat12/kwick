import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
export const IoTPanel = ({ onNavigate }) => {
    return (<div className="pt-20 p-6 min-h-screen bg-gray-50">
      <Card>
        <CardHeader>
          <CardTitle>IoT Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Placeholder for IoT device listings and live telemetry.</p>
          <Button onClick={() => onNavigate && onNavigate('admin-dashboard')}>Back to Admin</Button>
        </CardContent>
      </Card>
    </div>);
};
