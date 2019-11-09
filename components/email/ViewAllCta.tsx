import { MjmlButton, MjmlColumn, MjmlSection } from "mjml-react";
import { Component } from "react";
import React from "react";

export interface ViewAllProps {
  href: string;
  remainingItems: number;
}

export class ViewAllCta extends Component<ViewAllProps, {}> {
  public button(url: string, text: string): JSX.Element {
    return (
      <MjmlSection
        text-align="center"
        direction="ltr"
        background-color="#FFFFFF"
        padding="0"
      >
        <MjmlColumn width="100%" vertical-align="top">
          <MjmlButton
            background-color="#1DACED"
            border="1px solid rgba(230,236,238,1)"
            border-radius="5px"
            padding="10px"
            inner-padding="15px 20px"
            font-size="17px"
            align="center"
            color="#FFFFFF"
            href={url}
          >
            <span>{text}</span>
          </MjmlButton>
        </MjmlColumn>
      </MjmlSection>
    );
  }

  public render() {
    if (this.props.remainingItems === 1) {
      return this.button(this.props.href, "View one more photograph");
    } else {
      return this.button(
        this.props.href,
        `View ${this.props.remainingItems} more photographs`
      );
    }
  }
}
