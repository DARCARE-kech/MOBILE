
// This file is now just a reexport file to maintain backward compatibility
// New code should import from the services subdirectory directly
import { useServiceRequest, type ServiceLocationState } from './services/useServiceRequest';
import { useServiceRequestById } from './services/useServiceRequestById';

export type { ServiceLocationState };
export { useServiceRequest, useServiceRequestById };
