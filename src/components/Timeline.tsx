import { api, RouterOutputs } from "../utils/api";
import { CreateTweet } from "./CreateTweet";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useState, useEffect } from "react";
import {AiFillHeart} from "react-icons/ai";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s",
        s: "1m",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1M",
        MM: "%dM",
        y: "1y",
        yy: "%dy",
        },
});

function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = useState(0);

    function loadMoreOnScroll(){
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const winscroll = document.body.scrollTop || document.documentElement.scrollTop;

        const scrolled = (winscroll / height) * 100;

        setScrollPosition(scrolled)
    }

    useEffect(() => {
      window.addEventListener("scroll", loadMoreOnScroll, {passive: true})
        
      return () => {
        window.removeEventListener("scroll", loadMoreOnScroll);
      }
    }, [])

    return scrollPosition
}

function updateCache({client, variables, data, action}: {
    client: QueryClient;
    variables: {
        tweetId: string;
    };
    data: {
        userId: string;
    }
    action: "like" | "unlike";
}){
    client.setQueryData([
        ["tweet", "timeline"],
        {
            "input": {
            "limit": 10
            },
            "type": "infinite"
        },
    ], 
    (oldData)=> {
        console.log({oldData});
    })
}


function Tweet({ tweet, client }: {
    tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
    client: QueryClient;
}) {

    const likeMutation = api.tweet.like.useMutation({
        onSuccess: (data, variables) => {
            updateCache({client, data, variables, action: "like"})
        }
    }).mutateAsync;
    const unlikeMutation = api.tweet.unlike.useMutation({
        onSuccess: (data, variables) => {
            updateCache({client, data, variables, action: "unlike"})
        }
    }).mutateAsync;

    const hasLiked = tweet.likes.length > 0;

    return <div className="mb-4 border-b-2 border-gray-500">
        <div className="flex p-2">
            {tweet.author.image && (
                <Image 
                    src={tweet.author.image}
                    alt={`${tweet.author.name ? tweet.author.name : ""} profile picture`}
                    className="rounded-full"
                    width={50}
                    height={50}
                />
            )}
            <div className="ml-2">
                <div className="flex items-center">
                    <p className="font-bold">{tweet.author.name}</p>
                    <p className="text-sm text-gray-500"> - {dayjs(tweet.createdAt).fromNow()}</p>
                </div>
                <div className="">{tweet.text}</div>
            </div>
        </div>
        <div className="mt-4 flex p-2 items-center">
            <AiFillHeart
                className="cursor-pointer	" 
                color={hasLiked ? "red" : "gray"} 
                size="1.5rem" 
                onClick={()=> {
                    if(hasLiked){
                        unlikeMutation({
                            tweetId: tweet.id
                        });
                        return;
                    }

                    likeMutation({
                        tweetId: tweet.id,
                    })      
                }}
            />
            <span className="text-sm text-gray-500">{10}</span>
        </div>
    </div>
}

export const Timeline = () =>{
    const scrollPosition = useScrollPosition();
    
    const {data, hasNextPage, fetchNextPage, isFetching} = 
    api.tweet.timeline.useInfiniteQuery({
        limit: 10,
     }, {
         getNextPageParam: (lastPage) => lastPage.nextCursor,
        });
        
    const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

    const client = useQueryClient();
    
    useEffect(() => {     
        if(scrollPosition > 90 && hasNextPage && !isFetching){
          fetchNextPage();
        }
    }, [scrollPosition, isFetching, hasNextPage, fetchNextPage])

    return (
        <div>
            <CreateTweet></CreateTweet>
            <div className="border-l-2 border-r-2 border-t-2 border-gray-500">
                {tweets.map((tweet) => {
                    return <Tweet key={tweet.id} tweet={tweet} client={client}/>
                })}

                {!hasNextPage && <p>No more tweets left to load</p>}
            </div>
        </div>
    )
}