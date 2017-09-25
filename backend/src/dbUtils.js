import redis from "redis";
import promisify from "es6-promisify";

const notes_suffix = "_notes";
const public_notes_id = `public${notes_suffix}`;
const redisClient = redis.createClient(`redis://redis:6379`);

// TODO: do something about this
const hGetAllClient = promisify(redisClient.hgetall, redisClient);
const sInterClient = promisify(redisClient.sinter, redisClient);
const sUnionClient = promisify(redisClient.sunion, redisClient);

const errorHandler = (err) => {throw new Error(err)};

const saveToDB = (rawNote, user) => {
    console.log("Attempting to save in DB...");
    console.log("Attempting to generate new ID");

    let promiseClient = promisify(redisClient.incr, redisClient);

    promiseClient("nextNoteId")
        .then((result)=> {
            const id = `note_${result}`;

            // Create tags if it does not exist and adds the id to the list
            rawNote.tags.map((tag)=> {
                redisClient.sadd(tag, [id]);
            });

            // Add references to this note to the public/user-specific domains..
            if(user) {
                console.log("user detected, adding to user specific notes...");
                redisClient.sadd(`${user}${notes_suffix}`, [id]);
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
        .catch(errorHandler);
    console.log("Attempt seems to be successful...");
}

// All below returns promises
const getNoteFromIds = (noteIds) => {

    if(noteIds.length === 0) {
        console.log("Empty array...");
        return noteIds;
    }

    const promises = noteIds.map((id) => {
        return hGetAllClient(id).then((result) => {
            return result;
        }).catch(errorHandler);
    });

    return Promise.all(promises);
};

// For guest users
const getPublicNotesByQuery = (tagQuery, operator) => {
    tagQuery.push(public_notes_id);
    return operator(tagQuery).then( result => {return result});
}

const getUserNotesByQuery = (tagQuery, operator, userKey) => {
    tagQuery.push(userKey);
    return operator(tagQuery).then( result => {
        return result});
}

// For logged in users,
const getNoteByQuery = (tagQuery, tag_operation = "or", userToken, inclPublic) => {
    var operator = tag_operation === "or" ? sUnionClient : sInterClient;
    const userKey = `${userToken}${notes_suffix}`;
    
    if (inclPublic) {
        let promises = [];
        promises.push(getUserNotesByQuery(tagQuery, operator, userKey));
        promises.push(getPublicNotesByQuery(tagQuery, operator));

        Promise.all(promises).then(result => {
            console.log(">>>");
            
            const q = new Set(result);
            console.log(q );
            const uniqueNoteIds = Array.from(new Set(result));
    
            return getNoteFromIds(uniqueNoteIds);
        }).catch(errorHandler);
    }
    else {
        getUserNotesByQuery(tagQuery, operator, userKey).then( result => {
            return getNoteFromIds(result);
        }).catch(errorHandler);
    }
}

export {saveToDB, getNoteByQuery, getPublicNotesByQuery};
