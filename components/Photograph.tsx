import React from 'react';
import {Icon} from 'semantic-ui-react'

export interface PhotographProps {
    title?: string,
    description?: string,
    url: string,
    link: string
}

export interface PermalinkProps {
    text?: string,
    url: string
}

export const Permalink: React.SFC<PermalinkProps> = (props) => (
    <div className="text">
        <p>{props.text} <a href={props.url}><Icon name='star' /></a></p>
        <style jsx>{`
            p {
                text-align: center;
                color: #888;
                font-size: 0.6em;
            }
            a, a:link, a:visited {
                color: #888;
                text-decoration: none;
            }
        `}
        </style>
    </div>
)

export interface EntryProps {
    title?: string,
    description?: string
}

export const Entry: React.SFC<EntryProps> = (props) => (
    <div className="text">
        {props.title && <h3>{props.title}</h3>}
        {props.description && <p>{props.description}</p>}
        <style jsx>{`
        div {
            margin-top: 0.25em;
        }

        h3 {
            font-family: 'Droid Serif', serif;
            padding: 0;
            margin: 0;
            color: #888;
        }
        
        p {
            margin: 0;
            color: #888;
            white-space: pre-line;
        }        
        `}
        </style>
    </div>
)

export const Photograph: React.SFC<PhotographProps> = (props) => (
    <div className="image">
        <div className="photo">
            <img src={props.url} />
        </div>
        <Entry title={props.title} description={props.description} />
        <Permalink url={props.link} />
        <style jsx>{`
            .image {
                margin-bottom: 2em;
            }
        
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
        `}
        </style>
    </div>
)
