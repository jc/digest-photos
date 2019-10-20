export interface StreamProps {
  service_key: string;
  oauth_token: string;
  oauth_token_secret: string;
  service: string;
  last_checked: Date;
  created: Date;
  email: string;
  name?: string;
}

export interface FlickrPhotoProps {
  service: string;
  service_key: string;
  item_key: string;
  date_uploaded: Date;
  date_taken: Date;
  date_fetched: Date;
  farm: number;
  server: string;
  secret: string;
  type: string;
  title: string;
  description: string;
  url_h: string;
  url_k: string;
}

export interface SubscriptionProps {
  service_key: string;
  frequency: number;
  last_digest: Date;
  email: string;
}

export interface DigestProps {
  service_key: string;
  email: string;
  legacy_id?: string;
  start_date: Date;
  end_date: Date;
}

export function convertDaysToWords(value: number): string {
  if (value == 0) {
    return 'never';
  } else if (value == 1) {
    return 'daily';
  } else if (value == 2) {
    return 'every two days';
  } else if (value == 3) {
    return 'every three days';
  } else if (value == 7) {
    return 'weekly';
  } else if (value == 14) {
    return 'every two weeks'
  } else if (value == 30) {
    return 'monthly';
  }
  return value.toString();
}