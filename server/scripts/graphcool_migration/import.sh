rm -rf data
mkdir -p data/lists data/nodes data/relations
mv export.lists.json data/lists/1.json
mv export.nodes.json data/nodes/1.json
mv export.relations.json data/relations/1.json
prisma import --data data