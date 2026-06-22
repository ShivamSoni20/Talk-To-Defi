import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.headers.get('PAYMENT-SIGNATURE');
  
  if (!auth) {
    const paymentRequired = {
      x402Version: 2,
      resource: {
        url: request.url,
        description: "Live APY Data"
      },
      accepts: [
        {
          scheme: "exact",
          network: "eip155:43113",
          asset: process.env.USDC_ADDRESS || "0x5425890298aed601595a70AB815c96711a31Bc65",
          amount: "1000", 
          payTo: process.env.X402_PAYMENT_ADDRESS || "0x8CaacE76CE39cDA029D9b0E3cBF4321594d5Bc0F",
          maxTimeoutSeconds: 300,
          extra: {
            name: "USD Coin",
            version: "1"
          }
        }
      ]
    };

    const b64 = Buffer.from(JSON.stringify(paymentRequired)).toString('base64');

    return new NextResponse('Payment Required', {
      status: 402,
      headers: {
        'PAYMENT-REQUIRED': b64
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/apy"]
};
