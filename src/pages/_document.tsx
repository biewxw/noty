import Document, { Html, Head, Main, NextScript } from 'next/document';

import { getCssText } from '@/theme';

export default class NotyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{
              __html: getCssText(),
            }}
          />
          <style>
            {`
              @import url(https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&family=Inter:wght@100;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap);

              * {
                box-sizing: border-box;
                font-family: IBM Plex Sans;
              }

              html, body, #__next {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: auto;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                color-scheme: dark;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
