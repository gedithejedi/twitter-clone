import { api } from "../utils/api";
import { CreateTweet } from "./CreateTweet";

export const Timeline = () =>{

    const {data} = api.tweet.timeline.useQuery({})

    console.log(data);

    return (
        <div>
            <CreateTweet></CreateTweet>
        </div>
    )
}