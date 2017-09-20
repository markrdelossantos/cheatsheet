import redis from "redis";
import promisify from "es6-promisify";

const notes_suffix = "_notes";
const public_notes_id = `public${notes_suffix}`;
const redisClient = redis.createClient(`redis://redis:6379`);


const saveToDB = (rawNote, user) => {
    console.log("Attempting to save in DB...");
    console.log("Attempting to generate new ID");

    let promiseClient = promisify(redisClient.incr, redisClient);
    
    promiseClient("nextNoteId")
        .then((result)=> {
            const id = `note_${result}`;
            console.log(`Id is ${id}`);

            // Create tags if it does not exist and adds the id to the list
            rawNote.tags.map((tag)=> {
                redisClient.sadd(tag, [id]);
            });

            // Add references to this note to the public/user-specific domains..
            if(user) {
                console.log("user detected, adding to user specific notes...");
                redisClient.sadd(`user${notes_suffix}`, [id]);
            }
            else {
                console.log("no user detected, adding to public by default...");
                redisClient.sadd(public_notes_id, [id]);
            }

            // Finally create note entry 
            // TODO: ES6 this shiet.
            redisClient.hmset( id, {
                title: rawNote.title,
                body: rawNote.body
            }, redis.print);

        })
        .catch((err)=> {console.log(err);});
    console.log("Attempt seems to be successful...");
}

// All below returns promises
const getNoteFromId = (noteId) => {
    
    if(noteId.length === 0) {
        console.log("Empty array...");
        return noteId;
    }

    const hGetAllClient = promisify(redisClient.hgetall, redisClient);
    // merge these promises
    return hGetAllClient(noteId).then((result) => {
        // result["foundIn"] = "test";
        return result;
    })
    .catch((err) => console.log(err));
};

const getNoteByQuery = (tagQuery, user = "all", operation = "and") => {
    var user_domains = [];
    if(user === "all") {
        user_domains.push("public_notes");
    }
    user_domains.push(`${user}_notes`);

    var dbOperation;
    if(operation === "and") {
        dbOperation =  redisClient.sinter;
    }
    else {
        dbOperation = redisClient.sunion;
    }

    const sinterClient = promisify(dbOperation, redisClient);
    return sinterClient(tagQuery.push(user_domains)).then((result) => {
        console.log(tagQuery);
        return getNoteFromId(result);
    }).catch((err) => console.log(err));

    // return Promise.all(promises);
}

export {saveToDB, getNoteByQuery};
