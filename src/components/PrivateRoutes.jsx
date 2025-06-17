import { Route } from 'react-router-dom';
import { RoutesWithNotFound } from './RoutesWithNotFound';
import { Dashboard } from '../private';

export const PrivateRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Dashboard />} />
      <Route path="edit" element={<Dashboard />} />
      <Route path="new" element={<Dashboard />} />
      <Route path="view" element={<Dashboard />} />
    </RoutesWithNotFound>
  );
};