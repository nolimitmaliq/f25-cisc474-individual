"use client";
import { useState } from "react";

export default function Login(){
    const [user, setUser] = useState("");

    const users = ["Student", "Instructor", "Admin"]

    return (
        <div>
            {users.map((user1, userIndex) => {
                return(
                    <button onClick = {() => {
                        setUser(user1)
                    }}></button>
                )
            })}
        </div>
    )

}