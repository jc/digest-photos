export interface StreamProps {
  service_key: string,
  oauth_token: string,
  oauth_token_secret: string,
  service: string,
  last_checked: Date,
  created: Date,
  email: string
}

export interface FlickrPhotoProps {
  service: string,
  service_key: string,
  item_key: string,
  date_uploaded: Date,
  date_taken: Date,
  date_fetched: Date,
  farm: number,
  server: string,
  secret: string,
  type: string,
  title: string,
  description: string,
  url_h: string,
  url_k: string
}
