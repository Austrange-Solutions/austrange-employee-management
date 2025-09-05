import dotenv from 'dotenv';

// Load environment variables with correct path
dotenv.config({ path: '.env' });

export async function autoLogout() {
    console.log('🕛 Starting automated employee logout at midnight IST...');
    console.log(`📅 Execution time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    
    // Environment validation
    if (!siteUrl) {
        console.error('❌ NEXT_PUBLIC_SITE_URL or SITE_URL not found in environment variables');
        process.exit(1);
    }
    
    console.log(`📍 Using site URL: ${siteUrl}`);
    
    try {
        const response = await fetch(`${siteUrl}/api/cron/auto-logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Auto-logout completed successfully:', JSON.stringify(result, null, 2));
        
        // Exit successfully
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Auto-logout failed:', error);
        process.exit(1);
    }
}

// Execute the function
autoLogout();