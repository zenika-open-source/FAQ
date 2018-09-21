URL='https://api.graph.cool/simple/v1/cjdop7oh32ywh0122r6t651j0/export'
TOKEN='A_WORKING_TOKEN'

curl $URL -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"fileType":"nodes","cursor":{"table":0,"row":0,"field":0,"array":0}}' -sSv -o export.nodes.json
curl $URL -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"fileType":"lists","cursor":{"table":0,"row":0,"field":0,"array":0}}' -sSv -o export.lists.json
curl $URL -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"fileType":"relations","cursor":{"table":0,"row":0,"field":0,"array":0}}' -sSv -o export.relations.json