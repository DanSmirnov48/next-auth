'use client'

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SettingsPage = () => {

    const user = useCurrentUser()

    return (
        <div>
            {JSON.stringify(user)}
            <button onClick={logout} type='submit'>
                Sign Out
            </button>
        </div>
    )
}

export default SettingsPage