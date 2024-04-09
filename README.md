# Paste Bin

This tool is not meant for permanent content hosting, in fact it only keeps the data for 10min

No requests are logged, ever.

## Save Data

```
curl --request POST \
  --url http://localhost:3000/set \
  --header 'Content-Type: application/json' \
  --data '{
	"data": "long body"
}'
```

Response will simply be:

```
http://localhost:3000/get/icLXssYVOkMDuSbwbRTrM
```

Query that URL and you will get the data in text format
