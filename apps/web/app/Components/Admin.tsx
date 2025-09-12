"use client";
export default function Admin(){
    const tabs = ["Search Students", "Settings", "Usage Reports", "Profile", "Sign Out"]
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