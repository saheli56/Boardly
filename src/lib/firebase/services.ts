import { ref, set, get, update, onValue, child } from "firebase/database";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { db, auth } from "./config";
import { MOCK_FLIGHTS, MOCK_SEATS, MOCK_ADMIN_STATS } from "@/lib/mock-data";

/* ─── AUTH SERVICES ─── */

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string, fullName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: fullName });
  }
  return userCredential;
}

export async function logout() {
  return signOut(auth);
}

export function listenToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/* ─── DATABASE SERVICES ─── */

/**
 * Ensures the database has the initial mock data if it's empty.
 * Call this once when the app loads or via an admin button.
 */
export async function seedDatabaseIfEmpty() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "flights"));
  if (!snapshot.exists()) {
    console.log("Seeding Flights...");
    const flightsObj: Record<string, any> = {};
    MOCK_FLIGHTS.forEach(f => {
      flightsObj[f.id] = f;
    });
    await set(ref(db, "flights"), flightsObj);
  }

  const seatsSnapshot = await get(child(dbRef, "seats"));
  if (!seatsSnapshot.exists()) {
    console.log("Seeding Seats...");
    const seatsObj: Record<string, any> = {};
    MOCK_SEATS.forEach(s => {
      seatsObj[s.id] = s;
    });
    // Store seats under a specific flight (e.g., flight-001) for this demo
    await set(ref(db, "seats/flight-001"), seatsObj);
    await set(ref(db, "seats/flight-002"), seatsObj); 
  }

  const adminSnapshot = await get(child(dbRef, "adminStats"));
  if (!adminSnapshot.exists()) {
    console.log("Seeding Admin Stats...");
    await set(ref(db, "adminStats"), MOCK_ADMIN_STATS);
  }
}

/**
 * Listens to all seats for a specific flight
 */
export function listenToSeats(flightId: string, callback: (seats: any[]) => void) {
  const seatsRef = ref(db, `seats/${flightId}`);
  const unsubscribe = onValue(seatsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(Object.values(data));
    } else {
      callback([]);
    }
  });
  return unsubscribe;
}

/**
 * Mark a seat as occupied instantly
 */
export async function occupySeat(flightId: string, seatId: string) {
  const seatRef = ref(db, `seats/${flightId}/${seatId}`);
  await update(seatRef, { status: "occupied" });
}

/**
 * Listen to admin stats
 */
export function listenToAdminStats(callback: (stats: any) => void) {
  const adminRef = ref(db, "adminStats");
  const unsubscribe = onValue(adminRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
  return unsubscribe;
}

/**
 * Trigger an admin check-in ping (updates throughput array and total count)
 */
export async function registerCheckInPing() {
  const adminRef = ref(db, "adminStats");
  const snapshot = await get(adminRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const currentHour = new Date().getHours();
    
    const newThroughput = [...data.checkInsPerHour];
    // Bump the check-in count for the current hour by 1
    newThroughput[currentHour] = (newThroughput[currentHour] || 0) + 1;

    await update(adminRef, {
      totalCheckIns: data.totalCheckIns + 1,
      checkInsPerHour: newThroughput
    });
  }
}
