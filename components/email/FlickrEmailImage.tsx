import { FlickrImage } from "../FlickrImage";
import {
  MjmlText,
  MjmlColumn,
  MjmlImage,
} from 'mjml-react';
import React from "react";
import { FlickrPhotoProps } from "../Models";

interface FlickrEmailImageProps extends FlickrPhotoProps {
  digestUrl: string;  
}

export class FlickrEmailImage extends FlickrImage<FlickrEmailImageProps> {
  render() {
    return (
      <MjmlColumn width="100%" vertical-align="top">
      <MjmlImage width="600px" src={this.imgUrlSize('b')} href={this.props.digestUrl} 
                 title={this.props.title} align="center" padding="0" border-radius="0px" />
      <MjmlText font-size="17px" align="left" line-height="18.7px" padding="10px 10px 0px 10px"><span>{this.props.title}</span>
      </MjmlText>
      <MjmlText font-size="14px" align="left" line-height="15.4px" padding="10px">
        <p>
          {this.props.description.split('\n').map((item, key) => (
            <span key={key}>{item}<br/></span>
            ))}
        </p>
      </MjmlText>
    </MjmlColumn>
    );
  }
}
