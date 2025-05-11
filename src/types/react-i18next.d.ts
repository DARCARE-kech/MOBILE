
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend TransProps interface
  export interface TransProps {
    children?: ReactNode;
  }

  // Simply alias ReactI18NextChildren to ReactNode directly
  export type ReactI18NextChildren = ReactNode;
  
  // No need to extend or modify Iterable, as ReactNode is already compatible
}
