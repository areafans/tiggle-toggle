# ToggleLab Demo Instructions

## LaunchDarkly Flag Toggle Commands

Use these CURL commands to toggle feature flags during your demo presentation.

### Advanced Analytics Flag

**Turn ON Advanced Analytics:**
```bash
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/default/advanced-analytics" \
  -H "Authorization: api-1c02800f-3e4a-47f2-97d7-8d4cefef0816" \
  -H "Content-Type: application/json" \
  -d '[{"op": "replace", "path": "/environments/test/on", "value": true}]'
```

**Turn OFF Advanced Analytics:**
```bash
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/default/advanced-analytics" \
  -H "Authorization: api-1c02800f-3e4a-47f2-97d7-8d4cefef0816" \
  -H "Content-Type: application/json" \
  -d '[{"op": "replace", "path": "/environments/test/on", "value": false}]'
```

### AI Chatbot Flag

**Turn ON AI Chatbot:**
```bash
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/default/f2-ai-chatbot" \
  -H "Authorization: api-1c02800f-3e4a-47f2-97d7-8d4cefef0816" \
  -H "Content-Type: application/json" \
  -d '[{"op": "replace", "path": "/environments/test/on", "value": true}]'
```

**Turn OFF AI Chatbot:**
```bash
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/default/f2-ai-chatbot" \
  -H "Authorization: api-1c02800f-3e4a-47f2-97d7-8d4cefef0816" \
  -H "Content-Type: application/json" \
  -d '[{"op": "replace", "path": "/environments/test/on", "value": false}]'
```

## Demo Flow

1. **Start the application:** `npm start`
2. **Open browser** to `http://localhost:3000`
3. **Use CURL commands** from a separate terminal to toggle flags during demo
4. **Changes should appear** in the React app within a few seconds
5. **Use Demo Control Panel** in the app for user switching and local overrides

## LaunchDarkly Targeting Setup

### AI Chatbot Flag Targeting Configuration

#### Individual User Targeting
1. **Go to LaunchDarkly Dashboard** → Flags → `f2-ai-chatbot`
2. **In Test Environment**, set up individual targeting:
   - **Target "user2" (Sam Rodriguez)** → Serve `true`
   - **Target "user1" (Alex Chen)** → Serve `true` (lab owner gets access)

#### Rule-Based Targeting
1. **Create a rule** for beta users:
   - **Rule name:** "Beta Users"
   - **Conditions:** `isBetaUser` equals `true`
   - **Serve:** `true`

2. **Create a rule** for access level:
   - **Rule name:** "Admin and Beta Access"
   - **Conditions:** `accessLevel` is one of `["admin", "beta"]`
   - **Serve:** `true`

3. **Create a rule** for user segment:
   - **Rule name:** "Early Adopters"
   - **Conditions:** `userSegment` equals `"early-adopter"`
   - **Serve:** `true`

#### Default Rule
- **All other users:** Serve `false`

### User Context Attributes Available for Targeting

#### Lab Owner (Alex Chen - user1)
```json
{
  "key": "user1",
  "name": "Alex Chen",
  "role": "lab-owner",
  "isBetaUser": false,
  "isLabOwner": true,
  "accessLevel": "admin",
  "department": "product",
  "experienceLevel": "expert",
  "subscriptionTier": "enterprise",
  "userSegment": "power-user"
}
```

#### Beta User (Sam Rodriguez - user2)
```json
{
  "key": "user2",
  "name": "Sam Rivera",
  "role": "beta-user",
  "isBetaUser": true,
  "isLabOwner": false,
  "accessLevel": "beta",
  "department": "engineering",
  "experienceLevel": "advanced",
  "subscriptionTier": "pro",
  "userSegment": "early-adopter"
}
```

#### Standard User (Jordan Kim - user3)
```json
{
  "key": "user3",
  "name": "Jordan Kim",
  "role": "standard-user",
  "isBetaUser": false,
  "isLabOwner": false,
  "accessLevel": "standard",
  "department": "marketing",
  "experienceLevel": "beginner",
  "subscriptionTier": "basic",
  "userSegment": "regular-user"
}
```

## Environment Details

- **Environment:** test
- **Client-side ID:** 68ce16f8c7621309bd982219
- **SDK Key:** sdk-7495e621-8c80-44e1-abd4-7021393f150d