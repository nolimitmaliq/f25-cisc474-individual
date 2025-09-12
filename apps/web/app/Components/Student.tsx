"use client";
export default function Student(){
    const tabs = ["Courses", "Submissions", "Notifications", "Profile", "Sign Out"]
    return(
        <div>
            <nav>
                {tabs.map((tab, tabIndex) => {
                    return (
                        <button onClick = {() => {

                        }}
                        key = {tabIndex}>
                        {tab}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}