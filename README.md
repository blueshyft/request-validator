# request-validator

Validate requests from Blueshyft using ed25519 signature verification

example:

```
node index.js verify "2HTNYLgHAI4MHwuceBkoNIzsOkJI2kncsrmJHHk82YYJUfo0ZljBFhadSrdGonLaaOjj0R6Jup0uBipOkc/aAg==" '{"locationId":"58745fb100ad9b5e7eb2e1af","paymentId":"5bbef6ae45fd5c5f72183ebb","paymentStatus":"completed"}' "/api-auth/api-wallet/api/v1/deposit/SVZCWS1MED" "Ay9DbpCeGB7AcxAA8x8BnCxZmn3rtg+d2BcXXze3BSs="
```

```
{ valid: true }
```

Failed example: 
```
node index.js verify "3HTNYLgHAI4MHwuceBkoNIzsOkJI2kncsrmJHHk82YYJUfo0ZljBFhadSrdGonLaaOjj0R6Jup0uBipOkc/aAg==" '{"locationId":"58745fb100ad9b5e7eb2e1af","paymentId":"5bbef6ae45fd5c5f72183ebb","paymentStatus":"completed"}' "/api-auth/api-wallet/api/v1/deposit/SVZCWS1MED" "Ay9DbpCeGB7AcxAA8x8BnCxZmn3rtg+d2BcXXze3BSs="
```

```
{ valid: false,
  error:
   { code: 403,
     type: 'auth:signature:invalid',
     description:
      'The signature supplied does not validate against the current public key' } }
```
