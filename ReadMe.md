# ACS5413 Course Project - Dewayne Hafenstein

## University of Oklahoma - Gallogy School of Engineering

This project represents a relatively comprehensive personal medical information management
application that would allow a user to record medical related information. This information
would include:

- their insurance provider(s),
- prescriptions and their dosage,
- medical providers,
- hospitals,
- pharmacies,
- their personal medical history (such as illnesses, surgeries, and other diagnosis),
- alergies and the severity of them as well as mitigation,
- and general contacts for medical personnel to reach people in the case of an emergency.

The application provides map displays for doctors and hospitals to allow the user to
navigate to these facilities easier. Also, the prescriptions allows the user to take
a picture of the medication for future reference and to help medical professionals
identify the medication.

The application also includes local notifications when it is time to take certain
prescriptions as a reminder to the user.

The application uses an internal SQLite database to store all the persistent data,
and synchronizes it with Firebase when online using intelligent bidirectional merging.  
This allows the information to be entered, updated, and referenced even when the device
is not connected to a network.

## Intelligent Data Synchronization

The app implements sophisticated data synchronization between local SQLite storage and
Firebase Realtime Database:

### Bidirectional Data Preservation

- **Preserves data on both phone and Firebase** - No data is lost during sync
- **Intelligent merging** - Combines local and cloud data intelligently
- **Conflict resolution** - Uses timestamps to resolve conflicts between versions

### Sync Strategy

When the app initializes and connects to Firebase:

1. **Loads Firebase data not on phone** - Downloads any data that exists in Firebase but not locally
2. **Uploads phone data not in Firebase** - Sends any local data that doesn't exist in Firebase
3. **Resolves conflicts** - For items that exist in both places, uses the most recent timestamp
4. **Real-time updates** - Continues to sync changes as they happen

### Offline Support

- **Full offline functionality** - All features work without internet connection
- **Pending operations queue** - Stores changes made offline for later sync
- **Automatic reconnection sync** - Intelligently merges data when connection is restored
