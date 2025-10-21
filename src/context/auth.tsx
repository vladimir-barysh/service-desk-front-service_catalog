import React, {createContext, useContext, useEffect, useState} from "react";

function AuthProvider(props: any) {
    const [auth] = useState(true);
    const [user, setUser] = useState<boolean>();

    useEffect(() => {
        (async function () {
            setUser(auth);
            return;
        })()
    }, []);

    return <AuthContext.Provider value={{ user, setUser }} {...props}/>
}

const AuthContext: React.Context<any> = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
