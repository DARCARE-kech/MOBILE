
import { useThreads as useThreadsUtils } from './useThreads/threadUtils';
import { UseThreadsReturnType } from './chatState/types';

/**
 * Hook for managing chat threads
 */
export const useThreads = (): UseThreadsReturnType => {
  return useThreadsUtils();
};

export default useThreads;
