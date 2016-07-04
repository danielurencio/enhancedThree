var connection = new Mongo();
db = connection.getDB("enigh");

var a = db.getCollection("hogares").find({},{ "folioviv":1 }).toArray();
var bulk = db.getCollection("hogares").initializeUnorderedBulkOp();

a.forEach(function(doc) {
  doc.folioviv = String(doc.folioviv);
});

for(var i in a) {
  bulk.find({ "_id": a[i]._id }).update({ "$set": { "folioviv": a[i].folioviv } });
};

bulk.execute();

db.hogares.aggregate([
  { $match: { folioviv: { $regex: "^21" }}},
  { $project:{
    _id:0,
    num_ester:1,
    num_grab:1,
    num_radio:1,
    num_tva:1,
    num_tvd:1,
    num_dvd:1,
    num_licua:1,
    num_tosta:1,
    num_micro:1,
    num_refri:1,
    num_lavad:1,
    num_planc:1,
    num_maqui:1,
    num_venti:1,
    num_aspir:1,
    num_compu:1,
    num_impre:1,
    num_juego:1 }},
  { $out:"electro" }
]);
