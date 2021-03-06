import { Component } from 'react';
import { FlickrPhotoProps } from './Models';
import React from "react";

export class FlickrImage<P extends FlickrPhotoProps> extends Component<P> {
  static sizeWidths: { [key: string]: string } = {
    "z": "640w",
    "c": "800w",
    "b": "1024w",
    "h": "1600w",
    "k": "2048w"
  }

  imgUrlSize(size: string): string {
    if (size == 'h') {
      return this.props.url_h
    } else if (size == 'k') {
      return this.props.url_k
    } else {
      return `https://farm${this.props.farm}.staticflickr.com/${this.props.server}/${this.props.item_key}_${this.props.secret}_${size}.jpg`
    }
  }

  videoSrc(size = 'hd'): string {
    return `http://www.flickr.com/photos/${this.props.service_key}/${this.props.item_key}/play/${size}/${this.props.secret}/`;
  }

  imgSet(): JSX.Element {
    const srcset = Object.keys(FlickrImage.sizeWidths).reduce((acc, l) => {
      const imgUrl = this.imgUrlSize(l);
      if (imgUrl != undefined) {
        acc.push(`${imgUrl} ${FlickrImage.sizeWidths[l]}`);
      }
      return acc;
    },
      []).join();

    return (
      <img src={this.imgUrlSize("c")}
        sizes="90vw"
        srcSet={srcset} />
    );
  }

  video(): JSX.Element {
    if (this.props.farm == 0) {
      return (
        <video width="800" controls>
          <source type="video/mp4" src={this.videoSrc()}/>
        </video>
      );
    }
    return (
      <video width="800" poster={this.imgUrlSize("c")} controls>
        <source type="video/mp4" src={this.videoSrc()}/>
      </video>
    );
  }

  entry(): JSX.Element {
    if (this.props.type == 'video') {
      return this.video();
    } else {
      return this.imgSet();
    }
  }

  render() {
    return (
      <div className="photo">
        {this.entry()}
        <style jsx>{`
          .photo {
            display: flex;
            justify-content: center;
            align-items: baseline;
            margin-bottom: 1em;
          }
        `}</style>
      </div>
    )
  }
}
