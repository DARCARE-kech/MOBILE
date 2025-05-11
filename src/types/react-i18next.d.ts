
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend TransProps interface
  export interface TransProps {
    children?: ReactNode;
  }

  // Rather than just aliasing to ReactNode, we need to extend React's definitions
  // to ensure full type compatibility across all component uses
  export interface ReactI18NextChildren extends ReactNode {}
  
  // Ensure all iterables of ReactI18NextChildren are compatible with ReactNode
  export interface Iterable<T extends ReactI18NextChildren> extends Iterable<ReactNode> {}
}
