import {saveToDB, getNoteByQuery} from "./dbUtils";
import redis from "redis";

export default function fillData() {

    let note1 = {
        tags: ["credentials", "username", "password"],
        title: "test credentials",
        body: "username: test\r\npassword: test2\r\n"
    };

    let note2 = {
        tags: ["to_watch"],
        title: "Coldplay - Speed of Sound",
        body: "https://www.youtube.com/watch?v=0k_1kvDh2UA"
    }; 

    let note3 = {
        tags: ["shopping_list"],
        title: "9/19/2017",
        body:"eggs\r\nbanana\r\nyakult\r\n1/2 kilo chicken(thigh)\r\n"
    }

    let note4 = {
        tags: ["to_watch"],
        title: "Calvin Harris - Feels (Official Video) ft. Pharrell Williams, Katy Perry, Big Sean",
        body: "https://www.youtube.com/watch?v=ozv4q2ov3Mk"
    }

    let note5 = {
        tags: ["to_watch"],
        title: "Cowboy Bebop [Tributes Mix]",
        body: "https://www.youtube.com/watch?v=WHryvQQu9LU"
    }

    let note6 = {
        tags: ["shopping_list", "important"],
        title: "9/25/2017",
        body:"eggs\r\nbanana\r\nyakult\r\n1/2 kilo chicken(thigh)\r\n"
    }

    // saveToDB(note1);
    // saveToDB(note2);
    // saveToDB(note3);
    // saveToDB(note4);
    // saveToDB(note6, "mikee");

    // const prmise = getNoteByQuery(["to_watch", "shopping_list"],"all", "or")
    //     .then((result) => {console.log(result)});
}