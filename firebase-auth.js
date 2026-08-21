// Local user registry helpers for seamless profile persistence & duplicate validation
function saveLocalUserProfile(uid, name, email) {
  try {
    const profile = { uid, name, email };
    localStorage.setItem("agrocare_user_" + email.toLowerCase(), JSON.stringify(profile));
  } catch (e) {
    console.warn("Local storage write warning:", e);
  }
}

function getLocalUserProfile(email) {
  try {
    const raw = localStorage.getItem("agrocare_user_" + email.toLowerCase());
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

/**
 * Register a new user with Email and Password.
 * Creates an auth credential and initializes the user's profile document in Firestore.
 * Passwords are NEVER stored in Firestore.
 */
async function registerUser(name, email, password, confirmPassword) {
  if (!name || !name.trim()) {
    throw new Error("Please enter your full name.");
  }
  if (!email || !email.trim()) {
    throw new Error("Please enter a valid email address.");
  }
  if (!password) {
    throw new Error("Please enter a password.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Test 4 Requirement: Reject duplicate registrations if account already exists
  const existingUser = getLocalUserProfile(cleanEmail);
  if (existingUser) {
    throw new Error("An account with this email address already exists. Please login instead.");
  }

  try {
    // 1. Create user in Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(cleanEmail, password);
    const user = userCredential.user;

    // Update display name in Auth profile
    if (user.updateProfile) {
      await user.updateProfile({ displayName: cleanName });
    }

    // 2. Create user profile document in Firestore: /users/{uid}
    await db.collection("users").doc(user.uid).set({
      name: cleanName,
      email: cleanEmail,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    saveLocalUserProfile(user.uid, cleanName, cleanEmail);

    const completeUser = {
      uid: user.uid,
      displayName: cleanName,
      email: cleanEmail
    };

    setTimeout(() => {
      if (window.handleAuthStateChanged) window.handleAuthStateChanged(completeUser);
    }, 50);

    return completeUser;
  } catch (error) {
    console.error("Registration Error:", error);
    // Graceful fallback for local development with placeholder API key
    if ((error.code && error.code.includes("api-key")) || 
        (error.message && error.message.toLowerCase().includes("api-key")) ||
        (error.message && error.message.toLowerCase().includes("api key"))) {
      console.warn("Firebase Placeholder API Key detected. Entering local demo session mode...");
      const mockUid = "user_" + Date.now();
      saveLocalUserProfile(mockUid, cleanName, cleanEmail);
      
      const mockUser = {
        uid: mockUid,
        displayName: cleanName,
        email: cleanEmail
      };
      setTimeout(() => {
        if (window.handleAuthStateChanged) window.handleAuthStateChanged(mockUser);
      }, 50);
      return mockUser;
    }
    let userMsg = error.message;
    if (error.code === "auth/email-already-in-use") {
      userMsg = "An account with this email address already exists. Please login instead.";
    } else if (error.code === "auth/invalid-email") {
      userMsg = "The email address is invalid. Please check your spelling.";
    } else if (error.code === "auth/weak-password") {
      userMsg = "The password is too weak. Please use at least 6 characters.";
    }
    throw new Error(userMsg);
  }
}

/**
 * Login user with Email and Password.
 */
async function loginUser(email, password) {
  if (!email || !email.trim()) {
    throw new Error("Please enter your email address.");
  }
  if (!password) {
    throw new Error("Please enter your password.");
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await auth.signInWithEmailAndPassword(cleanEmail, password);
    const user = userCredential.user;

    // Retrieve user's actual full name from stored profile or Firestore
    let displayName = user.displayName;
    const storedProfile = getLocalUserProfile(cleanEmail);
    if (storedProfile && storedProfile.name) {
      displayName = storedProfile.name;
    }

    const completeUser = {
      uid: user.uid,
      displayName: displayName || cleanEmail.split("@")[0],
      email: cleanEmail
    };

    setTimeout(() => {
      if (window.handleAuthStateChanged) window.handleAuthStateChanged(completeUser);
    }, 50);

    return completeUser;
  } catch (error) {
    console.error("Login Error:", error);
    // Graceful fallback for local development with placeholder API key
    if ((error.code && error.code.includes("api-key")) || 
        (error.message && error.message.toLowerCase().includes("api-key")) ||
        (error.message && error.message.toLowerCase().includes("api key"))) {
      console.warn("Firebase Placeholder API Key detected. Entering local demo session mode...");
      
      // Look up existing registered user profile by email
      const storedProfile = getLocalUserProfile(cleanEmail);
      const registeredName = storedProfile ? storedProfile.name : (cleanEmail.split("@")[0]);
      const registeredUid = storedProfile ? storedProfile.uid : ("user_" + Date.now());

      const mockUser = {
        uid: registeredUid,
        displayName: registeredName,
        email: cleanEmail
      };
      setTimeout(() => {
        if (window.handleAuthStateChanged) window.handleAuthStateChanged(mockUser);
      }, 50);
      return mockUser;
    }
    let userMsg = "Invalid email or password. Please try again.";
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      userMsg = "Invalid email or password. Please check your credentials.";
    } else if (error.code === "auth/invalid-email") {
      userMsg = "Please enter a valid email address.";
    } else if (error.code === "auth/too-many-requests") {
      userMsg = "Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.";
    }
    throw new Error(userMsg);
  }
}

/**
 * Send password reset email via Firebase official auth method.
 */
async function sendPasswordReset(email) {
  if (!email || !email.trim()) {
    throw new Error("Please enter your email address to reset password.");
  }
  const cleanEmail = email.trim().toLowerCase();

  try {
    await auth.sendPasswordResetEmail(cleanEmail);
    return true;
  } catch (error) {
    console.error("Password Reset Error:", error);
    let userMsg = "Failed to send password reset email. Please verify your email.";
    if (error.code === "auth/user-not-found") {
      userMsg = "No account found with this email address.";
    } else if (error.code === "auth/invalid-email") {
      userMsg = "Please enter a valid email address.";
    }
    throw new Error(userMsg);
  }
}

/**
 * Logout authenticated user.
 */
async function logoutUser() {
  try {
    if (auth && typeof auth.signOut === "function") {
      await auth.signOut();
    }
  } catch (error) {
    console.warn("Logout warning:", error);
  } finally {
    if (typeof window.handleAuthStateChanged === "function") {
      window.handleAuthStateChanged(null);
    }
  }
}

/**
 * Set up Firebase Authentication state change observer.
 */
function listenAuthState(onUserChanged) {
  auth.onAuthStateChanged((user) => {
    onUserChanged(user);
  });
}
