# Firebase Setup Guide for Fletero App

## �� **Current Issue**

Your Firebase project `fletero-app-e7b3c` is not properly configured or doesn't exist.

## 🛠 **Step-by-Step Setup**

### **1. Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: **`fletero-app-e7b3c`**
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

### **2. Enable Authentication**

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Enable **"Email/Password"** provider
6. Click **"Save"**
7. **Enable Anonymous Authentication:**
   - Click **"Anonymous"** provider
   - Enable **"Anonymous"** authentication
   - Click **"Save"**

### **3. Create Firestore Database**

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to Argentina, e.g., `us-central1`)
5. Click **"Done"**

### **4. Get Web App Configuration**

1. In your Firebase project dashboard, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** → **"Web"** (</>)
5. Register app with name: **"Fletero Web App"**
6. Copy the configuration object

### **5. Update Configuration**

Replace the configuration in `src/config/firebase.ts` with your new config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "fletero-app-e7b3c.firebaseapp.com",
  projectId: "fletero-app-e7b3c",
  storageBucket: "fletero-app-e7b3c.appspot.com",
  messagingSenderId: "707401331032",
  appId: "your-actual-app-id",
};
```

### **6. Set Up Security Rules**

#### **Firestore Rules**

Go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Freight requests
    match /freightRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.consumerId == request.auth.uid;
    }

    // Offers
    match /offers/{offerId} {
      allow read, write: if request.auth != null;
    }

    // Jobs
    match /jobs/{jobId} {
      allow read, write: if request.auth != null &&
        (resource.data.consumerId == request.auth.uid ||
         resource.data.driverId == request.auth.uid);
    }
  }
}
```

#### **Storage Rules**

Go to Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures
    match /profile-pictures/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Driver documents
    match /driver-documents/{userId}/{documentType} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Freight request images
    match /freight-requests/{requestId}/images/{imageIndex} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔐 **Anonymous Authentication Features**

### **What's Available:**

- ✅ **Anonymous Sign In** - Users can explore the app without creating an account
- ✅ **Browse Freight Requests** - View available freight requests
- ✅ **Basic App Navigation** - Access all screens and features
- ✅ **Convert to Full Account** - Upgrade anonymous account to permanent account

### **What's Limited:**

- ❌ **Create Freight Requests** - Requires full account
- ❌ **Send Offers** - Requires driver account
- ❌ **Make Payments** - Requires full account
- ❌ **Save Preferences** - Limited persistence

## 🧪 **Testing**

1. Start the app: `npm start`
2. Navigate to Firebase Test screen (debug button)
3. Run the tests
4. Check console for detailed results

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"auth/configuration-not-found"**

   - Firebase project doesn't exist
   - Authentication not enabled
   - Wrong project ID

2. **"auth/operation-not-allowed"**

   - Anonymous authentication not enabled
   - Email/Password authentication not enabled

3. **Firestore connection errors**

   - Database not created
   - Wrong security rules
   - Network issues

4. **API key restrictions**
   - Check Firebase Console → Project Settings → General
   - Verify API key restrictions

### **Alternative: Use Demo Project**

If you want to test immediately, you can temporarily use a demo Firebase project:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC94JtWmD8JbJ8JbJ8JbJ8JbJ8JbJ8JbJ8",
  authDomain: "fletero-demo.firebaseapp.com",
  projectId: "fletero-demo",
  storageBucket: "fletero-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo1234567890",
};
```

## 📞 **Need Help?**

If you're still having issues:

1. Check the Firebase Console for any error messages
2. Verify all services are enabled
3. Check the console logs in your app
4. Try the Firebase Test screen to get detailed error information

## 🎯 **Next Steps**

Once Firebase is working:

1. Test anonymous sign-in
2. Test user registration and login
3. Test account conversion from anonymous to permanent
4. Test creating freight requests
5. Test real-time updates
6. Set up production security rules
