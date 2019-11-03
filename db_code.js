exports = async function(payload) {
   const { To, From, Body } = payload;
   const mongodb = context.services.get("mongodb-db");
   const texts = mongodb.db("contacts").collection("phone_numbers_1");

  //   // Save the text message body, to number, and from number
  //   // Send the user a confirmation text message
  //   //response.setBody(`Saved your text message with _id: ${insertedId}`);
     const twilio = context.services.get("DisasterBlaster");
    if(Body.toLowerCase() === "add"){
      const insertedId = await texts.insertOne(payload);
    twilio.send({
        to: From,
        from: To,
        body: "Welcome to DisasterCast, your center for disaster relief. You have been added to our database and will be notified of opportunities for aid."
    });
    }
    
    else if(Body.length >= 7 && Body.toLowerCase().substring(0,7) === "provide") {
      texts.count().then(function(x) {
    
    const curs = texts.find({},{"From":1, "_id":0});
  for(var i = 0; i < x; i++) {
    try{
      var test = curs.next();
      //console.log(i);
      //curs.next().then(function(x) {console.log(JSON.stringify(x).substring(9, 21))});
    test.then(function(x) {twilio.send({to: JSON.stringify(x).substring(9, 21), from: "+19382232218",body: "NOTICE for those in need: the following organization is offering aid: " + Body.substring(7)})});
    }
    catch(err){
      console.log(err);
    }
  }
      });
  }
  else {
    twilio.send({
    to:From,
    from:To,
    body: "Invalid Response. Please reply either 'add' or 'provide'"
    });
  }

}
