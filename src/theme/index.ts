import { createStitches } from '@stitches/react';

import { colors, space, sizes, radii, media, fonts, fontSizes, lineHeights } from './foundations';

export const { styled, css, getCssText } = createStitches({
  media,
  theme: {
    colors,
    space,
    sizes,
    radii,
    fonts,
    fontSizes,
    lineHeights,
  },
})