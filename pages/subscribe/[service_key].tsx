import { Layout } from '../../components/Layout';
import { ManageSubscriptionForm } from '../../components/Forms';
import { Component } from 'react';
import { NextPageContext } from 'next';
import React from "react";

interface SubscriptionPageProps {
  serviceKey: string;
  email?: string;
  frequency?: number;
}

class SubscriptionPage extends Component<SubscriptionPageProps> {
  static async getInitialProps(context: NextPageContext) {
    const serviceKey = context.query.service_key;
    const email = context.query.email;
    const frequency = context.query.frequency;
    return {serviceKey: serviceKey, email: email, frequency: Number(frequency)} as SubscriptionPageProps;
  }

  render() {
    return (
      <div>
        <Layout title={`Subscribe to ${this.props.serviceKey}`}>
          <ManageSubscriptionForm 
            serviceName={this.props.serviceKey} 
            serviceKey={this.props.serviceKey}
            url={`http://www.flickr.com/photos/${this.props.serviceKey}`}
            initialEmail={this.props.email}
            initialFrequency={this.props.frequency}
            />
        </Layout>
      </div>
    );
  }
}

export default SubscriptionPage;
