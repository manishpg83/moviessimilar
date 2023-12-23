import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import type {ChipProps} from './chip';

export interface ChipListProps {
  className?: string;
  children?: ReactElement | ReactElement[];
  size?: ChipProps['size'];
  radius?: ChipProps['radius'];
  color?: ChipProps['color'];
  selectable?: ChipProps['selectable'];
}
export function ChipList({
  className,
  children,
  size,
  color,
  radius,
  selectable,
}: ChipListProps) {
  return (
    <div className={clsx(className, 'flex flex-wrap items-center gap-8')}>
      {Children.map(children, chip => {
        if (isValidElement<ChipProps>(chip)) {
          return cloneElement<ChipProps>(chip, {
            size,
            color,
            selectable,
            radius,
          });
        }
      })}
    </div>
  );
}
