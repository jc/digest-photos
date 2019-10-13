import * as React from 'react';
import {
  Mjml,
  MjmlHead,
  MjmlText,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlStyle,
  MjmlAll,
  MjmlAttributes,
} from 'mjml-react';
import { FlickrPhotoProps } from '../Models';
import { FlickrEmailImage } from './FlickrEmailImage';
import { ViewAllCta } from './ViewAllCta';

export class DigestEmail {
  private static DISPLAY_IMAGES = 10;

  static _summary() {
    return (
      <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">
      <MjmlColumn width="100%" vertical-align="top">
        <MjmlText font-size="14px" align="left" line-height="25.2px" padding="10px 10px 20px 10px">
          <p>Here is your latest digest of photographs by
        <a href="http://digesti.photos">James Clarke</a>. Having trouble viewing this email? <a>View all 24 photographs on the web</a>.</p>
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
    );
  }

  static _unsub() {
    return (
      <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">
      <MjmlColumn width="95%" vertical-align="top">
        <MjmlText font-size="14px" align="center" line-height="25.2px" container-background-color="#ECF8FF" padding="10px">
          <p>We are currently sending you digests every two days when there are new photographs. Want to change the delivery rate? Adjust your <a href="http://digest.photos">subscription</a> or unsubscribe.</p>
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
    );
  }

  static generate(items: FlickrPhotoProps[], url: string) {
    return (
      <Mjml>
        <MjmlHead>
          <MjmlStyle>{'p {margin: 0 } a {color: #2BA6CB } a {text - decoration: underline }'}</MjmlStyle>
          <MjmlAttributes>
            <MjmlAll font-family="sans-serif" font-weight="normal" font-size="14px" color="#323232" />
          </MjmlAttributes>
        </MjmlHead>
        <MjmlBody width="600px" background-color="#FAFAFA">
          <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">`
              <MjmlColumn width="100%" vertical-align="top" border-bottom="1px solid rgba(0,0,0,1)">
              <MjmlText font-family="Georgia,serif" font-weight="normal" font-size="44px" align="left" letter-spacing="-2px" line-height="44px" padding="0"><span><em>Digestif</em></span>
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection text-align="center" background-color="#FFFFFF" padding="0">
            {items.slice(0, DigestEmail.DISPLAY_IMAGES).map((item) => (
              <FlickrEmailImage key={item.item_key} {...item} />
            ))}
          </MjmlSection>
          {items.length > DigestEmail.DISPLAY_IMAGES && <ViewAllCta remainingItems={items.length - DigestEmail.DISPLAY_IMAGES} href={url} />}
          <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">
            <MjmlColumn width="100%" vertical-align="top">
              <MjmlText align="center" line-height="25.2px" padding="20px 10px 10px 10px">
                <p>Powered by <a href="http://digest.photos">Digiestif</a></p>
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        </MjmlBody>
      </Mjml>
    );
  }
}
