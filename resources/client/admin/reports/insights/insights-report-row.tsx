import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}
export function InsightsReportRow({children}: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center overflow-x-auto gap-12 md:gap-24 mb-12 md:mb-24">
      {children}
    </div>
  );
}
