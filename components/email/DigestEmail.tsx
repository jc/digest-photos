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
import { FlickrPhotoProps, StreamProps, SubscriptionProps, convertDaysToWords } from '../Models';
import { FlickrEmailImage } from './FlickrEmailImage';
import { ViewAllCta } from './ViewAllCta';

interface SummaryProps {
  name: string;
  url: string;
}

interface UnsubscribeProps {
  stream: StreamProps;
  subscription: SubscriptionProps;
}

export const Summary: React.FunctionComponent<SummaryProps> = (props) => (
  <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">
    <MjmlColumn width="100%" vertical-align="top">
      <MjmlText font-size="14px" align="left" line-height="25.2px" padding="10px 10px 20px 10px">
        <p>Latest photographs from <a href={props.url}>{props.name}</a>.</p>
      </MjmlText>
    </MjmlColumn>
  </MjmlSection>
);

export const Unsubscribe: React.FunctionComponent<UnsubscribeProps> = (props) => (
  <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0">
  <MjmlColumn width="95%" vertical-align="top">
    <MjmlText font-size="14px" align="center" line-height="25.2px" container-background-color="#ECF8FF" padding="10px">
      <p>We are currently sending you digests {convertDaysToWords(props.subscription.frequency)} when there are new photographs. 
      Want to change the delivery rate? 
      Adjust your <a href={`https://digest.photos/unsubscribe/${props.stream.service_key}?email=${props.subscription.email}`}>subscription</a> 
      or <a href={`https://digest.photos/unsubscribe/${props.stream.service_key}?email=${props.subscription.email}&frequency=0`}>unsubscribe</a>.</p>
    </MjmlText>
  </MjmlColumn>
</MjmlSection>  
);

export const Layout: React.FunctionComponent<{}> = ({children}) => (
  <Mjml>
    <MjmlHead>
      <MjmlStyle>{'p {margin: 0 } a {color: #2BA6CB } a {text - decoration: underline }'}</MjmlStyle>
      <MjmlAttributes>
        <MjmlAll font-family="sans-serif" font-weight="normal" font-size="14px" color="#323232" />
      </MjmlAttributes>
    </MjmlHead>
    <MjmlBody width="600px" background-color="#FAFAFA">
      <MjmlSection text-align="center" direction="ltr" background-color="#FFFFFF" padding="0 0 25px 0">`
          <MjmlColumn width="100%" vertical-align="top" border-bottom="1px solid rgba(0,0,0,1)">
          <MjmlText font-family="Georgia,serif" font-weight="normal" font-size="44px" align="left" letter-spacing="-2px" line-height="44px" padding="0"><span><em>Digestif</em></span>
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      {children}
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

interface DigestEmailProps {
  items: FlickrPhotoProps[];
  url: string;
  stream: StreamProps;
  subscription: SubscriptionProps;
}

const MAX_DISPLAY_IMAGES = 10;

export const Email: React.FunctionComponent<DigestEmailProps> = (props) => (
  <Layout>
  {props.stream.name && <Summary name={props.stream.name} url={`https://www.flickr.com/photos/{props.stream.service_key}`} />}
  <MjmlSection text-align="center" background-color="#FFFFFF" padding="0">
    {props.items.slice(0, MAX_DISPLAY_IMAGES).map((item) => (
      <FlickrEmailImage key={item.item_key} digestUrl={props.url} {...item} />
    ))}
  </MjmlSection>
  {props.items.length > MAX_DISPLAY_IMAGES && <ViewAllCta remainingItems={props.items.length - MAX_DISPLAY_IMAGES} href={props.url} />}
  <Unsubscribe subscription={props.subscription} stream={props.stream} />
</Layout>  
)
