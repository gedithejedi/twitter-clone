import { useState } from "react";
import { object, string } from "zod";
import { api } from "../utils/api";

export const tweetSchema = object({
    text: string({
        required_error: "A tweet must be between 10 and 280 characters"
    })
    .min(10).max(280)
})

export const CreateTweet = () =>{

    const [text, setText] = useState("")
    const [error, setError] = useState("")
    const utils = api.useContext();

    const {mutateAsync} = api.tweet.create.useMutation({
        onSuccess: () => {
            setText("");
            utils.tweet.timeline.invalidate();
        },
        onError: () => console.log("Error has occorued")
    })

    
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
        <form onSubmit={sendTweet} className="mb-4 w-full flex flex-col border-2 rounded-md p-4">
            <textarea className="w-full p-4 shadow" onChange={(e)=> setText(e.target.value)} />
            <div className="flex justify-end">
                <button className="mt-2 bg-primary rounded-md px-4 py-2 text-white hover:border-primary border-2 hover:text-primary hover:bg-transparent" type="submit" >Tweet</button>
            </div>
        </form>
        </>
    )
}