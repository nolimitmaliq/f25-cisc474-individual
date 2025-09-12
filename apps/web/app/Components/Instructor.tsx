"use client";
export default function Instructor(){
    const tabs = ["Create Assignment", "Courses", "Profile", "Sign Out"]

    return(
        <div>
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
        </div>
    )
}