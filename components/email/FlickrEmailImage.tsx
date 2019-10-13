import { FlickrImage } from "../FlickrImage";
import {
  MjmlText,
  MjmlColumn,
  MjmlImage,
} from 'mjml-react';
import React from "react";

export class FlickrEmailImage extends FlickrImage {
  render() {
    return (
      <MjmlColumn width="100%" vertical-align="top">
      <MjmlText font-size="12px" align="right" line-height="13.2px" padding="0px 10px 10px 10px">
        <p>{this.props.date_taken.toString()}</p>
      </MjmlText>
      <MjmlImage width="600px" src={this.imgUrlSize('b')} href={`https://www.flickr.com/photos/${this.props.service_key}/${this.props.item_key}`} 
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
