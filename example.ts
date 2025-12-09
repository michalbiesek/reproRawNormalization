import { CriblControlPlane } from 'cribl-control-plane';

const serverUrl = 'http://localhost:9000/api/v1';
const username = 'admin';
const password = 'admin';
const destinationId = 'devnull'; // Replace with your actual destination ID

async function main() {
  
  try {
    // Step 1: Authenticate and get token
    const tempClient = new CriblControlPlane({
      serverURL: serverUrl,
    });

    const authResponse = await tempClient.auth.tokens.get({
      username: username,
      password: password,
    });

    const token = authResponse.result.token;
    console.log('Authentication successful');

    // Step 2: Create authenticated client
    const client = new CriblControlPlane({
      serverURL: serverUrl,
      security: {
        bearerAuth: token,
      },
      debugLogger: console
    });

    const sampleEvent = {
      raw: '127.0.0.1 - - [01/Jan/2024:00:00:00 +0000] "GET /test" 200 1234',
      additionalProperties: {
        host: 'localhost',
        sourcetype: 'access_common',
      },
    };

    const sampleResponse = await client.destinations.samples.create({
      id: destinationId,
      outputTestRequest: {
        events: [sampleEvent],
      },
    });
    console.log('Sample events sent successfully:', sampleResponse);

    const payload = [
      {
        raw: '123.456.789.789 - Qiv41020 204 2338',
        host: 'foo.io',
        sourcetype: 'acces_foo',
        source: '/var/log/foo.log',
        _time: 1234,
        cribl_test: 'cribl-test',
      },
    ] as any;

    // Need to use additionalProperties for this to work
    const sampleResponse2 = await client.destinations.samples.create({
      id: destinationId,
      outputTestRequest: {
        events: payload,
      },
    });

    console.log('Sample events sent successfully:', sampleResponse2);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
