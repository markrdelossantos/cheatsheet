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
const getNoteFromId = (tagId) => {
    const hGetAllClient = promisify(redisClient.hgetall, redisClient);
    // merge these promises
    return hGetAllClient(tagId).then((result) => {
        return result;
    })
    .catch((err) => console.log(err));
};

const getNoteByQuery = (tagQuery,user = "all") => {
    var user_domain;
    if(user === "all") {
        user_domain = "public_notes";
    }
    else {
        user_domain = `${user}_notes`;
    }

    const sinterClient = promisify(redisClient.sinter, redisClient);
    return sinterClient(user_domain, tagQuery).then((result) => {
        return getNoteFromId(result);
    }).catch((err) => console.log(err));
}

export {saveToDB, getNoteByQuery};
