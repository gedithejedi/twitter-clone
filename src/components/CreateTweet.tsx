import { type NextPage } from "next";
import { useState } from "react";
import { object, string } from "zod";
import { api } from "../utils/api";

export const tweetSchema = object({
    text: string({
        required_error: "A tweet must be between 10 and 280 characters"
    })
    .min(10).max(280)
})

export const CreateTweet:NextPage = () =>{

    const [text, setText] = useState("")
    const [error, setError] = useState("")
    const {mutateAsync} = api.tweet.create.useMutation()
    
    async function sendTweet(e: React.FormEvent) {
        e.preventDefault();
        
        try {
            await tweetSchema.parse({text});
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            return;
        }
        if(text.length < 10) return;
        mutateAsync({text})
    }

    return (
        <>
        {error && <div>{JSON.stringify(error)}</div>}
        <form onSubmit={sendTweet} className="w-full flex flex-col border-2 rounded-md p-4">
            <textarea className="w-full" onChange={(e)=> setText(e.target.value)} />
            <div>
                <button type="submit" >Tweet</button>
            </div>
        </form>
        </>
    )
}