// RoomManager is a singleton class responsible for managing rooms (spaces) and the users within them.
// It provides methods to add users to rooms, remove users from rooms, and broadcast messages to all users in a room.

class RoomManager {
  // Static property to hold the single instance of RoomManager
  static instance;

  constructor() {
      // A Map to store rooms and their associated users.
      // Key: space ID (room identifier), Value: Array of user instances in that room.
      this.rooms = new Map();
  }

  // Static method to get the singleton instance of RoomManager.
  // Ensures only one instance of RoomManager exists throughout the application.
  static getInstance() {
      // If an instance doesn't already exist, create one.
      if (!RoomManager.instance) {
          RoomManager.instance = new RoomManager();
      }
      // Return the existing or newly created instance.
      return RoomManager.instance;
  }

  // Method to add a user to a specific room (space).
  // `spaceId` is the unique identifier for the room.
  // `user` is an instance of the User class representing the connected user.
  addUser(spaceId, user) {
      // If the room (space) does not exist, create it and add the user as the first member.
      if (!this.rooms.has(spaceId)) {
          this.rooms.set(spaceId, [user]); // Initialize the room with the user.
          return;
      }
      // If the room already exists, add the user to the existing array of users.
      this.rooms.set(spaceId, [...this.rooms.get(spaceId), user]);
  }

  // Method to remove a user from a specific room (space).
  // `user` is the instance of the User class to be removed.
  // `spaceId` is the unique identifier for the room.
  removeUser(user, spaceId) {
      // If the room does not exist, there is nothing to remove.
      if (!this.rooms.has(spaceId)) return;

      // Filter out the user from the room's user list based on their unique ID.
      this.rooms.set(
          spaceId,
          this.rooms.get(spaceId).filter(u => u.id !== user.id)
      );
  }

  // Method to broadcast a message to all users in a specific room (space), except the sender.
  // `message` is the data to be sent to the users.
  // `user` is the sender of the message (excluded from receiving the broadcast).
  // `roomId` is the unique identifier for the room.
  broadcast(message, user, roomId) {
      // If the room does not exist, there is no one to broadcast to.
      if (!this.rooms.has(roomId)) return;

      // Iterate over all users in the room and send the message to everyone except the sender.
      this.rooms.get(roomId).forEach(u => {
          if (u.id !== user.id) { // Exclude the sender from receiving their own message.
              u.send(message); // Send the message using the `send` method of the User class.
          }
      });
  }
}

// Exporting the RoomManager class as the default export for use in other modules.
export default RoomManager;

/*
Generalized Steps for Future Reference:
Singleton Pattern: Use a singleton pattern for managing shared resources like rooms or connections. This ensures only one instance of the manager exists throughout the application.

Room Management:

Use a data structure (e.g., Map) to store rooms and their associated users.
The key should be a unique identifier for the room (e.g., roomId or spaceId).
The value should be a collection (e.g., Array) of user instances or connections.
Add Users to Rooms:

Check if the room exists. If not, create it and add the user.
If the room exists, append the user to the existing list.
Remove Users from Rooms:

Check if the room exists. If not, no action is needed.
Filter out the user from the room's user list based on a unique identifier (e.g., user.id).
Broadcast Messages:

Iterate over all users in a room.
Exclude the sender from receiving their own message.
Use a method (e.g., send) to deliver the message to each user.
Error Handling:

Always check if the room exists before performing operations like adding, removing, or broadcasting.
Handle edge cases where a user or room might not exist.
By following these steps, you can adapt this structure to manage rooms and users in any WebSocket-based server.
*/