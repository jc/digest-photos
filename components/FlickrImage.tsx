import React from 'react';

export interface FlickrImageProps {
  service_key: string,
  item_key: string,
  farm: string,
  server: string,
  secret: string,
  type: string,
  url_h?: string,
  url_k?: string
}

export class FlickrImage extends React.Component<FlickrImageProps> {
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
      return `http://farm${this.props.farm}.staticflickr.com/${this.props.server}/${this.props.item_key}_${this.props.secret}_${size}.jpg`
    }
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
        sizes="(max-width: 1144px) calc(100vw - 120px), 1024px"
        srcSet={srcset} />
    );
  }

  render() {
    return (
      <div className="photo">
        {this.imgSet()}
        <style jsx>{`
          .photo {
            display: flex;
            justify-content: center;
            align-items: baseline;
            margin-bottom: 1em;
          }
        
          img {
            flex: none;
            max-height: 1000px;
          }
        `}</style>
      </div>
    )
  }
}