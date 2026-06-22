import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../screens/client/Home.jsx';
import Projects from '../screens/client/Projects.jsx';
import UnitList from '../screens/client/UnitList.jsx';
import UnitDetail from '../screens/client/UnitDetail.jsx';
import Reserve from '../screens/client/Reserve.jsx';
import Success from '../screens/client/Success.jsx';
import { captureTrackingRef } from '../lib/trackingRef.js';

// CLIENT site — the broker/client reservation flow. Deployed at its own domain
// (e.g. app.jiwaraloula.com). Routes live at the domain root.
export default function ClientApp() {
  // Capture ?ref=ID-xxxx from whichever page the broker's link landed on,
  // before react-router strips it from later in-app navigation.
  useEffect(() => { captureTrackingRef(); }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId/units" element={<UnitList />} />
      <Route path="/units/:unitId" element={<UnitDetail />} />
      <Route path="/units/:unitId/reserve" element={<Reserve />} />
      <Route path="/reservation/:id/success" element={<Success />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
