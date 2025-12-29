'use server';

import { auth0 } from '../../lib/auth0';

/**
 * Request a password reset for the currently authenticated user
 * Uses Auth0's database connection password reset endpoint (no Management API required)
 */
export async function requestPasswordReset(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return { 
        success: false, 
        error: 'Not authenticated' 
      };
    }

    const userEmail = session.user.email;
    
    if (!userEmail) {
      return { 
        success: false, 
        error: 'User email not found' 
      };
    }

    // Remove https:// prefix if present in AUTH0_DOMAIN and trim whitespace
    const auth0Domain = process.env.AUTH0_DOMAIN?.trim().replace(/^https?:\/\//, '') || '';
    const clientId = process.env.AUTH0_CLIENT_ID?.trim();

    if (!auth0Domain || !clientId) {
      console.error('Missing Auth0 credentials:', { auth0Domain, clientId: !!clientId });
      return {
        success: false,
        error: 'Auth0 configuration is incomplete'
      };
    }

    // Use Auth0's database connection password reset endpoint
    // This doesn't require Management API access
    const resetUrl = `https://${auth0Domain}/dbconnections/change_password`;
    const resetResponse = await fetch(resetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        email: userEmail,
        connection: 'Username-Password-Authentication', // Default Auth0 database connection name
      }),
    });

    if (!resetResponse.ok) {
      const errorText = await resetResponse.text();
      console.error('Auth0 password reset error:', resetResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to send password reset email' 
      };
    }

    // Auth0 will send a password reset email to the user
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}

/**
 * Enroll user in Multi-Factor Authentication (2FA) via Authenticator App
 * Creates an MFA enrollment ticket via Auth0 Management API
 */
export async function enrollMFA(): Promise<{ success: boolean; error?: string; enrollmentUrl?: string }> {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return { 
        success: false, 
        error: 'Not authenticated' 
      };
    }

    // Remove https:// prefix if present in AUTH0_DOMAIN and trim whitespace
    const auth0Domain = process.env.AUTH0_DOMAIN?.trim().replace(/^https?:\/\//, '') || '';
    const clientId = process.env.AUTH0_CLIENT_ID?.trim();
    const clientSecret = process.env.AUTH0_CLIENT_SECRET?.trim();

    if (!auth0Domain || !clientId || !clientSecret) {
      console.error('Missing Auth0 credentials');
      return {
        success: false,
        error: 'Auth0 configuration is incomplete'
      };
    }

    // Get Management API access token
    const tokenUrl = `https://${auth0Domain}/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Auth0 token error:', tokenResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to authenticate with Auth0 Management API' 
      };
    }

    const { access_token } = await tokenResponse.json();

    // Create MFA enrollment ticket
    const ticketUrl = `https://${auth0Domain}/api/v2/guardian/enrollments/ticket`;
    const ticketResponse = await fetch(ticketUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        user_id: session.user.sub,
        send_mail: false,
      }),
    });

    if (!ticketResponse.ok) {
      const errorText = await ticketResponse.text();
      console.error('Auth0 MFA enrollment error:', ticketResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to create MFA enrollment ticket. Ensure MFA is enabled in your Auth0 tenant.' 
      };
    }

    const ticketData = await ticketResponse.json();
    
    console.log('MFA enrollment ticket created:', ticketData);
    
    return { 
      success: true, 
      enrollmentUrl: ticketData.ticket_url 
    };
  } catch (error) {
    console.error('MFA enrollment error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please ensure MFA is enabled in your Auth0 tenant.' 
    };
  }
}

/**
 * Enroll user in SMS-based Multi-Factor Authentication
 * Adds phone number to user profile and enables SMS MFA
 */
export async function enrollPhoneMFA(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return { 
        success: false, 
        error: 'Not authenticated' 
      };
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
      return {
        success: false,
        error: 'Invalid phone number format. Please use international format (e.g., +1234567890)'
      };
    }

    // Remove https:// prefix if present in AUTH0_DOMAIN and trim whitespace
    const auth0Domain = process.env.AUTH0_DOMAIN?.trim().replace(/^https?:\/\//, '') || '';
    const clientId = process.env.AUTH0_CLIENT_ID?.trim();
    const clientSecret = process.env.AUTH0_CLIENT_SECRET?.trim();

    if (!auth0Domain || !clientId || !clientSecret) {
      console.error('Missing Auth0 credentials');
      return {
        success: false,
        error: 'Auth0 configuration is incomplete'
      };
    }

    // Get Management API access token
    const tokenUrl = `https://${auth0Domain}/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Auth0 token error:', tokenResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to authenticate with Auth0 Management API' 
      };
    }

    const { access_token } = await tokenResponse.json();

    // Update user's phone number
    const updateUserUrl = `https://${auth0Domain}/api/v2/users/${session.user.sub}`;
    const updateResponse = await fetch(updateUserUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        phone_verified: false,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Auth0 update user error:', updateResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to update phone number' 
      };
    }

    // Enroll user in SMS MFA
    const enrollUrl = `https://${auth0Domain}/api/v2/guardian/enrollments`;
    const enrollResponse = await fetch(enrollUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        user_id: session.user.sub,
        phone_number: phoneNumber,
      }),
    });

    if (!enrollResponse.ok) {
      const errorText = await enrollResponse.text();
      console.error('Auth0 SMS enrollment error:', enrollResponse.status, errorText);
      return { 
        success: false, 
        error: 'Failed to enroll in SMS MFA. Ensure SMS MFA is enabled in your Auth0 tenant.' 
      };
    }

    console.log('SMS MFA enrollment successful');
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('SMS MFA enrollment error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please ensure SMS MFA is enabled in your Auth0 tenant.' 
    };
  }
}
