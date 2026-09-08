import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const DECOY_URL = 'https://accounts.shopify.com/lookup?rid=25d9622a-b519-428d-894f-d7497352b9e9&verify=1788869242-EU2uv6dja6SM6zso82f%2Bo%2BiPVynOtrWTPewK3%2BZXqt4%3D';

export default function AdminRootFallback() {
  redirect(DECOY_URL);
}
