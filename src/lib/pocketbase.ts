import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://124.220.64.29:8090';
export const pb = new PocketBase(POCKETBASE_URL);

export default pb;
