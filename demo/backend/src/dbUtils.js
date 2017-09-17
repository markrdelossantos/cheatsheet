import redis from "redis";

import config from "./config";

export default {
    postClient: redis.createClient(`redis://redis:6379${config.posts_db}`),
    tagClient: redis.createClient(`redis://redis:6379${config.tag_db}`)
};
