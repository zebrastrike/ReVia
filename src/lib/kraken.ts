import crypto from "crypto";

/* ------------------------------------------------------------------ */
/*  Kraken API Client — authenticated + public endpoints               */
/* ------------------------------------------------------------------ */

const KRAKEN_API_URL = "https://api.kraken.com";

function getApiKey() {
  const key = process.env.KRAKEN_API_KEY;
  if (!key) throw new Error("KRAKEN_API_KEY not set");
  return key;
}

function getApiSecret() {
  const secret = process.env.KRAKEN_API_SECRET;
  if (!secret) throw new Error("KRAKEN_API_SECRET not set");
  return secret;
}

/* ------------------------------------------------------------------ */
/*  Signature (Kraken uses nonce + HMAC-SHA512 over SHA256 hash)       */
/* ------------------------------------------------------------------ */

function createSignature(
  path: string,
  nonce: number,
  postData: string
): string {
  const secret = getApiSecret();
  const secretBuffer = Buffer.from(secret, "base64");

  // SHA256(nonce + postData)
  const sha256Hash = crypto
    .createHash("sha256")
    .update(nonce + postData)
    .digest();

  // HMAC-SHA512(path + sha256Hash, secret)
  const hmac = crypto
    .createHmac("sha512", secretBuffer)
    .update(Buffer.concat([Buffer.from(path), sha256Hash]))
    .digest("base64");

  return hmac;
}

/* ------------------------------------------------------------------ */
/*  Private API call                                                   */
/* ------------------------------------------------------------------ */

async function privateRequest<T = Record<string, unknown>>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const path = `/0/private/${endpoint}`;
  const nonce = Date.now() * 1000;
  const postData = new URLSearchParams({
    nonce: String(nonce),
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  }).toString();

  const signature = createSignature(path, nonce, postData);

  const res = await fetch(`${KRAKEN_API_URL}${path}`, {
    method: "POST",
    headers: {
      "API-Key": getApiKey(),
      "API-Sign": signature,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: postData,
  });

  if (!res.ok) {
    throw new Error(`Kraken API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API: ${data.error.join(", ")}`);
  }

  return data.result as T;
}

/* ------------------------------------------------------------------ */
/*  Public API call                                                    */
/* ------------------------------------------------------------------ */

async function publicRequest<T = Record<string, unknown>>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const query = new URLSearchParams(params).toString();
  const url = `${KRAKEN_API_URL}/0/public/${endpoint}${query ? `?${query}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Kraken API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API: ${data.error.join(", ")}`);
  }

  return data.result as T;
}

/* ------------------------------------------------------------------ */
/*  Get BTC/USD price                                                  */
/* ------------------------------------------------------------------ */

interface TickerResult {
  [pair: string]: {
    a: [string, string, string]; // ask [price, wholeLotVolume, lotVolume]
    b: [string, string, string]; // bid
    c: [string, string];         // last trade
    v: [string, string];         // volume
    p: [string, string];         // volume weighted average price
    t: [number, number];         // number of trades
    l: [string, string];         // low
    h: [string, string];         // high
    o: string;                   // opening price
  };
}

export async function getBtcUsdPrice(): Promise<number> {
  const data = await publicRequest<TickerResult>("Ticker", {
    pair: "XBTUSD",
  });
  // Kraken uses XXBTZUSD as the key
  const pair = Object.keys(data)[0];
  if (!pair || !data[pair]) {
    throw new Error("Failed to get BTC/USD price from Kraken");
  }
  // Use last trade price
  return parseFloat(data[pair].c[0]);
}

/* ------------------------------------------------------------------ */
/*  Convert USD to BTC                                                 */
/* ------------------------------------------------------------------ */

export async function usdToBtc(
  amountUsd: number
): Promise<{ amountBtc: number; exchangeRate: number }> {
  const rate = await getBtcUsdPrice();
  // amountUsd is in cents, convert to dollars first
  const dollars = amountUsd / 100;
  const amountBtc = parseFloat((dollars / rate).toFixed(8));
  return { amountBtc, exchangeRate: rate };
}

/* ------------------------------------------------------------------ */
/*  Get deposit address for BTC                                        */
/* ------------------------------------------------------------------ */

interface DepositAddress {
  address: string;
  expiretm: string;
  new: boolean;
  tag?: string;
}

export async function getDepositAddress(
  asset: string = "XBT"
): Promise<string> {
  // First try to get existing address
  const addresses = await privateRequest<DepositAddress[]>(
    "DepositAddresses",
    { asset, method: "Bitcoin" }
  );

  if (addresses && addresses.length > 0) {
    return addresses[0].address;
  }

  // Generate new address if none exist
  const newAddresses = await privateRequest<DepositAddress[]>(
    "DepositAddresses",
    { asset, method: "Bitcoin", new: 1 }
  );

  if (!newAddresses || newAddresses.length === 0) {
    throw new Error("Failed to get deposit address from Kraken");
  }

  return newAddresses[0].address;
}

/* ------------------------------------------------------------------ */
/*  Get recent deposits (ledger entries)                                */
/* ------------------------------------------------------------------ */

interface LedgerEntry {
  refid: string;
  time: number;
  type: string;
  subtype: string;
  aclass: string;
  asset: string;
  amount: string;
  fee: string;
  balance: string;
}

interface LedgerResult {
  ledger: Record<string, LedgerEntry>;
  count: number;
}

export async function getRecentDeposits(
  since?: number // unix timestamp
): Promise<Array<{
  id: string;
  refid: string;
  amount: number;
  asset: string;
  time: number;
  fee: number;
}>> {
  const params: Record<string, string | number> = {
    type: "deposit",
    asset: "XBT",
  };

  if (since) {
    params.start = since;
  }

  const data = await privateRequest<LedgerResult>("Ledgers", params);

  if (!data.ledger) return [];

  return Object.entries(data.ledger).map(([id, entry]) => ({
    id,
    refid: entry.refid,
    amount: parseFloat(entry.amount),
    asset: entry.asset,
    time: entry.time,
    fee: parseFloat(entry.fee),
  }));
}

/* ------------------------------------------------------------------ */
/*  Get deposit status (more detailed)                                 */
/* ------------------------------------------------------------------ */

interface DepositStatus {
  method: string;
  aclass: string;
  asset: string;
  refid: string;
  txid: string;
  info: string;
  amount: string;
  fee: string;
  time: number;
  status: string;
  "status-prop"?: string;
}

export async function getDepositStatus(
  asset: string = "XBT"
): Promise<DepositStatus[]> {
  return privateRequest<DepositStatus[]>("DepositStatus", {
    asset,
  });
}

/* ------------------------------------------------------------------ */
/*  Get account balance                                                */
/* ------------------------------------------------------------------ */

export async function getBalance(): Promise<Record<string, string>> {
  return privateRequest<Record<string, string>>("Balance");
}

/* ------------------------------------------------------------------ */
/*  Build bitcoin: URI for QR code                                     */
/* ------------------------------------------------------------------ */

export function buildBitcoinUri(
  address: string,
  amountBtc: number,
  label?: string,
  message?: string
): string {
  const params = new URLSearchParams();
  params.set("amount", amountBtc.toFixed(8));
  if (label) params.set("label", label);
  if (message) params.set("message", message);
  return `bitcoin:${address}?${params.toString()}`;
}
