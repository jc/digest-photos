import * as React from 'react';
import { Formik, FormikProps, FormikActions } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Message } from 'semantic-ui-react';

interface ManageSubscriptionFormProps {
  serviceName: string;
  url?: string;
  initialEmail?: string;
  initialFrequency?: number;
  serviceKey: string;
}

interface ManageSubscriptionValues {
  email: string;
  frequency: number;
  serviceKey: string;
}

const ManageSubscriptionSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  frequency: Yup.number().required(),
  serviceKey: Yup.string().required(),
});

const frequencyOptions = [
  { key: '0', text: 'Never (Unsubscribe)', value: 0 },
  { key: '1', text: 'Daily', value: 1 },
  { key: '2', text: 'Every other day', value: 2 },
  { key: '3', text: 'Every three days', value: 3 },
  { key: '7', text: 'Weekly', value: 7 },
  { key: '14', text: 'Every two weeks', value: 14 },
  { key: '30', text: 'Monthly', value: 30 }
];

async function handleSubmit(values: ManageSubscriptionValues, actions: FormikActions<ManageSubscriptionValues>) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {'Accept': 'application/json',
    'Content-Type': 'application/json'},
    body: JSON.stringify({email: values.email, frequency: values.frequency, service_key: values.serviceKey}),
  });
  actions.setSubmitting(false);
  const data = await response.json();
  actions.setStatus(data.success ? 'success' : 'warning');
}

export const ManageSubscriptionForm: React.FunctionComponent<ManageSubscriptionFormProps> = (props) => {
  return (
    <Formik
      initialValues={{ email: props.initialEmail || '', 
                      frequency: props.initialFrequency == 0 ? 0 : props.initialFrequency || 7,
                      serviceKey: props.serviceKey
                    }}
      validationSchema={ManageSubscriptionSchema}
      onSubmit={handleSubmit}
      render={(formikBag: FormikProps<ManageSubscriptionValues>) => (
      <><Form onSubmit={(event) => {formikBag.handleSubmit(event)}} success={formikBag.status == 'success'} warning={formikBag.status == 'warning'}>
          <Message
            success
            header='Preferences updated'
            content="Your subscription preferences have been updated."
          />
          <Message
            warning
            header='Error updating preferences'
            content="Unable to update subscription preferences at this time. Please try again."
          />               
          <p>Send photographs by <a href={props.url}>{props.serviceName}</a> to</p>
          <Form.Group widths='equal'>
            <Form.Input 
              value={formikBag.values.email} 
              error={formikBag.errors.email} 
              name='email' 
              placeholder='Enter email address' 
              onChange={(_event, o) => {formikBag.setFieldValue('email', o.value)}}
            />
            <Form.Dropdown 
              selection 
              defaultValue={formikBag.values.frequency} 
              name='frequency'
              options={frequencyOptions}
              placeholder='Select a Frequency'
              onChange={(_event, {name, value}) => {formikBag.setFieldValue(name, value)}} 
            />
          </Form.Group>
          <p>&nbsp; when there are new photographs.</p>
          {formikBag.values.frequency == 0 ?
            <Button type="submit" className="negative" loading={formikBag.isSubmitting}>Unsubscribe</Button>
          :
            <Button type="submit" loading={formikBag.isSubmitting}>Subscribe</Button>
          }   
        </Form>
      <style jsx>{`
      p {
        font-size: 1.2em;
        line-height: 1.2em;
      }
      button {
        margin-top: 15px;
        padding: 8px;
        font-family: 'Droid Serif', Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif;
        font-size: 22px;
        border: none;
        border-radius: 5px;
        background: #5bb75b;
        color: #ffffff;
        cursor: pointer;
        line-height: 26px;
      }
    
      button.negative {
        background: #b75b5b;
      }

      div {
        text-align: right;
      }      
      `}</style>
      </>
    )}
    />
  );
};
