import { supabase } from '../supabase/client';

/**
 * Handles user logout and redirection.
 */
export async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Use window.location for hard redirect to clear all states
        window.location.href = '/';
    } catch (err) {
        console.error("Logout failed:", err);
    }
}
