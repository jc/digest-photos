import he from "he";
import { MjmlColumn, MjmlImage, MjmlText } from "mjml-react";
import React from "react";
import { FlickrImage } from "../FlickrImage";
import { FlickrPhotoProps } from "../Models";

interface FlickrEmailImageProps extends FlickrPhotoProps {
  digestUrl: string;
}

export class FlickrEmailImage extends FlickrImage<FlickrEmailImageProps> {
  public render() {
    return (
      <MjmlColumn width="100%" vertical-align="top" padding-bottom="10px">
        <MjmlImage
          width="600px"
          src={this.imgUrlSize("b")}
          href={this.props.digestUrl}
          title={this.props.title}
          align="center"
          padding="0"
          border-radius="0px"
        />
        {this.props.title && (
          <MjmlText
            font-size="17px"
            align="left"
            line-height="18.7px"
            padding="10px 10px 0px 10px"
          >
            <span>{he.decode(this.props.title)}</span>
          </MjmlText>
        )}
        {this.props.description && (
          <MjmlText
            font-size="14px"
            align="left"
            line-height="15.4px"
            padding="10px"
          >
            {this.props.description.split("\n").map((item, key) => (
              <span key={key}>
                {he.decode(item)}
                <br />
              </span>
            ))}
          </MjmlText>
        )}
        <MjmlText
          font-size="14px"
          align="center"
          line-height="15.4px"
          padding="10px"
          color="#888"
        >
          {String.fromCharCode(9733)}
        </MjmlText>
      </MjmlColumn>
    );
  }
}
