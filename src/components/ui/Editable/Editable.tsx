import type { FC } from 'react';

import { ComponentProps } from '@stitches/react';

import { Text } from '@/components/ui';
import { styled } from '@/theme';

type EditableProps = ComponentProps<typeof Text>;

export const Editable: FC<EditableProps> = ({ children, css, ...props }) => (
  <Text
    contentEditable={true}
    suppressContentEditableWarning={true}
    css={{
      width: '100%',
      color: '$gray600',
      outline: 'none',
      transitionDuration: '0.2s',

      '&[contenteditable]': {
        '-webkit-tap-highlight-color': 'transparent',
      },

      '&[contenteditable]:empty:after': {
        content: 'attr(placeholder)',
        pointerEvents: 'none',
        color: '$gray700',
      },

      '&:focus': {
        outline: 'none',
        color: '$gray400',
      },

      ...css,
    }}
    {...props}
  >
    {children}
  </Text>
);
