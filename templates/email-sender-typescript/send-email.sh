#!/bin/bash
aws ses send-email \
  --from "${EMAIL_ADDRESS}" \
  --destination "ToAddresses=bounce@simulator.amazonses.com" \
  --message "Subject={Data=from ses,Charset=utf8},Body={Text={Data=This is a ses message,Charset=utf8},Html={Data=,Charset=utf8}}" \
  # --configuration-set-name "confSetFirst"

aws ses send-email \
  --from "${EMAIL_ADDRESS}" \
  --destination "ToAddresses=complaint@simulator.amazonses.com" \
  --message "Subject={Data=from ses,Charset=utf8},Body={Text={Data=This is a ses message,Charset=utf8},Html={Data=,Charset=utf8}}" \

aws ses send-email \
  --from "${EMAIL_ADDRESS}" \
  --destination "ToAddresses=delivery@simulator.amazonses.com" \
  --message "Subject={Data=from ses,Charset=utf8},Body={Text={Data=This is a ses message,Charset=utf8},Html={Data=,Charset=utf8}}" \
