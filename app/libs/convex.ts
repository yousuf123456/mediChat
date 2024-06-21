import { ConvexClient } from 'convex/browser';


declare global {
    var convex : ConvexClient | undefined
}

const client = globalThis.convex || new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

if (process.env.NODE_ENV !== "production") globalThis.convex = client;

export default client;